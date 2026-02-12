/**
 * ═══════════════════════════════════════════════════
 * GitHub API Integration
 * Fetches repos and contribution data for suhanstha09
 * ═══════════════════════════════════════════════════
 */

import { excludedRepos } from './channelData';

const GITHUB_USERNAME = 'suhanstha09';
const GITHUB_API_BASE = 'https://api.github.com';

/** Repository data shape */
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  created_at: string;
  homepage: string | null;
}

/** Contribution day data */
export interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4 intensity
}

/** Contribution week data */
export interface ContributionWeek {
  days: ContributionDay[];
}

/**
 * Fetch public repositories for the user, excluding specified repos.
 * Sorted by most recently updated.
 */
export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30&type=owner`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();

    // Filter out excluded repos and forks
    return repos.filter(
      (repo) =>
        !excludedRepos.includes(repo.name.toLowerCase()) &&
        !excludedRepos.includes(repo.name)
    );
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error);
    return [];
  }
}

/**
 * Fetch contribution/commit activity using the GitHub Events API.
 * Returns a simplified contribution calendar with intensity levels.
 * 
 * Note: The Events API returns up to 300 events / 90 days.
 * We process these into a calendar-like grid.
 */
export async function fetchContributionData(): Promise<ContributionWeek[]> {
  try {
    // Fetch multiple pages of events to get more data
    const pages = await Promise.all(
      [1, 2, 3].map((page) =>
        fetch(
          `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events?per_page=100&page=${page}`,
          {
            headers: { Accept: 'application/vnd.github.v3+json' },
            next: { revalidate: 3600 },
          }
        ).then((r) => (r.ok ? r.json() : []))
      )
    );

    // Flatten all events and count by date
    const allEvents = pages.flat();
    const dateCounts: Record<string, number> = {};

    // Count push events per day (closest to "commits")
    allEvents.forEach((event: { type: string; created_at: string }) => {
      if (event.type === 'PushEvent') {
        const date = event.created_at.split('T')[0];
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      }
    });

    // Generate 52 weeks of calendar data (364 days)
    const weeks: ContributionWeek[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 363); // 52 weeks back
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Find max contributions for scaling
    const maxCount = Math.max(1, ...Object.values(dateCounts));

    for (let w = 0; w < 52; w++) {
      const days: ContributionDay[] = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + w * 7 + d);
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = dateCounts[dateStr] || 0;

        // Calculate intensity level (0-4)
        let level = 0;
        if (count > 0) {
          level = Math.min(4, Math.ceil((count / maxCount) * 4));
        }

        days.push({ date: dateStr, count, level });
      }
      weeks.push({ days });
    }

    return weeks;
  } catch (error) {
    console.error('Failed to fetch contribution data:', error);
    // Return empty calendar on error
    return generateEmptyCalendar();
  }
}

/** Generate an empty 52-week calendar grid as fallback */
function generateEmptyCalendar(): ContributionWeek[] {
  const weeks: ContributionWeek[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 363);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  for (let w = 0; w < 52; w++) {
    const days: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + w * 7 + d);
      days.push({
        date: currentDate.toISOString().split('T')[0],
        count: 0,
        level: 0,
      });
    }
    weeks.push({ days });
  }
  return weeks;
}

/**
 * Fetch user profile information
 */
export async function fetchGitHubProfile() {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`,
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch GitHub profile:', error);
    return null;
  }
}

/** Language color mapping for repo cards */
export const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Java: '#b07219',
  'C++': '#f34b7d',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Dart: '#00B4AB',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
};
