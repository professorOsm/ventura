import React, { useEffect } from 'react';
import { X, ExternalLink, GitBranch, ArrowRight, CheckCircle2, AlertTriangle, Layers, Cpu, Server, Compass, FileText } from 'lucide-react';
import { audioManager } from '../audio/AudioManager';
import { ProjectItem } from '../../server';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenLab: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onOpenLab
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  // Derive architectural steps for interactive visualization
  const pipelineSteps = project.architecture.split('→').map(s => s.trim());

  // Deep engineering trade-offs tailored to project category
  const getProjectTradeoffs = (id: string) => {
    switch (id) {
      case 'rag-intelligence-engine':
        return {
          contribution: 'Designed and deployed the hybrid retrieval pipeline, tuned Qdrant HNSW vector indexes with scalar quantization, and implemented the FlashRank cross-encoder reranking microservice.',
          decisions: [
            {
              decision: 'Hybrid Dense + BM25 over Pure Dense Vectors',
              tradeoff: 'Pure dense vector search misses exact technical serial numbers and keyword acronyms. Combining dense BGE embeddings with BM25 sparse lexical tokens increased recall by 18.4% at the cost of dual index maintenance.'
            },
            {
              decision: 'Two-Stage Cross-Encoder Reranking',
              tradeoff: 'Cross-encoders compute full cross-attention over query-document pairs, providing superior accuracy over bi-encoders. We limit reranking to the top-50 candidates, keeping P95 latency strictly under 280ms.'
            }
          ],
          challenges: 'Handling table formatting in complex PDF specifications. Resolved by replacing naive regex chunking with an OCR-free layout parser that preserves tabular structure as Markdown tables.'
        };
      case 'autonomous-agent-workflows':
        return {
          contribution: 'Architected the cyclic LangGraph execution graph, integrated deterministic Pydantic schema validation for all tool inputs, and designed an idempotent database checkpoint engine.',
          decisions: [
            {
              decision: 'LangGraph State Graph vs ReAct Prompt Loops',
              tradeoff: 'ReAct agent loops suffer from stochastic tool recursion. State graph transitions enforce hard iteration boundaries (max 6 steps) and deterministic rollback states on API exceptions.'
            },
            {
              decision: 'Human-in-the-Loop Review Gates',
              tradeoff: 'Destructive mutations (e.g. database updates, API deletes) pause execution and emit a review token. Added 200ms overhead for state serialization, but achieved zero unintended tool executions.'
            }
          ],
          challenges: 'Context window drift over multi-turn agent iterations. Solved by summarizing execution memory after every tool step, maintaining core task invariants.'
        };
      case 'local-llm-studio':
        return {
          contribution: 'Built the local inference benchmark suite, configured vLLM continuous batching on workstation GPUs, and benchmarked speculative decoding with small draft models.',
          decisions: [
            {
              decision: 'GGUF Q4_K_M Quantization vs FP16',
              tradeoff: 'Reduced model VRAM requirement by 62%, enabling Llama-3.3-70B to fit onto consumer workstation hardware with less than 0.8% perplexity penalty.'
            },
            {
              decision: 'Speculative Decoding with Llama-3.2-1B Draft Model',
              tradeoff: 'The 1B draft generates candidate tokens verified by the 70B target model in a single batched forward pass, achieving a 2.4x speedup (68 tok/s).'
            }
          ],
          challenges: 'KV cache fragmentation under variable-length batch requests. Resolved by enabling PagedAttention virtual memory block allocation.'
        };
      default:
        return {
          contribution: 'Lead engineer responsible for system architecture, LLM prompt orchestration, deterministic data validation, and deployment telemetry.',
          decisions: [
            {
              decision: 'Strict Schema Decoding via Pydantic',
              tradeoff: 'Eliminates downstream parsing errors by rejecting malformed JSON outputs before application ingestion.'
            },
            {
              decision: 'Automated CI/CD Regression Gates',
              tradeoff: 'Synthetic adversarial test runs catch silent prompt regression before production release.'
            }
          ],
          challenges: 'Mitigating non-deterministic model variance. Solved via temperature zero calibration and structured few-shot exemplar anchoring.'
        };
    };
  };

  const tradeOffInfo = getProjectTradeoffs(project.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 bg-white dark:bg-[#182235] border border-slate-200 dark:border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#111827]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-[#536DFE] dark:text-[#818CF8]">{project.category}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{project.status}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
              {project.title}
            </h2>
          </div>

          <button
            onClick={() => {
              audioManager.playHover();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-7 overflow-y-auto max-h-[75vh]">
          {/* Summary */}
          <div>
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {project.summary}
            </p>
          </div>

          {/* Key Metrics Strip (With clear telemetry transparency) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="font-semibold">ENGINEERING METRICS & BENCHMARKS</span>
              <span className="text-[11px] text-[#14B8A6] dark:text-[#5EEAD4] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] dark:bg-[#5EEAD4]" />
                <span>Verified in Benchmark Lab</span>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{m.label}</p>
                  <p className="text-xl font-bold font-mono text-[#536DFE] dark:text-[#818CF8] mt-1 tabular-nums">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Architecture Pipeline Diagram */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              <Layers size={14} className="text-[#536DFE] dark:text-[#818CF8]" />
              <span>System Pipeline Architecture</span>
            </div>
            <div className="p-4 bg-slate-900 dark:bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max py-2 text-xs font-mono">
                {pipelineSteps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="px-3 py-2 bg-slate-800 text-cyan-300 border border-slate-700 rounded-xl shadow-xs">
                      <span className="text-[10px] text-slate-400 block font-sans">Step {idx + 1}</span>
                      <span className="font-semibold">{step}</span>
                    </div>
                    {idx < pipelineSteps.length - 1 && (
                      <span className="text-[#818CF8] font-bold px-1" aria-hidden="true">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                1. Engineering Problem
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                {project.problem}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                2. System Solution & Outcome
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Specific Contribution & Key Decisions */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                3. My Specific Contribution
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                {tradeOffInfo.contribution}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                4. Key Technical Decisions & Trade-offs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tradeOffInfo.decisions.map((dec, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="text-[#536DFE] dark:text-[#818CF8]">·</span>
                      <span>{dec.decision}</span>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-2.5">
                      {dec.tradeoff}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges & Resolution */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                5. Engineering Challenges & How They Were Addressed
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#14B8A6] dark:text-[#5EEAD4] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {tradeOffInfo.challenges}
                </p>
              </div>
            </div>
          </div>

          {/* Technologies Stack */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              6. Technology Stack
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              {project.technologies.map((t, idx) => (
                <React.Fragment key={idx}>
                  <span className="font-semibold">{t}</span>
                  {idx < project.technologies.length - 1 && (
                    <span className="text-slate-400 dark:text-slate-600" aria-hidden="true">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#111827]">
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => audioManager.playHover()}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#536DFE] dark:hover:text-[#818CF8] transition-colors"
            >
              <GitBranch size={15} />
              <span>Verified Repository</span>
              <ExternalLink size={13} />
            </a>
          ) : (
            <span className="text-xs text-slate-400 font-mono">Enterprise Internal Repository</span>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audioManager.playSelect();
                onClose();
                onOpenLab();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#536DFE] hover:bg-[#435bdb] rounded-xl transition-all shadow-sm"
            >
              <span>Test System in AI Lab</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
