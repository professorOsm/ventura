# INTERACTION MAP — ROBOT CORE

| Interaction Point | Trigger | Visual Response | Audio Cue | Target State / Destination |
| :--- | :--- | :--- | :--- | :--- |
| **Global Load** | Page initialization | Darkness -> CRT scanline glow -> Eye blink sequence | `CUE_01_BOOT`, `CUE_02_CRT_ON` | Scene 00 Boot complete -> Scene 01 Hero |
| **Cursor Move (3D)** | Pointer move on hero canvas | Robot neck pivots (±15° pitch, ±25° yaw), pupils follow pointer within safe anatomical bounds | None (throttled) | Real-time inverse tracking |
| **Audio Switch** | Click top sound toggle | Icon animates between muted and active; master volume ramps up to 0.5 | `CUE_05_SELECT` | Ambient sound generator starts |
| **Theme Toggle** | Click Dark / Light / System button | DOM class updates; Three.js ambient & directional lights smoothly interpolate color & intensity | `CUE_04_HOVER` | Dark `#080B12` <-> Light `#F8FAFC` |
| **Scroll Down** | Wheel / Touch swipe | Camera interpolates along spline; Robot repositions; Neural nodes expand | `CUE_06_TRANSITION` | Moves between Scenes 01 to 05 |
| **Explore Projects CTA** | Click hero primary button | Camera glides down to Project Showcase (Scene 03) | `CUE_05_SELECT` | Focus on Project Cards Grid |
| **Project Card Click** | Click project tile or "View Details" | Fullscreen drawer / modal opens with deep architectural schematic, metrics, stack | `CUE_05_SELECT` | Detailed Case Study View |
| **Assistant Chat Toggle** | Click bottom dock "Robot Chat" | Robot shifts to `listen` state; conversational slide-over panel emerges | `CUE_05_SELECT` | Interactive LLM Chat Session |
| **Chat Prompt Send** | Submit message in chat | Robot shifts to `think` state (eyes pulse cyan); server processes via Gemini/LLM | `CUE_07_THINKING` | Streams text; robot enters `speak` state |
| **RAG Query Execution** | Click "Run Semantic Search" | Document embeddings highlighted; vector similarity ranking displayed | `CUE_08_SUCCESS` | Grounded answer with cited chunks |
| **Agent Trace Run** | Click "Dispatch Multi-Step Task" | Step-by-step DAG graph highlights active tool (API, DB, Code, Review) | `CUE_07_THINKING` -> `CUE_08_SUCCESS` | Finished execution telemetry |
| **Admin Sign In** | Navigate to `/admin` or click Admin in footer | Password authentication modal with token session; redirects to Admin Console | `CUE_05_SELECT` | Full CRUD dashboard |
| **Zen Mode Toggle** | Click "▾ Hide Controls" in bottom dock | Dock translates down offscreen; 100% full-screen unobstructed 3D view | `CUE_05_SELECT` | Cinema View |
