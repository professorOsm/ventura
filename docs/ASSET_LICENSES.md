# ASSET LICENSES & PIPELINE DOCUMENTATION — VENTURA

## 1. 3D Model & Procedural Materials
- **Geometry**: 100% procedurally generated using Three.js built-in primitives (`BoxGeometry`, `CylinderGeometry`, `SphereGeometry`, `TorusGeometry`, `TubeGeometry`, `PlaneGeometry`).
- **Surface Textures**: Procedurally rendered into HTML5 Canvas elements at runtime (`CanvasTexture`, `SRGBColorSpace`).
- **Studio Environment Reflection**: Procedurally synthesized using Three.js `RoomEnvironment` and `PMREMGenerator`.
- **License**: Custom procedural code for Ventura. Apache 2.0 / MIT compatible.

## 2. Audio Engine
- **Synthesizer Engine**: Web Audio API oscillator nodes, gain nodes, biquad filter nodes, and LFO modulators.
- **External Audio Files**: Zero external audio files required. All 7 cues are generated in code in real time with zero 404 dependencies.
- **License**: Custom procedural code. Apache 2.0 / MIT compatible.

## 3. High-Fidelity Imagery
- **Generation Method**: Generated via Google AI Studio multimodal tool (`generate_image`) for high-fidelity fallback presentation and project context diagrams.
  - `/src/assets/images/hero_crt_robot_laboratory_1791991384959.jpg` (Hero CRT robot fallback)
  - `/src/assets/images/project_rag_engine_1791991385209.jpg` (RAG neural retrieval pipeline)
  - `/src/assets/images/project_agent_orchestrator_1791991385489.jpg` (Multi-agent execution graph)
  - `/src/assets/images/project_local_llm_lab_1791991386444.jpg` (Hardware engineering laboratory)
- **License**: Generated specifically for this portfolio project.

## 4. Typography
- **Plus Jakarta Sans**: Google Fonts (SIL Open Font License 1.1)
- **DM Sans**: Google Fonts (SIL Open Font License 1.1)
- **JetBrains Mono**: Google Fonts (SIL Open Font License 1.1)
