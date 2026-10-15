import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Ventura Projects Data (Typed, colourful and production-ready)
export interface ProjectItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  accentColor: 'blue' | 'violet' | 'teal' | 'orange' | 'pink' | 'cyan';
  status: 'production' | 'demonstration' | 'prototype' | 'research';
  problem: string;
  solution: string;
  architecture: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  repoUrl?: string;
  demoUrl?: string;
  image?: string;
}

const venturaProjects: ProjectItem[] = [
  {
    id: 'rag-intelligence-engine',
    title: 'RAG Intelligence Engine',
    summary: 'Hierarchical document chunking, hybrid BM25 + dense vector embeddings with cross-encoder reranking and verified source attribution.',
    category: 'Retrieval Augmented Generation',
    accentColor: 'blue',
    status: 'production',
    problem: 'Standard naive vector search suffers from context dilution, semantic hallucination, and lack of reproducible source attribution across 50,000+ technical PDF specifications.',
    solution: 'Engineered a multi-stage retrieval pipeline: structural document layout parsing, contextual chunking with metadata preservation, hybrid lexical + dense retrieval, and FlashRank cross-encoder reranking before LLM synthesis.',
    architecture: 'Unstructured Parser → Chunk Enrichment → BGE-Large-v1.5 Dense Embeddings → Qdrant HNSW Index → Reciprocal Rank Fusion → Cross-Encoder Rerank → Gemini 3.8 / Llama 3.3 Context Assembly.',
    technologies: ['Python', 'Qdrant', 'FastAPI', 'Gemini 3.8', 'BGE Embeddings', 'DSPy', 'Docker'],
    metrics: [
      { label: 'Retrieval Precision@5', value: '94.2%' },
      { label: 'Latency (P95)', value: '280ms' },
      { label: 'Citation Faithfulness', value: '98.6%' },
      { label: 'Indexed Documents', value: '120,000+' }
    ],
    repoUrl: 'https://github.com/ventura-ai/rag-intelligence-engine',
    demoUrl: '#ai-lab',
    image: '/src/assets/images/project_rag_engine_1791991385209.jpg'
  },
  {
    id: 'autonomous-agent-workflows',
    title: 'Autonomous Agent Workflows',
    summary: 'Cyclic state-graph agent system with deterministic tool verification, dynamic sandboxing, and human-in-the-loop escalation boundaries.',
    category: 'Agentic Workflows',
    accentColor: 'violet',
    status: 'production',
    problem: 'Unconstrained ReAct agent loops suffer from infinite tool recursion, stochastic drift, and catastrophic errors when invoking mutation APIs.',
    solution: 'Designed a directed acyclic graph (DAG) execution framework with explicit state transitions, schema-enforced tool interfaces, idempotent execution checkpoints, and human approval gates for critical actions.',
    architecture: 'LangGraph State Machine → Pydantic v2 Schema Validator → Sandboxed Tool Runtime → Replay Execution Log → Dynamic Fallback Recovery.',
    technologies: ['TypeScript', 'Python', 'LangGraph', 'Gemini Function Calling', 'PostgreSQL', 'Redis'],
    metrics: [
      { label: 'Task Success Rate', value: '91.8%' },
      { label: 'Avg Step Convergence', value: '3.4 steps' },
      { label: 'Zero-Escape Sandboxing', value: '100%' },
      { label: 'Tool Invocation Latency', value: '115ms' }
    ],
    repoUrl: 'https://github.com/ventura-ai/agent-workflows',
    demoUrl: '#ai-lab',
    image: '/src/assets/images/project_agent_orchestrator_1791991385489.jpg'
  },
  {
    id: 'local-llm-studio',
    title: 'Local LLM Studio',
    summary: 'Hardware-optimized local model deployment featuring dynamic quantization (GGUF Q4_K_M/Q8_0), speculative decoding, and continuous batching.',
    category: 'Local Inference & Optimization',
    accentColor: 'teal',
    status: 'demonstration',
    problem: 'Cloud LLM APIs introduce latency, strict data privacy barriers, and prohibitive operational costs for high-throughput air-gapped workloads.',
    solution: 'Benchmarked and deployed quantized open-weights models (Llama 3.3 70B, DeepSeek R1, Mistral Large 2) using llama.cpp and vLLM with KV-cache paging and speculative draft decoding.',
    architecture: 'Ollama API / vLLM Server → PagedAttention KV Cache → Speculative Drafting Engine → TensorRT-LLM Acceleration → Prometheus Metrics.',
    technologies: ['C++', 'Ollama', 'vLLM', 'CUDA', 'Python', 'Prometheus', 'Grafana'],
    metrics: [
      { label: 'Token Throughput', value: '68 tok/s' },
      { label: 'First Token Latency', value: '140ms' },
      { label: 'VRAM Savings', value: '62%' },
      { label: 'Zero Cloud Egress', value: '100% On-Prem' }
    ],
    repoUrl: 'https://github.com/ventura-ai/local-llm-studio',
    demoUrl: '#ai-lab',
    image: '/src/assets/images/project_local_llm_lab_1791991386444.jpg'
  },
  {
    id: 'multimodal-ai-explorer',
    title: 'Multimodal AI Explorer',
    summary: 'End-to-end OCR-free extraction of complex financial broadsheets, engineering blueprints, and circuit schematics into validated JSON schemas.',
    category: 'Multimodal AI',
    accentColor: 'orange',
    status: 'production',
    problem: 'Traditional OCR engines fail on complex multi-column layouts, tables with merged headers, and nested mechanical schematics.',
    solution: 'Leveraged high-resolution vision-language models with spatial bounding-box prompts and strict JSON schema decoding to output structured relational data.',
    architecture: 'PDF Splitting → High-DPI Rasterizer → Gemini Vision Multimodal Retrieval → JSON Schema Enforcement → Anomaly Detection.',
    technologies: ['Python', 'Gemini Vision', 'PyMuPDF', 'Pydantic', 'OpenCV'],
    metrics: [
      { label: 'Table Extraction Accuracy', value: '97.4%' },
      { label: 'Throughput', value: '45 pages/min' },
      { label: 'Hallucination Rate', value: '< 0.8%' }
    ],
    repoUrl: 'https://github.com/ventura-ai/multimodal-explorer',
    demoUrl: '#ai-lab'
  },
  {
    id: 'model-evaluation-lab',
    title: 'Model Evaluation Lab',
    summary: 'Automated CI/CD benchmarking framework measuring semantic drift, toxicity, prompt injection vulnerabilities, and retrieval grounding.',
    category: 'Evaluation & MLOps',
    accentColor: 'pink',
    status: 'production',
    problem: 'Model prompt updates or model version updates frequently cause regressions in downstream task accuracy without warning.',
    solution: 'Created an automated evaluation suite running golden datasets through synthetic adversarial fuzzing, Ragas metric calculations, and cost-efficiency scoring.',
    architecture: 'GitHub Actions CI → Test Harness → Dual-Judge Consensus → Ragas Groundedness → Slack Regression Alerts.',
    technologies: ['Python', 'Ragas', 'DeepEval', 'Pytest', 'GitHub Actions'],
    metrics: [
      { label: 'Regression Detection', value: '100%' },
      { label: 'Eval Suite Runtime', value: '4.2 mins' },
      { label: 'Test Suite Coverage', value: '650+ Scenarios' }
    ],
    repoUrl: 'https://github.com/ventura-ai/model-eval-lab',
    demoUrl: '#ai-lab'
  },
  {
    id: 'ai-automation-systems',
    title: 'AI Automation Systems',
    summary: 'Serverless event streaming pipeline combining Kafka topics, dead-letter queues, and deterministic LLM workers for automated triage.',
    category: 'Infrastructure & Automation',
    accentColor: 'cyan',
    status: 'production',
    problem: 'Spiky asynchronous workloads overload LLM rate limits and cause unhandled task drops during third-party API throttling.',
    solution: 'Implemented backpressure-aware message queues with exponential backoff, distributed lock managers, and checkpointed state saves.',
    architecture: 'Kafka Topics → Rate-Limiting Shaper → LLM Worker Pools → Dead Letter Queue → OpenTelemetry Tracing.',
    technologies: ['Node.js', 'Kafka', 'Redis', 'Docker', 'OpenTelemetry'],
    metrics: [
      { label: 'Daily Event Throughput', value: '1.2M events' },
      { label: 'Availability SLA', value: '99.98%' },
      { label: 'Auto-Recovery Rate', value: '99.4%' }
    ],
    repoUrl: 'https://github.com/ventura-ai/ai-automation-systems',
    demoUrl: '#ai-lab'
  }
];

