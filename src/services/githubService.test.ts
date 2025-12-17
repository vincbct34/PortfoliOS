import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => mockLocalStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockLocalStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockLocalStorage[key];
  },
  clear: () => {
    Object.keys(mockLocalStorage).forEach((key) => delete mockLocalStorage[key]);
  },
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Import after mocking
import { fetchGitHubData, clearGitHubCache } from './githubService';

describe('githubService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchGitHubData', () => {
    it('should return cached data if available and not expired', async () => {
      const cachedData = {
        user: { publicRepos: 10, privateRepos: 0, totalRepos: 10, followers: 5 },
        commitActivity: [],
        languages: { TypeScript: 1000 },
        recentEvents: [],
        totalCommitsThisYear: 100,
        activeReposCount: 3,
        lastUpdated: Date.now(),
        isAuthenticated: false,
      };

      localStorageMock.setItem(
        'github_full_data_vincbct34',
        JSON.stringify({
          data: cachedData,
          timestamp: Date.now(),
        })
      );

      const result = await fetchGitHubData();

      expect(result).toEqual(cachedData);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should fetch data from API when cache is expired', async () => {
      const expiredTimestamp = Date.now() - 2 * 60 * 60 * 1000; // 2 hours ago
      localStorageMock.setItem(
        'github_full_data_vincbct34',
        JSON.stringify({
          data: { user: null },
          timestamp: expiredTimestamp,
        })
      );

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          public_repos: 15,
          followers: 10,
          following: 5,
          public_gists: 2,
          created_at: '2020-01-01',
          avatar_url: 'https://example.com/avatar.png',
          bio: 'Developer',
        }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await fetchGitHubData();

      expect(result.user?.publicRepos).toBe(15);
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should return error data when API fails', async () => {
      // Mock all API calls to fail (user, repos for commits, repos for languages, events)
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await fetchGitHubData();

      // Should still return a valid structure with nulls
      expect(result.user).toBeNull();
      expect(result.commitActivity).toEqual([]);
    });

    it('should handle rate limit errors', async () => {
      // Mock rate limit response
      mockFetch.mockResolvedValue({
        ok: false,
        status: 403,
      });

      const result = await fetchGitHubData();

      // Rate limit should result in null user and empty data
      expect(result.user).toBeNull();
    });
  });

  describe('clearGitHubCache', () => {
    it('should clear all GitHub cache keys', () => {
      localStorageMock.setItem('github_user_vincbct34', 'test');
      localStorageMock.setItem('github_commits_vincbct34', 'test');
      localStorageMock.setItem('github_full_data_vincbct34', 'test');

      clearGitHubCache();

      expect(localStorageMock.getItem('github_user_vincbct34')).toBeNull();
      expect(localStorageMock.getItem('github_commits_vincbct34')).toBeNull();
      expect(localStorageMock.getItem('github_full_data_vincbct34')).toBeNull();
    });
  });
});
