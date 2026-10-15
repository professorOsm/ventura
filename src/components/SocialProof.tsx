import React from 'react';
import {
  ShieldCheck,
  GitBranch,
  Terminal,
  FileCode2,
  ExternalLink,
  Cpu,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { GITHUB_CONFIG } from '../config/githubConfig';
import { audioManager } from '../audio/AudioManager';

export const SocialProof: React.FC = () => {
  const verifiedPractices = [
    {
      title: 'Deterministic State Graphs',
      metric: 'LangGraph + Pydantic v2',
      description: 'Production agent systems with bounded graph cycles, idempotent keys, and human-in-the-loop review boundaries.'
    },
    {
      title: 'Hybrid Lexical + Vector Search',
      metric: 'BGE-Large + BM25 + Qdrant',
      description: 'Reciprocal Rank Fusion paired with FlashRank cross-encoder reranking to achieve sub-45ms retrieval SLAs.'
    },
    {
      title: 'Air-Gapped Local Inference',
      metric: 'vLLM + GGUF Quantization',
      description: 'Speculative draft decoding on edge workstations with PagedAttention KV-cache optimization.'
    },
    {
      title: 'Regression & Groundedness CI/CD',
      metric: 'Ragas + Pytest Synthetic Fuzzing',
      description: 'Continuous evaluation measuring semantic drift and hallucination guardrails across 650+ golden scenarios.'
    }
  ];

  return (
    <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto border-t border-[#E2E8F0]/80 dark:border-[#334155]/80 transition-colors">
      <div className="space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#536DFE] dark:text-[#818CF8]">
          <ShieldCheck size={14} />
          <span>TECHNICAL VALIDATION & RIGOR</span>
        </div>

        <h3 className="text-3xl sm:text-4xl font-extrabold text-[#172033] dark:text-[#F8FAFC] tracking-tight">
          Engineering Credibility & Verifiable Standards
        </h3>

        <p className="text-sm sm:text-base text-[#64748B] dark:text-[#CBD5E1] max-w-3xl font-normal leading-relaxed">
          Grounded exclusively in open-source engineering standards, reproducible benchmarks, and verifiable architecture patterns. Zero fabricated reviews or unverified metrics.
        </p>
      </div>

      {/* Grid of Verified Architectural Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {verifiedPractices.map((prac, idx) => (
          <div
            key={idx}
            className="p-6 bg-white/90 dark:bg-[#182235]/90 backdrop-blur-md border border-[#E2E8F0] dark:border-[#334155] rounded-3xl shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#E8EEFF] dark:bg-[#818CF8]/20 text-[#536DFE] dark:text-[#818CF8] flex items-center justify-center font-bold">
                <CheckCircle2 size={16} />
              </div>

              <h4 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC]">
                {prac.title}
              </h4>

              <div className="text-xs font-mono font-semibold text-[#536DFE] dark:text-[#818CF8]">
                {prac.metric}
              </div>

              <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                {prac.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0]/60 dark:border-[#334155]/60 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
              <Terminal size={12} />
              <span>Production Pattern</span>
            </div>
          </div>
        ))}
      </div>

      {/* Verified Open Source & Architecture Documentation Banner */}
      <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-900/70 border border-[#E2E8F0] dark:border-[#334155] flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-sm">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-mono font-bold text-[#536DFE] dark:text-[#818CF8]">
            REPRODUCIBLE CODEBASE & REPOSITORIES
          </div>
          <h4 className="text-xl font-bold text-[#172033] dark:text-[#F8FAFC]">
            Inspect the Code, Test Harnesses, and Architecture Records
          </h4>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
            Every pipeline stage and agent graph highlighted on Ventura can be cloned, verified with local Pytest harnesses, and benchmarked against your private datasets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={GITHUB_CONFIG.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioManager.playHover()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#172033] dark:bg-white text-white dark:text-[#172033] font-semibold text-xs sm:text-sm transition-all shadow-sm hover:opacity-90"
          >
            <GitBranch size={16} />
            <span>Open Source Repositories</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </section>
  );
};
