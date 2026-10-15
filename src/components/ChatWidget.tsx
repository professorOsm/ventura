import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, RotateCcw, Copy, Check, MessageSquare, Bot, AlertCircle, Info } from 'lucide-react';
import { audioManager } from '../audio/AudioManager';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  source?: 'gemini-3.8-flash' | 'ventura-knowledge-base' | 'error';
  model?: string;
  timestamp: string;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: 'Hello! I am Ventura AI, your technical architecture assistant. I can explain Ventura\'s production RAG pipelines, autonomous agent state graphs, local quantized inference benchmarks, or evaluation criteria. What would you like to explore?',
      source: 'ventura-knowledge-base',
      model: 'Ventura Core AI',
      timestamp: 'Ready'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'How does your hybrid RAG reranker work?',
    'Explain the LangGraph agent safety sandbox',
    'What quantized models run in your local studio?',
    'What metrics are in your evaluation benchmark?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Analysis complete.',
        source: data.source === 'gemini-3.8-flash' ? 'gemini-3.8-flash' : 'ventura-knowledge-base',
        model: data.model || 'Gemini 3.8 Flash',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      audioManager.playSuccess();
    } catch (err) {
      console.error('Chat error:', err);
      audioManager.playError();
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'The assistant service encountered a temporary variance. You can still test all live pipelines and tools directly in the interactive AI Lab.',
        source: 'error',
        timestamp: 'Notice'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    audioManager.playHover();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    audioManager.playSelect();
    setMessages([
      {
        id: `rst-${Date.now()}`,
        sender: 'assistant',
        text: 'Conversation history reset. How can I assist with your technical evaluation?',
        source: 'ventura-knowledge-base',
        timestamp: 'Reset'
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-lg h-full bg-white dark:bg-[#182235] border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#536DFE] to-[#9361F5] flex items-center justify-center text-white shadow-sm">
              <Bot size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Ventura Assistant</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">LLM Architecture & Systems Guide</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              title="Clear Conversation"
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={onClose}
              title="Close Panel (Esc)"
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#536DFE] text-white font-medium rounded-tr-xs shadow-sm'
                    : 'bg-[#F1F5F9] dark:bg-[#202D42] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 rounded-tl-xs shadow-xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1 px-1 text-[11px] text-slate-400 dark:text-slate-500">
                <span>{msg.timestamp}</span>

                {/* Honest Transparency Label as requested by Section 4 */}
                {msg.sender === 'assistant' && msg.source === 'gemini-3.8-flash' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/40">
                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span>Gemini 3.8 Flash (Live Model)</span>
                  </span>
                )}
                {msg.sender === 'assistant' && msg.source === 'ventura-knowledge-base' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#536DFE] dark:text-[#818CF8] bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-800/40">
                    <span className="w-1 h-1 rounded-full bg-[#536DFE]" />
                    <span>Ventura Knowledge Base (Deterministic Demo Mode)</span>
                  </span>
                )}

                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors ml-1"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl max-w-[70%]">
              <Sparkles size={14} className="text-[#536DFE] animate-spin" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Synthesizing technical response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#111827]/60">
          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">Suggested Technical Topics:</p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => {
                  audioManager.playHover();
                  handleSendMessage(qp);
                }}
                className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-[#536DFE] dark:hover:text-[#818CF8] bg-white dark:bg-slate-800 hover:bg-blue-50/50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-left transition-colors whitespace-nowrap shadow-2xs"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#182235]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about Ventura's RAG, agents, or local models..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#536DFE] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 bg-[#536DFE] hover:bg-[#435bdb] disabled:opacity-40 text-white rounded-xl transition-colors shrink-0 shadow-sm"
              title="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
