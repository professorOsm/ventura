import React, { useState } from 'react';
import {
  GitBranch,
  ExternalLink,
  ArrowRight,
  Layers,
  Code2,
  Terminal,
  Cpu,
  Database,
  Workflow,
  Sparkles,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { GITHUB_CONFIG, VERIFIED_PROJECTS, ShowcaseProject } from '../config/githubConfig';
import { audioManager } from '../audio/AudioManager';
import { Locale, translations } from '../i18n/translations';
import { ProjectItem } from '../../server';

interface GitHubShowcaseProps {
  locale: Locale;
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onNavigateToLab: () => void;
}

export const GitHubShowcase: React.FC<GitHubShowcaseProps> = ({
  locale,
  projects,
  onSelectProject,
  onNavigateToLab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const shouldReduceMotion = useReducedMotion();
  const t = translations[locale];

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'LLM & RAG', label: 'LLMs & RAG' },
    { id: 'AI Agents', label: 'AI Agents' },
    { id: 'Local Inference', label: 'Local Models' },
    { id: 'MLOps & Eval', label: 'MLOps & Eval' },
    { id: 'Infrastructure', label: 'Infrastructure' }
  ];

  const filteredProjects = selectedCategory === 'all'
    ? VERIFIED_PROJECTS
    : VERIFIED_PROJECTS.filter((p) => p.category === selectedCategory);

  const isConfigured = GITHUB_CONFIG.isConfigured;

  return (
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
          {isConfigured ? (
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
              onNavigateToLab();
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
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                audioManager.playSelect();
                setSelectedCategory(cat.id);
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
        {filteredProjects.map((proj) => {
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
                    title={isConfigured ? `View ${proj.name} on GitHub` : 'Configure your GitHub handle in src/config/githubConfig.ts'}
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
                      onSelectProject(fullProject);
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
  );
};
