# Suhan Shrestha — Portfolio

A retro CRT television-themed developer portfolio built with Next.js. Browse through 8 TV channels using a rotary dial to explore my work, skills, projects, and more.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-purple?logo=framer)

## Features

- **CRT TV Interface** — Vintage television aesthetic with scanlines, static overlay, and screen effects
- **8 Channels** — About, Experience, Skills, Projects, Proof of Work, Quotes, Blog, and Contact
- **Rotary Dial Navigation** — Draggable channel selector knob with realistic interaction
- **Music Player** — Built-in music toggle via the Vol knob
- **Linux Terminal Background** — Animated terminal with neofetch and package manager commands
- **GitHub Integration** — Live pinned repos and contribution data fetched from GitHub
- **Green/Amber Mode** — Toggle between retro green and amber CRT color schemes
- **Responsive Design** — Desktop side panel and mobile remote control layouts
- **Sound Effects** — CRT power-on, channel switch, and static audio via Web Audio API

## Channels

| CH | Name          | Description                            |
|----|---------------|----------------------------------------|
| 1  | About Me      | Bio, personal info, and introduction   |
| 2  | Experience    | Work history and professional timeline |
| 3  | Skills        | Technical skills grouped by category   |
| 4  | Projects      | Pinned GitHub repositories             |
| 5  | Proof of Work | GitHub contributions and stats         |
| 6  | Quotes        | Favorite developer quotes              |
| 7  | Blog/Writing  | Articles and blog posts                |
| 8  | Contact       | Email, LinkedIn, GitHub, and location  |

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Audio:** Web Audio API + HTML Audio
- **API:** GitHub REST API (server-side routes)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/suhanstha09/SuhanShrestha_protfolio.git
cd SuhanShrestha_protfolio
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles & CRT effects
│   └── api/
│       ├── contributions/  # GitHub contributions endpoint
│       └── pinned-repos/   # GitHub pinned repos endpoint
├── components/
│   ├── CRTMonitor.tsx      # Main TV container & state management
│   ├── ChannelContent.tsx  # All 8 channel views
│   ├── TVControls.tsx      # Side panel & mobile remote controls
│   ├── RotaryDial.tsx      # Draggable channel dial
│   ├── BootSequence.tsx    # CRT boot-up animation
│   └── StaticOverlay.tsx   # TV static/noise effect
├── lib/
│   ├── channelData.ts      # Channel config & content data
│   ├── githubApi.ts        # GitHub API helpers
│   └── soundEffects.ts     # Web Audio sound generators
└── public/                 # Static assets & music
```

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ☕ by **Suhan Shrestha**
