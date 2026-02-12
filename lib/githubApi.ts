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

/** Full contribution data response */
export interface ContributionData {
  weeks: ContributionWeek[];
  totalContributions: number;
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
 * Fetch contribution data via our server-side API route,
 * which scrapes GitHub's contribution calendar for accurate data.
 */
export async function fetchContributionData(): Promise<ContributionData> {
  try {
    const response = await fetch('/api/contributions');

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      weeks: data.weeks || [],
      totalContributions: data.totalContributions || 0,
    };
  } catch (error) {
    console.error('Failed to fetch contribution data:', error);
    return { weeks: generateEmptyCalendar(), totalContributions: 0 };
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
