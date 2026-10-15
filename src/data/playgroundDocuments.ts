/**
 * Sample Technical Corpus for Deterministic RAG & Semantic Search Demonstrations
 * Grounded in genuine LLM engineering architectures and benchmark methodologies.
 */

export interface TechnicalDocument {
  id: string;
  title: string;
  section: string;
  content: string;
  keywords: string[];
  embeddingVectorPreview: number[];
  category: 'rag' | 'inference' | 'agents' | 'infrastructure';
  metadata: {
    source: string;
    tokenCount: number;
    lastVerified: string;
  };
}

export const PLAYGROUND_DOCUMENTS: TechnicalDocument[] = [
  {
    id: 'doc-rag-01',
    title: 'Dense Retrieval vs Cross-Encoder Reranking in RAG Pipelines',
    section: '§2.1 Architecture & NDCG@10 Latency Trade-offs',
    content: 'Bi-encoder architectures (e.g., BGE-Large, Contriever) map queries and documents into independent dense vectors, enabling sub-30ms vector lookups via HNSW indices. However, bi-encoders cannot compute token-level cross-attention between query and passage. Integrating a cross-encoder reranker (e.g., FlashRank or BGE-Reranker-Large) on the top-50 candidates improves NDCG@10 by up to 18.4% while adding only 32ms–45ms of compute overhead.',
    keywords: ['cross-encoder', 'reranker', 'ndcg', 'bi-encoder', 'bge', 'flashrank', 'latency', 'hnsw', 'retrieval'],
    embeddingVectorPreview: [0.042, -0.018, 0.089, 0.031, -0.076, 0.112],
    category: 'rag',
    metadata: {
      source: 'Ventura AI Lab Technical Report #24-03',
      tokenCount: 88,
      lastVerified: 'October 2026'
    }
  },
  {
    id: 'doc-inf-02',
    title: 'Speculative Decoding with Quantized Open Weights (Llama 3.3 70B)',
    section: '§4.3 Draft Verification Dynamics & VRAM Footprint',
    content: 'Speculative decoding pairs an ultra-compact draft model (such as Llama-3.2-1B-Instruct) with a quantized 70B target model (Q4_K_M GGUF). The draft model generates K=4 candidate tokens sequentially in ~18ms, which the target model verifies simultaneously in a single forward pass via causal attention masking. With acceptance rates exceeding 72%, effective generation speed jumps from 24 tok/s to 68 tok/s on an RTX 4090 with zero mathematical quality degradation.',
    keywords: ['speculative decoding', 'quantization', 'gguf', 'vram', 'llama', 'throughput', 'draft model', 'tokens'],
    embeddingVectorPreview: [0.081, 0.045, -0.032, 0.094, -0.015, 0.063],
    category: 'inference',
    metadata: {
      source: 'Local Inference Optimization Benchmarks',
      tokenCount: 94,
      lastVerified: 'October 2026'
    }
  },
  {
    id: 'doc-agt-03',
    title: 'LangGraph Cyclic State Machine Invariants & Bounded Execution',
    section: '§3.2 Deterministic State Transitions & Sandboxed Tool Invocation',
    content: 'Unconstrained ReAct loops in multi-agent workflows suffer from infinite recursion when tool arguments fail or model responses drift. Enforcing production reliability requires three structural invariants: 1) Bound cyclic graph traversals (max_iterations=6); 2) Enforce idempotent execution checkpoints with unique task run IDs; 3) Insert human-in-the-loop review gates prior to executing any mutation or external payment API calls.',
    keywords: ['langgraph', 'agents', 'state machine', 'recursion', 'invariants', 'tool sandbox', 'human-in-the-loop'],
    embeddingVectorPreview: [-0.025, 0.072, 0.061, -0.048, 0.084, 0.019],
    category: 'agents',
    metadata: {
      source: 'Autonomous Systems Guardrail Specification',
      tokenCount: 79,
      lastVerified: 'October 2026'
    }
  },
  {
    id: 'doc-inf-04',
    title: 'Context Window Attention Sinks & Lost-in-the-Middle Mitigation',
    section: '§1.4 Hierarchical Document Summarization & Token Budgets',
    content: 'Even large foundation models with 1M+ token context windows suffer noticeable retrieval degradation when critical facts are buried in the middle 60% of an input prompt. Implementing contextual document chunking with hierarchical summarization and semantic query prefixing anchors key needles in the initial 15% of the attention distribution, dropping context retrieval errors from 34% to under 3.8%.',
    keywords: ['context window', 'attention sink', 'lost in the middle', 'chunking', 'summarization', 'needle', 'retrieval'],
    embeddingVectorPreview: [0.037, -0.052, 0.078, 0.021, -0.063, 0.091],
    category: 'rag',
    metadata: {
      source: 'Retrieval Fidelity & Long-Context Studies',
      tokenCount: 82,
      lastVerified: 'October 2026'
    }
  },
  {
    id: 'doc-inf-05',
    title: 'Grammar-Constrained JSON Schema Sampling via CFG Logit Processors',
    section: '§5.1 Deterministic Output Structuring & Zero-Violation Sampling',
    content: 'Prompting LLMs to "only return JSON" yields unpredictable schema failures under high concurrency. By compiling the JSON Schema into a Context-Free Grammar (CFG) finite state automaton, the token logits processor masks invalid continuation tokens before sampling occurs. This enforces 100% syntactic validity and eliminates parsing retries without degrading token generation latency.',
    keywords: ['json schema', 'grammar', 'logit processor', 'structured output', 'sampling', 'finite state automaton', 'cfg'],
    embeddingVectorPreview: [0.064, 0.019, -0.081, 0.053, 0.042, -0.038],
    category: 'infrastructure',
    metadata: {
      source: 'Reliable API Interfaces Working Paper',
      tokenCount: 76,
      lastVerified: 'October 2026'
    }
  }
];
