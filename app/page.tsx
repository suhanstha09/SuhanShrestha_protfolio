/**
 * ═══════════════════════════════════════════════════
 * Portfolio Home Page
 * Entry point that renders the CRT Monitor interface.
 * The entire portfolio is a single-page application
 * controlled through the TV channel metaphor.
 * ═══════════════════════════════════════════════════
 */

import CRTMonitor from '@/components/CRTMonitor';

export default function Home() {
  return (
    <main>
      <CRTMonitor />
    </main>
  );
}
