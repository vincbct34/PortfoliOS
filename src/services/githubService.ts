// ============================================================================
// GitHub Service
// ============================================================================
// Fetches GitHub API data with localStorage caching to minimize API calls.
// Public API allows 60 requests/hour without authentication.
// With a token (VITE_GITHUB_TOKEN), allows 5000 requests/hour + private repos.
// ============================================================================

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = 'vincbct34';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// GitHub Personal Access Token (optional, enables private repo access)
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface GitHubUserStats {
  publicRepos: number;
  privateRepos: number;
  totalRepos: number;
  followers: number;
  following: number;
  publicGists: number;
  createdAt: string;
  avatarUrl: string;
  bio: string | null;
}

export interface CommitWeek {
  week: number; // Unix timestamp
  days: number[]; // Sun-Sat commit counts
  total: number;
}

export interface LanguageStats {
  [language: string]: number; // bytes per language
}

export interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  createdAt: string;
  payload?: {
    commits?: { message: string }[];
    action?: string;
  };
}

export interface GitHubData {
  user: GitHubUserStats | null;
  commitActivity: CommitWeek[];
  languages: LanguageStats;
  recentEvents: GitHubEvent[];
  totalCommitsThisYear: number;
  activeReposCount: number;
  lastUpdated: number;
  isAuthenticated: boolean;
  error?: string;
}

// ----------------------------------------------------------------------------
// Cache Helpers
// ----------------------------------------------------------------------------

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function getFromCache<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();

    if (now - entry.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage might be full or unavailable
  }
}

// ----------------------------------------------------------------------------
// API Fetchers
// ----------------------------------------------------------------------------

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchWithRetry<T>(url: string, retries = 2): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded');
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError;
}

async function fetchUserStats(): Promise<GitHubUserStats> {
  const cacheKey = `github_user_${GITHUB_USERNAME}`;
  const cached = getFromCache<GitHubUserStats>(cacheKey);
  if (cached) return cached;

  interface GitHubUserResponse {
    public_repos: number;
    total_private_repos?: number;
    owned_private_repos?: number;
    followers: number;
    following: number;
    public_gists: number;
    created_at: string;
    avatar_url: string;
    bio: string | null;
  }

  // Use authenticated endpoint if token available (includes private repo info)
  const endpoint = GITHUB_TOKEN
    ? `${GITHUB_API_BASE}/user`
    : `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`;

  const data = await fetchWithRetry<GitHubUserResponse>(endpoint);

  const privateRepos = data.owned_private_repos || data.total_private_repos || 0;
  const stats: GitHubUserStats = {
    publicRepos: data.public_repos,
    privateRepos: privateRepos,
    totalRepos: data.public_repos + privateRepos,
    followers: data.followers,
    following: data.following,
    publicGists: data.public_gists,
    createdAt: data.created_at,
    avatarUrl: data.avatar_url,
    bio: data.bio,
  };

  setCache(cacheKey, stats);
  return stats;
}

