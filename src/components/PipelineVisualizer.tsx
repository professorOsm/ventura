import React, { useState, useEffect } from 'react';
import {
  Workflow,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Code2,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';
import { PIPELINE_STAGES, PipelineStage } from '../data/pipelineStages';
import { audioManager } from '../audio/AudioManager';
import { motion, AnimatePresence } from 'framer-motion';

export const PipelineVisualizer: React.FC = () => {
  const [selectedStageId, setSelectedStageId] = useState<string>('stage-01');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isWalkthroughActive, setIsWalkthroughActive] = useState<boolean>(false);

  const selectedIndex = PIPELINE_STAGES.findIndex((s) => s.id === selectedStageId);
  const currentStage: PipelineStage = PIPELINE_STAGES[selectedIndex] || PIPELINE_STAGES[0];

  // Auto-advance walkthrough timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWalkthroughActive) {
      timer = setInterval(() => {
        setSelectedStageId((prevId) => {
          const idx = PIPELINE_STAGES.findIndex((s) => s.id === prevId);
          if (idx >= PIPELINE_STAGES.length - 1) {
            setIsWalkthroughActive(false);
            audioManager.playSuccess();
            return PIPELINE_STAGES[0].id;
          }
          audioManager.playHover();
          return PIPELINE_STAGES[idx + 1].id;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isWalkthroughActive]);

  const handleSelectStage = (id: string) => {
    audioManager.playSelect();
    setIsWalkthroughActive(false);
    setSelectedStageId(id);
  };

  const handleNextStage = () => {
    if (selectedIndex < PIPELINE_STAGES.length - 1) {
      audioManager.playSelect();
      setSelectedStageId(PIPELINE_STAGES[selectedIndex + 1].id);
    }
  };

  const handlePrevStage = () => {
    if (selectedIndex > 0) {
      audioManager.playSelect();
      setSelectedStageId(PIPELINE_STAGES[selectedIndex - 1].id);
    }
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentStage.codeSnippet);
      setCopiedCode(true);
      audioManager.playSuccess();
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const toggleWalkthrough = () => {
    audioManager.playSelect();
    setIsWalkthroughActive(!isWalkthroughActive);
  };

  return (
    <div className="space-y-6">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#536DFE] dark:text-[#818CF8]">
            <Workflow size={14} />
            <span>ARCHITECTURE SPECIFICATION</span>
            <span aria-hidden="true">·</span>
            <span>7 STAGES</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Deterministic RAG & Agent Pipeline
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Select any stage to inspect strict technical invariants, real payload formats, and verified implementation code.
          </p>
        </div>

        {/* Walkthrough Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleWalkthrough}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
              isWalkthroughActive
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white dark:bg-[#182235] text-[#536DFE] dark:text-[#818CF8] border-[#536DFE]/30 hover:bg-[#E8EEFF] dark:hover:bg-[#818CF8]/20'
            }`}
          >
            {isWalkthroughActive ? <Pause size={13} /> : <Play size={13} />}
            <span>{isWalkthroughActive ? 'Pause Walkthrough' : 'Interactive Flow Walkthrough'}</span>
          </button>
        </div>
      </div>

      {/* 7 Connected Stage Selector Track */}
      <div className="relative">
        <div className="overflow-x-auto pb-3 pt-1 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isSelected = stage.id === selectedStageId;
              const isPast = idx < selectedIndex;

              return (
                <React.Fragment key={stage.id}>
                  <button
                    onClick={() => handleSelectStage(stage.id)}
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls={`panel-${stage.id}`}
                    className={`group relative text-left p-3.5 rounded-2xl border transition-all min-w-[145px] max-w-[160px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#536DFE] ${
                      isSelected
                        ? 'bg-[#536DFE] dark:bg-[#536DFE] text-white border-[#435bdb] shadow-md scale-[1.02]'
                        : isPast
                        ? 'bg-slate-50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-[#536DFE]/50'
                        : 'bg-white dark:bg-[#182235] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className={isSelected ? 'text-white/80 font-bold' : 'text-[#536DFE] dark:text-[#818CF8] font-bold'}>
                        Step {stage.stepNumber}
                      </span>
                      {isPast && !isSelected && (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      )}
                    </div>
                    <div className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {stage.shortName}
                    </div>
                    <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                      {stage.category}
                    </div>
                  </button>

                  {idx < PIPELINE_STAGES.length - 1 && (
                    <div className="flex items-center px-0.5 text-slate-300 dark:text-slate-700 shrink-0">
                      <ArrowRight size={14} className={idx < selectedIndex ? 'text-[#536DFE] dark:text-[#818CF8]' : ''} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Context Panel for Selected Stage */}
      <div
        id={`panel-${currentStage.id}`}
        role="tabpanel"
        className="p-6 sm:p-8 bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl space-y-6 transition-colors backdrop-blur-sm"
      >
        {/* Stage Header Info */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#536DFE] dark:text-[#818CF8]">
              <span className="font-bold">STAGE {currentStage.stepNumber} OF 07</span>
              <span aria-hidden="true">·</span>
              <span className="uppercase">{currentStage.category}</span>
            </div>
            <h5 className="text-2xl font-bold text-slate-900 dark:text-white">
              {currentStage.title}
            </h5>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {currentStage.summary}
            </p>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center gap-2 self-start">
            <button
              onClick={handlePrevStage}
              disabled={selectedIndex === 0}
              aria-label="Previous pipeline stage"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182235] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="text-xs font-mono text-slate-500 px-1">
              {selectedIndex + 1} / {PIPELINE_STAGES.length}
            </span>
            <button
              onClick={handleNextStage}
              disabled={selectedIndex === PIPELINE_STAGES.length - 1}
              aria-label="Next pipeline stage"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182235] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Technical Invariants & Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Key Invariants */}
          <div className="p-4 bg-white dark:bg-[#182235] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#536DFE] dark:text-[#818CF8]" />
              <span>Production Invariants</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-sans">
              {currentStage.keyInvariants.map((inv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#536DFE] dark:text-[#818CF8] font-bold" aria-hidden="true">•</span>
                  <span>{inv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology Stack & Tooling */}
          <div className="p-4 bg-white dark:bg-[#182235] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-[#536DFE] dark:text-[#818CF8]" />
              <span>Engine Stack & Protocols</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {currentStage.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sample Payload Walkthrough (Input vs Output) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-[#182235] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              Input Payload
            </div>
            <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {currentStage.sampleInput}
            </pre>
          </div>

          <div className="p-4 bg-white dark:bg-[#182235] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
            <div className="text-[11px] font-mono text-[#536DFE] dark:text-[#818CF8] uppercase tracking-wider">
              Verified Output Payload
            </div>
            <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {currentStage.sampleOutput}
            </pre>
          </div>
        </div>

        {/* Code Snippet Implementation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
              <Terminal size={14} className="text-[#536DFE] dark:text-[#818CF8]" />
              <span className="font-bold">Verified Production Implementation:</span>
              <span className="text-slate-400 uppercase">({currentStage.language})</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#182235] border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              {copiedCode ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
            <code>{currentStage.codeSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
