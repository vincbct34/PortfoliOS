import { useState, useEffect, useMemo } from 'react';
import styles from './GitHubPerformance.module.css';
import TaskManagerGraph from './TaskManagerGraph';
import { fetchGitHubData, clearGitHubCache, type GitHubData } from '../../services/githubService';
import { useTranslation } from '../../context/I18nContext';

type MetricType = 'commits' | 'repos' | 'languages' | 'activity';

// Language colors from GitHub
const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Haskell: '#5e5086',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Vue: '#41b883',
  Svelte: '#ff3e00',
};

export default function GitHubPerformance() {
  const { t } = useTranslation();
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<MetricType>('commits');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const githubData = await fetchGitHubData();
      if (githubData.error) {
        setError(githubData.error);
      } else {
        setData(githubData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    clearGitHubCache();
    loadData();
  };

  // Prepare commit data for the graph (last 26 weeks)
  const commitGraphData = useMemo(() => {
    if (!data?.commitActivity) return [];
    const lastWeeks = data.commitActivity.slice(-26);
    return lastWeeks.map((w) => w.total);
  }, [data]);

  // Prepare daily commits for a detailed view
  const dailyCommitData = useMemo(() => {
    if (!data?.commitActivity) return [];
    const lastWeeks = data.commitActivity.slice(-8);
    return lastWeeks.flatMap((w) => w.days);
  }, [data]);

  // Calculate language percentages
  const languageData = useMemo(() => {
    if (!data?.languages) return [];
    const total = Object.values(data.languages).reduce((a, b) => a + b, 0);
    if (total === 0) return [];

    return Object.entries(data.languages)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percent: Math.round((bytes / total) * 100),
        color: languageColors[name] || '#888',
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 8);
  }, [data]);

  // Format relative time
  const formatRelativeTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  // Get event icon
  const getEventIcon = (type: string): string => {
    switch (type) {
      case 'PushEvent':
        return '📤';
      case 'CreateEvent':
        return '✨';
      case 'PullRequestEvent':
        return '🔀';
      case 'IssuesEvent':
        return '🐛';
      case 'WatchEvent':
        return '⭐';
      case 'ForkEvent':
        return '🍴';
      case 'DeleteEvent':
        return '🗑️';
      default:
        return '📝';
    }
  };

  // Get event type label
  const getEventLabel = (event: { type: string; payload?: { action?: string } }): string => {
    switch (event.type) {
      case 'PushEvent':
        return 'Pushed commits';
      case 'CreateEvent':
        return 'Created branch/tag';
      case 'PullRequestEvent':
        return `PR ${event.payload?.action || 'updated'}`;
      case 'IssuesEvent':
        return `Issue ${event.payload?.action || 'updated'}`;
      case 'WatchEvent':
        return 'Starred repo';
      case 'ForkEvent':
        return 'Forked repo';
      default:
        return event.type.replace('Event', '');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <span>{t.skillsPage.perfLoading || 'Loading GitHub data...'}</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.errorContainer}>
        <span className={styles.errorIcon}>⚠️</span>
        <span className={styles.errorMessage}>{error || 'Failed to load data'}</span>
        <button className={styles.retryButton} onClick={handleRetry}>
          {t.skillsPage.perfRetry || 'Retry'}
        </button>
      </div>
    );
  }

  const metrics: { type: MetricType; icon: string; label: string; value: string | number }[] = [
    {
      type: 'commits',
      icon: '📊',
      label: t.skillsPage.perfCommits || 'Commits',
      value: data.totalCommitsThisYear,
    },
    {
      type: 'repos',
      icon: '📁',
      label: t.skillsPage.perfRepos || 'Repositories',
      value: data.user?.totalRepos || data.user?.publicRepos || 0,
    },
    {
      type: 'languages',
      icon: '💻',
      label: t.skillsPage.perfLanguages || 'Languages',
      value: Object.keys(data.languages).length,
    },
    {
      type: 'activity',
      icon: '⚡',
      label: t.skillsPage.perfActivity || 'Activity',
      value: data.recentEvents.length,
    },
  ];

  return (
    <div className={styles.performanceContainer}>
      {/* Left Sidebar - Metrics */}
      <div className={styles.sidebar}>
        {metrics.map((metric) => (
          <button
            key={metric.type}
            className={`${styles.metricCard} ${activeMetric === metric.type ? styles.active : ''}`}
            onClick={() => setActiveMetric(metric.type)}
          >
            <div className={styles.metricIcon}>{metric.icon}</div>
            <div className={styles.metricInfo}>
              <div className={styles.metricLabel}>{metric.label}</div>
              <div className={styles.metricValue}>{metric.value}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Panel */}
      <div className={styles.mainPanel}>
        <div className={styles.panelHeader}>
          <div>
            <div className={styles.panelTitle}>
              {metrics.find((m) => m.type === activeMetric)?.label}
            </div>
            <div className={styles.panelSubtitle}>
              GitHub Activity {data.isAuthenticated && '🔐'}
            </div>
          </div>
        </div>

        {/* Commits View */}
        {activeMetric === 'commits' && (
          <>
            <TaskManagerGraph
              data={commitGraphData}
              label={t.skillsPage.perfWeeklyCommits || 'Weekly Commits (last 6 months)'}
              color="#00d4aa"
              height={140}
            />
            <TaskManagerGraph
              data={dailyCommitData}
              label={t.skillsPage.perfDailyCommits || 'Daily Commits (last 8 weeks)'}
              color="#60cdff"
              height={100}
            />
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <div className={styles.statBoxLabel}>
                  {t.skillsPage.perfTotalCommits || 'Total This Year'}
                </div>
                <div className={styles.statBoxValue}>{data.totalCommitsThisYear}</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBoxLabel}>
                  {t.skillsPage.perfActiveRepos || 'Active Repos'}
                </div>
                <div className={styles.statBoxValue}>{data.activeReposCount}</div>
                <div className={styles.statBoxSubtext}>Last 90 days</div>
              </div>
            </div>
          </>
        )}

        {/* Repos View */}
        {activeMetric === 'repos' && (
          <>
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <div className={styles.statBoxLabel}>Public Repos</div>
                <div className={styles.statBoxValue}>{data.user?.publicRepos || 0}</div>
              </div>
              {data.isAuthenticated && (
                <div className={styles.statBox}>
                  <div className={styles.statBoxLabel}>Private Repos 🔐</div>
                  <div className={styles.statBoxValue}>{data.user?.privateRepos || 0}</div>
                </div>
              )}
              <div className={styles.statBox}>
                <div className={styles.statBoxLabel}>Followers</div>
                <div className={styles.statBoxValue}>{data.user?.followers || 0}</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBoxLabel}>Following</div>
                <div className={styles.statBoxValue}>{data.user?.following || 0}</div>
              </div>
            </div>
            {data.user?.createdAt && (
              <div className={styles.statBox}>
                <div className={styles.statBoxLabel}>Member Since</div>
                <div className={styles.statBoxValue}>
                  {new Date(data.user.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </>
        )}

        {/* Languages View */}
        {activeMetric === 'languages' && (
          <div className={styles.languagesContainer}>
            <div className={styles.languagesTitle}>
              {t.skillsPage.perfLanguageUsage || 'Language Usage'}
            </div>
            <div className={styles.languageBar}>
              {languageData.map((lang) => (
                <div
                  key={lang.name}
                  className={styles.languageSegment}
                  style={{
                    width: `${lang.percent}%`,
                    backgroundColor: lang.color,
                  }}
                  title={`${lang.name}: ${lang.percent}%`}
                />
              ))}
            </div>
            <div className={styles.languagesList}>
              {languageData.map((lang) => (
                <div key={lang.name} className={styles.languageItem}>
                  <div className={styles.languageDot} style={{ backgroundColor: lang.color }} />
                  <span className={styles.languageName}>{lang.name}</span>
                  <span className={styles.languagePercent}>{lang.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity View */}
        {activeMetric === 'activity' && (
          <div className={styles.activityContainer}>
            <div className={styles.activityTitle}>
              {t.skillsPage.perfRecentActivity || 'Recent Activity'}
            </div>
            {data.recentEvents.slice(0, 10).map((event) => (
              <div key={event.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>{getEventIcon(event.type)}</div>
                <div className={styles.activityContent}>
                  <div className={styles.activityType}>{getEventLabel(event)}</div>
                  <div className={styles.activityRepo}>{event.repo.name}</div>
                </div>
                <div className={styles.activityTime}>{formatRelativeTime(event.createdAt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
