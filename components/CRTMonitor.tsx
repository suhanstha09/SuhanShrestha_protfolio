'use client';

/**
 * ═══════════════════════════════════════════════════
 * CRT Monitor — Main Container Component
 * 
 * The complete vintage TV interface that wraps all
 * components together: bezel, screen, controls, boot
 * sequence, channel switching, and CRT effects.
 * 
 * Handles:
 * - Power on/off with boot animation
 * - Channel switching with static transitions
 * - Keyboard navigation (arrows, number keys)
 * - Sound effects coordination
 * - Green phosphor easter egg
 * - Screen CRT visual effects (scanlines, flicker, etc.)
 * ═══════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BootSequence from './BootSequence';
import StaticOverlay from './StaticOverlay';
import TVControls from './TVControls';
import ChannelContent from './ChannelContent';
import { channels } from '@/lib/channelData';
import {
  playPowerOn,
  playPowerOff,
  playChannelBeep,
  playStaticNoise,
  initAudio,
} from '@/lib/soundEffects';

export default function CRTMonitor() {
  // ═══════════ State ═══════════
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(1);
  const [showStatic, setShowStatic] = useState(false);
  const [greenMode, setGreenMode] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // ═══════════ Music Player State ═══════════
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  // Track the actual displayed channel (for smooth transitions)
  const [displayChannel, setDisplayChannel] = useState(1);
  const staticTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ═══════════ Audio Init ═══════════
  // Initialize audio on first user interaction
  const ensureAudio = useCallback(() => {
    if (!audioInitialized) {
      initAudio();
      setAudioInitialized(true);
    }
  }, [audioInitialized]);

  // ═══════════ Power Toggle ═══════════
  const handlePowerToggle = useCallback(() => {
    ensureAudio();

    if (isPoweredOn) {
      // POWER OFF — screen collapses
      playPowerOff();
      setIsShuttingDown(true);
      setTimeout(() => {
        setIsPoweredOn(false);
        setIsShuttingDown(false);
        setIsBooting(false);
      }, 700);
    } else {
      // POWER ON — boot sequence
      playPowerOn();
      setIsPoweredOn(true);
      setIsBooting(true);
      // Boot sequence duration: 2.5 seconds
      setTimeout(() => {
        setIsBooting(false);
      }, 2500);
    }
  }, [isPoweredOn, ensureAudio]);

  // ═══════════ Music Controls ═══════════
  const handleMusicToggle = useCallback(() => {
    if (!musicRef.current) {
      musicRef.current = new Audio('/NEFFEX - Grateful [Copyright Free] No.54.mp3');
      musicRef.current.loop = true;
      musicRef.current.volume = volume;
    }
    if (isPlaying) {
      musicRef.current.pause();
      setIsPlaying(false);
    } else {
      musicRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying, volume]);

  const handleVolumeUp = useCallback(() => {
    setVolume((prev) => {
      const next = Math.min(1, prev + 0.1);
      if (musicRef.current) musicRef.current.volume = next;
      return next;
    });
  }, []);

  const handleVolumeDown = useCallback(() => {
    setVolume((prev) => {
      const next = Math.max(0, prev - 0.1);
      if (musicRef.current) musicRef.current.volume = next;
      return next;
    });
  }, []);

  // Cleanup music on unmount
  useEffect(() => {
    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
    };
  }, []);

  // ═══════════ Green Mode Easter Egg ═══════════
  const handlePowerLongPress = useCallback(() => {
    ensureAudio();
    setGreenMode((prev) => !prev);
    // Play a confirmation sound
    playChannelBeep();
  }, [ensureAudio]);

  // ═══════════ Channel Change ═══════════
  const handleChannelChange = useCallback(
    (newChannel: number) => {
      if (!isPoweredOn || isBooting || newChannel === currentChannel) return;
      ensureAudio();

      // Clamp channel to valid range
      const ch = Math.max(1, Math.min(newChannel, channels.length));

      // Play sound effects
      playChannelBeep();
      playStaticNoise();

      // Show static overlay for 300ms
      setShowStatic(true);
      setCurrentChannel(ch);

      // Clear any pending timeout
      if (staticTimeoutRef.current) {
        clearTimeout(staticTimeoutRef.current);
      }

      staticTimeoutRef.current = setTimeout(() => {
        setShowStatic(false);
        setDisplayChannel(ch);
      }, 300);
    },
    [isPoweredOn, isBooting, currentChannel, ensureAudio]
  );

  // ═══════════ Keyboard Navigation ═══════════
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPoweredOn || isBooting) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowRight':
          e.preventDefault();
          handleChannelChange(
            currentChannel >= channels.length ? 1 : currentChannel + 1
          );
          break;
        case 'ArrowDown':
        case 'ArrowLeft':
          e.preventDefault();
          handleChannelChange(
            currentChannel <= 1 ? channels.length : currentChannel - 1
          );
          break;
        // Number keys 1-8 for direct channel selection
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
          e.preventDefault();
          handleChannelChange(parseInt(e.key));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPoweredOn, isBooting, currentChannel, handleChannelChange]);

  // ═══════════ Cleanup on unmount ═══════════
  useEffect(() => {
    return () => {
      if (staticTimeoutRef.current) {
        clearTimeout(staticTimeoutRef.current);
      }
    };
  }, []);

  // ═══════════ Accent colors based on mode ═══════════
  const accentColor = greenMode ? '#33ff33' : '#ff9f43';

  return (
    <div
      className={`flex h-screen w-screen items-center justify-center bg-[#050505] p-2 md:p-4 lg:p-8 ${
        greenMode ? 'green-mode' : ''
      }`}
      role="application"
      aria-label="CRT Television Portfolio - Suhan Shrestha"
    >
      {/* ═══════════ TV BEZEL FRAME ═══════════ */}
      <div className="tv-bezel relative flex h-full max-h-[700px] w-full max-w-[1100px] rounded-2xl md:rounded-3xl overflow-hidden">
        {/* ═══════════ SCREEN AREA ═══════════ */}
        <div className="relative flex-1 m-3 md:m-4 lg:m-5">
          <div className="crt-screen relative h-full w-full overflow-hidden bg-crt-dark">
            {/* ═══ Screen content area ═══ */}
            <div className="relative h-full w-full">
              {/* Power OFF state — dark screen */}
              {!isPoweredOn && !isShuttingDown && (
                <div className="flex h-full w-full items-center justify-center">
                  <motion.p
                    className="font-display text-xs tracking-widest opacity-20"
                    style={{ color: '#333' }}
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    PRESS POWER TO START
                  </motion.p>
                </div>
              )}

              {/* Shutdown animation — screen collapses to line */}
              <AnimatePresence>
                {isShuttingDown && (
                  <motion.div
                    className="absolute inset-0 z-40 bg-crt-dark"
                    initial={{ scaleY: 1 }}
                    animate={{ scaleY: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeIn' }}
                    style={{ originY: 0.5 }}
                  >
                    {/* The collapsing bright line */}
                    <motion.div
                      className="absolute left-0 right-0 top-1/2 h-1"
                      style={{
                        background: accentColor,
                        boxShadow: `0 0 30px ${accentColor}`,
                        transform: 'translateY(-50%)',
                      }}
                      animate={{ opacity: [1, 1, 0] }}
                      transition={{ duration: 0.8, times: [0, 0.7, 1] }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Boot-up sequence animation */}
              {isPoweredOn && (
                <BootSequence isBooting={isBooting} greenMode={greenMode} />
              )}

              {/* Main channel content (visible after boot) */}
              {isPoweredOn && !isBooting && !isShuttingDown && (
                <motion.div
                  className="relative h-full w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Channel number OSD (on-screen display) */}
                  <motion.div
                    className="absolute right-4 top-3 z-20 flex items-center gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: `${accentColor}88` }}
                    >
                      CH
                    </span>
                    <span
                      className="font-display text-2xl font-bold phosphor-glow"
                      style={{ color: accentColor }}
                    >
                      {currentChannel}
                    </span>
                  </motion.div>

                  {/* Channel label OSD */}
                  <motion.div
                    className="absolute left-4 top-3 z-20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span
                      className="font-display text-[10px] tracking-wider phosphor-glow"
                      style={{ color: `${accentColor}99` }}
                    >
                      {channels[currentChannel - 1]?.label.toUpperCase()}
                    </span>
                  </motion.div>

                  {/* The actual channel content */}
                  <div className="h-full pt-8 pb-2">
                    <ChannelContent
                      channel={displayChannel}
                      greenMode={greenMode}
                    />
                  </div>
                </motion.div>
              )}

              {/* Static noise overlay during channel switch */}
              <StaticOverlay isVisible={showStatic} />
            </div>

            {/* ═══ CRT Visual Effects Layers ═══ */}
            {isPoweredOn && (
              <>
                {/* Scanlines */}
                <div className="crt-scanlines" aria-hidden="true" />

                {/* Glass reflection */}
                <div className="crt-glass" aria-hidden="true" />

                {/* Edge vignette */}
                <div className="crt-vignette" aria-hidden="true" />

                {/* Subtle screen flicker */}
                <motion.div
                  className="pointer-events-none absolute inset-0 z-[8]"
                  animate={{ opacity: [0.97, 1, 0.98, 1, 0.97] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                  aria-hidden="true"
                />
              </>
            )}
          </div>
        </div>

        {/* ═══════════ SIDE CONTROL PANEL ═══════════ */}
        <div
          className="hidden md:flex w-[110px] lg:w-[120px] flex-shrink-0 border-l"
          style={{ borderColor: 'rgba(255,255,255,0.03)' }}
        >
          <TVControls
            currentChannel={currentChannel}
            isPoweredOn={isPoweredOn}
            greenMode={greenMode}
            isPlaying={isPlaying}
            volume={volume}
            onChannelChange={handleChannelChange}
            onPowerToggle={handlePowerToggle}
            onPowerLongPress={handlePowerLongPress}
            onMusicToggle={handleMusicToggle}
            onVolumeUp={handleVolumeUp}
            onVolumeDown={handleVolumeDown}
          />
        </div>

        {/* ═══════════ MOBILE CONTROLS ═══════════ */}
        <div className="md:hidden">
          <TVControls
            currentChannel={currentChannel}
            isPoweredOn={isPoweredOn}
            greenMode={greenMode}
            isPlaying={isPlaying}
            volume={volume}
            onChannelChange={handleChannelChange}
            onPowerToggle={handlePowerToggle}
            onPowerLongPress={handlePowerLongPress}
            onMusicToggle={handleMusicToggle}
            onVolumeUp={handleVolumeUp}
            onVolumeDown={handleVolumeDown}
          />
        </div>

        {/* ═══════════ BEZEL DECORATIONS ═══════════ */}
        {/* Speaker grille (bottom of bezel, desktop only) */}
        <div
          className="hidden md:block absolute bottom-3 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <div className="flex gap-[2px]">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="h-4 w-[2px] rounded-full"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              />
            ))}
          </div>
        </div>

        {/* Model number label */}
        <div
          className="absolute bottom-1.5 right-4 hidden md:block"
          aria-hidden="true"
        >
          <p
            className="text-[7px] tracking-widest uppercase"
            style={{ color: '#7a6a5a' }}
          >
            Model CRT-2026-SS
          </p>
        </div>
      </div>

      {/* ═══════════ KEYBOARD SHORTCUTS HINT ═══════════ */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-4 text-[10px]" style={{ color: '#333' }}>
        <span>↑↓ Channel</span>
        <span>1-8 Direct</span>
        <span>Hold Power 3s = Green Mode</span>
      </div>
    </div>
  );
}
