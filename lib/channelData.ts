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
  title: 'UI/UX Designer & Full Stack Developer',
  bio: `A Full-Stack Developer pursuing a Bachelor's degree in CSIT, with hands-on experience designing and shipping production-grade web applications end-to-end from pixel-perfect frontends to scalable backend APIs, database architecture, and cloud deployment. Comfortable across the full development lifecycle including CI/CD, containerization, and Linux-based environments. Building things that work, look good, and scale—always shipping something new.`,
  email: 'scubashrestha4@gmail.com',
  location: 'Deepnagar, Butwal, Nepal',
  phone: '9847154781',
  website: 'suhanshrestha.com.np',
  linkedin: 'https://www.linkedin.com/in/suhan-shrestha-9223b1247/',
  github: 'suhanstha09',
  githubUrl: 'https://github.com/suhanstha09',
};

/** Work experience data */
export const experiences = [
  {
    title: 'Senior Full Stack Developer',
    company: 'Inovex Tech & Media',
    duration: 'Jan 2025 – Jun 2026',
    location: 'Drivetole, Tilottama',
    current: false,
    responsibilities: [
      'Led and mentored a team of junior developers and interns, conducting code reviews and maintaining high delivery standards',
      'Oversaw full-stack architecture decisions ensuring scalable, production-ready solutions across multiple projects',
      'Coordinated development workflows and aligned technical execution with business requirements',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'Nava Tech & Media',
    duration: 'Jul 2025 – Jan 2026',
    location: 'Manigram, Tilottama',
    current: false,
    responsibilities: [
      'Delivered dynamic, responsive web solutions for 5+ clients including colleges and businesses, handling full-stack development end-to-end',
      'Collaborated within cross-functional teams to build and maintain scalable web applications tailored to diverse client requirements',
      'Translated client requirements into production-ready features using modern frontend frameworks and robust backend APIs',
    ],
  },
  {
    title: 'Frontend Developer',
    company: 'ELZA.FUN',
    duration: 'Jun 2024 – Mar 2025',
    current: false,
    responsibilities: [
      'Developed and maintained responsive, component-based UIs using React/Next.js, TypeScript, and modern CSS',
      'Built interactive features for quiz and learning experiences (timers, question flows, result views), improving user engagement through intuitive layouts',
      'Collaborated closely with designers and backend engineers to translate Figma designs into pixel-perfect interfaces and integrate APIs',
    ],
  },
  {
    title: 'Graphic Designer',
    company: 'Nava Tech & Media',
    duration: 'May 2025 – Jun 2026',
    location: 'Tilottama',
    current: false,
    responsibilities: [
      'Designed and delivered high-quality visual content for branding, digital marketing, and client engagement initiatives',
      'Produced creative assets including social media campaigns, advertisements, presentations, and promotional materials',
      'Maintained brand consistency across multiple projects while ensuring alignment with client requirements',
      'Contributed to UI/UX concepts, marketing campaigns, and digital content strategies to enhance audience engagement',
    ],
  },
  {
    title: 'Graphic Designer',
    company: 'Four-Bit',
    duration: 'Jan 2024 – Mar 2025',
    location: 'Butwal',
    current: false,
    responsibilities: [
      'Designed social media creatives, advertising materials, and brand assets for multiple clients across different industries',
      'Created logos, banners, posters, brochures, and marketing collateral while maintaining brand consistency',
      'Produced content optimized for Facebook, Instagram, LinkedIn, and other digital platforms',
      'Managed multiple design projects simultaneously while meeting deadlines and maintaining high quality standards',
    ],
  },
];

/** Technical skills categorized */
export const technicalSkills = [
  { name: 'Figma' , level:100, category: 'frontend'},
  { name: 'Next.js', level: 90, category: 'frontend' },
  { name: 'React', level: 90, category: 'frontend' },
  { name: 'TypeScript', level: 85, category: 'language' },
  { name: 'JavaScript', level: 90, category: 'language' },
  { name: 'Python', level: 90, category: 'language' },
  { name: 'HTML/CSS', level: 95, category: 'frontend' },
  { name: 'TailwindCSS / ShadCN / Redux' , level:100, category: 'frontend'},
  { name: 'Django', level: 60, category: 'backend' },
  { name: 'Node.js', level: 65, category: 'backend' },
  { name: 'AWS' , level:100, category: 'cloud'},
  { name: 'Express.js' , level:100, category: 'cloud'},
  { name: 'PostgreSQL/ MongoDB/ Mysql/ SQlite' , level:100, category: 'database'},
  { name: 'Figma', level: 80, category: 'design' },
  { name: 'Photoshop / Illustrator', level: 75, category: 'design' },
  { name: 'FL Studio', level: 70, category: 'creative' },
  { name: 'Vercel/ Railway', level: 70, category: 'deployment' }, 
  { name: 'Docker', level: 70, category: 'deployment' }, 
  
  

];

/** Non-technical skills */
export const softSkills = [
  { name: 'Leadership', icon: '' },
  { name: 'Communication', icon: '' },
  { name: 'Musician', icon: '' },
];

/** Personal quotes for the quotes channel */
export const quotes = [
  {
    text: 'Code is poetry written for machines, but read by humans.',
    context: 'Suhan Shrestha',
  },
  {
    text: 'He who is not contented with what he has, would not be contented with what he would like to have.',
    context: 'Socrates',
  },
  {
    text: 'How could I dirt of the deepest trenches on earth dream about stars.',
    context: 'Suhan Shrestha',
  },
  {
    text: 'She\'s the sunflower for which the sun shines',
    context: 'Suhan Shrestha',
  },
  {
    text: 'Build things that matter. Ship things that work.',
    context: 'Suhan Shrestha',
  },
];

/** Repos to exclude from GitHub display */
export const excludedRepos = ['netflix-clone', 'dropbox-clone'];
