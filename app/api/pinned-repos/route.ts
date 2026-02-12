import { NextResponse } from 'next/server';

const GITHUB_USERNAME = 'suhanstha09';

/** Excluded pinned repos (case-insensitive match on repo name) */
const EXCLUDED = ['netflixclone', 'suhan-dropbox-clone', 'netflix-clone', 'dropbox-clone'];

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
    // Fetch the GitHub profile page
    const response = await fetch(`https://github.com/${GITHUB_USERNAME}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)',
        Accept: 'text/html',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub profile fetch error: ${response.status}`);
    }

    const html = await response.text();

    // Extract the pinned repos section
    // Pinned repos are in elements with class "pinned-item-list-item-content"
    // Each has a link like /owner/repo
    const pinnedRepos: PinnedRepo[] = [];

    // Match pinned repo blocks — GitHub wraps each in a div with class containing "pinned-item-list-item"
    // The repo link is in an <a> with href like /owner/repo or /username/repo
    const pinnedSection = html.match(
      /class="js-pinned-items-reorder-container"[\s\S]*?<\/ol>/
    );

    if (!pinnedSection) {
      // Fallback: try to find pinned items directly
      console.log('Could not find pinned section wrapper, trying direct approach');
    }

    const searchIn = pinnedSection ? pinnedSection[0] : html;

    // Find all pinned repo links — they follow the pattern:
    // <a href="/owner/repo" ...>
    // within pinned-item-list-item containers
    const repoPattern =
      /class="[^"]*pinned-item-list-item-content[^"]*"[\s\S]*?<a\s+href="\/([^"]+\/[^"]+)"[^>]*>[\s\S]*?<span class="repo">([^<]+)<\/span>/g;

    let match;
    const foundRepos: { owner: string; name: string }[] = [];

    while ((match = repoPattern.exec(searchIn)) !== null) {
      const fullPath = match[1].trim();
      const parts = fullPath.split('/');
      if (parts.length === 2) {
        foundRepos.push({ owner: parts[0], name: parts[1] });
      }
    }

    // Fallback: simpler pattern if the above doesn't work
    if (foundRepos.length === 0) {
      const simplePattern =
        /pinned-item-list-item[\s\S]*?href="\/([^"\/]+)\/([^"\/]+)"/g;
      while ((match = simplePattern.exec(searchIn)) !== null) {
        const owner = match[1].trim();
        const name = match[2].trim();
        // Avoid duplicates
        if (!foundRepos.some((r) => r.owner === owner && r.name === name)) {
          foundRepos.push({ owner, name });
        }
      }
    }

    // Filter out excluded repos
    const filteredRepos = foundRepos.filter(
      (r) =>
        !EXCLUDED.includes(r.name.toLowerCase()) &&
        !EXCLUDED.includes(r.name)
    );

    // Fetch details for each pinned repo via GitHub REST API
    const repoDetails = await Promise.all(
      filteredRepos.map(async ({ owner, name }) => {
        try {
          const repoRes = await fetch(
            `https://api.github.com/repos/${owner}/${name}`,
            {
              headers: {
                Accept: 'application/vnd.github.v3+json',
                'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)',
              },
              next: { revalidate: 3600 },
            }
          );
          if (!repoRes.ok) return null;
          const data = await repoRes.json();
          return {
            owner: data.owner?.login || owner,
            name: data.name || name,
            fullName: data.full_name || `${owner}/${name}`,
            description: data.description || null,
            language: data.language || null,
            stars: data.stargazers_count || 0,
            forks: data.forks_count || 0,
            url: data.html_url || `https://github.com/${owner}/${name}`,
          } as PinnedRepo;
        } catch {
          return null;
        }
      })
    );

    const finalRepos = repoDetails.filter(Boolean) as PinnedRepo[];

    return NextResponse.json({ repos: finalRepos });
  } catch (error) {
    console.error('Failed to fetch pinned repos:', error);
    return NextResponse.json({ repos: [] }, { status: 500 });
  }
}
