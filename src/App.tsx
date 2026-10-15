import React, { useState, useEffect } from 'react';
import { Navbar, ThemeMode, WhatsAppIcon } from './components/Navbar';
import { RobotHero } from './components/RobotHero';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { EngineeringLab } from './components/EngineeringLab';
import { ChatWidget } from './components/ChatWidget';
import { PresentationGuideModal } from './components/PresentationGuideModal';
import { SocialProof } from './components/SocialProof';
import { SystemStatus } from './components/SystemStatus';
import { audioManager } from './audio/AudioManager';
import { Locale, translations } from './i18n/translations';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { ProjectItem } from '../server';
import { motion, useReducedMotion } from 'framer-motion';
import { GITHUB_CONFIG, VERIFIED_PROJECTS } from './config/githubConfig';
import { WHATSAPP_CONFIG } from './config/whatsappConfig';
import {
  Sparkles,
  GitBranch,
  ArrowRight,
  Send,
  Mail,
  CheckCircle2,
  ExternalLink,
  Layers,
  Cpu,
  Database,
  Terminal,
  Code2,
  Server,
  Workflow,
  BarChart2,
  ShieldCheck,
  Presentation,
  Settings
} from 'lucide-react';

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [effectiveDark, setEffectiveDark] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(audioManager.getSoundEnabled());
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [locale, setLocale] = useState<Locale>('en');
  const [projectCategory, setProjectCategory] = useState<string>('all');
  const shouldReduceMotion = useReducedMotion();

  // Modals & Chat
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Projects data loaded from server
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  // Contact form state
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactSending, setContactSending] = useState<boolean>(false);
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const t = translations[locale];

  // 1. Initial theme & locale retrieval
  useEffect(() => {
    const savedTheme = localStorage.getItem('ventura_theme_mode') as ThemeMode | null;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeMode(savedTheme);
    } else {
      setThemeMode('light');
    }

    const savedLocale = localStorage.getItem('ventura_locale') as Locale | null;
    if (savedLocale && ['en', 'ur'].includes(savedLocale)) {
      setLocale(savedLocale);
    }
  }, []);

  // 2. Authoritative Theme Resolution & DOM Synchronization (zero flash)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const resolveAndApplyTheme = () => {
      let isDark = false;
      if (themeMode === 'system') {
        isDark = mediaQuery.matches;
      } else {
        isDark = themeMode === 'dark';
      }

      setEffectiveDark(isDark);
      const themeString = isDark ? 'dark' : 'light';

      document.documentElement.setAttribute('data-theme', themeString);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      document.documentElement.style.colorScheme = themeString;
      localStorage.setItem('ventura_theme_mode', themeMode);
    };

    resolveAndApplyTheme();

    const handleSystemChange = () => {
      if (themeMode === 'system') {
        resolveAndApplyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [themeMode]);

  // Handle locale toggle
  const handleToggleLocale = () => {
    audioManager.playSelect();
    const nextLocale = locale === 'en' ? 'ur' : 'en';
    setLocale(nextLocale);
    localStorage.setItem('ventura_locale', nextLocale);
    document.documentElement.lang = nextLocale;
    document.documentElement.dir = nextLocale === 'ur' ? 'rtl' : 'ltr';
  };

  // Load Projects from server
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error('Failed to load projects:', err));
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const sectionIds = ['hero', 'projects', 'ai-lab', 'about', 'skills', 'contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSound = () => {
    const next = audioManager.toggleSound();
    setSoundEnabled(next);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);
    setContactSending(true);
    audioManager.playSelect();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }
      setContactSuccess(true);
      audioManager.playSuccess();
    } catch (err: any) {
      setContactError(err.message);
      audioManager.playError();
    } finally {
      setContactSending(false);
    }
  };

  return (
    <div
      dir={locale === 'ur' ? 'rtl' : 'ltr'}
      className="relative min-h-screen overflow-x-hidden bg-[#F8FAFC] dark:bg-[#111827] text-[#172033] dark:text-[#F8FAFC] transition-colors font-sans selection:bg-[#536DFE]/20 selection:text-[#536DFE]"
    >
      {/* Ventura AI Engineering Layered Atmospheric Background */}
      <AtmosphericBackground isDark={effectiveDark} />

      {/* Primary Responsive Navigation */}
      <Navbar
        themeMode={themeMode}
        effectiveDark={effectiveDark}
        soundEnabled={soundEnabled}
        onSelectTheme={setThemeMode}
        onToggleSound={handleToggleSound}
        onOpenChat={() => setIsChatOpen(true)}
        activeSection={activeSection}
        locale={locale}
        onToggleLocale={handleToggleLocale}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Main Content Flow with Natural Scrolling */}
      <main className="relative z-10 pt-16">
        {/* ==================== SECTION 1 — HERO ==================== */}
        <section
          id="hero"
          className="min-h-[calc(100vh-4rem)] flex items-center px-6 sm:px-12 lg:px-24 py-16 max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
            {/* Left Column (Text & CTAs) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EEFF] dark:bg-[#818CF8]/15 border border-[#536DFE]/20 dark:border-[#818CF8]/30 text-xs font-mono font-semibold text-[#536DFE] dark:text-[#818CF8]">
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-[#172033] dark:text-[#F8FAFC]" style={{ textWrap: 'balance' }}>
                {t.hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-[#64748B] dark:text-[#CBD5E1] leading-relaxed max-w-2xl font-normal overflow-visible break-normal">
                {t.hero.subheadline}
              </p>

              {/* CTAs: Primary 'Explore My Work' & Secondary 'Ask Ventura AI' + 'Let's Connect' */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    audioManager.playSelect();
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-[#536DFE] hover:bg-[#435bdb] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#536DFE] rounded-2xl transition-all shadow-md transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
                  aria-label="Explore My Work - Scroll to projects showcase"
                >
                  <span>{t.hero.ctaWork}</span>
                  <ArrowRight size={15} />
                </a>

                <button
                  onClick={() => {
                    audioManager.playSelect();
                    setIsChatOpen(true);
                  }}
                  className="px-6 py-3.5 text-sm font-semibold text-[#172033] dark:text-[#F8FAFC] bg-white/90 dark:bg-[#182235]/90 hover:bg-[#F1F5F9] dark:hover:bg-[#202D42] active:scale-[0.98] border border-[#536DFE]/40 dark:border-[#818CF8]/40 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#536DFE] rounded-2xl transition-all shadow-xs backdrop-blur-sm inline-flex items-center gap-2 cursor-pointer"
                  aria-label="Ask Ventura AI - Open interactive technical assistant"
                >
                  <Sparkles size={15} className="text-[#536DFE] dark:text-[#818CF8]" />
                  <span>{t.hero.ctaAskAI}</span>
                </button>

                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    audioManager.playSelect();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 text-sm font-semibold text-[#64748B] dark:text-[#CBD5E1] hover:text-[#172033] dark:hover:text-[#F8FAFC] transition-colors inline-flex items-center gap-2 rounded-2xl focus-visible:ring-2 focus-visible:ring-[#536DFE]"
                >
                  <Mail size={15} />
                  <span>{t.hero.ctaConnect}</span>
                </a>

                <a
                  href="#ai-lab"
                  onClick={(e) => {
                    e.preventDefault();
                    audioManager.playSelect();
                    document.getElementById('ai-lab')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-3.5 text-xs font-mono font-medium text-slate-500 hover:text-[#536DFE] dark:hover:text-[#818CF8] transition-colors"
                >
                  <Cpu size={14} />
                  <span>{t.hero.ctaLab}</span>
                </a>
              </div>

              {/* Concise line of core technologies */}
              <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#283750] flex flex-wrap items-center gap-2 text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
                <span className="text-[#172033] dark:text-[#F8FAFC] font-semibold">{t.hero.technologies}</span>
                <span>LLMs</span>
                <span aria-hidden="true">·</span>
                <span>RAG</span>
                <span aria-hidden="true">·</span>
                <span>AI Agents</span>
                <span aria-hidden="true">·</span>
                <span>Python</span>
                <span aria-hidden="true">·</span>
                <span>Ollama</span>
              </div>
            </div>

            {/* Right Column: Signature Interactive CRT Robot with Ambient Halo & Orbiting Glass Elements */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Soft blue-violet glow positioned directly behind the robot */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 sm:-inset-10 rounded-full blur-3xl pointer-events-none transition-all duration-700 -z-10"
                style={{
                  background: effectiveDark
                    ? 'radial-gradient(circle, rgba(83,109,254,0.38) 0%, rgba(147,97,245,0.28) 45%, rgba(20,184,166,0.12) 70%, transparent 85%)'
                    : 'radial-gradient(circle, rgba(83,109,254,0.24) 0%, rgba(147,97,245,0.18) 45%, rgba(20,184,166,0.08) 70%, transparent 85%)',
                }}
              />

              {/* Translucent glass shapes positioned around the robot without covering it */}
              <div
                aria-hidden="true"
                className="hidden sm:block absolute -top-5 -right-5 w-16 h-16 rounded-2xl border border-white/70 dark:border-white/10 bg-white/30 dark:bg-white/[0.04] backdrop-blur-md shadow-lg pointer-events-none transform rotate-12 -z-10"
              />
              <div
                aria-hidden="true"
                className="hidden sm:block absolute -bottom-4 -left-4 w-14 h-14 rounded-2xl border border-white/60 dark:border-white/10 bg-gradient-to-tr from-[#14B8A6]/20 to-transparent backdrop-blur-md shadow-md pointer-events-none transform -rotate-6 -z-10"
              />

              <RobotHero
                isDarkTheme={effectiveDark}
                onOpenChat={() => setIsChatOpen(true)}
              />
            </div>
          </div>
        </section>

        {/* ==================== SECTION 2 — OPEN SOURCE & GITHUB PROJECTS ==================== */}
        <section
          id="projects"
          className="scroll-mt-20 py-24 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto border-t border-[#E2E8F0]/80 dark:border-[#334155]/80 transition-colors"
        >
          {/* Header with Title, Subtitle, and GitHub Profile action */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#536DFE] dark:text-[#818CF8] px-3 py-1 rounded-full bg-[#E8EEFF] dark:bg-[#818CF8]/15 border border-[#536DFE]/20 dark:border-[#818CF8]/30">
                <GitBranch size={13} />
                <span>{t.projects.badge}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172033] dark:text-[#F8FAFC] tracking-tight">
                {t.projects.headline}
              </h2>

              <p className="text-sm sm:text-base text-[#64748B] dark:text-[#CBD5E1] leading-relaxed font-normal">
                {t.projects.description}
              </p>
            </div>

            {/* GitHub Profile Action & Configuration Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {GITHUB_CONFIG.isConfigured ? (
                <a
                  href={GITHUB_CONFIG.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audioManager.playHover()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#172033] dark:bg-white text-white dark:text-[#172033] hover:opacity-90 font-semibold text-xs sm:text-sm transition-all shadow-sm"
                >
                  <GitBranch size={16} />
                  <span>{t.projects.githubProfile} (@{GITHUB_CONFIG.username})</span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F1F5F9] dark:bg-[#202D42] border border-[#E2E8F0] dark:border-[#334155] text-xs font-mono text-[#64748B] dark:text-[#CBD5E1]">
                  <Settings size={13} className="text-[#536DFE] dark:text-[#818CF8]" />
                  <span>GitHub Handle: <code className="text-[#536DFE] dark:text-[#818CF8] font-bold">src/config/githubConfig.ts</code></span>
                </div>
              )}

              <button
                onClick={() => {
                  audioManager.playSelect();
                  document.getElementById('ai-lab')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white/80 dark:bg-[#182235]/80 hover:bg-[#F1F5F9] dark:hover:bg-[#202D42] text-xs font-semibold text-[#536DFE] dark:text-[#818CF8] transition-colors"
              >
                <span>{t.projects.ctaLab}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'LLM & RAG', label: 'LLMs & RAG' },
              { id: 'AI Agents', label: 'AI Agents' },
              { id: 'Local Inference', label: 'Local Models' },
              { id: 'MLOps & Eval', label: 'MLOps & Eval' },
              { id: 'Infrastructure', label: 'Infrastructure' }
            ].map((cat) => {
              const isActive = projectCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    audioManager.playSelect();
                    setProjectCategory(cat.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#536DFE] dark:bg-[#818CF8] text-white shadow-xs'
                      : 'bg-white/80 dark:bg-[#182235]/80 text-[#64748B] dark:text-[#CBD5E1] hover:text-[#172033] dark:hover:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Project Cards Grid — Responsive CSS Grid with repeat() and minmax() */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7 items-stretch w-full min-w-0"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))'
            }}
          >
            {(projectCategory === 'all'
              ? VERIFIED_PROJECTS
              : VERIFIED_PROJECTS.filter((p) => p.category === projectCategory)
            ).map((proj) => {
              const repoUrl = GITHUB_CONFIG.getRepoUrl(proj.repoSlug);

              // Find corresponding server project item for deep case study modal
              const fullProject = projects.find((p) => p.id === proj.id) || {
                id: proj.id,
                title: proj.name,
                summary: proj.description,
                category: proj.category,
                accentColor: proj.accentColor,
                status: proj.status,
                problem: 'Production-scale reliability and verification challenge.',
                solution: proj.description,
                architecture: proj.architectureHighlight,
                technologies: proj.technologies,
                metrics: [proj.keyMetric],
                repoUrl: repoUrl,
                demoUrl: '#ai-lab'
              };

              const accentBadgeClass =
                proj.accentColor === 'blue'
                  ? 'text-[#536DFE] dark:text-[#818CF8]'
                  : proj.accentColor === 'violet'
                  ? 'text-[#9361F5] dark:text-[#B69AFB]'
                  : proj.accentColor === 'teal'
                  ? 'text-[#14B8A6] dark:text-[#5EEAD4]'
                  : proj.accentColor === 'orange'
                  ? 'text-[#FB923C] dark:text-[#FDBA74]'
                  : proj.accentColor === 'pink'
                  ? 'text-[#EC4899] dark:text-[#F9A8D4]'
                  : 'text-cyan-600 dark:text-cyan-400';

              const accentBorderHover =
                proj.accentColor === 'blue'
                  ? 'hover:border-[#536DFE] dark:hover:border-[#818CF8]'
                  : proj.accentColor === 'violet'
                  ? 'hover:border-[#9361F5] dark:hover:border-[#B69AFB]'
                  : proj.accentColor === 'teal'
                  ? 'hover:border-[#14B8A6] dark:hover:border-[#5EEAD4]'
                  : proj.accentColor === 'orange'
                  ? 'hover:border-[#FB923C] dark:hover:border-[#FDBA74]'
                  : proj.accentColor === 'pink'
                  ? 'hover:border-[#EC4899] dark:hover:border-[#F9A8D4]'
                  : 'hover:border-cyan-500';

              return (
                <motion.div
                  key={proj.id}
                  initial={{ y: 0, scale: 1 }}
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: -4,
                          scale: 1.02
                        }
                  }
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 24
                  }}
                  className={`flex flex-col justify-between p-6 sm:p-7 bg-white/90 dark:bg-[#182235]/90 backdrop-blur-md border border-[#E2E8F0] dark:border-[#334155] rounded-3xl shadow-xs transition-[border-color,box-shadow] duration-200 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50 hover:border-slate-400/80 dark:hover:border-slate-500/80 ${accentBorderHover} group relative z-0 hover:z-10 min-w-0 w-full`}
                >
                  <div className="space-y-4 min-w-0">
                    {/* Category & Status header */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-[#64748B] dark:text-[#CBD5E1] flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#536DFE] dark:bg-[#818CF8] shrink-0" />
                        <span className="truncate">{proj.category}</span>
                      </span>
                      <span className={`capitalize font-semibold shrink-0 ml-2 ${accentBadgeClass}`}>
                        {proj.status}
                      </span>
                    </div>

                    {/* Repository Title with GitHub Icon */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#172033] dark:text-[#F8FAFC] group-hover:text-[#536DFE] dark:group-hover:text-[#818CF8] transition-colors leading-snug break-words min-w-0">
                        {proj.name}
                      </h3>
                      <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={GITHUB_CONFIG.isConfigured ? `View ${proj.name} on GitHub` : 'Configure your GitHub handle in src/config/githubConfig.ts'}
                        onClick={(e) => {
                          e.stopPropagation();
                          audioManager.playHover();
                        }}
                        className="p-1.5 text-slate-400 hover:text-[#172033] dark:hover:text-[#F8FAFC] rounded-lg hover:bg-slate-100 dark:hover:bg-[#202D42] transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-[#536DFE] dark:focus-visible:ring-[#818CF8] focus:outline-none"
                        aria-label={`View ${proj.name} on GitHub`}
                      >
                        <GitBranch size={17} />
                      </a>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed font-normal break-words">
                      {proj.description}
                    </p>

                    {/* Architecture highlight snippet */}
                    <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#202D42] border border-[#E2E8F0]/70 dark:border-[#334155]/60 text-[11px] font-mono text-[#172033] dark:text-[#CBD5E1] flex items-center gap-2 overflow-hidden">
                      <Terminal size={12} className={`${accentBadgeClass} shrink-0`} />
                      <span className="truncate">{proj.architectureHighlight}</span>
                    </div>

                    {/* Clean unboxed technologies with typographic separators */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#64748B] dark:text-[#94A3B8] pt-1">
                      {proj.technologies.slice(0, 4).map((tech, tidx) => (
                        <React.Fragment key={tidx}>
                          <span className="font-medium text-[#172033] dark:text-[#F8FAFC]">{tech}</span>
                          {tidx < Math.min(proj.technologies.length, 4) - 1 && (
                            <span className="text-[#94A3B8] dark:text-[#475569]" aria-hidden="true">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Key Metric & View on GitHub / Case Study actions */}
                  <div className="pt-6 mt-6 border-t border-[#E2E8F0] dark:border-[#334155] flex flex-col gap-3">
                    <div className="text-xs font-mono font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center justify-between">
                      <span className="text-[#64748B] dark:text-[#94A3B8] font-normal">{proj.keyMetric.label}:</span>
                      <span className={accentBadgeClass}>{proj.keyMetric.value}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                      {/* View on GitHub button */}
                      <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          audioManager.playHover();
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#172033] dark:text-[#F8FAFC] hover:text-[#536DFE] dark:hover:text-[#818CF8] transition-colors focus-visible:ring-2 focus-visible:ring-[#536DFE] dark:focus-visible:ring-[#818CF8] focus:outline-none rounded-md"
                      >
                        <GitBranch size={13} />
                        <span>{t.projects.viewOnGithub}</span>
                        <ExternalLink size={11} className="opacity-70" />
                      </a>

                      {/* Case study modal button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          audioManager.playSelect();
                          setSelectedProject(fullProject);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#536DFE] dark:text-[#818CF8] hover:underline focus-visible:ring-2 focus-visible:ring-[#536DFE] dark:focus-visible:ring-[#818CF8] focus:outline-none rounded-md"
                      >
                        <span>{t.projects.viewCaseStudy}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ==================== SECTION 3 — AI ENGINEERING LAB ==================== */}
        <section
          id="ai-lab"
          className="scroll-mt-20 py-24 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto border-t border-[#E2E8F0]/80 dark:border-[#334155]/80"
        >
          <EngineeringLab />
        </section>

        {/* ==================== SECTION 4 — ABOUT & PHILOSOPHY ==================== */}
        <section
          id="about"
          className="scroll-mt-20 py-24 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto border-t border-[#E2E8F0]/80 dark:border-[#334155]/80"
        >
          <div className="max-w-3xl space-y-4 mb-12">
            <div className="text-xs font-mono font-semibold text-[#536DFE] dark:text-[#818CF8]">
              {t.about.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172033] dark:text-[#F8FAFC] tracking-tight">
              {t.about.headline}
            </h2>
            <p className="text-base text-[#64748B] dark:text-[#CBD5E1] leading-relaxed font-normal">
              {t.about.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white/80 dark:bg-[#182235]/80 backdrop-blur-md border border-[#E2E8F0] dark:border-[#334155] rounded-3xl shadow-xs hover:shadow-md transition-all space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#E8EEFF] dark:bg-[#818CF8]/20 text-[#536DFE] dark:text-[#818CF8] flex items-center justify-center font-bold">
                <Layers size={18} />
              </div>
              <h3 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC] pt-2">{t.about.card1Title}</h3>
              <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                {t.about.card1Desc}
              </p>
            </div>

            <div className="p-6 bg-white/80 dark:bg-[#182235]/80 backdrop-blur-md border border-[#E2E8F0] dark:border-[#334155] rounded-3xl shadow-xs hover:shadow-md transition-all space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#F0E8FF] dark:bg-[#B69AFB]/20 text-[#9361F5] dark:text-[#B69AFB] flex items-center justify-center font-bold">
                <Workflow size={18} />
              </div>
              <h3 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC] pt-2">{t.about.card2Title}</h3>
              <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                {t.about.card2Desc}
              </p>
            </div>

            <div className="p-6 bg-white/80 dark:bg-[#182235]/80 backdrop-blur-md border border-[#E2E8F0] dark:border-[#334155] rounded-3xl shadow-xs hover:shadow-md transition-all space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#DDF8F4] dark:bg-[#5EEAD4]/20 text-[#14B8A6] dark:text-[#5EEAD4] flex items-center justify-center font-bold">
                <Cpu size={18} />
              </div>
              <h3 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC] pt-2">{t.about.card3Title}</h3>
              <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                {t.about.card3Desc}
              </p>
            </div>

            <div className="p-6 bg-white/80 dark:bg-[#182235]/80 backdrop-blur-md border border-[#E2E8F0] dark:border-[#334155] rounded-3xl shadow-xs hover:shadow-md transition-all space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#FCE7F3] dark:bg-[#F9A8D4]/20 text-[#EC4899] dark:text-[#F9A8D4] flex items-center justify-center font-bold">
                <BarChart2 size={18} />
              </div>
              <h3 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC] pt-2">{t.about.card4Title}</h3>
              <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                {t.about.card4Desc}
              </p>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 5 — SKILLS AND TECHNOLOGIES ==================== */}
        <section
          id="skills"
          className="scroll-mt-20 py-24 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto border-t border-[#E2E8F0]/80 dark:border-[#334155]/80"
        >
          <div className="max-w-2xl space-y-3 mb-12">
            <div className="text-xs font-mono font-semibold text-[#536DFE] dark:text-[#818CF8]">
              {t.skills.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172033] dark:text-[#F8FAFC] tracking-tight">
              {t.skills.headline}
            </h2>
            <p className="text-sm text-[#64748B] dark:text-[#CBD5E1]">
              {t.skills.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Group 1: LLM Engineering */}
            <div className="p-6 bg-[#E8EEFF]/50 dark:bg-[#182235]/85 backdrop-blur-md border border-blue-200/60 dark:border-[#334155] rounded-3xl space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-sm font-bold text-[#536DFE] dark:text-[#818CF8]">
                <Cpu size={18} />
                <span>LLM Engineering</span>
              </div>
              <ul className="space-y-2 text-xs text-[#172033] dark:text-[#CBD5E1]">
                <li className="flex items-center gap-2"><span>·</span> Prompt engineering & DSPy compilation</li>
                <li className="flex items-center gap-2"><span>·</span> Structured JSON outputs via schema constraint</li>
                <li className="flex items-center gap-2"><span>·</span> Multi-provider integration (Gemini, Llama, Claude)</li>
                <li className="flex items-center gap-2"><span>·</span> Context window optimization & needle retrieval</li>
                <li className="flex items-center gap-2"><span>·</span> Inference latency and TTFT optimization</li>
              </ul>
            </div>

            {/* Group 2: Retrieval & Knowledge Systems */}
            <div className="p-6 bg-[#F0E8FF]/50 dark:bg-[#182235]/85 backdrop-blur-md border border-purple-200/60 dark:border-[#334155] rounded-3xl space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-sm font-bold text-[#9361F5] dark:text-[#B69AFB]">
                <Database size={18} />
                <span>Retrieval & Knowledge Systems</span>
              </div>
              <ul className="space-y-2 text-xs text-[#172033] dark:text-[#CBD5E1]">
                <li className="flex items-center gap-2"><span>·</span> Advanced RAG (Dense + BM25 hybrid search)</li>
                <li className="flex items-center gap-2"><span>·</span> BGE dense embeddings & vector spaces</li>
                <li className="flex items-center gap-2"><span>·</span> Contextual document parsing & chunking</li>
                <li className="flex items-center gap-2"><span>·</span> Qdrant HNSW vector index tuning</li>
                <li className="flex items-center gap-2"><span>·</span> FlashRank cross-encoder reranking</li>
              </ul>
            </div>

            {/* Group 3: AI Agents */}
            <div className="p-6 bg-[#DDF8F4]/50 dark:bg-[#182235]/85 backdrop-blur-md border border-teal-200/60 dark:border-[#334155] rounded-3xl space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-sm font-bold text-[#14B8A6] dark:text-[#5EEAD4]">
                <Workflow size={18} />
                <span>AI Agents</span>
              </div>
              <ul className="space-y-2 text-xs text-[#172033] dark:text-[#CBD5E1]">
                <li className="flex items-center gap-2"><span>·</span> Tool declaration & function calling</li>
                <li className="flex items-center gap-2"><span>·</span> LangGraph cyclic state graph orchestration</li>
                <li className="flex items-center gap-2"><span>·</span> Deterministic Pydantic tool schemas</li>
                <li className="flex items-center gap-2"><span>·</span> Human-in-the-loop approval barriers</li>
                <li className="flex items-center gap-2"><span>·</span> State recovery & execution trace logging</li>
              </ul>
            </div>

            {/* Group 4: Development */}
            <div className="p-6 bg-[#FFF0E1]/50 dark:bg-[#182235]/85 backdrop-blur-md border border-orange-200/60 dark:border-[#334155] rounded-3xl space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-sm font-bold text-[#FB923C] dark:text-[#FDBA74]">
                <Code2 size={18} />
                <span>Software Development</span>
              </div>
              <ul className="space-y-2 text-xs text-[#172033] dark:text-[#CBD5E1]">
                <li className="flex items-center gap-2"><span>·</span> Python (FastAPI, PyMuPDF, Pydantic v2)</li>
                <li className="flex items-center gap-2"><span>·</span> TypeScript & React modern frontend</li>
                <li className="flex items-center gap-2"><span>·</span> REST & Server-Sent Event (SSE) streaming APIs</li>
                <li className="flex items-center gap-2"><span>·</span> Pytest unit & integration test suites</li>
                <li className="flex items-center gap-2"><span>·</span> Git, GitHub Actions, and CI/CD pipelines</li>
              </ul>
            </div>

            {/* Group 5: Infrastructure & MLOps */}
            <div className="p-6 bg-[#FCE7F3]/50 dark:bg-[#182235]/85 backdrop-blur-md border border-pink-200/60 dark:border-[#334155] rounded-3xl space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-sm font-bold text-[#EC4899] dark:text-[#F9A8D4]">
                <Server size={18} />
                <span>Infrastructure & MLOps</span>
              </div>
              <ul className="space-y-2 text-xs text-[#172033] dark:text-[#CBD5E1]">
                <li className="flex items-center gap-2"><span>·</span> Docker containerization & microservices</li>
                <li className="flex items-center gap-2"><span>·</span> PostgreSQL relational data models</li>
                <li className="flex items-center gap-2"><span>·</span> OpenTelemetry tracing & latency monitoring</li>
                <li className="flex items-center gap-2"><span>·</span> Ollama & vLLM local hardware runtimes</li>
                <li className="flex items-center gap-2"><span>·</span> Ragas automated evaluation benchmarks</li>
              </ul>
            </div>

            {/* Group 6: Security & Guardrails */}
            <div className="p-6 bg-[#E0F7FA]/50 dark:bg-[#182235]/85 backdrop-blur-md border border-cyan-200/60 dark:border-[#334155] rounded-3xl space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0891B2] dark:text-cyan-300">
                <ShieldCheck size={18} />
                <span>Security & Guardrails</span>
              </div>
              <ul className="space-y-2 text-xs text-[#172033] dark:text-[#CBD5E1]">
                <li className="flex items-center gap-2"><span>·</span> Prompt injection fuzzing & prevention</li>
                <li className="flex items-center gap-2"><span>·</span> Server-side secret isolation</li>
                <li className="flex items-center gap-2"><span>·</span> Token rate-limiting & backpressure queues</li>
                <li className="flex items-center gap-2"><span>·</span> Air-gapped on-premise privacy constraints</li>
                <li className="flex items-center gap-2"><span>·</span> Hallucination filtering with verified citations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 6 — TECHNICAL VALIDATION & STANDARDS ==================== */}
        <SocialProof />

        {/* ==================== SECTION 7 — CONTACT & FOOTER ==================== */}
        <section
          id="contact"
          className="scroll-mt-20 py-24 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto border-t border-[#E2E8F0]/80 dark:border-[#334155]/80"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Inquiry Intro & Instant Communication */}
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-mono font-semibold text-[#536DFE] dark:text-[#818CF8]">
                {t.contact.badge}
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#172033] dark:text-[#F8FAFC] tracking-tight leading-tight">
                {t.contact.headline}
              </h2>

              <p className="text-base text-[#64748B] dark:text-[#CBD5E1] leading-relaxed font-normal">
                {t.contact.description}
              </p>

              {/* Direct channels */}
              <div className="space-y-3 pt-2">
                {/* Instant WhatsApp Action Card */}
                <a
                  href={WHATSAPP_CONFIG.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audioManager.playSelect()}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/30 transition-all group/wa shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-700/60 flex items-center justify-center shrink-0 shadow-2xs group-hover/wa:scale-105 transition-transform">
                    <WhatsAppIcon size={20} className="text-[#25D366]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">WhatsApp Instant Connect</div>
                    <div className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC] tracking-tight">{WHATSAPP_CONFIG.phoneNumber}</div>
                  </div>
                  <ExternalLink size={14} className="text-emerald-600 dark:text-emerald-400 opacity-70 shrink-0" />
                </a>

                <div className="flex items-center gap-3 text-sm text-[#172033] dark:text-[#CBD5E1] px-1">
                  <Mail size={16} className="text-[#536DFE] dark:text-[#818CF8]" />
                  <span>vinturasmm@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#172033] dark:text-[#CBD5E1] px-1">
                  <Terminal size={16} className="text-[#536DFE] dark:text-[#818CF8]" />
                  <span>{t.contact.locationLabel}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-6 p-8 bg-white/90 dark:bg-[#182235]/90 backdrop-blur-md border border-[#E2E8F0] dark:border-[#334155] rounded-3xl shadow-xl">
              {contactSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#DDF8F4] dark:bg-[#5EEAD4]/20 text-[#14B8A6] dark:text-[#5EEAD4] flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-[#172033] dark:text-[#F8FAFC]">{t.contact.successTitle}</h3>
                  <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] max-w-sm mx-auto leading-relaxed">
                    {t.contact.successDesc}
                  </p>
                  <button
                    onClick={() => setContactSuccess(false)}
                    className="mt-4 text-xs font-bold text-[#536DFE] dark:text-[#818CF8] hover:underline"
                  >
                    {t.contact.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC]">{t.contact.formTitle}</h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#172033] dark:text-[#CBD5E1] mb-1">{t.contact.nameLabel}</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={t.contact.namePlaceholder}
                      required
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#F8FAFC] dark:bg-[#111827] text-[#172033] dark:text-[#F8FAFC] rounded-xl border border-[#E2E8F0] dark:border-[#334155] focus:outline-none focus:border-[#536DFE] dark:focus:border-[#818CF8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#172033] dark:text-[#CBD5E1] mb-1">{t.contact.emailInputLabel}</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder={t.contact.emailPlaceholder}
                      required
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#F8FAFC] dark:bg-[#111827] text-[#172033] dark:text-[#F8FAFC] rounded-xl border border-[#E2E8F0] dark:border-[#334155] focus:outline-none focus:border-[#536DFE] dark:focus:border-[#818CF8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#172033] dark:text-[#CBD5E1] mb-1">{t.contact.messageLabel}</label>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                      placeholder={t.contact.messagePlaceholder}
                      required
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#F8FAFC] dark:bg-[#111827] text-[#172033] dark:text-[#F8FAFC] rounded-xl border border-[#E2E8F0] dark:border-[#334155] focus:outline-none focus:border-[#536DFE] dark:focus:border-[#818CF8]"
                    />
                  </div>

                  {contactError && (
                    <p className="text-xs text-rose-500 font-medium">{contactError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={contactSending}
                    className="w-full py-3 bg-[#536DFE] hover:bg-[#435bdb] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Send size={15} />
                    <span>{contactSending ? t.contact.sendingButton : t.contact.sendButton}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="px-6 sm:px-12 lg:px-24 py-10 border-t border-[#E2E8F0]/80 dark:border-[#334155]/80 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md text-xs text-[#64748B] dark:text-[#CBD5E1] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#172033] dark:text-[#F8FAFC] tracking-wider">VENTURA</span>
            <span aria-hidden="true">·</span>
            <span>{t.footer.role}</span>
            <span aria-hidden="true">·</span>
            <span>© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsPresentationOpen(true)}
              className="text-[#536DFE] dark:text-[#818CF8] hover:underline flex items-center gap-1 font-semibold"
            >
              <Presentation size={13} />
              <span>{t.nav.presentation}</span>
            </button>
            <a
              href={WHATSAPP_CONFIG.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audioManager.playSelect()}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 font-semibold"
            >
              <WhatsAppIcon size={13} className="text-[#25D366]" />
              <span>WhatsApp</span>
            </a>
            <a
              href={GITHUB_CONFIG.profileUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => audioManager.playHover()}
              className="hover:text-[#536DFE] dark:hover:text-[#818CF8] transition-colors flex items-center gap-1 font-semibold"
            >
              <GitBranch size={13} />
              <span>GitHub</span>
            </a>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                audioManager.playSelect();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#536DFE] dark:hover:text-[#818CF8] transition-colors"
            >
              {t.footer.backToTop}
            </a>
          </div>
        </footer>
      </main>

      {/* Floating Quick Action Dock (WhatsApp & Ventura AI Assistant) */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2.5">
        {/* Floating WhatsApp Action Button */}
        <a
          href={WHATSAPP_CONFIG.directUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => audioManager.playSelect()}
          title="Chat directly on WhatsApp (+92 300 966 7001)"
          aria-label="Chat directly on WhatsApp (+92 300 966 7001)"
          className="flex items-center justify-center w-11 h-11 sm:w-auto sm:px-3.5 sm:py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-transform transform hover:scale-105 border border-emerald-400/40"
        >
          <WhatsAppIcon size={18} className="text-white" />
          <span className="hidden sm:inline font-semibold text-xs ml-2">WhatsApp</span>
        </a>

        {/* Floating AI Chat Assistant Trigger */}
        <button
          onClick={() => {
            audioManager.playSelect();
            setIsChatOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#536DFE] to-[#9361F5] hover:opacity-95 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          <Sparkles size={16} />
          <span>Ask Ventura AI</span>
        </button>
      </div>

      {/* Ventura AI Technical Assistant Drawer */}
      <ChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Project Case Study Deep Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenLab={() => {
          document.getElementById('ai-lab')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Recruiter & Client Presentation Walkthrough Modal */}
      <PresentationGuideModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        onNavigateToSection={handleNavigateSection}
        onOpenAssistant={() => setIsChatOpen(true)}
      />
    </div>
  );
}