// Sample Technical Documents for RAG Playground
const ragCorpus = [
  {
    id: 'doc-01',
    title: 'Dense Retrieval vs Cross-Encoder Reranking in RAG',
    section: 'Section 2.1: Latency & Re-ranking Trade-offs',
    content: 'Bi-encoder architectures like BGE or Contriever map queries and passages into independent dense vectors, yielding sub-30ms vector search via HNSW graphs. However, bi-encoders cannot capture fine-grained token-level cross-attention. Inserting a cross-encoder reranker (e.g. FlashRank, BGE-Reranker) on the top-50 candidates improves NDCG@10 by up to 18.4% while adding only 35ms of latency.',
    embeddingDistance: 0.94
  },
  {
    id: 'doc-02',
    title: 'Speculative Decoding in Quantized Local LLMs',
    section: 'Section 4.3: Draft Verification Dynamics',
    content: 'Speculative decoding utilizes a compact draft model (such as Llama-3.2-1B) to generate K candidate tokens sequentially. A larger target model (such as Llama-3.3-70B-Q4_K_M) evaluates all K draft tokens in a single forward pass via causal masking. When acceptance rates exceed 70%, wall-clock speedups reach 2.2x to 2.8x on standard workstation GPUs without mathematical loss of precision.',
    embeddingDistance: 0.89
  },
  {
    id: 'doc-03',
    title: 'LangGraph Cyclic State Machine Best Practices',
    section: 'Section 3.2: Deterministic State Invariants',
    content: 'In production multi-agent systems, unconstrained recursion leads to runaway token usage. Strict guardrails require: 1) Bound maximum graph cycles (e.g., max_iterations = 6); 2) Enforce idempotent tool calls using transactional idempotency keys; 3) Insert human approval checkpoints before executing irreversible side-effects.',
    embeddingDistance: 0.86
  },
  {
    id: 'doc-04',
    title: 'Context Window Poisoning & Needle Retrieval',
    section: 'Section 1.4: Attention Sink Phenomenon',
    content: 'Even models supporting 1M+ tokens suffer from the "lost in the middle" effect when relevant context is flanked by hundreds of thousands of low-signal tokens. Applying structural chunking and semantic query prefixing ensures key facts remain near the top 15% of the attention distribution, reducing retrieval drop-off from 32% to under 4%.',
    embeddingDistance: 0.81
  }
];

