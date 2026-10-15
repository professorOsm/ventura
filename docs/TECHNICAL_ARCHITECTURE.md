# TECHNICAL ARCHITECTURE — ROBOT CORE

## 1. System Overview
ROBOT CORE is a production-grade full-stack creative web application pairing a Three.js PBR 3D simulation with an Express backend, server-side Google GenAI (Gemini) LLM integrations, and a persistent in-memory/JSON-backed project & session management engine.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT VIEWPORT (PORT 3000)                     │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │   THREE.JS 3D SCENE   │  │             REACT 19 DOM              │  │
│  │   - PBR CRT Robot     │  │   - Top Bar Contract (3 Zones)        │  │
│  │   - Procedural Eyes   │  │   - Scene 01: Hero Content            │  │
│  │   - Catenary Cables   │  │   - Scene 02: 8-Layer Neural Stack    │  │
│  │   - Studio Room Env   │  │   - Scene 03: Project Showcase Grid   │  │
│  │   - Smooth Kinematics │  │   - Scene 04: Interactive Lab         │  │
│  │   - Camera Director   │  │   - Scene 05: Finale Terminal         │  │
│  │                       │  │   - Bottom Dock (Collapsible Zen HUD) │  │
│  │                       │  │   - Robot Chat Assistant Slide-Over   │  │
│  │                       │  │   - Full Admin Dashboard Suite        │  │
│  └───────────▲───────────┘  └───────────────────▲───────────────────┘  │
│              │                                  │                      │
│              └─────────────────┬────────────────┘                      │
│                                │ State & Events                        │
│                     ┌──────────┴──────────┐                            │
│                     │ Web Audio Synthesizer│                           │
│                     │ 10 Procedural Cues   │                           │
│                     └─────────────────────┘                            │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ /api/chat, /api/rag, /api/agent,
                                     │ /api/evaluate, /api/admin/*
┌────────────────────────────────────▼───────────────────────────────────┐
│                      EXPRESS BACKEND (server.ts)                       │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │   GEMINI AI SERVICE   │  │         DATABASE & PERSISTENCE        │  │
│  │   - @google/genai SDK │  │   - Projects (CRUD, Seeded Defaults)  │  │
│  │   - Server-side keys  │  │   - Lab Datasets (RAG Docs, Vector)   │  │
│  │   - Streaming Chat    │  │   - Agent Execution Traces            │  │
│  │   - RAG & Embeddings  │  │   - Model Benchmarks Matrix           │  │
│  │   - Agent Tool Loop   │  │   - Admin Sessions (JWT / Auth Token) │  │
│  │   - User-Agent Header │  │   - System Audit Telemetry            │  │
│  └───────────────────────┘  └───────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

## 2. 3D Engine & Robot Character Architecture
- **Robot Anatomy**:
  - `CRTCabinet`: Chamfered monitor housing with ventilation louvers, brightness/contrast knobs, power toggle, and rear connector plate.
  - `CathodeScreen`: Recessed convex glass surface with procedural scanline shader and phosphor persistence.
  - `EyeDisplays`: Dual glowing turquoise oval eyes with dynamic dilation, wink, look-at pupil offset, and expression morphing (idle, blink, think, speak, alert).
  - `NeckGimbal`: Two-axis ball-and-socket servo joint with hydraulic pistons and copper coil accents.
  - `TorsoChassis`: Industrial steel chassis with internal motherboard glimpses and heat-sink fins.
  - `ConduitCables`: Dynamic quadratic Bézier curves with ribbed conduit textures running from the monitor head down into the torso.
- **Lighting & Rendering**:
  - `RoomEnvironment` procedural studio reflection map generated via `PMREMGenerator`.
  - Balanced 3-point lighting (Key softbox, fill light, cyan rim light).
  - Contact shadow grounding plane beneath base.
  - Exponential damping (`THREE.MathUtils.damp`) for silky 60fps tracking without hitching.

## 3. Audio Engine Architecture
- Zero external MP3/WAV files (Zero 404 guarantee).
- Centralized `AudioManager` singleton managing an `AudioContext`.
- Safe user gesture un-muting with state persistence in `localStorage`.
- Master volume, ambient volume, and SFX volume gains.

## 4. LLM & Engineering Lab Architecture
- **Real Gemini Integration**: Uses `@google/genai` on the server with `process.env.GEMINI_API_KEY`.
- **RAG Playground**: Pre-computed vector embeddings for sample technical whitepapers with cosine similarity ranking and dynamic snippet citation generation.
- **Agent Sandbox**: Tool dispatch loop (Calculator, Search, Schema Check, Python Eval) with state graph telemetry.
- **Local Model Benchmark**: Benchmarking engine tracking latency, First Token Time (TTFT), tokens/sec, and GPU memory footprint.
