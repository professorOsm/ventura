import React, { useState, useEffect, useRef, useCallback } from 'react';
import { audioManager } from '../audio/AudioManager';

interface RobotHeroProps {
  isDarkTheme: boolean;
  onOpenChat?: () => void;
}

export const RobotHero: React.FC<RobotHeroProps> = ({ isDarkTheme, onOpenChat }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<HTMLDivElement | null>(null);
  const eyesContainerRef = useRef<HTMLDivElement | null>(null);
  const leftPupilRef = useRef<HTMLDivElement | null>(null);
  const rightPupilRef = useRef<HTMLDivElement | null>(null);
  const leftEyelidRef = useRef<HTMLDivElement | null>(null);
  const rightEyelidRef = useRef<HTMLDivElement | null>(null);
  const specularGlintRef = useRef<HTMLDivElement | null>(null);

  // Motion targets and current interpolated values (managed directly in ref for 120fps performance without React re-renders)
  const motionRef = useRef({
    targetRotY: 0, // deg [-12, +12]
    targetRotX: 0, // deg [-6, +6]
    currentRotY: 0,
    currentRotX: 0,
    targetPupilX: 0, // px [-7, +7]
    targetPupilY: 0, // px [-5, +5]
    currentPupilX: 0,
    currentPupilY: 0,
    isBlinking: false,
    blinkProgress: 0, // 0 = open, 1 = closed
    blinkTimer: 0,
    nextBlinkTime: 3.5,
    isVisible: true,
    isReducedMotion: false,
    isTouchDevice: false,
    animFrameId: 0,
    lastTime: 0
  });

  const [reducedMotionState, setReducedMotionState] = useState<boolean>(false);

  // 1. Accessibility: Detect reduced motion preference
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionRef.current.isReducedMotion = motionQuery.matches;
    setReducedMotionState(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      motionRef.current.isReducedMotion = e.matches;
      setReducedMotionState(e.matches);
      if (e.matches) {
        motionRef.current.targetRotY = 0;
        motionRef.current.targetRotX = 0;
        motionRef.current.targetPupilX = 0;
        motionRef.current.targetPupilY = 0;
      }
    };

    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // 2. Touch detection: Touchscreens do not track mouse cursor, keeping neutral forward-facing pose
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    motionRef.current.isTouchDevice = isTouch;
  }, []);

  // 3. Page visibility & Intersection Observer: Suspend animation when tab is hidden or hero is scrolled off-screen
  useEffect(() => {
    const handleVisibilityChange = () => {
      motionRef.current.isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          motionRef.current.isVisible = entry.isIntersecting && !document.hidden;
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  // 4. Smooth Cursor Tracking over Hero Section
  useEffect(() => {
    const heroElement = document.getElementById('hero');
    if (!heroElement) return;

    // Movement limits as specified in prompt
    const MAX_ROT_Y = 12; // ±12 degrees horizontal
    const MAX_ROT_X = 6;  // ±6 degrees vertical
    const MAX_PUPIL_X = 7; // ±7px pupil horizontal
    const MAX_PUPIL_Y = 5; // ±5px pupil vertical

    const handlePointerMove = (e: PointerEvent) => {
      if (motionRef.current.isReducedMotion || motionRef.current.isTouchDevice) {
        return;
      }

      const rect = heroElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Normalized coordinates relative to hero center: -1.0 (left/top) to +1.0 (right/bottom)
      const normX = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      const normY = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));

      // Calm observation kinematics:
      // When cursor moves left (normX < 0), face subtly turns left (-deg)
      // When cursor moves right (normX > 0), face subtly turns right (+deg)
      motionRef.current.targetRotY = normX * MAX_ROT_Y;

      // When cursor moves upward (normY < 0), face looks slightly upward (-deg)
      // When cursor moves downward (normY > 0), face looks slightly downward (+deg)
      motionRef.current.targetRotX = -normY * MAX_ROT_X;

      // Subtle pupil tracking on the phosphor CRT surface
      motionRef.current.targetPupilX = normX * MAX_PUPIL_X;
      motionRef.current.targetPupilY = normY * MAX_PUPIL_Y;
    };

    const handlePointerLeave = () => {
      // When cursor leaves hero section, smoothly return face and eyes to neutral forward-facing pose
      motionRef.current.targetRotY = 0;
      motionRef.current.targetRotX = 0;
      motionRef.current.targetPupilX = 0;
      motionRef.current.targetPupilY = 0;
    };

    heroElement.addEventListener('pointermove', handlePointerMove, { passive: true });
    heroElement.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('blur', handlePointerLeave);

    return () => {
      heroElement.removeEventListener('pointermove', handlePointerMove);
      heroElement.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
    };
  }, []);

  // 5. Continuous 60/120fps Animation Loop with Spring Damping and Independent Eye Blinking
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      animId = requestAnimationFrame(tick);
      motionRef.current.animFrameId = animId;

      if (!motionRef.current.isVisible) {
        motionRef.current.lastTime = now;
        return;
      }

      if (!motionRef.current.lastTime) {
        motionRef.current.lastTime = now;
      }

      const delta = Math.min((now - motionRef.current.lastTime) / 1000, 0.1);
      motionRef.current.lastTime = now;

      const m = motionRef.current;

      // A. Damped Easing for Head Rotation (Calm robotic servo response, no jitter or twitching)
      const dampFactor = 1 - Math.exp(-5.2 * delta); // Smooth spring-like exponential easing

      m.currentRotY += (m.targetRotY - m.currentRotY) * dampFactor;
      m.currentRotX += (m.targetRotX - m.currentRotX) * dampFactor;

      m.currentPupilX += (m.targetPupilX - m.currentPupilX) * dampFactor;
      m.currentPupilY += (m.targetPupilY - m.currentPupilY) * dampFactor;

      // Apply 3D rotation only to the head node with pivot at the neck junction (50% horizontal, 54.7% vertical)
      if (headRef.current) {
        headRef.current.style.transform = `perspective(850px) rotateY(${m.currentRotY.toFixed(2)}deg) rotateX(${m.currentRotX.toFixed(2)}deg)`;
      }

      // Apply subtle specular glint shift across the curved CRT glass
      if (specularGlintRef.current) {
        const glintX = -m.currentRotY * 1.8;
        const glintY = m.currentRotX * 1.8;
        specularGlintRef.current.style.transform = `translate3d(${glintX.toFixed(1)}px, ${glintY.toFixed(1)}px, 0)`;
      }

      // Apply pupil shift to the glowing phosphor eyes
      if (leftPupilRef.current && rightPupilRef.current) {
        const pTransform = `translate3d(${m.currentPupilX.toFixed(2)}px, ${m.currentPupilY.toFixed(2)}px, 0)`;
        leftPupilRef.current.style.transform = pTransform;
        rightPupilRef.current.style.transform = pTransform;
      }

      // B. Independent Natural Eye Blinking loop (every 3.2s to 5.8s, duration ~160ms)
      m.blinkTimer += delta;
      if (!m.isBlinking && m.blinkTimer >= m.nextBlinkTime) {
        m.isBlinking = true;
        m.blinkProgress = 0;
        m.blinkTimer = 0;
        m.nextBlinkTime = 3.2 + Math.random() * 2.6;
      }

      if (m.isBlinking) {
        m.blinkProgress += delta * 11.0; // Fast natural blink closure
        if (m.blinkProgress >= 1.0) {
          m.isBlinking = false;
          m.blinkProgress = 0;
        }
      }

      const blinkScale = m.isBlinking ? Math.sin(m.blinkProgress * Math.PI) : 0;
      if (leftEyelidRef.current && rightEyelidRef.current) {
        if (blinkScale > 0.01) {
          leftEyelidRef.current.style.transform = `scaleY(${blinkScale.toFixed(2)})`;
          leftEyelidRef.current.style.opacity = '0.98';
          rightEyelidRef.current.style.transform = `scaleY(${blinkScale.toFixed(2)})`;
          rightEyelidRef.current.style.opacity = '0.98';
        } else {
          leftEyelidRef.current.style.transform = 'scaleY(0)';
          leftEyelidRef.current.style.opacity = '0';
          rightEyelidRef.current.style.transform = 'scaleY(0)';
          rightEyelidRef.current.style.opacity = '0';
        }
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[460px] mx-auto rounded-3xl overflow-hidden bg-white/90 dark:bg-[#182235]/90 backdrop-blur-sm border border-slate-200/90 dark:border-[#334155] shadow-2xl transition-all select-none group"
    >
      {/* Soft atmospheric gradient backdrop that responds to theme */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDarkTheme
            ? 'radial-gradient(circle at 50% 38%, rgba(83,109,254,0.22) 0%, rgba(147,97,245,0.16) 45%, rgba(20,184,166,0.08) 75%, transparent 100%)'
            : 'radial-gradient(circle at 50% 38%, rgba(83,109,254,0.14) 0%, rgba(147,97,245,0.10) 45%, rgba(20,184,166,0.05) 75%, transparent 100%)'
        }}
      />

      {/* ========================================================
          LAYER 1: STATIONARY BODY, TURTLENECK, CABLES, & BACKGROUND
          Remains 100% stationary with no movement, gestures, or dancing
          ======================================================== */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <img
          src="src/assets/images/ventura_crt_robot_hero_1791995045522.jpg"
          alt="Ventura CRT Robot Body & Chassis"
          className="w-full h-full object-cover object-center pointer-events-none"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* ========================================================
          LAYER 2: ROTATING HEAD PIVOT (CRT MONITOR)
          Anchored at the mechanical neck joint (x: 49.5%, y: 54.7%)
          Natural rotation strictly clamped: ±12° yaw, ±6° pitch
          ======================================================== */}
      <div
        ref={headRef}
        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
        style={{
          transformOrigin: '49.5% 54.7%', // Natural anatomical neck joint pivot point
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 55.4%, 0% 55.4%)' // Covers only the CRT head cabinet
        }}
      >
        <img
          src="src/assets/images/ventura_crt_robot_hero_1791995045522.jpg"
          alt="Ventura CRT Head Monitor"
          className="w-full h-full object-cover object-center pointer-events-none"
          loading="eager"
          decoding="async"
        />

        {/* Dynamic Specular Glass Glint across CRT curved face */}
        <div
          ref={specularGlintRef}
          aria-hidden="true"
          className="absolute pointer-events-none will-change-transform"
          style={{
            left: '29%',
            top: '14%',
            width: '42%',
            height: '32%',
            background: 'radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)',
            borderRadius: '16px'
          }}
        />

        {/* ========================================================
            LAYER 3: DYNAMIC PHOSPHOR EYES & NATURAL PUPIL TRACKING
            Coordinates aligned with the CRT-8000 screen
            Left Eye: center ≈ 41.5% x, 30.2% y
            Right Eye: center ≈ 58.4% x, 30.2% y
            ======================================================== */}
        <div ref={eyesContainerRef} className="absolute inset-0 pointer-events-none">
          {/* LEFT EYE */}
          <div
            className="absolute"
            style={{
              left: '35.8%',
              top: '24.6%',
              width: '11.4%',
              height: '11.2%'
            }}
          >
            {/* Pupil Glow Disk that tracks mouse gaze */}
            <div
              ref={leftPupilRef}
              className="w-full h-full rounded-full will-change-transform"
              style={{
                background: 'radial-gradient(circle at center, #ffffff 0%, #bbf7ff 35%, #00F0FF 75%, rgba(0,240,255,0) 100%)',
                boxShadow: '0 0 20px 4px rgba(0, 240, 255, 0.65)'
              }}
            />

            {/* Phosphor Eyelid for organic eye blink */}
            <div
              ref={leftEyelidRef}
              aria-hidden="true"
              className="absolute inset-0 bg-[#070b10] rounded-full origin-center pointer-events-none transition-none"
              style={{ transform: 'scaleY(0)', opacity: 0 }}
            />
          </div>

          {/* RIGHT EYE */}
          <div
            className="absolute"
            style={{
              left: '52.8%',
              top: '24.6%',
              width: '11.4%',
              height: '11.2%'
            }}
          >
            {/* Pupil Glow Disk that tracks mouse gaze */}
            <div
              ref={rightPupilRef}
              className="w-full h-full rounded-full will-change-transform"
              style={{
                background: 'radial-gradient(circle at center, #ffffff 0%, #bbf7ff 35%, #00F0FF 75%, rgba(0,240,255,0) 100%)',
                boxShadow: '0 0 20px 4px rgba(0, 240, 255, 0.65)'
              }}
            />

            {/* Phosphor Eyelid for organic eye blink */}
            <div
              ref={rightEyelidRef}
              aria-hidden="true"
              className="absolute inset-0 bg-[#070b10] rounded-full origin-center pointer-events-none transition-none"
              style={{ transform: 'scaleY(0)', opacity: 0 }}
            />
          </div>
        </div>
      </div>

      {/* Atmospheric glass reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 dark:via-transparent dark:to-white/5 pointer-events-none" />

      {/* Editorial Identity Badge at top-left */}
      <div className="absolute top-3.5 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border border-slate-200/70 dark:border-slate-800 text-[10px] font-mono font-medium text-slate-700 dark:text-slate-200 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] dark:bg-[#5EEAD4]" />
        <span>VENTURA CRT-8000</span>
      </div>

      {/* Interactive Speech Prompt & Assistant Trigger */}
      {onOpenChat && (
        <button
          onClick={() => {
            audioManager.playSelect();
            onOpenChat();
          }}
          className="absolute top-3.5 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-[#111827]/90 hover:bg-[#E8EEFF] dark:hover:bg-[#818CF8]/20 backdrop-blur-md border border-[#536DFE]/30 dark:border-[#818CF8]/40 text-[11px] font-mono text-[#536DFE] dark:text-[#818CF8] hover:text-[#435bdb] dark:hover:text-[#a5b4fc] transition-all shadow-sm group/btn"
          title="Click to consult Ventura AI Assistant"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#9361F5] dark:bg-[#B69AFB] animate-ping" />
          <span className="font-semibold">Ask Ventura AI</span>
          <span className="text-[10px] opacity-70">💬</span>
        </button>
      )}

      {/* Clean editorial technical spec label at bottom with clickable consult affordance */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-800">
        <span className="font-semibold text-slate-700 dark:text-slate-200">CRT INTERACTIVE CORE</span>
        {onOpenChat ? (
          <button
            onClick={() => {
              audioManager.playSelect();
              onOpenChat();
            }}
            className="text-[#536DFE] dark:text-[#818CF8] font-medium flex items-center gap-1.5 hover:underline"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] dark:bg-[#5EEAD4]" />
            <span>CONSULT ASSISTANT</span>
          </button>
        ) : (
          <span className="text-[#536DFE] dark:text-[#818CF8] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] dark:bg-[#5EEAD4]" />
            <span>ACTIVE</span>
          </span>
        )}
      </div>
    </div>
  );
};
