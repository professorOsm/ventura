# AUDIO CUE SHEET — VENTURA

All audio is procedurally synthesized via the browser's native Web Audio API (`AudioContext`). This ensures zero 404 broken file dependencies, zero external network requests, instant loading, and complete browser autoplay policy compliance (audio starts disabled by default).

| Cue Name | Procedural Synthesizer Architecture | Trigger Event | Volume (Rel) | Duration | Loop | Note |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **boot** | Low-to-high exponential sine glide (110Hz -> 440Hz) | User turns on audio or clicks initial CTA | 0.25 | 0.5s | No | One-shot welcoming tone |
| **ambient-loop** | Binaural sub-drones (65.4Hz C2 & 67.5Hz) with slow LFO resonant lowpass filter | Active audio state | 0.20 | Infinite | Yes | Smooth 0.3s fade-in/out on master toggle |
| **ui-hover** | High subtle sine pip (1760Hz, 30ms decay) | Hovering primary interactive items | 0.04 | 0.035s | No | Throttled to max once per 90ms |
| **ui-select** | Dual harmonic chime (523Hz C5 + 659Hz E5) | Button clicks, tab selections, modal opens | 0.12 | 0.16s | No | Clean tactile feedback |
| **scene-transition** | Triangle wave frequency sweep (220Hz -> 550Hz -> 180Hz) | Section jumps and workbench mode switches | 0.10 | 0.5s | No | Subtle spatial cue |
| **success** | Ascending tri-tone chime (523Hz -> 659Hz -> 784Hz, C-E-G) | Successful RAG retrieval, agent task, form transmit | 0.15 | 0.22s | No | Clear confirmation tone |
| **error** | Soft sawtooth minor-second dissonance (220Hz + 233Hz) | Network variance or validation alert | 0.08 | 0.25s | No | Non-jarring gentle warning |

> **Mandatory Rule**: The CRT robot's subtle eye blinking must NEVER trigger any audio. Eye blinking is purely visual and silent.
