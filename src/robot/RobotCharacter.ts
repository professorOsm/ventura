import * as THREE from 'three';
import { createBrushedMetalTexture, createContactShadowTexture } from './ProceduralTextures';

export class RobotCharacter {
  public group: THREE.Group;
  public headGroup: THREE.Group;
  public neckGroup: THREE.Group;
  public torsoGroup: THREE.Group;
  public cablesGroup: THREE.Group;

  private screenMaterial: THREE.MeshBasicMaterial;
  private screenMesh: THREE.Mesh;
  private eyeCanvas: HTMLCanvasElement;
  private eyeCtx: CanvasRenderingContext2D;
  private eyeCanvasTexture: THREE.CanvasTexture;

  // Blinking kinematics
  private blinkTimer: number = 0;
  private nextBlinkInterval: number = 3.6;
  private blinkProgress: number = 0; // 0 = open, 1 = closed
  private isBlinking: boolean = false;

  private eyeGlowColor: string = '#00F0FF';
  private eyeBrightness: number = 1.0;

  // Cursor tracking kinematics (calm observation, no twitching)
  private targetRotX: number = 0; // Vertical pitch
  private targetRotY: number = 0; // Horizontal yaw
  private currentRotX: number = 0;
  private currentRotY: number = 0;

  private targetPupilX: number = 0;
  private targetPupilY: number = 0;
  private currentPupilX: number = 0;
  private currentPupilY: number = 0;

  // Physically believable rotation limits (±12° horizontal, ±6° vertical)
  private readonly maxHeadRotY: number = 12 * (Math.PI / 180); // ~0.2094 rad
  private readonly maxHeadRotX: number = 6 * (Math.PI / 180);  // ~0.1047 rad
  private readonly maxPupilOffset: number = 0.4;

  constructor() {
    this.group = new THREE.Group();
    this.headGroup = new THREE.Group();
    this.neckGroup = new THREE.Group();
    this.torsoGroup = new THREE.Group();
    this.cablesGroup = new THREE.Group();

    this.group.add(this.torsoGroup);
    this.group.add(this.neckGroup);
    this.group.add(this.headGroup);
    this.group.add(this.cablesGroup);

    // High performance reusable Canvas for phosphor eyes (avoids garbage collection allocations)
    this.eyeCanvas = document.createElement('canvas');
    this.eyeCanvas.width = 512;
    this.eyeCanvas.height = 512;
    this.eyeCtx = this.eyeCanvas.getContext('2d')!;

    this.eyeCanvasTexture = new THREE.CanvasTexture(this.eyeCanvas);
    this.eyeCanvasTexture.colorSpace = THREE.SRGBColorSpace;

    this.screenMaterial = new THREE.MeshBasicMaterial({
      map: this.eyeCanvasTexture,
      toneMapped: false
    });

    const screenGeo = new THREE.PlaneGeometry(1.68, 1.48, 8, 8);
    // Convex CRT curvature
    const pos = screenGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      pos.setZ(i, -Math.pow(dist * 0.45, 2) * 0.14);
    }
    screenGeo.computeVertexNormals();

    this.screenMesh = new THREE.Mesh(screenGeo, this.screenMaterial);
    this.screenMesh.position.set(0, 0, 0.88);

    this.buildTorso();
    this.buildNeck();
    this.buildHead();
    this.buildCables();
    this.buildGroundShadow();

    // Fixed anatomical positioning: head pivot anchored at neck junction
    this.headGroup.position.set(0, 1.85, 0);
    this.neckGroup.position.set(0, 1.35, 0);
    this.torsoGroup.position.set(0, 0.65, 0);

    // Initial neutral forward-facing orientation
    this.group.rotation.set(0, 0.05, 0);
    this.group.position.set(0, -0.9, 0);

