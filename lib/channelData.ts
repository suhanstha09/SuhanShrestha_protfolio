/**
 * ═══════════════════════════════════════════════════
 * Channel Data Configuration
 * Defines all 8 TV channels with metadata and content
 * ═══════════════════════════════════════════════════
 */

export interface Channel {
  number: number;
  name: string;
  label: string;
  icon: string;
}

export const channels: Channel[] = [
  { number: 1, name: 'about', label: 'About Me', icon: '👤' },
  { number: 2, name: 'experience', label: 'Experience', icon: '💼' },
  { number: 3, name: 'skills', label: 'Skills', icon: '⚡' },
  { number: 4, name: 'projects', label: 'Projects', icon: '📂' },
  { number: 5, name: 'proof-of-work', label: 'Proof of Work', icon: '📊' },
  { number: 6, name: 'quotes', label: 'Quotes', icon: '💬' },
  { number: 7, name: 'blog', label: 'Blog/Writing', icon: '✍️' },
  { number: 8, name: 'contact', label: 'Contact', icon: '📡' },
];

/** Personal bio & information */
export const personalInfo = {
  name: 'Suhan Shrestha',
  title: 'Full Stack Developer',
  bio: `Frontend developer with 1 year of experience transitioning to full-stack. Specialized in building responsive, component-based UIs with React/Next.js. Strong eye for UI/UX design and pixel-perfect implementation. Currently expanding backend skills with Django and Node.js while maintaining expertise in modern frontend development and design tools.`,
  email: 'scubashrestha4@gmail.com',
  location: 'Butwal, Nepal',
  linkedin: 'https://www.linkedin.com/in/suhan-shrestha-9223b1247/',
  github: 'suhanstha09',
  githubUrl: 'https://github.com/suhanstha09',
};

/** Work experience data */
export const experiences = [
  {
    title: 'Frontend Developer',
    company: 'ELZA.FUN',
    duration: '1 Year',
    current: true,
    responsibilities: [
      'Developed and maintained responsive, component-based UIs using React/Next.js, TypeScript, and modern CSS, ensuring fast load times and smooth interactions across desktop and mobile.',
      'Built interactive features for quiz and learning experiences (timers, question flows, result views), improving user engagement and completion rates through intuitive layouts and micro-interactions.',
      'Collaborated closely with designers and backend engineers to translate Figma designs into pixel-perfect interfaces, integrate APIs, and refine UX based on user feedback and analytics.',
    ],
  },
];

/** Technical skills categorized */
export const technicalSkills = [
  { name: 'Next.js', level: 90, category: 'frontend' },
  { name: 'React', level: 90, category: 'frontend' },
  { name: 'TypeScript', level: 85, category: 'language' },
  { name: 'JavaScript', level: 90, category: 'language' },
  { name: 'HTML/CSS', level: 95, category: 'frontend' },
  { name: 'Django', level: 60, category: 'backend' },
  { name: 'Node.js', level: 65, category: 'backend' },
  { name: 'Figma', level: 80, category: 'design' },
  { name: 'Photoshop', level: 75, category: 'design' },
  { name: 'FL Studio', level: 70, category: 'creative' },
];

/** Non-technical skills */
export const softSkills = [
  { name: 'Leadership', icon: '🎯' },
  { name: 'Communication', icon: '🗣️' },
  { name: 'Musician', icon: '🎵' },
];

/** Personal quotes for the quotes channel */
export const quotes = [
  {
    text: 'Code is poetry written for machines, but read by humans.',
    context: 'On clean code philosophy',
  },
  {
    text: 'Every pixel matters. Every interaction counts.',
    context: 'On attention to detail',
  },
  {
    text: 'The best UI is the one the user never notices.',
    context: 'On intuitive design',
  },
  {
    text: 'From frontend to full-stack — the journey never stops.',
    context: 'On continuous learning',
  },
  {
    text: 'Build things that matter. Ship things that work.',
    context: 'On practical development',
  },
  {
    text: 'Design is not just what it looks like. Design is how it works.',
    context: 'On product thinking',
  },
];

/** Repos to exclude from GitHub display */
export const excludedRepos = ['netflix-clone', 'dropbox-clone'];
