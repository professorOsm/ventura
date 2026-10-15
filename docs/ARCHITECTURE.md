# TECHNICAL ARCHITECTURE — VENTURA

## 1. Executive Summary
Ventura is a premium LLM Engineer portfolio pairing a bright, colourful frontend design with a stationary Three.js retro CRT robot in the homepage hero and a full suite of functional AI engineering demonstrations on an Express backend.

## 2. Structural Principles & Requirements Compliance
- **Bright & Colourful Design**: Default light mode palette (`#F8FAFC` background, `#536DFE` primary blue, `#9361F5` violet, with teal, orange, cyan, and pink accents) adhering to a 60–30–10 distribution.
- **Stationary 3D Hero Robot**: Rendered strictly within the homepage hero right-column card. Completely stationary (no head, neck, body, or cable movement; no cursor tracking). The only animation is occasional, natural eye blinking every 3–6s.
- **Natural Scrolling**: Natural document flow across standard page sections (Hero → About → Skills → Projects → AI Lab → Contact → Footer).
- **No Admin Dashboard**: Ventura is a clean public portfolio without admin routes, admin logins, or unused admin database models.
- **Server-Side AI Security**: All Gemini SDK calls (`@google/genai` using model `gemini-3.8-flash`) are managed on the Express backend (`server.ts`) with telemetry headers (`User-Agent: 'aistudio-build'`). No API keys are ever leaked to the browser.

## 3. Component Architecture
```
ventura/
├── src/
│   ├── audio/
│   │   └── AudioManager.ts          # Native Web Audio procedural synthesizer (7 cues)
│   ├── components/
│   │   ├── Navbar.tsx               # Ventura wordmark, theme selector (L/D/S), sound toggle
│   │   ├── RobotHero.tsx            # Isolated Three.js hero container with visibility observer
│   │   ├── ChatWidget.tsx           # Floating text AI chatbot with blue-violet styling
│   │   ├── ProjectDetailModal.tsx   # Deep architectural case study modal
│   │   └── EngineeringLab.tsx       # RAG, Agent, Local, Eval, Multimodal, Automation
│   ├── robot/
│   │   ├── ProceduralTextures.ts    # Phosphor scanlines, brushed metal, contact shadow
│   │   ├── RobotCharacter.ts        # PBR CRT robot geometry with subtle blink kinematics
│   │   └── SceneDirector.ts         # Three.js scene, RoomEnvironment, soft blue studio rig
│   ├── App.tsx                      # Main single-page application orchestrator
│   └── index.css                    # Tailwind CSS v4 styling & typography
└── server.ts                        # Full-stack Express backend & Gemini API proxy
```

## 4. API Endpoints
- `GET /api/health`: Health status and Gemini key detection.
- `GET /api/projects`: Return Ventura's 6 production AI case studies.
- `POST /api/chat`: Server-side Gemini 3.8 Flash query with engineering knowledge-base fallback.
- `POST /api/rag`: Ingest query, calculate vector similarity, return top passages and cited synthesis.
- `POST /api/agent`: Run multi-step agent graph with DAG tool execution telemetry.
- `GET /api/evaluate`: Return comparative evaluation matrix across 4 model candidates.
- `GET /api/local-models`: Return Ollama / vLLM runtime and loaded GGUF model specs.
- `POST /api/contact`: Form validation and inquiry submission.
