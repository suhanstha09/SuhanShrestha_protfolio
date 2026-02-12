'use client';

/**
 * ═══════════════════════════════════════════════════
 * Rotary Dial Component
 * A draggable rotary knob that changes channels.
 * Click and drag to rotate — each 45° step changes
 * the channel with a satisfying click sound.
 * ═══════════════════════════════════════════════════
 */

import { useRef, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { playDialClick } from '@/lib/soundEffects';

interface RotaryDialProps {
  currentChannel: number;
  totalChannels: number;
  onChannelChange: (channel: number) => void;
  greenMode: boolean;
}

export default function RotaryDial({
  currentChannel,
  totalChannels,
  onChannelChange,
  greenMode,
}: RotaryDialProps) {
  const dialRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastAngle = useRef(0);
  const accumulatedRotation = useRef(0);

  // Calculate rotation per channel (360° / 8 channels = 45° each)
  const degreesPerChannel = 360 / totalChannels;
  const [rotation, setRotation] = useState(
    (currentChannel - 1) * degreesPerChannel
  );

  // Sync rotation when channel changes externally
  useEffect(() => {
    setRotation((currentChannel - 1) * degreesPerChannel);
  }, [currentChannel, degreesPerChannel]);

  /**
   * Calculate angle from center of dial to pointer position
   */
  const getAngle = useCallback((clientX: number, clientY: number): number => {
    if (!dialRef.current) return 0;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  }, []);

  /**
   * Handle pointer down — start tracking rotation
   */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      lastAngle.current = getAngle(e.clientX, e.clientY);
      accumulatedRotation.current = 0;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [getAngle]
  );

  /**
   * Handle pointer move — rotate dial and detect channel changes
   */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;

      const currentAngle = getAngle(e.clientX, e.clientY);
      let delta = currentAngle - lastAngle.current;

      // Handle angle wrapping at ±180°
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      accumulatedRotation.current += delta;
      lastAngle.current = currentAngle;

      setRotation((prev) => prev + delta);

      // Check if accumulated rotation crosses a channel boundary (45°)
      if (Math.abs(accumulatedRotation.current) >= degreesPerChannel) {
        const direction = accumulatedRotation.current > 0 ? 1 : -1;
        const newChannel =
          ((currentChannel - 1 + direction + totalChannels) % totalChannels) + 1;
        onChannelChange(newChannel);
        playDialClick();
        accumulatedRotation.current = 0;
      }
    },
    [
      currentChannel,
      degreesPerChannel,
      getAngle,
      onChannelChange,
      totalChannels,
    ]
  );

  /**
   * Handle pointer up — stop tracking
   */
  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    // Snap to nearest channel position
    const snappedRotation =
      Math.round(rotation / degreesPerChannel) * degreesPerChannel;
    setRotation(snappedRotation);
  }, [rotation, degreesPerChannel]);

  const indicatorColor = greenMode ? '#33ff33' : '#ff9f43';

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Channel numbers around the dial */}
      <div className="relative h-[80px] w-[80px]">
        {/* Tick marks around the dial */}
        {Array.from({ length: totalChannels }, (_, i) => {
          const angle = (i * degreesPerChannel - 90) * (Math.PI / 180);
          const radius = 36;
          const x = 40 + radius * Math.cos(angle);
          const y = 40 + radius * Math.sin(angle);
          const isActive = i + 1 === currentChannel;

          return (
            <span
              key={i}
              className="absolute text-[8px] font-display transition-all duration-200"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
                color: isActive ? indicatorColor : '#555',
                textShadow: isActive
                  ? `0 0 6px ${indicatorColor}`
                  : 'none',
              }}
            >
              {i + 1}
            </span>
          );
        })}

        {/* The actual rotary knob */}
        <motion.div
          ref={dialRef}
          className="rotary-dial absolute left-1/2 top-1/2"
          style={{ rotate: rotation, x: '-50%', y: '-50%' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          whileTap={{ scale: 0.95 }}
          role="slider"
          aria-label="Channel selector dial"
          aria-valuenow={currentChannel}
          aria-valuemin={1}
          aria-valuemax={totalChannels}
          tabIndex={0}
        >
          {/* Indicator notch */}
          <div
            className="rotary-notch"
            style={{
              background: indicatorColor,
              boxShadow: `0 0 4px ${indicatorColor}`,
            }}
          />

          {/* Center dot */}
          <div
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: 'radial-gradient(circle, #3a3530, #1a1612)',
            }}
          />
        </motion.div>
      </div>

      <span
        className="text-[9px] uppercase tracking-[0.2em] font-display"
        style={{ color: '#666' }}
      >
        Channel
      </span>
    </div>
  );
}
