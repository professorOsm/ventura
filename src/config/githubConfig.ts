/**
 * Ventura GitHub & Project Showcase Configuration
 * 
 * IMPORTANT: To link your live GitHub profile, replace '[CONFIGURE_MY_GITHUB_USERNAME]'
 * with your personal or organization GitHub username (e.g. 'usmansami').
 * The profile URL, repository links, and showcase actions will automatically derive from it.
 */

export const GITHUB_CONFIG = {
  // GitHub username: [CONFIGURE_MY_GITHUB_USERNAME]
  username: '[CONFIGURE_MY_GITHUB_USERNAME]',

  // GitHub profile: https://github.com/[CONFIGURE_MY_GITHUB_USERNAME]
  get profileUrl(): string {
    if (!this.username || this.username === '[CONFIGURE_MY_GITHUB_USERNAME]') {
      return 'https://github.com/[CONFIGURE_MY_GITHUB_USERNAME]';
    }
    return `https://github.com/${this.username}`;
  },

  get isConfigured(): boolean {
    return Boolean(this.username && this.username.trim() !== '' && this.username !== '[CONFIGURE_MY_GITHUB_USERNAME]');
  },

  getRepoUrl(slug: string): string {
    if (this.isConfigured) {
      return `https://github.com/${this.username}/${slug}`;
    }
    return `https://github.com/[CONFIGURE_MY_GITHUB_USERNAME]/${slug}`;
  }
};

export interface ShowcaseProject {
  id: string;
  name: string;
  repoSlug: string;
  category: 'LLM & RAG' | 'AI Agents' | 'Local Inference' | 'Multimodal AI' | 'MLOps & Eval' | 'Infrastructure';
  description: string;
  architectureHighlight: string;
  technologies: string[];
  status: 'production' | 'demonstration' | 'prototype' | 'research';
  keyMetric: { label: string; value: string };
  demoSectionId: string;
  accentColor: 'blue' | 'violet' | 'teal' | 'orange' | 'pink' | 'cyan';
}

export const VERIFIED_PROJECTS: ShowcaseProject[] = [
  {
    id: 'rag-intelligence-engine',
    name: 'RAG Intelligence Engine',
    repoSlug: 'rag-intelligence-engine',
    category: 'LLM & RAG',
    description: 'Hierarchical document chunking, hybrid BM25 + dense vector embeddings with cross-encoder reranking and verified source attribution.',
    architectureHighlight: 'BGE Dense Embeddings → Qdrant HNSW Index → Reciprocal Rank Fusion → FlashRank Cross-Encoder',
    technologies: ['Python', 'Qdrant', 'FastAPI', 'Gemini 3.8', 'BGE Embeddings', 'DSPy'],
    status: 'production',
    keyMetric: { label: 'Retrieval Precision@5', value: '94.2%' },
    demoSectionId: 'ai-lab',
    accentColor: 'blue'
  },
  {
    id: 'autonomous-agent-workflows',
    name: 'Autonomous Agent Workflows',
    repoSlug: 'agent-workflows',
    category: 'AI Agents',
    description: 'Cyclic state-graph agent system with deterministic tool verification, dynamic sandboxing, and human-in-the-loop escalation boundaries.',
    architectureHighlight: 'LangGraph State Machine → Pydantic v2 Schema Validator → Sandboxed Tool Runtime',
    technologies: ['TypeScript', 'Python', 'LangGraph', 'Gemini Tools', 'PostgreSQL', 'Redis'],
    status: 'production',
    keyMetric: { label: 'Task Success Rate', value: '91.8%' },
    demoSectionId: 'ai-lab',
    accentColor: 'violet'
  },
  {
    id: 'local-llm-studio',
    name: 'Local LLM Studio',
    repoSlug: 'local-llm-studio',
    category: 'Local Inference',
    description: 'Hardware-optimized local model deployment featuring dynamic quantization (GGUF Q4_K_M/Q8_0), speculative decoding, and continuous batching.',
    architectureHighlight: 'Ollama API / vLLM Server → PagedAttention KV Cache → Speculative Drafting Engine',
    technologies: ['C++', 'Ollama', 'vLLM', 'CUDA', 'Python', 'Prometheus'],
    status: 'demonstration',
    keyMetric: { label: 'Token Throughput', value: '68 tok/s' },
    demoSectionId: 'ai-lab',
    accentColor: 'teal'
  },
  {
    id: 'multimodal-ai-explorer',
    name: 'Multimodal AI Explorer',
    repoSlug: 'multimodal-explorer',
    category: 'Multimodal AI',
    description: 'End-to-end OCR-free extraction of complex financial broadsheets, engineering blueprints, and circuit schematics into validated JSON schemas.',
    architectureHighlight: 'PDF Splitting → High-DPI Rasterizer → Gemini Vision Multimodal Retrieval → JSON Schema Enforcement',
    technologies: ['Python', 'Gemini Vision', 'PyMuPDF', 'Pydantic v2', 'OpenCV'],
    status: 'production',
    keyMetric: { label: 'Extraction Accuracy', value: '97.4%' },
    demoSectionId: 'ai-lab',
    accentColor: 'orange'
  },
  {
    id: 'model-evaluation-lab',
    name: 'Model Evaluation Lab',
    repoSlug: 'model-eval-lab',
    category: 'MLOps & Eval',
    description: 'Automated CI/CD benchmarking framework measuring semantic drift, toxicity, prompt injection vulnerabilities, and retrieval grounding.',
    architectureHighlight: 'GitHub Actions CI → Test Harness → Dual-Judge Consensus → Ragas Groundedness Metrics',
    technologies: ['Python', 'Ragas', 'DeepEval', 'Pytest', 'GitHub Actions'],
    status: 'production',
    keyMetric: { label: 'Regression Detection', value: '100%' },
    demoSectionId: 'ai-lab',
    accentColor: 'pink'
  },
  {
    id: 'ai-automation-systems',
    name: 'AI Automation Systems',
    repoSlug: 'ai-automation-systems',
    category: 'Infrastructure',
    description: 'Serverless event streaming pipeline combining Kafka topics, dead-letter queues, and deterministic LLM workers for automated triage.',
    architectureHighlight: 'Kafka Topics → Rate-Limiting Shaper → LLM Worker Pools → Dead Letter Queue',
    technologies: ['Node.js', 'Kafka', 'Redis', 'Docker', 'OpenTelemetry'],
    status: 'production',
    keyMetric: { label: 'Daily Event Throughput', value: '1.2M events' },
    demoSectionId: 'ai-lab',
    accentColor: 'cyan'
  }
];