// ======================== PUBLIC API ROUTES ========================

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    app: 'Ventura',
    uptime: process.uptime(),
    geminiConfigured: !!geminiApiKey,
    timestamp: new Date().toISOString()
  });
});

// Projects list
app.get('/api/projects', (_req: Request, res: Response) => {
  res.json(venturaProjects);
});

// Chat endpoint (Server-side Gemini with clean engineering fallback)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required' });
    }

    if (ai) {
      try {
        const systemPrompt = `You are Ventura AI, an intelligent, concise technical assistant embedded in the Ventura LLM Engineer portfolio.
You assist technical recruiters, engineering leaders, and developers with:
- Explaining Ventura's production projects (RAG Intelligence Engine, Autonomous Agent Workflows, Local LLM Studio, Multimodal AI, Model Evaluation, AI Automation).
- Technical discussion on retrieval pipelines (HNSW, BM25, cross-encoders, DSPy), agents (LangGraph, tool sandboxing, state machines), local inference (quantization Q4_K_M, vLLM, speculative decoding), and evaluation frameworks.
Keep responses concise, articulate, and technically accurate (under 160 words). Maintain a bright, helpful, and professional tone.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nVisitor Question: ${message}` }]
            }
          ]
        });

        const reply = response.text || 'I have analyzed your request across Ventura\'s system parameters. How can I assist your engineering evaluation further?';
        return res.json({ reply, source: 'gemini-3.8-flash', model: 'gemini-3.8-flash' });
      } catch (geminiError) {
        console.error('Gemini API call failed, using deterministic fallback:', geminiError);
      }
    }

    // High quality deterministic fallback
    const lower = message.toLowerCase();
    let reply = '';
    if (lower.includes('rag') || lower.includes('retrieval') || lower.includes('vector')) {
      reply = `Ventura's RAG Intelligence Engine uses hybrid dense-sparse indexing (BGE-Large + BM25) in Qdrant with Reciprocal Rank Fusion. The top candidates are reranked via a FlashRank cross-encoder, achieving 94.2% Precision@5 with a P95 latency of 280ms. You can test live queries in the AI Lab!`;
    } else if (lower.includes('agent') || lower.includes('langgraph') || lower.includes('tool')) {
      reply = `The Autonomous Agent system is built as a cyclic state graph in LangGraph with strict Pydantic v2 boundary schemas. It features sandboxed execution, step bounds, and human-in-the-loop review before any mutation actions are executed.`;
    } else if (lower.includes('local') || lower.includes('ollama') || lower.includes('quant')) {
      reply = `For on-premise and local inference, Ventura deploys quantized GGUF models (Q4_K_M and Q8_0) using vLLM and Ollama. With speculative decoding and PagedAttention, we achieve 68 tokens/sec on Llama-3.3-70B with a 62% reduction in memory footprint.`;
    } else if (lower.includes('eval') || lower.includes('metric') || lower.includes('benchmark')) {
      reply = `Our Model Evaluation Lab tests regression, toxicity, and retrieval groundedness across 650+ golden scenarios using automated dual-judge consensus and Ragas metrics before deployment.`;
    } else {
      reply = `Hello! I am Ventura's technical assistant. I can guide you through our production RAG pipelines, autonomous agent state machines, local quantized runtimes, or model evaluation benches. Feel free to explore the interactive AI Lab below!`;
    }

    return res.json({
      reply,
      source: 'ventura-knowledge-base',
      model: 'ventura-core-v1'
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Internal assistant service error' });
  }
});

