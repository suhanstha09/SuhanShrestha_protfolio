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
 * Fetch contribution data directly from GitHub's contribution calendar page.
 * Scrapes the public HTML endpoint which contains exact contribution counts
 * and intensity levels, matching what's shown on the GitHub profile.
 */
export async function fetchContributionData(): Promise<ContributionData> {
  try {
    const currentYear = new Date().getFullYear();
    const response = await fetch(
      `https://github.com/users/${GITHUB_USERNAME}/contributions?from=${currentYear}-01-01&to=${currentYear}-12-31`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`GitHub contributions page error: ${response.status}`);
    }

    const html = await response.text();

    // Extract total contributions from the heading (e.g. "158 contributions in 2026")
    const totalMatch = html.match(/(\d+)\s+contributions?\s+in\s+\d{4}/);
    const totalContributions = totalMatch ? parseInt(totalMatch[1], 10) : 0;

    // Parse contribution cells: extract data-date and data-level from <td> elements
    const cellRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
    const dateMap: Record<string, number> = {};
    let match;
    while ((match = cellRegex.exec(html)) !== null) {
      dateMap[match[1]] = parseInt(match[2], 10);
    }

    // Parse tooltip text for actual contribution counts
    const tooltipRegex = /for="contribution-day-component-(\d+)-(\d+)"[^>]*>(\d+)\s+contribution|No contributions/g;
    const countMap: Record<string, number> = {};
    // Use a different approach: match each tool-tip and extract count + linked date
    const tooltipDetailRegex = /for="(contribution-day-component-\d+-\d+)"[^>]*class="[^"]*">([\s\S]*?)<\/tool-tip>/g;
    let tipMatch;
    while ((tipMatch = tooltipDetailRegex.exec(html)) !== null) {
      const tipId = tipMatch[1];
      const tipText = tipMatch[2].trim();
      // Find the corresponding td with this id
      const tdRegex = new RegExp(`id="${tipId}"[^>]*data-date="(\\d{4}-\\d{2}-\\d{2})"`);
      const tdMatch = tdRegex.exec(html);
      if (tdMatch) {
        const date = tdMatch[1];
        const countMatch = tipText.match(/^(\d+)\s+contribution/);
        countMap[date] = countMatch ? parseInt(countMatch[1], 10) : 0;
      }
    }

    // Build weekly grid (GitHub uses Sun-Sat columns, 53 weeks max)
    const jan1 = new Date(currentYear, 0, 1);
    const startDate = new Date(jan1);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // align to Sunday

    const weeks: ContributionWeek[] = [];
    for (let w = 0; w < 53; w++) {
      const days: ContributionDay[] = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + w * 7 + d);
        const dateStr = currentDate.toISOString().split('T')[0];

        const level = dateMap[dateStr] ?? 0;
        const count = countMap[dateStr] ?? 0;

        days.push({ date: dateStr, count, level });
      }
      weeks.push({ days });
    }

    return { weeks, totalContributions };
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
