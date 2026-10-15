# IMPLEMENTATION PLAN — ROBOT CORE

## Stage Summary & Progress Tracking

- [x] **Stage A — Repository and Reference Audit**:
  - Reference audit (`docs/REFERENCE_AUDIT.md`)
  - Interaction mapping (`docs/INTERACTION_MAP.md`)
  - Scene choreography (`docs/SCENE_BREAKDOWN.md`)
  - Web Audio cue sheet (`docs/AUDIO_CUE_SHEET.md`)
  - Technical architecture (`docs/TECHNICAL_ARCHITECTURE.md`)
  - Asset generation and licensing strategy (Procedural Three.js + Studio textures + AI generated hero assets)

- [ ] **Stage B — Backend Foundation & API Services**:
  - Express server (`server.ts`) with Vite middleware mounted on port 3000
  - Gemini SDK client initialization (`@google/genai`) with telemetry headers
  - Full API endpoints: `/api/chat`, `/api/rag`, `/api/agent`, `/api/evaluate`, `/api/admin/*`
  - In-memory database with initial projects, case studies, and admin credentials

- [ ] **Stage C — Procedural 3D Robot Character & Scene Director**:
  - Three.js procedural CRT monitor head with realistic convex glass, bezel, and vents
  - Expressive dual eyes with animated blinking, gaze tracking, and scanlines
  - Mechanical neck gimbal with servo pistons and copper wiring
  - Flexible conduit catenary cables running from head to torso
  - PBR materials, `RoomEnvironment` reflections, contact shadow plane
  - Character state manager: `idle`, `wake`, `blink`, `lookAtCursor`, `listen`, `think`, `speak`, `projectReveal`, `success`, `error`, `sleep`, `finale`

- [ ] **Stage D — Cinematic Story Scenes (00 to 05)**:
  - Scene 00: Boot sequence with CRT scanlines & degauss
  - Scene 01: Hero with typography, CTAs, and cursor interaction
  - Scene 02: 8-Layer Neural Architecture breakdown
  - Scene 03: Project Worlds (6 deep case studies)
  - Scene 04: Interactive Engineering Lab (RAG, Agent, Local LLM, Eval)
  - Scene 05: Contact Terminal & System Finale
  - Collapsible bottom control dock (Zen Mode)

- [ ] **Stage E — Web Audio Synthesizer**:
  - Zero-dependency Web Audio API synthesizer
  - 10 procedural audio cues
  - Smooth master volume, mute toggle, and persistent preference

- [ ] **Stage F — Full Admin Dashboard Suite**:
  - Protected admin routes with token authentication
  - Project CRUD (Create, Edit, Delete, Publish toggle)
  - AI Provider settings & model status
  - Agent execution logs & audit trail

- [ ] **Stage G — Responsive Polish, Accessibility, and Verification**:
  - Desktop 1440px baseline, tablet and mobile responsiveness
  - Light, Dark, and System theme synchronization
  - `compile_applet` build validation and end-to-end verification
