import { NextResponse } from 'next/server';

const GITHUB_USERNAME = 'suhanstha09';

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();
    const response = await fetch(
      `https://github.com/users/${GITHUB_USERNAME}/contributions?from=${currentYear}-01-01&to=${currentYear}-12-31`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Accept: 'text/html',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub error: ${response.status}`);
    }

    const rawHtml = await response.text();
    // Normalize whitespace so multi-line attributes don't break regex matching
    const html = rawHtml.replace(/\s+/g, ' ');

    // Extract total contributions from heading (e.g. "158 contributions in 2026")
    const totalMatch = html.match(/(\d+)\s+contributions?\s+in\s+\d{4}/);
    const totalContributions = totalMatch ? parseInt(totalMatch[1], 10) : 0;

    // Parse contribution cells: extract data-date and data-level
    const cellRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
    const dateMap: Record<string, number> = {};
    let match;
    while ((match = cellRegex.exec(html)) !== null) {
      dateMap[match[1]] = parseInt(match[2], 10);
    }

    // Parse tooltip text for actual contribution counts per day
    const countMap: Record<string, number> = {};
    // HTML order: data-date="YYYY-MM-DD" ... id="contribution-day-component-X-Y"
    const tdCellRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-\d+-\d+)"/g;
    const idToDate: Record<string, string> = {};
    let tdCellMatch;
    while ((tdCellMatch = tdCellRegex.exec(html)) !== null) {
      idToDate[tdCellMatch[2]] = tdCellMatch[1];
    }

    // Match tooltips: for="contribution-day-component-X-Y" ...>TEXT</tool-tip>
    const tipRegex = /for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g;
    let tipMatch;
    while ((tipMatch = tipRegex.exec(html)) !== null) {
      const tipId = tipMatch[1];
      const tipText = tipMatch[2].trim();
      const date = idToDate[tipId];
      if (date) {
        const numMatch = tipText.match(/^(\d+)\s+contribution/);
        countMap[date] = numMatch ? parseInt(numMatch[1], 10) : 0;
      }
    }

    // Build weekly grid (53 weeks, Sun-Sat)
    const jan1 = new Date(currentYear, 0, 1);
    const startDate = new Date(jan1);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const weeks: { days: { date: string; count: number; level: number }[] }[] = [];
    for (let w = 0; w < 53; w++) {
      const days: { date: string; count: number; level: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + w * 7 + d);
        const dateStr = currentDate.toISOString().split('T')[0];
        days.push({
          date: dateStr,
          count: countMap[dateStr] ?? 0,
          level: dateMap[dateStr] ?? 0,
        });
      }
      weeks.push({ days });
    }

    return NextResponse.json({ weeks, totalContributions });
  } catch (error) {
    console.error('Contributions API error:', error);
    return NextResponse.json(
      { weeks: [], totalContributions: 0 },
      { status: 500 }
    );
  }
}
