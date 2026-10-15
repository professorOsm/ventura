# REFERENCE AUDIT: igloo.inc & Translation to ROBOT CORE

## 1. Audit Methodology & Scope
An in-depth interaction and creative-technology audit of https://www.igloo.inc/ (and related WebGL/Three.js creative development standards) was performed to extract structural principles:
- **Core Concept**: igloo.inc uses an elemental theme (ice, crystals, atmospheric refractions, and a narrative scroll sequence) to guide visitors through its studio profile and case studies.
- **Translation to ROBOT CORE**: Rather than an elemental ice motif, ROBOT CORE translates this into a high-fidelity retro-futuristic CRT computer-headed robot navigating a mysterious neural engineering laboratory. The robot is the protagonist, guide, and interactive interlocutor.

## 2. Interaction & Visual Architecture Findings

### A. Initial Boot Sequence
- **igloo Observation**: Ambient darkness -> sound toggle prompt / preload progress -> cinematic object assembly.
- **ROBOT CORE Implementation**: Dark atmosphere -> boot status label -> CRT degauss & phosphor scanline ignition -> dual eye illumination with expressive blink -> camera pull-back into interactive hero.

### B. Viewport & Spatial Composition
- **igloo Observation**: Central protagonist object centered in 3D viewport, DOM typography floating over canvas with pointer-events pass-through.
- **ROBOT CORE Implementation**: PBR Three.js CRT robot with procedural cathode screen, brass/dark-metal neck gimbal, ribbed catenary cables, and expressive dual phosphor eyes. Unobstructed central 3D viewport with bottom-dock HUD and zero pill-clutter.

### C. Scroll Choreography
- **igloo Observation**: Smooth scroll drives camera z-distance, orbit angle, and environmental particle field density.
- **ROBOT CORE Implementation**: Multi-stage scroll progression across 5 defined scenes:
  1. Boot / Hero: Idle inspection, cursor tracking, intro copy.
  2. The Intelligence Core: Exploded view / neural architecture ring assembly around the robot.
  3. Project Worlds: 6 deep LLM engineering case studies with interactive modals & live code/traces.
  4. Engineering Lab: Functional RAG playground, Agent graph trace runner, Local LLM benchmark explorer, and Evaluation matrix.
  5. Contact & System Finale: Direct inquiry terminal and session summary.

### D. Audio Experience
- **igloo Observation**: Subtle ambient synthesizer loop with spatialized UI click / hover accents. Muted by default with clear master switch.
- **ROBOT CORE Implementation**: Web Audio API zero-dependency procedural synthesizer generating 10 distinct audio cues (CRT hum, degauss click, eye spark, UI hover, selection chime, scene transition whoosh, neural processing, success, warning, finale chord).

### E. Mobile & Accessibility
- **igloo Observation**: Reduced canvas pixel ratio, simplified particle counts, touch swipe gestures.
- **ROBOT CORE Implementation**: Responsive camera distance scaling, `prefers-reduced-motion` compliance, WebGL context loss recovery, and a guaranteed high-fidelity CSS/SVG/Canvas fallback if WebGL is unavailable.
