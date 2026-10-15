<<<<<<< HEAD
# ventura
=======
# Ventura — Premium LLM Engineer Portfolio

A premium, responsive, colourful personal LLM Engineer portfolio featuring a realistic retro CRT monitor-headed robot in the homepage hero, natural page scrolling, functional AI demonstrations, and an integrated technical chatbot.

---

## Key Highlights

- **Distinctive CRT Robot Hero**: Inspired by the retro computer monitor character reference, rendered exclusively in the homepage hero with soft blue/violet studio lighting and realistic materials. Completely stationary with subtle, natural eye blinking every 3–6s.
- **Bright & Colourful UI**: Designed with an editorial, modern aesthetic using a 60–30–10 colour balance (`#F8FAFC` light canvas, `#536DFE` primary blue, `#9361F5` violet, with teal, orange, cyan, and pink project accents).
- **Theme Modes**: Full support for Light mode (default), Dark mode, and System appearance.
- **Natural Page Scrolling**: Traditional, accessible document scroll across 7 structured sections:
  1. **Hero**: Headline, engineering intro, primary CTAs, technology highlights, and stationary 3D robot card.
  2. **About**: Engineering philosophy, focus areas, interests, and preferred stack.
  3. **Skills & Capabilities**: Colourful skill domains (LLM Engineering, RAG & Vector Systems, AI Agents, Development, Infrastructure).
  4. **Featured Projects**: 6 production case study cards with distinct visual accents (Blue, Violet, Teal, Orange, Pink, Cyan).
  5. **Case Studies**: Deep modal technical inspector covering architecture, decisions, and measured metrics.
  6. **AI Engineering Lab**: 6 practical workbenches (RAG playground with citations, Agent DAG execution trace, Local LLM studio with live token streaming, Model Evaluation matrix, Multimodal AI, and Automation).
  7. **Contact & Footer**: Direct inquiry submission form and dynamic footer.
- **Functional AI Chatbot**: Clean text-based floating assistant powered by server-side Gemini 3.8 Flash (`@google/genai`) with fallback knowledge of Ventura's systems.
- **Optional Web Audio**: Subtle procedural sound effects and ambient drone. Disabled by default with a visible Navbar toggle.
- **Zero Admin Overhead**: Pure public portfolio without admin routes, admin logins, or unused database models.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
- **3D & Graphics**: Three.js, RoomEnvironment PMREM reflections, PBR materials, procedural canvas textures.
- **Audio**: Native Web Audio API procedural synthesizer (zero 404 dependencies).
- **Backend**: Express, Node.js, `@google/genai` TypeScript SDK (server-side only with telemetry headers).

---

## Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Documentation

- `docs/ARCHITECTURE.md`: Full-stack system and component design.
- `docs/SETUP.md`: Local setup and build instructions.
- `docs/AUDIO_CUE_SHEET.md`: Procedural synthesizer specifications.
- `docs/ASSET_LICENSES.md`: 3D, audio, image, and font licenses.
- `docs/TEST_REPORT.md`: Test results and acceptance verification.
>>>>>>> 069ae62 (Upload project files)