    // Initial screen render
    this.renderScreen(0, 0, 0, 0);
  }

  private buildHead() {
    // 1. Vintage CRT Housing Box
    const cabinetGeo = new THREE.BoxGeometry(2.1, 1.85, 1.75);
    const brushedMap = createBrushedMetalTexture();

    const cabinetMat = new THREE.MeshStandardMaterial({
      color: 0x1a2130, // Deep slate-navy
      roughness: 0.52,
      metalness: 0.32,
      bumpMap: brushedMap,
      bumpScale: 0.02
    });

    const cabinetMesh = new THREE.Mesh(cabinetGeo, cabinetMat);
    cabinetMesh.castShadow = true;
    cabinetMesh.receiveShadow = true;
    this.headGroup.add(cabinetMesh);

    // 2. Rear Cathode Ray Bulge
    const rearGeo = new THREE.CylinderGeometry(0.55, 0.82, 0.75, 16);
    rearGeo.rotateX(Math.PI / 2);
    const rearMat = new THREE.MeshStandardMaterial({
      color: 0x121722,
      roughness: 0.7,
      metalness: 0.2
    });
    const rearMesh = new THREE.Mesh(rearGeo, rearMat);
    rearMesh.position.set(0, 0, -1.05);
    this.headGroup.add(rearMesh);

    // 3. Bezel Frame inset
    const bezelGeo = new THREE.BoxGeometry(1.88, 1.64, 0.12);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x0f141e,
      roughness: 0.8,
      metalness: 0.15
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.set(0, 0, 0.84);
    this.headGroup.add(bezelMesh);

    // 4. CRT Curved Screen
    this.headGroup.add(this.screenMesh);

    // 5. Protective Outer Curved Glass
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.82,
      opacity: 0.95,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      thickness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      depthWrite: false
    });
    const glassMesh = new THREE.Mesh(this.screenMesh.geometry.clone(), glassMat);
    glassMesh.position.set(0, 0, 0.91);
    this.headGroup.add(glassMesh);

    // 6. Ventilation Louvers (Top)
    const louverGeo = new THREE.BoxGeometry(1.4, 0.03, 0.8);
    const louverMat = new THREE.MeshStandardMaterial({ color: 0x0d1117, roughness: 0.9 });
    const louverMesh = new THREE.Mesh(louverGeo, louverMat);
    louverMesh.position.set(0, 0.94, -0.1);
    this.headGroup.add(louverMesh);

    // 7. Front Panel Dial Knobs
    const knobGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.05, 16);
    knobGeo.rotateX(Math.PI / 2);
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x8a929e, metalness: 0.85, roughness: 0.2 });

    const knob1 = new THREE.Mesh(knobGeo, knobMat);
    knob1.position.set(0.68, -0.72, 0.89);
    const knob2 = new THREE.Mesh(knobGeo, knobMat);
    knob2.position.set(0.82, -0.72, 0.89);
    this.headGroup.add(knob1);
    this.headGroup.add(knob2);

    // Power Indicator Jewel Light (Soft blue)
    const jewelGeo = new THREE.SphereGeometry(0.025, 12, 12);
    const jewelMat = new THREE.MeshBasicMaterial({ color: 0x536dfe });
    const jewelMesh = new THREE.Mesh(jewelGeo, jewelMat);
    jewelMesh.position.set(0.54, -0.72, 0.89);
    this.headGroup.add(jewelMesh);
  }

  private buildNeck() {
    // Mechanical Gimbal Ring
    const ringGeo = new THREE.TorusGeometry(0.38, 0.07, 12, 24);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x3a4252,
      metalness: 0.8,
      roughness: 0.25
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    this.neckGroup.add(ringMesh);

    // Ball Joint
    const ballGeo = new THREE.SphereGeometry(0.28, 20, 20);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0x222a38,
      metalness: 0.92,
      roughness: 0.15
    });
    const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    this.neckGroup.add(ballMesh);

    // Dual Hydraulic Side Pistons (Stationary mechanical framework)
    const cylinderGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.38, 12);
    const pistonMat = new THREE.MeshStandardMaterial({
      color: 0xd4a359, // Brass actuator
      metalness: 0.85,
      roughness: 0.25
    });

    const leftPiston = new THREE.Mesh(cylinderGeo, pistonMat);
    leftPiston.position.set(-0.35, 0.1, 0);
    leftPiston.rotation.z = 0.2;
    this.neckGroup.add(leftPiston);

    const rightPiston = new THREE.Mesh(cylinderGeo, pistonMat);
    rightPiston.position.set(0.35, 0.1, 0);
    rightPiston.rotation.z = -0.2;
    this.neckGroup.add(rightPiston);
  }

  private buildTorso() {
    // Upper Chassis
    const torsoGeo = new THREE.BoxGeometry(1.7, 1.1, 1.25);
    const torsoMat = new THREE.MeshStandardMaterial({
      color: 0x222a38,
      roughness: 0.5,
      metalness: 0.4
    });
    const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    this.torsoGroup.add(torsoMesh);

    // Heat Sink Ribs on the Back
    const finMat = new THREE.MeshStandardMaterial({ color: 0x151c27, metalness: 0.8, roughness: 0.3 });
    for (let i = 0; i < 5; i++) {
      const finGeo = new THREE.BoxGeometry(1.3, 0.04, 0.22);
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(0, -0.3 + i * 0.15, -0.66);
      this.torsoGroup.add(fin);
    }

    // Industrial Pedestal Base
    const baseGeo = new THREE.CylinderGeometry(0.75, 0.95, 0.25, 24);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x18202d,
      roughness: 0.6,
      metalness: 0.5
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, -0.65, 0);
    baseMesh.receiveShadow = true;
    this.torsoGroup.add(baseMesh);
  }

  private buildCables() {
    // Realistic catenary cables looping from head to torso
    const cableRoutes = [
      { start: new THREE.Vector3(-0.85, 1.6, -0.4), mid: new THREE.Vector3(-1.15, 1.1, -0.2), end: new THREE.Vector3(-0.65, 0.7, -0.3) },
      { start: new THREE.Vector3(0.85, 1.6, -0.4), mid: new THREE.Vector3(1.15, 1.1, -0.2), end: new THREE.Vector3(0.65, 0.7, -0.3) },
      { start: new THREE.Vector3(-0.35, 1.5, -0.7), mid: new THREE.Vector3(-0.45, 1.0, -0.9), end: new THREE.Vector3(-0.25, 0.6, -0.6) },
      { start: new THREE.Vector3(0.35, 1.5, -0.7), mid: new THREE.Vector3(0.45, 1.0, -0.9), end: new THREE.Vector3(0.25, 0.6, -0.6) }
    ];

    const cableMat = new THREE.MeshStandardMaterial({
      color: 0x111620,
      roughness: 0.8,
      metalness: 0.1
    });

    cableRoutes.forEach((r) => {
      const curve = new THREE.QuadraticBezierCurve3(r.start, r.mid, r.end);
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.038, 8, false);
      const tubeMesh = new THREE.Mesh(tubeGeo, cableMat);
      this.cablesGroup.add(tubeMesh);
    });
  }

  private buildGroundShadow() {
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      depthWrite: false,
      opacity: 0.55
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -0.78, 0);
    this.group.add(shadowMesh);
  }

  /**
   * Updates pointer target coordinates.
   * normX: -1 (left) to +1 (right)
   * normY: -1 (top) to +1 (bottom)
   * active: true when cursor is over hero, false when cursor has left
   */
  public setCursorTarget(normX: number, normY: number, active: boolean, reducedMotion: boolean = false) {
    if (!active || reducedMotion) {
      // Smoothly return face to neutral forward-facing position
      this.targetRotX = 0;
      this.targetRotY = 0;
      this.targetPupilX = 0;
      this.targetPupilY = 0;
      return;
    }

    const clampedX = Math.max(-1, Math.min(1, normX));
    const clampedY = Math.max(-1, Math.min(1, normY));

    // When cursor moves left (clampedX < 0), face subtly turns left (viewer's left: +Y rotation)
    // When cursor moves right (clampedX > 0), face subtly turns right (viewer's right: -Y rotation)
    this.targetRotY = -clampedX * this.maxHeadRotY;

    // When cursor moves up (clampedY < 0), face looks slightly upward (-X rotation)
    // When cursor moves down (clampedY > 0), face looks slightly downward (+X rotation)
    this.targetRotX = clampedY * this.maxHeadRotX;

    // Subtle pupil tracking on the phosphor CRT surface
    this.targetPupilX = clampedX * this.maxPupilOffset;
    this.targetPupilY = clampedY * this.maxPupilOffset;
  }

  /**
   * In-place phosphor screen renderer with CRT scanlines and subtle eye movements.
   */
  private renderScreen(blinkVal: number, pupilX: number, pupilY: number, scanlineShift: number) {
    const ctx = this.eyeCtx;
    ctx.clearRect(0, 0, 512, 512);

    // Deep CRT curvature background
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

    // Phosphor Eyes coordinates (combines base position with natural pupil tracking)
    const baseEyeY = 256 + pupilY * 26;
    const leftEyeX = 176 + pupilX * 34;
    const rightEyeX = 336 + pupilX * 34;

    const eyeWidth = 44;
    const eyeHeight = Math.max(2, 60 * (1 - blinkVal));

    const drawEye = (cx: number, cy: number) => {
      ctx.save();
      ctx.shadowColor = this.eyeGlowColor;
      ctx.shadowBlur = 24 * this.eyeBrightness;

      ctx.fillStyle = this.eyeGlowColor;
      ctx.beginPath();
      ctx.ellipse(cx, cy, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pupil highlight
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(
        cx + pupilX * 9,
        cy + pupilY * 7,
        eyeWidth * 0.42,
        Math.max(1, eyeHeight * 0.42),
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.restore();
    };

    if (blinkVal < 0.95) {
      drawEye(leftEyeX, baseEyeY);
      drawEye(rightEyeX, baseEyeY);
    } else {
      // Clean horizontal phosphor eyelid slit during blink
      ctx.save();
      ctx.strokeStyle = this.eyeGlowColor;
      ctx.shadowColor = this.eyeGlowColor;
      ctx.shadowBlur = 14;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(leftEyeX - 35, baseEyeY);
      ctx.lineTo(leftEyeX + 35, baseEyeY);
      ctx.moveTo(rightEyeX - 35, baseEyeY);
      ctx.lineTo(rightEyeX + 35, baseEyeY);
      ctx.stroke();
      ctx.restore();
    }

    // Subtle phosphor glass border vignette
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.lineWidth = 20;
    ctx.strokeRect(0, 0, 512, 512);

    this.eyeCanvasTexture.needsUpdate = true;
  }

  /**
   * Continuous update loop.
   * Damps head rotation smoothly into target cursor direction.
   * Keeps torso, neck, limbs, and cables completely stationary.
   */
  public update(delta: number, time: number) {
    // 1. Damped spring-like easing for head rotation (calm observation, no aggressive snapping)
    const dampSpeed = 4.2; // Smooth robotic hydraulic damping
    const dampFactor = 1 - Math.exp(-dampSpeed * delta);

    this.currentRotY += (this.targetRotY - this.currentRotY) * dampFactor;
    this.currentRotX += (this.targetRotX - this.currentRotX) * dampFactor;
    this.currentPupilX += (this.targetPupilX - this.currentPupilX) * dampFactor;
    this.currentPupilY += (this.targetPupilY - this.currentPupilY) * dampFactor;

    // Apply rotation only to the dedicated headGroup pivot
    this.headGroup.rotation.y = this.currentRotY;
    this.headGroup.rotation.x = this.currentRotX;
    this.headGroup.rotation.z = 0;

    // Strictly ensure torso, neck, and cables remain stationary
    this.torsoGroup.rotation.set(0, 0, 0);
    this.neckGroup.rotation.set(0, 0, 0);
    this.cablesGroup.rotation.set(0, 0, 0);

    // 2. Subtle, natural eye blink scheduling (every 3.2s to 6.2s)
    this.blinkTimer += delta;
    if (!this.isBlinking && this.blinkTimer >= this.nextBlinkInterval) {
      this.isBlinking = true;
      this.blinkProgress = 0;
      this.blinkTimer = 0;
      this.nextBlinkInterval = 3.2 + Math.random() * 3.0;
    }

    if (this.isBlinking) {
      this.blinkProgress += delta * 9.5; // Natural blink (~160ms)
      if (this.blinkProgress >= 1.0) {
        this.isBlinking = false;
        this.blinkProgress = 0;
      }
    }

    const blinkVal = this.isBlinking ? Math.sin(this.blinkProgress * Math.PI) : 0;
    const scanlineShift = (time * 40) % 512;

    this.renderScreen(blinkVal, this.currentPupilX, this.currentPupilY, scanlineShift);
  }

  public dispose() {
    this.eyeCanvasTexture.dispose();
    this.screenMaterial.dispose();
  }
}
