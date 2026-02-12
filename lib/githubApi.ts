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
 * Returns a simplified contribution calendar for the current year.
 * 
 * Note: The Events API returns up to 300 events / 90 days.
 * We process these into a calendar-like grid for the current year.
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

    // Count actual commits within each PushEvent (not just 1 per push)
    // and also count other contribution-type events
    allEvents.forEach((event: { type: string; created_at: string; payload?: { size?: number; commits?: unknown[] } }) => {
      const date = event.created_at.split('T')[0];
      if (event.type === 'PushEvent') {
        // Each PushEvent can contain multiple commits
        const commitCount = event.payload?.size || event.payload?.commits?.length || 1;
        dateCounts[date] = (dateCounts[date] || 0) + commitCount;
      } else if (
        event.type === 'CreateEvent' ||
        event.type === 'IssuesEvent' ||
        event.type === 'PullRequestEvent' ||
        event.type === 'PullRequestReviewEvent'
      ) {
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      }
    });

    // Generate calendar data for the current year (Jan 1 to today)
    const today = new Date();
    const currentYear = today.getFullYear();
    const jan1 = new Date(currentYear, 0, 1); // January 1st of current year
    // Align to Sunday of the week containing Jan 1
    const startDate = new Date(jan1);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Find max contributions for scaling
    const maxCount = Math.max(1, ...Object.values(dateCounts));

    // Show the full year (52 weeks), marking future dates as empty
    const totalWeeks = 53;

    const weeks: ContributionWeek[] = [];
    for (let w = 0; w < totalWeeks; w++) {
      const days: ContributionDay[] = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + w * 7 + d);
        
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Dates before Jan 1 or after today get level 0
        if (currentDate < jan1 || currentDate > today) {
          days.push({ date: dateStr, count: 0, level: 0 });
          continue;
        }
        
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

/** Generate an empty calendar grid for the current year as fallback */
function generateEmptyCalendar(): ContributionWeek[] {
  const weeks: ContributionWeek[] = [];
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  for (let w = 0; w < 53; w++) {
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
