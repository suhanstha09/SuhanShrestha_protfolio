import type { Metadata } from 'next';
import { IBM_Plex_Mono, Orbitron } from 'next/font/google';
import './globals.css';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Suhan Shrestha | Full Stack Developer',
  description:
    'Portfolio of Suhan Shrestha — Full Stack Developer specializing in React, Next.js, and modern web technologies. Experience the retro CRT TV interface.',
  keywords: [
    'Suhan Shrestha',
    'Full Stack Developer',
    'React',
    'Next.js',
    'Portfolio',
    'Frontend Developer',
  ],
  authors: [{ name: 'Suhan Shrestha' }],
  openGraph: {
    title: 'Suhan Shrestha | Full Stack Developer',
    description: 'Retro CRT TV Portfolio — Full Stack Developer',
    type: 'website',
    url: 'https://suhan-shrestha-protfolio.vercel.app',
    images: [
      {
        url: 'https://suhan-shrestha-protfolio.vercel.app/logo.png',
        width: 1200,
        height: 630,
        alt: 'Suhan Shrestha | Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Suhan Shrestha | Full Stack Developer',
    description: 'Retro CRT TV Portfolio — Full Stack Developer',
    images: ['https://suhan-shrestha-protfolio.vercel.app/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${ibmPlexMono.variable} ${orbitron.variable}`}>
      <body className={`${ibmPlexMono.className} antialiased`}>{children}</body>
    </html>
  );
}