// RAG Search Playground endpoint
app.post('/api/rag', (req: Request, res: Response) => {
  const { query } = req.body;
  const q = (query || '').toLowerCase().trim();

  // Score relevance against corpus
  const results = ragCorpus.map(doc => {
    let score = 0.5;
    const words = q.split(/\s+/).filter(Boolean);
    for (const w of words) {
      if (doc.title.toLowerCase().includes(w)) score += 0.15;
      if (doc.content.toLowerCase().includes(w)) score += 0.1;
      if (doc.section.toLowerCase().includes(w)) score += 0.12;
    }
    score = Math.min(0.98, Math.max(0.65, score * (doc.embeddingDistance || 0.85)));
    return {
      ...doc,
      score: Number(score.toFixed(3))
    };
  }).sort((a, b) => b.score - a.score);

  const topDocs = results.slice(0, 3);
  const synthesizedAnswer = `Based on Ventura's indexed technical documentation, ${
    q.includes('local') || q.includes('quant')
      ? 'speculative decoding and GGUF quantization allow running 70B parameter models at 2.2x–2.8x speedup using a 1B draft model without numerical degradation [Doc 2, §4.3].'
      : q.includes('agent')
      ? 'production agent reliability is guaranteed by establishing bounded graph cycles, idempotent tool interfaces, and transactional human review gates [Doc 3, §3.2].'
      : 'hybrid dense-sparse retrieval paired with cross-encoder re-ranking achieves an 18.4% improvement in NDCG@10 over isolated bi-encoder embeddings at a modest 35ms latency overhead [Doc 1, §2.1].'
  }`;

  res.json({
    query: query || 'Semantic retrieval overview',
    latencyMs: Math.floor(Math.random() * 40) + 180,
    results: topDocs,
    answer: synthesizedAnswer,
    citations: topDocs.map(d => ({ title: d.title, section: d.section, score: d.score }))
  });
});

// Agent Execution Sandbox endpoint
app.post('/api/agent', (req: Request, res: Response) => {
  const { task } = req.body;
  const taskPrompt = task || 'Analyze arXiv paper on LoRA fine-tuning and calculate memory budget for 70B parameter model';

  const steps = [
    {
      step: 1,
      phase: 'Planning & Graph Routing',
      tool: 'AgentRouter',
      input: { task: taskPrompt },
      output: { plannedTools: ['ArXivSearch', 'PythonMemoryCalculator', 'SafetyValidator'], executionGraph: 'DAG-3-Node' },
      durationMs: 42,
      status: 'completed'
    },
    {
      step: 2,
      phase: 'Information Retrieval',
      tool: 'ArXivSearch',
      input: { query: 'LoRA Low-Rank Adaptation 70B VRAM formula' },
      output: {
        paperId: 'arXiv:2106.09685',
        parameters: 'r=16, alpha=32, target_modules=[q_proj, v_proj]',
        baseWeightsFP16: '140 GB',
        loraWeightsExtra: '~0.65 GB'
      },
      durationMs: 120,
      status: 'completed'
    },
    {
      step: 3,
      phase: 'Deterministic Calculation',
      tool: 'PythonMemoryCalculator',
      input: { baseBits: 4, loraRank: 16, contextLen: 4096, batchSize: 2 },
      output: {
        quantizedBaseVRAM: '39.2 GB',
        adapterVRAM: '0.65 GB',
        kvCacheVRAM: '4.8 GB',
        activationVRAM: '3.1 GB',
        totalRecommendedVRAM: '47.75 GB (Fit in 1x A6000 48GB or 2x RTX 4090 24GB)'
      },
      durationMs: 35,
      status: 'completed'
    },
    {
      step: 4,
      phase: 'Safety & Guardrail Verification',
      tool: 'SafetyValidator',
      input: { constraintsChecked: ['VRAM Overcommit', 'OOM Danger Margin', 'FP16 Precision Invariants'] },
      output: { passed: true, safetyScore: 0.992, alertLevel: 'NOMINAL' },
      durationMs: 25,
      status: 'completed'
    }
  ];

  res.json({
    taskId: `task-${Date.now().toString(36)}`,
    task: taskPrompt,
    totalDurationMs: 222,
    state: 'SUCCESS',
    steps,
    finalResult: 'Execution converged in 4 steps. LoRA fine-tuning for 70B parameter models with 4-bit base weights requires 47.75 GB VRAM, deployable on a single 48GB workstation GPU without OOM hazard.'
  });
});

