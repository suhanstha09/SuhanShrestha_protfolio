'use client';

/**
 * ═══════════════════════════════════════════════════
 * Static Overlay Component
 * Displays TV static/noise during channel transitions.
 * Uses SVG noise filter with rapid background-position
 * animation for authentic analog static look.
 * ═══════════════════════════════════════════════════
 */

import { motion, AnimatePresence } from 'framer-motion';

interface StaticOverlayProps {
  isVisible: boolean;
}

export default function StaticOverlay({ isVisible }: StaticOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 z-30 overflow-hidden rounded-[20px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.05 }}
          aria-hidden="true"
        >
          {/* Static noise layer */}
          <div className="static-noise absolute inset-0" />

          {/* Bright scan bars that flicker */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }}
            animate={{ backgroundPosition: ['0 0', '0 100px'] }}
            transition={{ duration: 0.2, repeat: Infinity, ease: 'linear' }}
          />

          {/* Central luminance flash */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
            }}
            animate={{ opacity: [0.5, 1, 0.3, 0.8] }}
            transition={{ duration: 0.1, repeat: Infinity }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
