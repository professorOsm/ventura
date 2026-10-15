import React, { useEffect, useRef, useState } from 'react';

interface AtmosphericBackgroundProps {
  isDark: boolean;
}

/**
 * Ventura AI Engineering Atmospheric Layer
 * 
 * Implements a multi-layered, performance-optimized visual environment:
 * 1. Base Layer: Soft off-white (#F8FAFC) in Light mode, Deep Charcoal/Navy (#0B0F19) in Dark mode.
 * 2. Mesh Wave Ribbon: High-precision sinusoidal dot matrix directly derived from the Ventura AI particle wave reference.
 * 3. Section Atmosphere: Radial gradients mapped to Ventura's palette (Blue #536DFE, Violet #9361F5, Teal #14B8A6, Orange #FB923C, Pink #EC4899).
 * 4. Geometric Glass Accents: Translucent floating polygonal & rounded glass shapes with subtle borders and gentle refraction.
 * 5. Technical Grid Matrix: Fine 40px engineering grid with radial falloff for the RAG and Lab sections.
 */
export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // Canvas animation for the 3D sinusoidal dotted wave ribbon
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let time = 0;

    // Handle high DPI displays
    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = Math.max(750, Math.min(1000, window.innerHeight * 0.95));

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (reducedMotion) {
        drawFrame(0);
      }
    };

    // Staggered multi-layer sinusoidal ribbons
    const ribbonConfig = [
      {
        pointsCount: 90,
        strands: 18,
        freqX: 0.0035,
        freqY: 0.08,
        speed: 0.00045,
        baseYRatio: 0.44,
        amplitudeY: 75,
        spreadY: 80,
        depthAmp: 50,
      },
      {
        pointsCount: 75,
        strands: 14,
        freqX: 0.0028,
        freqY: 0.1,
        speed: -0.00035,
        baseYRatio: 0.49,
        amplitudeY: 60,
        spreadY: 65,
        depthAmp: 40,
      }
    ];

    // Ventura Palette Color Interpolator (Blue -> Violet -> Pink -> Teal)
    const getColor = (t: number, dark: boolean, depthAlpha: number) => {
      // t is [0, 1] across the width of the wave
      // Segments:
      // 0.00 - 0.30: Blue #536DFE
      // 0.30 - 0.60: Violet #9361F5
      // 0.60 - 0.85: Pink #EC4899
      // 0.85 - 1.00: Teal #14B8A6

      let r: number, g: number, b: number;
      if (t < 0.3) {
        const u = t / 0.3;
        // Blue (83, 109, 254) to Violet (147, 97, 245)
        r = Math.round(83 + (147 - 83) * u);
        g = Math.round(109 + (97 - 109) * u);
        b = Math.round(254 + (245 - 254) * u);
      } else if (t < 0.6) {
        const u = (t - 0.3) / 0.3;
        // Violet (147, 97, 245) to Pink (236, 72, 153)
        r = Math.round(147 + (236 - 147) * u);
        g = Math.round(97 + (72 - 97) * u);
        b = Math.round(245 + (153 - 245) * u);
      } else {
        const u = (t - 0.6) / 0.4;
        // Pink (236, 72, 153) to Teal (20, 184, 166)
        r = Math.round(236 + (20 - 236) * u);
        g = Math.round(72 + (184 - 72) * u);
        b = Math.round(153 + (166 - 153) * u);
      }

      // In dark mode, slightly higher brightness/alpha for luminous radiance
      const baseAlpha = dark ? 0.45 : 0.40;
      const finalAlpha = Math.max(0.08, Math.min(0.85, baseAlpha * depthAlpha));

      return `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
    };

    const drawFrame = (currentTime: number) => {
      ctx.clearRect(0, 0, width, height);

      // Render flowing ribbons
      for (const ribbon of ribbonConfig) {
        const baseY = height * ribbon.baseYRatio;
        const colStep = width / ribbon.pointsCount;

        for (let i = 0; i < ribbon.pointsCount; i++) {
          const x = i * colStep;
          const normX = i / ribbon.pointsCount;

          // Multi-frequency wave formula
          const wavePhase = x * ribbon.freqX + currentTime * ribbon.speed;
          const waveOffset1 = Math.sin(wavePhase * 2.8) * ribbon.amplitudeY;
          const waveOffset2 = Math.cos(wavePhase * 1.6 + 0.8) * (ribbon.amplitudeY * 0.45);
          const currentCenterY = baseY + waveOffset1 + waveOffset2;

          for (let s = 0; s < ribbon.strands; s++) {
            const strandNorm = (s / (ribbon.strands - 1)) - 0.5; // -0.5 to +0.5
            
            // 3D twist effect
            const twist = Math.sin(wavePhase * 1.8 + s * ribbon.freqY) * (ribbon.spreadY * 0.5);
            const zDepth = Math.cos(wavePhase * 1.4 + s * 0.2) * ribbon.depthAmp;
            
            // Projected point
            const py = currentCenterY + (strandNorm * ribbon.spreadY) + twist;
            
            // Perspective point size and opacity based on zDepth
            const depthScale = (zDepth + ribbon.depthAmp) / (ribbon.depthAmp * 2); // 0 to 1
            const pointRadius = (isDark ? 0.9 : 0.8) + depthScale * 1.6;
            const depthAlpha = 0.35 + depthScale * 0.65;

            // Fade softly at canvas edges
            const edgeFade = Math.sin(normX * Math.PI);
            const finalDepthAlpha = depthAlpha * edgeFade;

            if (finalDepthAlpha <= 0.02) continue;

            ctx.fillStyle = getColor(normX, isDark, finalDepthAlpha);
            ctx.beginPath();
            ctx.arc(x, py, pointRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    const loop = (timestamp: number) => {
      if (isVisible && !reducedMotion) {
        time = timestamp;
        drawFrame(time);
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Pause when page is hidden
    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible && !reducedMotion) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    if (!reducedMotion) {
      animationFrameId = requestAnimationFrame(loop);
    } else {
      drawFrame(0);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isDark, reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden z-0"
    >
      {/* ========================================================
          LAYER 1: HERO AMBIENT LIGHTING & SOFT RADIAL GLOWS
          ======================================================== */}
      {/* Primary Hero Glow (Soft Blue-Violet directly illuminating robot & headline) */}
      <div
        className="absolute top-0 right-0 sm:right-[5%] lg:right-[12%] w-[550px] sm:w-[720px] lg:w-[860px] h-[550px] sm:h-[720px] lg:h-[860px] rounded-full blur-[110px] sm:blur-[135px] transition-all duration-700 opacity-60 dark:opacity-40"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(83,109,254,0.30) 0%, rgba(147,97,245,0.22) 40%, rgba(20,184,166,0.10) 70%, transparent 85%)'
            : 'radial-gradient(circle, rgba(83,109,254,0.18) 0%, rgba(147,97,245,0.14) 45%, rgba(20,184,166,0.08) 75%, transparent 90%)',
        }}
      />

      {/* Hero Left Accent Glow (Subtle pale blue keeping text high-contrast) */}
      <div
        className="absolute top-[8%] left-[-10%] sm:left-[-5%] w-[480px] sm:w-[650px] h-[480px] sm:h-[650px] rounded-full blur-[120px] opacity-40 dark:opacity-25"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(147,97,245,0.25) 0%, rgba(83,109,254,0.15) 50%, transparent 80%)'
            : 'radial-gradient(circle, rgba(83,109,254,0.12) 0%, rgba(147,97,245,0.08) 50%, transparent 80%)',
        }}
      />

      {/* Subtle Teal Ambient Lighting (flanking hero & robot halo) */}
      <div
        className="absolute top-[18%] right-[8%] sm:right-[15%] w-[380px] h-[380px] rounded-full blur-[100px] opacity-35 dark:opacity-20 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(94,234,212,0.22) 0%, rgba(20,184,166,0.12) 50%, transparent 80%)'
            : 'radial-gradient(circle, rgba(20,184,166,0.18) 0%, rgba(20,184,166,0.06) 50%, transparent 80%)',
        }}
      />

      {/* Fine subtle technical grid lines across the hero */}
      <div
        className="absolute top-0 inset-x-0 h-[820px] opacity-[0.035] dark:opacity-[0.055] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? '#818CF8' : '#536DFE'} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at 50% 40%, black 25%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 25%, transparent 75%)',
        }}
      />

      {/* ========================================================
          LAYER 2: VENTURA AI PARTICLE WAVE RIBBON CANVAS
          ======================================================== */}
      <div className="absolute top-[2%] left-0 right-0 h-[680px] sm:h-[820px] flex justify-center opacity-85 dark:opacity-80 mix-blend-multiply dark:mix-blend-screen pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ========================================================
          LAYER 3: TRANSLUCENT GLASS-LIKE ABSTRACT SHAPES (HERO)
          Strategically positioned around the hero without covering robot or text
          ======================================================== */}
      {/* Glass Orb 1: Upper right edge */}
      <div
        className="hidden lg:block absolute top-[12%] right-[4%] w-32 h-32 rounded-3xl border border-white/60 dark:border-white/10 bg-white/20 dark:bg-white/[0.03] backdrop-blur-md shadow-[0_8px_32px_rgba(83,109,254,0.08)] transform rotate-12 transition-transform duration-1000"
      />

      {/* Glass Orb 2: Flanking bottom of hero visual */}
      <div
        className="hidden md:block absolute top-[44%] right-[2%] w-24 h-24 rounded-2xl border border-white/50 dark:border-white/10 bg-gradient-to-br from-white/30 to-white/5 dark:from-white/[0.05] dark:to-transparent backdrop-blur-md shadow-[0_8px_24px_rgba(147,97,245,0.08)] transform -rotate-6"
      />

      {/* Glass Bar: Subtly anchoring mid-screen transition */}
      <div
        className="hidden xl:block absolute top-[28%] left-[2%] w-20 h-44 rounded-3xl border border-white/40 dark:border-white/5 bg-white/15 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm transform -rotate-12"
      />

      {/* ========================================================
          LAYER 4: SECTION-SPECIFIC ATMOSPHERIC ACCENTS
          ======================================================== */}
      
      {/* 1. Introduction Section: Pale blue & violet atmosphere */}
      <div
        className="absolute top-[1050px] left-[15%] w-[580px] h-[480px] rounded-full blur-[130px] opacity-45 dark:opacity-25"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(83,109,254,0.18) 0%, rgba(147,97,245,0.12) 55%, transparent 80%)'
            : 'radial-gradient(circle, rgba(83,109,254,0.10) 0%, rgba(147,97,245,0.08) 55%, transparent 80%)',
        }}
      />

      {/* 2. Technical Skills Section: Clean surfaces with restrained teal accents */}
      <div
        className="absolute top-[1750px] right-[8%] w-[640px] h-[520px] rounded-full blur-[140px] opacity-40 dark:opacity-20"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(20,184,166,0.20) 0%, rgba(83,109,254,0.10) 50%, transparent 80%)'
            : 'radial-gradient(circle, rgba(20,184,166,0.10) 0%, rgba(83,109,254,0.05) 50%, transparent 80%)',
        }}
      />

      {/* 3. Featured Projects: Neutral calm with subtle orange/violet warmth */}
      <div
        className="absolute top-[2550px] left-[5%] w-[600px] h-[500px] rounded-full blur-[150px] opacity-35 dark:opacity-15"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(251,146,60,0.12) 0%, rgba(147,97,245,0.08) 55%, transparent 80%)'
            : 'radial-gradient(circle, rgba(251,146,60,0.06) 0%, rgba(147,97,245,0.04) 55%, transparent 80%)',
        }}
      />

      {/* 4. RAG Explorer & AI Lab: Subtle technical grid / node matrix pattern */}
      <div
        className="absolute top-[3250px] inset-x-0 h-[880px] opacity-[0.035] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? '#818CF8' : '#536DFE'} 1px, transparent 0)`,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
        }}
      />
      <div
        className="absolute top-[3350px] right-[15%] w-[580px] h-[500px] rounded-full blur-[130px] opacity-40 dark:opacity-20"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(83,109,254,0.20) 0%, rgba(20,184,166,0.15) 60%, transparent 85%)'
            : 'radial-gradient(circle, rgba(83,109,254,0.10) 0%, rgba(20,184,166,0.06) 60%, transparent 85%)',
        }}
      />

      {/* 5. Contact Section: Gentle violet-blue gradient atmosphere */}
      <div
        className="absolute top-[4100px] sm:top-[4200px] left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[650px] rounded-full blur-[150px] opacity-45 dark:opacity-25"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(147,97,245,0.22) 0%, rgba(83,109,254,0.18) 45%, rgba(236,72,153,0.08) 75%, transparent 90%)'
            : 'radial-gradient(circle, rgba(147,97,245,0.12) 0%, rgba(83,109,254,0.10) 45%, rgba(236,72,153,0.05) 75%, transparent 90%)',
        }}
      />

      {/* Fine technical horizontal separator lines with soft gradient falloff */}
      <div className="absolute top-[960px] inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#536DFE]/20 dark:via-[#818CF8]/15 to-transparent" />
      <div className="absolute top-[1660px] inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#14B8A6]/20 dark:via-[#5EEAD4]/15 to-transparent" />
      <div className="absolute top-[2460px] inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#9361F5]/20 dark:via-[#B69AFB]/15 to-transparent" />
    </div>
  );
};
