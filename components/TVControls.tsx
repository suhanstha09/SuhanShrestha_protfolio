'use client';

/**
 * ═══════════════════════════════════════════════════
 * TV Controls Component
 * Physical bezel controls: Power button, Channel Up/Down,
 * rotary dial, and power LED indicator.
 * Desktop: Side panel on the TV bezel
 * Mobile: Handheld remote control interface
 * ═══════════════════════════════════════════════════
 */

import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import RotaryDial from './RotaryDial';
import { channels } from '@/lib/channelData';

interface TVControlsProps {
  currentChannel: number;
  isPoweredOn: boolean;
  greenMode: boolean;
  onChannelChange: (channel: number) => void;
  onPowerToggle: () => void;
  onPowerLongPress: () => void;
}

export default function TVControls({
  currentChannel,
  isPoweredOn,
  greenMode,
  onChannelChange,
  onPowerToggle,
  onPowerLongPress,
}: TVControlsProps) {
  const powerPressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggered = useRef(false);

  const handleChannelUp = useCallback(() => {
    const next =
      currentChannel >= channels.length ? 1 : currentChannel + 1;
    onChannelChange(next);
  }, [currentChannel, onChannelChange]);

  const handleChannelDown = useCallback(() => {
    const prev =
      currentChannel <= 1 ? channels.length : currentChannel - 1;
    onChannelChange(prev);
  }, [currentChannel, onChannelChange]);

  /**
   * Power button press handling:
   * - Short press: toggle power
   * - Long press (3s): toggle green phosphor mode (Easter egg!)
   */
  const handlePowerDown = useCallback(() => {
    longPressTriggered.current = false;
    powerPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      onPowerLongPress();
    }, 3000);
  }, [onPowerLongPress]);

  const handlePowerUp = useCallback(() => {
    if (powerPressTimer.current) {
      clearTimeout(powerPressTimer.current);
      powerPressTimer.current = null;
    }
    if (!longPressTriggered.current) {
      onPowerToggle();
    }
  }, [onPowerToggle]);

  const accentColor = greenMode ? '#33ff33' : '#ff9f43';

  return (
    <>
      {/* ═══════════ DESKTOP CONTROLS (side bezel panel) ═══════════ */}
      <div className="hidden md:flex flex-col items-center gap-6 py-6 px-3">
        {/* Brand label */}
        <div className="text-center">
          <p
            className="font-display text-[10px] tracking-[0.3em] uppercase"
            style={{ color: '#555' }}
          >
            SUHAN
          </p>
          <p
            className="font-display text-[7px] tracking-[0.15em] uppercase mt-0.5"
            style={{ color: '#444' }}
          >
            CRT-2026
          </p>
        </div>

        {/* Power Button */}
        <div className="flex flex-col items-center gap-2">
          <motion.button
            className="tv-button relative"
            style={{ width: 40, height: 40 }}
            onPointerDown={handlePowerDown}
            onPointerUp={handlePowerUp}
            onPointerLeave={() => {
              if (powerPressTimer.current) {
                clearTimeout(powerPressTimer.current);
              }
            }}
            whileTap={{ scale: 0.9 }}
            aria-label={isPoweredOn ? 'Power off' : 'Power on'}
            title="Hold 3s for green mode"
          >
            {/* Power icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isPoweredOn ? accentColor : '#555'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
              <line x1="12" y1="2" x2="12" y2="12" />
            </svg>
          </motion.button>

          {/* Power LED */}
          <div
            className={`power-led ${isPoweredOn ? 'on' : 'off'}`}
            aria-label={isPoweredOn ? 'Power on' : 'Power off'}
          />

          <span
            className="text-[8px] uppercase tracking-wider"
            style={{ color: '#555' }}
          >
            Power
          </span>
        </div>

        {/* Rotary Dial */}
        <RotaryDial
          currentChannel={currentChannel}
          totalChannels={channels.length}
          onChannelChange={onChannelChange}
          greenMode={greenMode}
        />

        {/* Channel Up/Down Buttons */}
        <div className="flex flex-col items-center gap-2">
          <motion.button
            className="tv-button"
            onClick={handleChannelUp}
            whileTap={{ scale: 0.9 }}
            aria-label="Channel Up"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill={accentColor}
            >
              <path d="M12 4l8 8H4z" />
            </svg>
          </motion.button>

          <span
            className="text-[9px] font-display"
            style={{ color: accentColor }}
          >
            CH
          </span>

          <motion.button
            className="tv-button"
            onClick={handleChannelDown}
            whileTap={{ scale: 0.9 }}
            aria-label="Channel Down"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill={accentColor}
            >
              <path d="M12 20l-8-8h16z" />
            </svg>
          </motion.button>
        </div>

        {/* Volume knob (decorative) */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="h-10 w-10 rounded-full"
            style={{
              background: 'linear-gradient(145deg, #3a3530, #1a1612)',
              border: '1px solid rgba(255,255,255,0.03)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
            }}
          >
            <div
              className="mt-2 mx-auto h-1 w-3 rounded-full"
              style={{ background: '#555' }}
            />
          </div>
          <span
            className="text-[8px] uppercase tracking-wider"
            style={{ color: '#555' }}
          >
            Vol
          </span>
        </div>

        {/* Brand logo area at bottom */}
        <div className="mt-auto text-center">
          <div
            className="w-12 h-px mx-auto mb-2"
            style={{ background: '#333' }}
          />
          <p
            className="text-[7px] tracking-widest uppercase"
            style={{ color: '#444' }}
          >
            Made in
          </p>
          <p
            className="text-[7px] tracking-widest uppercase"
            style={{ color: '#444' }}
          >
            Nepal
          </p>
        </div>
      </div>

      {/* ═══════════ MOBILE REMOTE CONTROL ═══════════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <motion.div
          className="mx-auto max-w-sm rounded-t-2xl px-6 py-4"
          style={{
            background: 'linear-gradient(180deg, #2a2318 0%, #1a1612 100%)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.8)',
          }}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Channel indicator */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs" style={{ color: '#666' }}>
              CH {currentChannel}
            </span>
            <span
              className="text-xs font-display"
              style={{ color: accentColor }}
            >
              {channels[currentChannel - 1]?.label}
            </span>
            <div
              className={`power-led ${isPoweredOn ? 'on' : 'off'}`}
            />
          </div>

          {/* Control buttons row */}
          <div className="flex items-center justify-between gap-3">
            {/* Power */}
            <motion.button
              className="tv-button"
              style={{ width: 44, height: 44 }}
              onPointerDown={handlePowerDown}
              onPointerUp={handlePowerUp}
              whileTap={{ scale: 0.9 }}
              aria-label="Power"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isPoweredOn ? accentColor : '#555'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
              </svg>
            </motion.button>

            {/* Channel Down */}
            <motion.button
              className="tv-button"
              style={{ width: 44, height: 44 }}
              onClick={handleChannelDown}
              whileTap={{ scale: 0.9 }}
              aria-label="Channel Down"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={accentColor}>
                <path d="M12 20l-8-8h16z" />
              </svg>
            </motion.button>

            {/* Channel Number Display */}
            <div
              className="flex h-12 w-16 items-center justify-center rounded-lg font-display text-2xl"
              style={{
                background: '#0a0a0a',
                color: accentColor,
                boxShadow: `inset 0 2px 8px rgba(0,0,0,0.8), 0 0 10px ${accentColor}22`,
                textShadow: `0 0 10px ${accentColor}`,
              }}
            >
              {currentChannel}
            </div>

            {/* Channel Up */}
            <motion.button
              className="tv-button"
              style={{ width: 44, height: 44 }}
              onClick={handleChannelUp}
              whileTap={{ scale: 0.9 }}
              aria-label="Channel Up"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={accentColor}>
                <path d="M12 4l8 8H4z" />
              </svg>
            </motion.button>

            {/* Quick channel select (1-8) */}
            <div className="grid grid-cols-4 gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((ch) => (
                <motion.button
                  key={ch}
                  className="flex h-5 w-5 items-center justify-center rounded text-[9px]"
                  style={{
                    background:
                      ch === currentChannel
                        ? accentColor
                        : 'rgba(255,255,255,0.05)',
                    color: ch === currentChannel ? '#0a0a0a' : '#666',
                  }}
                  onClick={() => onChannelChange(ch)}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Channel ${ch}`}
                >
                  {ch}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
