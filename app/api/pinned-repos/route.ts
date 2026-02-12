import { NextResponse } from 'next/server';

const GITHUB_USERNAME = 'suhanstha09';

/** Repos to exclude (case-insensitive match on repo name) */
const EXCLUDED = ['netflixclone', 'suhan-dropbox-clone', 'netflix-clone', 'dropbox-clone', 'suhanstha09'];

/** Featured repos to display — add repo names here to pin them */
const FEATURED_REPOS = [
  '_CodeForImpact_LCCsMeisters_CareerCraft_',
  'milesmorales_landonorris-clone-',
  'suhan-portofoilo_UI_experimentation_',
  'SuhanShrestha_protfolio',
];

interface PinnedRepo {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
}

export async function GET() {
  try {
    // Fetch featured repos directly from GitHub REST API
    const repoDetails = await Promise.all(
      FEATURED_REPOS.map(async (name) => {
        try {
          const repoRes = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${name}`,
            {
              headers: {
                Accept: 'application/vnd.github.v3+json',
                'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)',
              },
              next: { revalidate: 600 },
            }
          );

          if (!repoRes.ok) {
            // Try as a forked repo — check if it's from another owner
            return null;
          }

          const data = await repoRes.json();
          return {
            owner: data.owner?.login || GITHUB_USERNAME,
            name: data.name || name,
            fullName: data.full_name || `${GITHUB_USERNAME}/${name}`,
            description: data.description || null,
            language: data.language || null,
            stars: data.stargazers_count || 0,
            forks: data.forks_count || 0,
            url: data.html_url || `https://github.com/${GITHUB_USERNAME}/${name}`,
          } as PinnedRepo;
        } catch {
          return null;
        }
      })
    );

    // If featured repos are empty or too few, also fetch recent repos
    let finalRepos = repoDetails.filter(Boolean) as PinnedRepo[];

    if (finalRepos.length < 4) {
      try {
        const allReposRes = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
              'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)',
            },
            next: { revalidate: 600 },
          }
        );

        if (allReposRes.ok) {
          const allRepos = await allReposRes.json();
          const existingNames = new Set(finalRepos.map((r) => r.name.toLowerCase()));

          for (const data of allRepos) {
            if (finalRepos.length >= 6) break;
            const name = (data.name || '').toLowerCase();
            if (EXCLUDED.includes(name) || existingNames.has(name)) continue;
            existingNames.add(name);
            finalRepos.push({
              owner: data.owner?.login || GITHUB_USERNAME,
              name: data.name,
              fullName: data.full_name,
              description: data.description || null,
              language: data.language || null,
              stars: data.stargazers_count || 0,
              forks: data.forks_count || 0,
              url: data.html_url,
            });
          }
        }
      } catch {
        // Silently fail — we already have some repos
      }
    }

    return NextResponse.json({ repos: finalRepos });
  } catch (error) {
    console.error('Failed to fetch repos:', error);
    return NextResponse.json({ repos: [] }, { status: 500 });
  }
}
