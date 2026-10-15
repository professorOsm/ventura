import React, { useEffect } from 'react';
import { X, Play, ArrowRight, CheckCircle2, Bot, Layers, Workflow, Terminal, GitBranch, ExternalLink } from 'lucide-react';
import { audioManager } from '../audio/AudioManager';

interface PresentationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection: (sectionId: string) => void;
  onOpenAssistant: () => void;
}

export const PresentationGuideModal: React.FC<PresentationGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSection,
  onOpenAssistant
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: "Ventura's Identity & Interactive Robot",
      sectionId: 'hero',
      icon: Bot,
      accent: 'text-[#536DFE] dark:text-[#818CF8]',
      bgAccent: 'bg-[#E8EEFF] dark:bg-[#818CF8]/15',
      talkingPoints: [
        'Demonstrate natural cursor head-tracking on the CRT-8000 robot (clamped ±12° yaw, ±6° pitch).',
        'Highlight subtle phosphor eye pupil tracking and independent eyelid blinking.',
        'Show responsive return to neutral pose when the mouse leaves the hero.',
        'Explain stationary chassis/cables engineering to avoid fake whole-scene rotation.'
      ]
    },
    {
      num: '02',
      title: 'Technical Skills & Production Projects',
      sectionId: 'projects',
      icon: Layers,
      accent: 'text-[#9361F5] dark:text-[#B69AFB]',
      bgAccent: 'bg-[#F0E8FF] dark:bg-[#B69AFB]/15',
      talkingPoints: [
        'Review the 6 core production case studies: RAG Engine, Autonomous Agents, Local LLM Studio, Multimodal AI, Evaluation Lab, and Automation.',
        'Explain the structured metrics: Precision@5, P95 latency (280ms), and 98.6% citation faithfulness.',
        'Click on any "Case Study" button to inspect detailed problem, solution, and pipeline diagrams.'
      ]
    },
    {
      num: '03',
      title: 'Deep Architecture & Technical Trade-offs',
      sectionId: 'about',
      icon: Workflow,
      accent: 'text-[#14B8A6] dark:text-[#5EEAD4]',
      bgAccent: 'bg-[#DDF8F4] dark:bg-[#5EEAD4]/15',
      talkingPoints: [
        'Discuss why hybrid dense + BM25 search with cross-encoder reranking beats naive single-vector search.',
        'Detail LangGraph cyclic state machines with Pydantic v2 validation and human approval checkpoints.',
        'Explain speculative decoding and GGUF quantization (Q4_K_M) saving 62% VRAM on local workstation hardware.'
      ]
    },
    {
      num: '04',
      title: 'Interactive AI Engineering Lab Showcase',
      sectionId: 'ai-lab',
      icon: Terminal,
      accent: 'text-[#FB923C] dark:text-[#FDBA74]',
      bgAccent: 'bg-[#FFF0E1] dark:bg-[#FDBA74]/15',
      talkingPoints: [
        'Run a live query in the RAG Pipeline: observe hybrid vector distance, cross-encoder reranking, and citation synthesis.',
        'Dispatch an Agent DAG task: inspect step-by-step tool invocation traces with millisecond execution timings.',
        'Switch to Local Studio to trigger real-time token streaming with live measured tok/sec throughput.'
      ]
    },
    {
      num: '05',
      title: 'Code Repositories, AI Assistant, & Live Evaluation',
      sectionId: 'contact',
      icon: GitBranch,
      accent: 'text-[#EC4899] dark:text-[#F9A8D4]',
      bgAccent: 'bg-[#FCE7F3] dark:bg-[#F9A8D4]/15',
      talkingPoints: [
        'Open the Ventura AI Assistant to demonstrate conversational question-answering over system architecture.',
        'Point to verified GitHub repositories, project source files, and contact dispatch.',
        'Conclude with production readiness, deterministic error boundaries, and benchmark rigor.'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-white dark:bg-[#182235] border border-slate-200 dark:border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#111827]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#E8EEFF] dark:bg-[#818CF8]/15 text-[#536DFE] dark:text-[#818CF8] text-[11px] font-mono font-semibold">
              <span>PRESENTATION WALKTHROUGH</span>
              <span aria-hidden="true">·</span>
              <span>5-STAGE DEMO FLOW</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
              Recruiter & Client Demo Guide
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

        {/* Walkthrough List */}
        <div className="p-6 sm:p-8 space-y-4 overflow-y-auto max-h-[75vh]">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Follow this 5-stage walkthrough when presenting Ventura in technical interviews, portfolio reviews, or architecture demonstrations. Click any stage to smoothly navigate to the live component.
          </p>

          <div className="space-y-3.5 pt-2">
            {steps.map((st) => {
              const IconComp = st.icon;
              return (
                <div
                  key={st.num}
                  className="p-5 bg-slate-50 dark:bg-[#111827]/60 border border-slate-200/70 dark:border-slate-800 rounded-2xl hover:border-[#536DFE]/40 dark:hover:border-[#818CF8]/40 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${st.bgAccent} ${st.accent} flex items-center justify-center font-bold shrink-0`}>
                        <IconComp size={18} />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">
                          STAGE {st.num}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {st.title}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        audioManager.playSelect();
                        onClose();
                        onNavigateToSection(st.sectionId);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#536DFE] hover:bg-[#435bdb] rounded-xl transition-all self-start sm:self-center shadow-xs shrink-0"
                    >
                      <span>Jump to Live Section</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pl-1">
                    {st.talkingPoints.map((tp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#536DFE] dark:text-[#818CF8] mt-0.5">·</span>
                        <span>{tp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#111827]">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Ventura LLM Engineer · High-Fidelity Walkthrough
          </span>

          <button
            onClick={() => {
              audioManager.playSelect();
              onClose();
              onOpenAssistant();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#536DFE] to-[#9361F5] rounded-xl shadow-xs hover:opacity-95"
          >
            <Bot size={15} />
            <span>Open Ventura AI Assistant</span>
          </button>
        </div>
      </div>
    </div>
  );
};
