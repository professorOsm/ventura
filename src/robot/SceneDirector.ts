import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RobotCharacter } from './RobotCharacter';

export interface HeroSceneConfig {
  canvas: HTMLCanvasElement;
  isDarkTheme: boolean;
}

export class HeroSceneDirector {
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public robot: RobotCharacter;

  private clock: THREE.Clock;
  private animFrameId: number | null = null;
  private isVisible: boolean = true;
  private isDestroyed: boolean = false;

  // Studio Lights
  private ambientLight: THREE.AmbientLight;
  private keyLight: THREE.DirectionalLight;
  private fillLight: THREE.DirectionalLight;
  private rimLight: THREE.DirectionalLight;

  constructor(config: HeroSceneConfig) {
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();

    const width = config.canvas.clientWidth || 500;
    const height = config.canvas.clientHeight || 500;

    // Fixed camera framing specifically for the hero right column
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 40);
    this.camera.position.set(0, 0.45, 3.5);
    this.camera.lookAt(0, 0.35, 0);

    // High performance WebGL setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: config.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Room Environment reflection map for realistic metallic joints and glass reflections
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    this.scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();

    // 3-Point Studio Lighting (Soft Blue and Violet Studio Rig)
    this.ambientLight = new THREE.AmbientLight(0xe8eeff, 1.8);
    this.scene.add(this.ambientLight);

    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    this.keyLight.position.set(3, 3.5, 3);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.bias = -0.0005;
    this.scene.add(this.keyLight);

    this.fillLight = new THREE.DirectionalLight(0x9361f5, 1.2); // Soft violet fill
    this.fillLight.position.set(-3, 2, 2);
    this.scene.add(this.fillLight);

    this.rimLight = new THREE.DirectionalLight(0x536dfe, 2.8); // Primary blue rim highlight
    this.rimLight.position.set(0, 2.5, -2.5);
    this.scene.add(this.rimLight);

    // Stationary Robot Protagonist (Subtle eye blinking only)
    this.robot = new RobotCharacter();
    this.scene.add(this.robot.group);

    this.applyTheme(config.isDarkTheme);
    this.startLoop();
  }

  public applyTheme(isDark: boolean) {
    if (isDark) {
      this.ambientLight.color.setHex(0x182235);
      this.ambientLight.intensity = 1.4;
      this.keyLight.color.setHex(0xf8fafc);
      this.keyLight.intensity = 2.4;
      this.fillLight.color.setHex(0x9361f5);
      this.fillLight.intensity = 1.5;
      this.rimLight.color.setHex(0x60a5fa);
      this.rimLight.intensity = 2.8;
    } else {
      // Bright studio lighting for Ventura light theme
      this.ambientLight.color.setHex(0xf0e8ff);
      this.ambientLight.intensity = 2.4;
      this.keyLight.color.setHex(0xffffff);
      this.keyLight.intensity = 2.8;
      this.fillLight.color.setHex(0x9361f5);
      this.fillLight.intensity = 1.2;
      this.rimLight.color.setHex(0x536dfe);
      this.rimLight.intensity = 2.2;
    }
  }

  public setVisibility(visible: boolean) {
    this.isVisible = visible;
  }

  public setCursorTarget(normX: number, normY: number, active: boolean, reducedMotion: boolean = false) {
    this.robot.setCursorTarget(normX, normY, active, reducedMotion);
  }

  public handleResize(width: number, height: number) {
    if (this.isDestroyed || !this.renderer) return;
    this.camera.aspect = width / height;
    if (width < 600) {
      this.camera.fov = 46;
    } else {
      this.camera.fov = 38;
    }
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private startLoop() {
    const tick = () => {
      if (this.isDestroyed) return;
      this.animFrameId = requestAnimationFrame(tick);

      if (!this.isVisible) return; // Pause rendering loop when off-screen

      const delta = Math.min(this.clock.getDelta(), 0.1);
      const time = this.clock.getElapsedTime();

      // Only update subtle eye blinking
      this.robot.update(delta, time);

      this.renderer.render(this.scene, this.camera);
    };

    this.animFrameId = requestAnimationFrame(tick);
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.robot.dispose();
    this.renderer.dispose();
  }
}
