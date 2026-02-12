'use client';

/**
 * ═══════════════════════════════════════════════════
 * Boot Sequence Animation Component
 * Simulates CRT TV power-on: thin horizontal line
 * expands vertically with phosphor glow, then reveals
 * the main content.
 * ═══════════════════════════════════════════════════
 */

import { motion, AnimatePresence } from 'framer-motion';

interface BootSequenceProps {
  isBooting: boolean;
  greenMode: boolean;
}

export default function BootSequence({ isBooting, greenMode }: BootSequenceProps) {
  const glowColor = greenMode ? '#33ff33' : '#ff9f43';

  return (
    <AnimatePresence>
      {isBooting && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center bg-crt-dark"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Phase 1: Bright center dot appears */}
          <motion.div
            className="relative"
            style={{ width: '100%', height: '100%' }}
          >
            {/* The horizontal scan line that expands into full screen */}
            <motion.div
              className="absolute left-0 right-0"
              style={{
                top: '50%',
                background: glowColor,
                boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor}, 0 0 100px ${glowColor}`,
              }}
              initial={{ height: 0, opacity: 0, y: '-50%' }}
              animate={{
                height: [0, 2, 2, 2, '100%'],
                opacity: [0, 1, 1, 1, 1],
                y: '-50%',
              }}
              transition={{
                duration: 2,
                times: [0, 0.15, 0.3, 0.5, 1],
                ease: 'easeOut',
              }}
            />

            {/* Boot text that appears during expansion */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1] }}
              transition={{ duration: 2, times: [0, 0.7, 1] }}
            >
              <motion.p
                className="font-display text-lg tracking-widest crt-text"
                style={{ color: glowColor }}
                animate={{ opacity: [0, 1, 0.8, 1] }}
                transition={{ duration: 0.5, repeat: 3, repeatType: 'reverse' }}
              >
                INITIALIZING...
              </motion.p>
              <motion.div
                className="mt-4 flex gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 w-6 rounded-full"
                    style={{ background: glowColor }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