// Model Evaluation Matrix endpoint
app.get('/api/evaluate', (_req: Request, res: Response) => {
  const models = [
    {
      name: 'Gemini 3.8 Flash',
      provider: 'Google GenAI',
      mmluPro: '89.4%',
      gsm8k: '94.2%',
      ttftMs: 120,
      throughputTokPerSec: 142,
      costPerMillionTokens: '$0.075 / $0.30',
      hallucinationRate: '1.2%',
      recommendedUse: 'High-throughput RAG & Real-Time Multimodal Workflows'
    },
    {
      name: 'Llama 3.3 70B Instruct',
      provider: 'Meta / Local vLLM',
      mmluPro: '86.1%',
      gsm8k: '91.8%',
      ttftMs: 185,
      throughputTokPerSec: 68,
      costPerMillionTokens: 'Zero API (Hardware amortized)',
      hallucinationRate: '2.1%',
      recommendedUse: 'Air-Gapped Private Workloads & Self-Hosted Infrastructure'
    },
    {
      name: 'Mistral Large 2',
      provider: 'Mistral AI',
      mmluPro: '84.0%',
      gsm8k: '90.2%',
      ttftMs: 160,
      throughputTokPerSec: 85,
      costPerMillionTokens: '$2.00 / $6.00',
      hallucinationRate: '1.8%',
      recommendedUse: 'Multilingual Reasoning & Code Synthesis'
    },
    {
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      mmluPro: '88.7%',
      gsm8k: '93.5%',
      ttftMs: 210,
      throughputTokPerSec: 72,
      costPerMillionTokens: '$3.00 / $15.00',
      hallucinationRate: '1.4%',
      recommendedUse: 'Complex Agentic Planning & Architecture Reviews'
    }
  ];

  res.json({
    benchmarkDate: 'October 2026',
    evalDataset: 'GSM8K + MMLU-Pro + Custom RAG Groundedness Benchmark (650 items)',
    models
  });
});

// Local Models Status endpoint
app.get('/api/local-models', (_req: Request, res: Response) => {
  res.json({
    runtimeAvailable: true,
    runtimeType: 'Ollama / vLLM Edge Simulator',
    host: '127.0.0.1:11434',
    gpuDetected: 'NVIDIA RTX 4090 24GB (CUDA 12.4)',
    activeModels: [
      {
        name: 'llama3.3:70b-instruct-q4_K_M',
        sizeGb: 42.4,
        quantization: 'Q4_K_M',
        contextWindow: 131072,
        status: 'ready',
        vramUsageGb: 21.2
      },
      {
        name: 'mistral-nemo:12b-instruct-q8_0',
        sizeGb: 12.8,
        quantization: 'Q8_0',
        contextWindow: 32768,
        status: 'standby',
        vramUsageGb: 0
      },
      {
        name: 'bge-large-en-v1.5:fp16',
        sizeGb: 1.34,
        quantization: 'FP16',
        contextWindow: 512,
        status: 'loaded',
        vramUsageGb: 1.4
      }
    ]
  });
});

// Contact message endpoint
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address format.' });
  }

  console.log(`[Ventura Contact] Received message from ${name} (${email}): ${message.slice(0, 60)}...`);
  res.json({
    success: true,
    message: 'Your inquiry has been successfully received by Ventura. We will follow up promptly.'
  });
});

// Vite Middleware Integration for Development / Static Serve in Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Ventura] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Ventura server:', err);
  process.exit(1);
});
