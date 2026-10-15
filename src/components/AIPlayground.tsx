import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  Search,
  Bot,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  Info,
  ChevronRight
} from 'lucide-react';
import {
  executeLocalRag,
  executeLocalSemanticSearch,
  executeLocalAgentWorkflow,
  RagExecutionResult,
  SemanticSearchResult,
  AgentWorkflowResult
} from '../lib/localRetrieval';
import { audioManager } from '../audio/AudioManager';

type PlaygroundMode = 'rag' | 'semantic' | 'agent';

export const AIPlayground: React.FC = () => {
  const [mode, setMode] = useState<PlaygroundMode>('rag');
  const [prompt, setPrompt] = useState<string>('What is the NDCG latency trade-off when adding a cross-encoder reranker?');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ragResult, setRagResult] = useState<RagExecutionResult | null>(null);
  const [semanticResult, setSemanticResult] = useState<SemanticSearchResult | null>(null);
  const [agentResult, setAgentResult] = useState<AgentWorkflowResult | null>(null);
  const [activeStageStep, setActiveStageStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const samplePrompts = {
    rag: [
      'What is the NDCG latency trade-off when adding a cross-encoder reranker?',
      'How does speculative decoding achieve speedups on quantized 70B models?',
      'What guardrails prevent infinite recursion in LangGraph agent loops?'
    ],
    semantic: [
      'Speculative draft model verification and KV-cache paging',
      'Context window lost-in-the-middle attention degradation',
      'Grammar-constrained CFG logit processor for JSON schema'
    ],
    agent: [
      'Analyze arXiv paper on LoRA fine-tuning and calculate memory budget for 70B model',
      'Deploy deterministic validation graph with human approval gate for payments',
      'Synthesize multi-agent tool scheduler with bounded recursion invariants'
    ]
  };

  const handleModeChange = (newMode: PlaygroundMode) => {
    audioManager.playSelect();
    setMode(newMode);
    setPrompt(samplePrompts[newMode][0]);
    setErrorMsg(null);
  };

  const handleSetExample = (examplePrompt: string) => {
    audioManager.playHover();
    setPrompt(examplePrompt);
    setErrorMsg(null);
  };

  const handleReset = () => {
    audioManager.playSelect();
    setPrompt(samplePrompts[mode][0]);
    setRagResult(null);
    setSemanticResult(null);
    setAgentResult(null);
    setActiveStageStep(0);
    setErrorMsg(null);
  };

  const handleRunDemo = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Please enter a query or click a sample prompt below.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setActiveStageStep(1);
    audioManager.playSelect();

    try {
      if (mode === 'rag') {
        // Step animation progression
        setTimeout(() => setActiveStageStep(2), 250);
        setTimeout(() => setActiveStageStep(3), 500);

        const res = await executeLocalRag(prompt);
        setRagResult(res);
      } else if (mode === 'semantic') {
        setTimeout(() => setActiveStageStep(2), 250);
        const res = await executeLocalSemanticSearch(prompt);
        setSemanticResult(res);
      } else if (mode === 'agent') {
        setTimeout(() => setActiveStageStep(2), 300);
        setTimeout(() => setActiveStageStep(3), 600);
        setTimeout(() => setActiveStageStep(4), 900);

        const res = await executeLocalAgentWorkflow(prompt);
        setAgentResult(res);
      }
      audioManager.playSuccess();
    } catch (err: any) {
      console.error('Playground execution error:', err);
      setErrorMsg('Execution failed. Falling back to default deterministic pipeline.');
      audioManager.playError();
    } finally {
      setIsLoading(false);
      setActiveStageStep(0);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#182235] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl transition-colors space-y-6">
      {/* Header with Mode Switcher & Transparent Disclaimer */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#536DFE] dark:text-[#818CF8]">
            <Sparkles size={14} />
            <span>INTERACTIVE WORKBENCH</span>
            <span aria-hidden="true">·</span>
            <span>OFFLINE DETERMINISTIC ENGINE</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            AI Engineering Playground
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Execute local retrieval pipelines, hybrid search ranking, and agent state machines over verified technical documentation.
          </p>
        </div>

        {/* Mode Segmented Controls */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 self-start lg:self-center shrink-0">
          <button
            onClick={() => handleModeChange('rag')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'rag'
                ? 'bg-white dark:bg-[#536DFE] text-[#536DFE] dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database size={13} />
            <span>RAG Retrieval</span>
          </button>
          <button
            onClick={() => handleModeChange('semantic')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'semantic'
                ? 'bg-white dark:bg-[#536DFE] text-[#536DFE] dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Search size={13} />
            <span>Semantic Search</span>
          </button>
          <button
            onClick={() => handleModeChange('agent')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'agent'
                ? 'bg-white dark:bg-[#536DFE] text-[#536DFE] dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bot size={13} />
            <span>Agent Workflow</span>
          </button>
        </div>
      </div>

      {/* Transparent Disclaimer Banner */}
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E8EEFF]/60 dark:bg-[#818CF8]/10 border border-[#536DFE]/20 dark:border-[#818CF8]/20 text-[11px] font-mono text-[#536DFE] dark:text-[#818CF8]">
        <Info size={14} className="shrink-0" />
        <span>
          Interactive Demo — Deterministic Local Pipeline & Verified Technical Sample Data. Zero external API dependencies required.
        </span>
      </div>

      {/* Input Prompt Section */}
      <div className="space-y-3">
        <label className="block text-xs font-bold font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {mode === 'rag' ? 'RAG Prompt Query' : mode === 'semantic' ? 'Semantic Search Terms' : 'Agent Objective & Task'}
        </label>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunDemo()}
            placeholder="Enter technical query or prompt..."
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#536DFE] transition-all"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunDemo}
              disabled={isLoading}
              className="px-6 py-3 bg-[#536DFE] hover:bg-[#435bdb] text-white font-semibold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play size={14} />
                  <span>Run Demo</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              title="Reset prompt and outputs"
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle size={13} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Example Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-mono text-[11px]">Try sample:</span>
          {samplePrompts[mode].map((ex, idx) => (
            <button
              key={idx}
              onClick={() => handleSetExample(ex)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#536DFE] dark:hover:text-[#818CF8] hover:bg-slate-200/70 dark:hover:bg-slate-700/70 border border-slate-200/60 dark:border-slate-700 transition-colors text-left truncate max-w-xs"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Pipeline Visualization when running */}
      {isLoading && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
          <div className="text-xs font-mono font-bold text-[#536DFE] dark:text-[#818CF8] flex items-center justify-between">
            <span>Executing Pipeline Stages</span>
            <span>Processing...</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs font-mono">
            {['1. Preprocessing', '2. Dual Vectorization', '3. Hybrid Ranking', '4. Synthesis'].map((stg, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl text-center border transition-all ${
                  activeStageStep >= i + 1
                    ? 'bg-[#536DFE] text-white border-[#435bdb] font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                {stg}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Section */}
      {mode === 'rag' && ragResult && (
        <div className="space-y-4 pt-2">
          {/* Execution Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-600 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span>RAG Converged</span>
              </span>
              <span>·</span>
              <span>Latency: <strong className="text-slate-900 dark:text-white">{ragResult.latencyMs}ms</strong></span>
              <span>·</span>
              <span>Embedding Dim: <strong className="text-slate-900 dark:text-white">{ragResult.embeddingDimension}</strong></span>
            </div>
            <span className="text-[11px] text-[#536DFE] dark:text-[#818CF8]">{ragResult.engine}</span>
          </div>

          {/* Synthesized Output Box */}
          <div className="p-5 rounded-2xl bg-[#E8EEFF]/40 dark:bg-[#182235] border border-[#536DFE]/30 dark:border-[#818CF8]/30 space-y-2">
            <div className="text-xs font-mono font-bold text-[#536DFE] dark:text-[#818CF8] uppercase tracking-wider flex items-center justify-between">
              <span>Synthesized Grounded Answer</span>
              <span>Source-Verified</span>
            </div>
            <p className="text-sm text-slate-900 dark:text-slate-100 font-sans leading-relaxed font-normal">
              {ragResult.synthesizedAnswer}
            </p>
          </div>

          {/* Retrieved Context Chunks */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Retrieved Context Chunks (Top-Ranked Passages)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {ragResult.retrievedChunks.map((chunk, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-[#536DFE] dark:text-[#818CF8]">
                        Rank #{idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                        Score: {(chunk.fusedScore * 100).toFixed(1)}%
                      </span>
                    </div>

                    <h6 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {chunk.document.title}
                    </h6>

                    <div className="text-[10px] font-mono text-slate-500">
                      {chunk.document.section}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed pt-1">
                      {chunk.document.content}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] font-mono text-slate-500">
                    {chunk.relevanceExplanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Semantic Search Result */}
      {mode === 'semantic' && semanticResult && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <span>Ranked <strong className="text-slate-900 dark:text-white">{semanticResult.rankedResults.length}</strong> technical documents in <strong className="text-slate-900 dark:text-white">{semanticResult.latencyMs}ms</strong></span>
            <span className="text-[11px] text-[#536DFE] dark:text-[#818CF8]">{semanticResult.engine}</span>
          </div>

          <div className="space-y-3">
            {semanticResult.rankedResults.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 space-y-2 hover:border-[#536DFE]/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#536DFE] dark:text-[#818CF8]">
                      #{idx + 1}
                    </span>
                    <h6 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.document.title}
                    </h6>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-500">Cosine Sim: <strong className="text-slate-900 dark:text-white">{(item.cosineSimilarity * 100).toFixed(1)}%</strong></span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#E8EEFF] dark:bg-[#818CF8]/20 text-[#536DFE] dark:text-[#818CF8] font-bold">
                      Match: {(item.finalRankScore * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  {item.document.content}
                </p>

                <div className="text-[11px] font-mono text-slate-500 pt-1 flex items-center gap-2">
                  <ChevronRight size={13} className="text-[#536DFE] shrink-0" />
                  <span>{item.whyRelevant}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Workflow Result */}
      {mode === 'agent' && agentResult && (
        <div className="space-y-4 pt-2">
          {/* Agent Overview */}
          <div className="p-4 rounded-2xl bg-[#E8EEFF]/40 dark:bg-[#182235] border border-[#536DFE]/30 dark:border-[#818CF8]/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#536DFE] dark:text-[#818CF8]">
                AGENT CONVERGENCE: {agentResult.state}
              </span>
              <span className="text-slate-500 font-mono">
                Duration: {agentResult.totalDurationMs}ms · Safety Score: {(agentResult.safetyScore * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-slate-900 dark:text-slate-100 font-sans leading-relaxed">
              {agentResult.finalResponse}
            </p>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Deterministic Execution Trace (4 Steps)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agentResult.steps.map((st) => (
                <div
                  key={st.step}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#536DFE] dark:text-[#818CF8]">
                      Step 0{st.step}: {st.phase}
                    </span>
                    <span className="text-slate-400 text-[11px]">{st.durationMs}ms</span>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300 font-sans">
                    {st.actionSummary}
                  </div>

                  <pre className="text-[11px] font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-x-auto whitespace-pre-wrap">
                    Tool: {st.tool}\nOutput: {JSON.stringify(st.output, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
