import * as THREE from 'three';

/**
 * Procedural texture generators ensuring zero external 404 dependencies.
 */

// 1. CRT Scanline & Phosphor Grid Texture
export function createCrtScreenTexture(
  eyeState: {
    blinkProgress: number; // 0 = open, 1 = closed
    pupilOffsetX: number; // -1 to 1
    pupilOffsetY: number; // -1 to 1
    expression: 'normal' | 'happy' | 'think' | 'alert' | 'speak';
    glowColor: string;
    brightness: number;
    scanlineShift: number;
  }
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep CRT black curvature background
  const bgGrad = ctx.createRadialGradient(256, 256, 40, 256, 256, 320);
  bgGrad.addColorStop(0, '#0a141e');
  bgGrad.addColorStop(0.7, '#04080c');
  bgGrad.addColorStop(1, '#010204');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 512);

  // CRT Horizontal Scanlines
  ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
  for (let y = 0; y < 512; y += 4) {
    ctx.fillRect(0, y, 512, 2);
  }

  // Draw Dual Expressive CRT Phosphor Eyes
  const baseEyeY = 256 + eyeState.pupilOffsetY * 24;
  const leftEyeX = 176 + eyeState.pupilOffsetX * 32;
  const rightEyeX = 336 + eyeState.pupilOffsetX * 32;

  const eyeWidth = 44;
  const eyeHeight = Math.max(2, 60 * (1 - eyeState.blinkProgress));

  const drawEye = (cx: number, cy: number) => {
    ctx.save();
    ctx.shadowColor = eyeState.glowColor;
    ctx.shadowBlur = 24 * eyeState.brightness;

    ctx.fillStyle = eyeState.glowColor;
    ctx.beginPath();

    if (eyeState.expression === 'happy') {
      // Upward crescent arch
      ctx.lineWidth = 14;
      ctx.strokeStyle = eyeState.glowColor;
      ctx.arc(cx, cy + 10, eyeWidth * 0.9, Math.PI * 1.15, Math.PI * 1.85, false);
      ctx.stroke();
    } else {
      // Expressive oval phosphor capsule
      ctx.ellipse(cx, cy, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pupil core highlight
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(cx + eyeState.pupilOffsetX * 8, cy + eyeState.pupilOffsetY * 6, eyeWidth * 0.45, Math.max(1, eyeHeight * 0.45), 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  if (eyeState.blinkProgress < 0.95) {
    drawEye(leftEyeX, baseEyeY);
    drawEye(rightEyeX, baseEyeY);
  } else {
    // Slit blink line
    ctx.strokeStyle = eyeState.glowColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(leftEyeX - 35, baseEyeY);
    ctx.lineTo(leftEyeX + 35, baseEyeY);
    ctx.moveTo(rightEyeX - 35, baseEyeY);
    ctx.lineTo(rightEyeX + 35, baseEyeY);
    ctx.stroke();
  }

  // Subtle phosphor noise and edge bezel shadow
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.lineWidth = 20;
  ctx.strokeRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 2. Brushed Metal Finish Texture
export function createBrushedMetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#22252a';
  ctx.fillRect(0, 0, 256, 256);

  // Micro streaks
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const len = 8 + Math.random() * 24;
    const opacity = 0.03 + Math.random() * 0.05;
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fillRect(x, y, len, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 3. Contact Shadow Ground Texture
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 240);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.55)');
  grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.2)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