async function fetchCommitActivity(): Promise<CommitWeek[]> {
  const cacheKey = `github_commits_${GITHUB_USERNAME}`;
  const cached = getFromCache<CommitWeek[]>(cacheKey);
  if (cached) return cached;

  // Fetch repos - use authenticated endpoint if token available (includes private repos)
  interface RepoResponse {
    name: string;
    fork: boolean;
    owner: { login: string };
  }

  const reposEndpoint = GITHUB_TOKEN
    ? `${GITHUB_API_BASE}/user/repos?per_page=100&sort=pushed&affiliation=owner`
    : `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`;

  const repos = await fetchWithRetry<RepoResponse[]>(reposEndpoint);

  // Filter non-fork repos and get top 10 most recently pushed
  const ownRepos = repos.filter((r) => !r.fork).slice(0, 10);

  // Aggregate commit activity from repos
  const allWeeks: Map<number, CommitWeek> = new Map();

  interface CommitActivityResponse {
    week: number;
    days: number[];
    total: number;
  }

  for (const repo of ownRepos) {
    try {
      // GitHub stats API may return 202 while computing - we need to retry
      const repoPath = repo.owner?.login
        ? `${repo.owner.login}/${repo.name}`
        : `${GITHUB_USERNAME}/${repo.name}`;

      let activity: CommitActivityResponse[] | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${repoPath}/stats/commit_activity`, {
          headers: getAuthHeaders(),
        });

        if (response.status === 202) {
          // Stats being computed, wait and retry
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }

        if (response.ok) {
          activity = await response.json();
          break;
        }
      }

      if (Array.isArray(activity)) {
        for (const week of activity) {
          const existing = allWeeks.get(week.week);
          if (existing) {
            existing.total += week.total;
            week.days.forEach((d, i) => (existing.days[i] += d));
          } else {
            allWeeks.set(week.week, {
              week: week.week,
              days: [...week.days],
              total: week.total,
            });
          }
        }
      }
    } catch {
      // Skip repos that fail
    }
  }

  const result = Array.from(allWeeks.values()).sort((a, b) => a.week - b.week);
  setCache(cacheKey, result);
  return result;
}

async function fetchLanguages(): Promise<LanguageStats> {
  const cacheKey = `github_languages_${GITHUB_USERNAME}`;
  const cached = getFromCache<LanguageStats>(cacheKey);
  if (cached) return cached;

  // Fetch repos - use authenticated endpoint if token available (includes private repos)
  interface RepoResponse {
    name: string;
    fork: boolean;
    owner: { login: string };
  }

  const reposEndpoint = GITHUB_TOKEN
    ? `${GITHUB_API_BASE}/user/repos?per_page=100&affiliation=owner`
    : `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100`;

  const repos = await fetchWithRetry<RepoResponse[]>(reposEndpoint);

  const ownRepos = repos.filter((r) => !r.fork).slice(0, 10);
  const aggregatedLanguages: LanguageStats = {};

  for (const repo of ownRepos) {
    try {
      const langs = await fetchWithRetry<LanguageStats>(
        `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/languages`
      );

      for (const [lang, bytes] of Object.entries(langs)) {
        aggregatedLanguages[lang] = (aggregatedLanguages[lang] || 0) + bytes;
      }
    } catch {
      // Skip repos that fail
    }
  }

  setCache(cacheKey, aggregatedLanguages);
  return aggregatedLanguages;
}

async function fetchRecentEvents(): Promise<GitHubEvent[]> {
  const cacheKey = `github_events_${GITHUB_USERNAME}`;
  const cached = getFromCache<GitHubEvent[]>(cacheKey);
  if (cached) return cached;

  interface EventResponse {
    id: string;
    type: string;
    repo: { name: string };
    created_at: string;
    payload?: {
      commits?: { message: string }[];
      action?: string;
    };
  }

  const events = await fetchWithRetry<EventResponse[]>(
    `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events?per_page=30`
  );

  const result: GitHubEvent[] = events.map((e) => ({
    id: e.id,
    type: e.type,
    repo: e.repo,
    createdAt: e.created_at,
    payload: e.payload,
  }));

  setCache(cacheKey, result);
  return result;
}

// ----------------------------------------------------------------------------
// Main Export
// ----------------------------------------------------------------------------

export async function fetchGitHubData(): Promise<GitHubData> {
  const cacheKey = `github_full_data_${GITHUB_USERNAME}`;
  const cached = getFromCache<GitHubData>(cacheKey);
  if (cached) return cached;

  try {
    const [user, commitActivity, languages, recentEvents] = await Promise.all([
      fetchUserStats().catch(() => null),
      fetchCommitActivity().catch(() => []),
      fetchLanguages().catch(() => ({})),
      fetchRecentEvents().catch(() => []),
    ]);

    // Calculate total commits this year
    const totalCommitsThisYear = commitActivity.reduce((sum, week) => sum + week.total, 0);

    // Count active repos (those with commits in the last 3 months)
    const threeMonthsAgo = Date.now() / 1000 - 90 * 24 * 60 * 60;
    const activeReposCount = new Set(
      recentEvents
        .filter(
          (e) => e.type === 'PushEvent' && new Date(e.createdAt).getTime() / 1000 > threeMonthsAgo
        )
        .map((e) => e.repo.name)
    ).size;

    const data: GitHubData = {
      user,
      commitActivity,
      languages,
      recentEvents,
      totalCommitsThisYear,
      activeReposCount,
      lastUpdated: Date.now(),
      isAuthenticated: !!GITHUB_TOKEN,
    };

    setCache(cacheKey, data);
    return data;
  } catch (error) {
    return {
      user: null,
      commitActivity: [],
      languages: {},
      recentEvents: [],
      totalCommitsThisYear: 0,
      activeReposCount: 0,
      lastUpdated: Date.now(),
      isAuthenticated: !!GITHUB_TOKEN,
      error: error instanceof Error ? error.message : 'Failed to fetch GitHub data',
    };
  }
}

export function clearGitHubCache(): void {
  const keys = [
    `github_user_${GITHUB_USERNAME}`,
    `github_commits_${GITHUB_USERNAME}`,
    `github_languages_${GITHUB_USERNAME}`,
    `github_events_${GITHUB_USERNAME}`,
    `github_full_data_${GITHUB_USERNAME}`,
  ];
  keys.forEach((key) => localStorage.removeItem(key));
}
