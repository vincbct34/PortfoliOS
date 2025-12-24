/**
 * @fileoverview Hook for fetching OpenGraph images from URLs via CORS proxies
 * @module hooks/useOpenGraphImage
 */

import { useState, useEffect } from 'react';

/** State returned by the useOpenGraphImage hook */
interface OpenGraphImageState {
  /** The resolved image URL (OG image or fallback) */
  imageUrl: string | null;
  /** Whether the fetch is in progress */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
}

/** Cache to avoid refetching the same URLs */
const ogImageCache = new Map<string, string>();

// Note: Removed codetabs proxy as it often has issues or strict limits, keeping robust ones.
// User provided:
// (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
// (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
// (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,

/**
 * Extracts OpenGraph image URL from HTML content
 * Tries multiple meta tag patterns including Twitter card fallback
 * @param html - Raw HTML content to parse
 * @returns The OG image URL or null if not found
 */
function extractOgImage(html: string): string | null {
  const patterns = [
    /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /<meta[^>]*name=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']og:image["']/i,
    /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Attempts to fetch content through multiple CORS proxies
 * Falls back to next proxy if current one fails
 * @param url - Target URL to fetch
 * @param signal - AbortSignal for cancellation
 * @returns HTML content as string
 * @throws Error if all proxies fail
 */
async function fetchWithProxies(url: string, signal: AbortSignal): Promise<string> {
  const proxies = [
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  ];

  for (const proxyFn of proxies) {
    try {
      const proxyUrl = proxyFn(url);
      const response = await fetch(proxyUrl, {
        signal,
        headers: {
          Accept: 'text/html',
        },
      });

      if (response.ok) {
        return await response.text();
      }
    } catch {
      // Try next proxy
      continue;
    }
  }
  throw new Error('All proxies failed');
}

/**
 * Hook to fetch OpenGraph image from a URL using CORS proxies
 * Includes caching, fallback support, and automatic cleanup
 * @param url - The website URL to fetch OG image from
 * @param fallbackImage - Optional fallback image if OG fetch fails
 * @returns State with imageUrl, isLoading, and error
 */
export function useOpenGraphImage(url?: string, fallbackImage?: string): OpenGraphImageState {
  const [state, setState] = useState<OpenGraphImageState>({
    imageUrl: fallbackImage || null,
    isLoading: !!url,
    error: null,
  });

  useEffect(() => {
    // If no URL provided, use fallback
    if (!url) {
      setState({
        imageUrl: fallbackImage || null,
        isLoading: false,
        error: null,
      });
      return;
    }

    // Check cache first
    if (ogImageCache.has(url)) {
      setState({
        imageUrl: ogImageCache.get(url)!,
        isLoading: false,
        error: null,
      });
      return;
    }

    const controller = new AbortController();

    // 10 second timeout for the request
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    async function fetchOgImage() {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Check if we are checking checking own domain (localhost or relative)
        // Ideally we should proxy everything that is external.
        // Logic remains same as provided.

        const html = await fetchWithProxies(url!, controller.signal);
        const imageUrl = extractOgImage(html);

        if (imageUrl) {
          // Resolve relative URLs if necessary
          let resolvedUrl = imageUrl;
          if (imageUrl.startsWith('/')) {
            try {
              const urlObj = new URL(url!);
              resolvedUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
            } catch {
              // Failed to resolve relative, keep as is
            }
          }

          ogImageCache.set(url!, resolvedUrl);
          setState({
            imageUrl: resolvedUrl,
            isLoading: false,
            error: null,
          });
        } else {
          // No OG image found, use fallback
          setState({
            imageUrl: fallbackImage || null,
            isLoading: false,
            error: 'No OG image found',
          });
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          setState({
            imageUrl: fallbackImage || null,
            isLoading: false,
            error: 'Request timed out',
          });
          return;
        }
        setState({
          imageUrl: fallbackImage || null,
          isLoading: false,
          error: (err as Error).message,
        });
      } finally {
        clearTimeout(timeoutId);
      }
    }

    fetchOgImage();

    // Cleanup on unmount or URL change
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [url, fallbackImage]);

  return state;
}
