/**
 * Ventura — Procedural Web Audio Synthesizer
 * Zero external 404 dependencies. Complies with browser autoplay policies (starts disabled).
 * Subtle, restrained, high-quality audio cues.
 */

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private isAmbientPlaying: boolean = false;
  private lastHoverTime: number = 0;

  constructor() {
    // Starts disabled by default. Reads saved preference if user previously opted in.
    const saved = localStorage.getItem('ventura_sound_enabled');
    if (saved === 'true') {
      this.isMuted = false;
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.ambientGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.ambientGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);

        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);
        this.ambientGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getSoundEnabled(): boolean {
    return !this.isMuted;
  }

  public setSoundEnabled(enabled: boolean) {
    this.isMuted = !enabled;
    localStorage.setItem('ventura_sound_enabled', enabled ? 'true' : 'false');

    if (enabled) {
      this.initContext();
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 0.3);
      }
      this.startAmbient();
      this.playSelect();
    } else {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
      }
      this.stopAmbient();
    }
  }

  public toggleSound(): boolean {
    const next = !this.getSoundEnabled();
    this.setSoundEnabled(next);
    return next;
  }

  // 1. boot: short electronic startup accent
  public playBoot() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.4);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  // 2. ambient-loop: soft background atmosphere
  public startAmbient() {
    if (this.isMuted || this.isAmbientPlaying) return;
    this.initContext();
    if (!this.ctx || !this.ambientGain) return;

    const t = this.ctx.currentTime;
    this.ambientOsc1 = this.ctx.createOscillator();
    this.ambientOsc2 = this.ctx.createOscillator();
    this.ambientFilter = this.ctx.createBiquadFilter();
    this.lfo = this.ctx.createOscillator();

    this.ambientOsc1.type = 'sine';
    this.ambientOsc1.frequency.setValueAtTime(65.41, t); // C2

    this.ambientOsc2.type = 'sine';
    this.ambientOsc2.frequency.setValueAtTime(67.5, t); // Subtle harmonic binaural beat

    this.ambientFilter.type = 'lowpass';
    this.ambientFilter.frequency.setValueAtTime(360, t);
    this.ambientFilter.Q.setValueAtTime(1.5, t);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(120, t);
    this.lfo.type = 'sine';
    this.lfo.frequency.setValueAtTime(0.1, t);
    this.lfo.connect(lfoGain);
    lfoGain.connect(this.ambientFilter.frequency);

    this.ambientOsc1.connect(this.ambientFilter);
    this.ambientOsc2.connect(this.ambientFilter);
    this.ambientFilter.connect(this.ambientGain);

    this.ambientOsc1.start();
    this.ambientOsc2.start();
    this.lfo.start();
    this.isAmbientPlaying = true;
  }

  public stopAmbient() {
    if (!this.isAmbientPlaying) return;
    try {
      this.ambientOsc1?.stop();
      this.ambientOsc2?.stop();
      this.lfo?.stop();
      this.ambientOsc1?.disconnect();
      this.ambientOsc2?.disconnect();
      this.lfo?.disconnect();
    } catch (e) {
      // Ignored
    }
    this.isAmbientPlaying = false;
  }

  // 3. ui-hover: restrained hover accent
  public playHover() {
    if (this.isMuted) return;
    const now = performance.now();
    if (now - this.lastHoverTime < 90) return; // Throttled
    this.lastHoverTime = now;

    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, t); // A6 quiet pip
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.035);
  }

  // 4. ui-select: selection confirmation
  public playSelect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    [523.25, 659.25].forEach((freq) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.16);
    });
  }

  // 5. scene-transition: subtle transition effect
  public playTransition() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(550, t + 0.2);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.5);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  // 6. success: quiet successful-action confirmation
  public playSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.22);
    });
  }

  // 7. error: restrained error notification
  public playError() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    [220, 233.08].forEach((freq) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  }
}

export const audioManager = new AudioManager();
