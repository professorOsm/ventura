import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Sun, Moon, Laptop, Menu, X, Sparkles, Check, Globe, Presentation } from 'lucide-react';
import { audioManager } from '../audio/AudioManager';
import { Locale, translations } from '../i18n/translations';
import { WHATSAPP_CONFIG } from '../config/whatsappConfig';
import { SystemStatus } from './SystemStatus';

export type ThemeMode = 'light' | 'dark' | 'system';

export const WhatsAppIcon = ({ size = 15, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.712 1.456h.005c6.554 0 11.89-5.336 11.893-11.893a11.821 11.821 0 00-3.48-8.414z" />
  </svg>
);

interface NavbarProps {
  themeMode: ThemeMode;
  effectiveDark: boolean;
  soundEnabled: boolean;
  onSelectTheme: (mode: ThemeMode) => void;
  onToggleSound: () => void;
  onOpenChat: () => void;
  activeSection: string;
  locale: Locale;
  onToggleLocale: () => void;
  onOpenPresentation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  themeMode,
  effectiveDark,
  soundEnabled,
  onSelectTheme,
  onToggleSound,
  onOpenChat,
  activeSection,
  locale,
  onToggleLocale,
  onOpenPresentation
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const t = translations[locale].nav;

  const navLinks = [
    { id: 'hero', label: t.home },
    { id: 'projects', label: t.projects },
    { id: 'ai-lab', label: t.aiLab },
    { id: 'about', label: t.about },
    { id: 'skills', label: t.skills },
    { id: 'contact', label: t.contact }
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (id: string) => {
    audioManager.playSelect();
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand Wordmark with Neural Geometric Mark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('hero');
          }}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#536DFE] to-[#9361F5] flex items-center justify-center text-white shadow-xs">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3v3" />
              <path d="M12 18v3" />
              <path d="M3 12h3" />
              <path d="M18 12h3" />
            </svg>
          </div>
          <span className="font-extrabold tracking-wider font-sans">VENTURA</span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                  isActive
                    ? 'text-[#536DFE] dark:text-[#818CF8] font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#536DFE] dark:bg-[#818CF8] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Truthful System Health Status */}
          <SystemStatus compact className="hidden md:inline-flex" />

          {/* Presentation Walkthrough Guide Trigger */}
          <button
            onClick={() => {
              audioManager.playSelect();
              onOpenPresentation();
            }}
            title="Recruiter & Client Presentation Walkthrough (5-Step Tour)"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#536DFE] dark:text-[#818CF8] bg-[#E8EEFF] dark:bg-[#818CF8]/15 hover:bg-[#dbe4ff] dark:hover:bg-[#818CF8]/25 border border-[#536DFE]/25 dark:border-[#818CF8]/30 rounded-xl transition-all shadow-2xs whitespace-nowrap"
          >
            <Presentation size={14} />
            <span>Walkthrough</span>
          </button>

          {/* Bilingual English / Urdu Language Toggle */}
          <button
            onClick={() => {
              audioManager.playSelect();
              onToggleLocale();
            }}
            title={locale === 'en' ? 'اردو میں تبدیل کریں (Switch to Urdu)' : 'Switch to English'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-800"
            aria-label="Toggle language"
          >
            <Globe size={14} className="text-[#536DFE] dark:text-[#818CF8]" />
            <span>{locale === 'en' ? 'EN' : 'اردو'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Disable Sound' : 'Enable Subtle Ambient Sound'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 size={18} className="text-[#536DFE] dark:text-[#818CF8]" />
            ) : (
              <VolumeX size={18} />
            )}
          </button>

          {/* Theme Selector Popover & Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                audioManager.playHover();
                setThemeDropdownOpen(!themeDropdownOpen);
              }}
              title={`Theme: ${themeMode.toUpperCase()} (Click to change)`}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
              aria-label="Theme selector"
              aria-expanded={themeDropdownOpen}
            >
              {themeMode === 'light' && <Sun size={18} className="text-amber-500" />}
              {themeMode === 'dark' && <Moon size={18} className="text-[#818CF8]" />}
              {themeMode === 'system' && <Laptop size={18} className="text-slate-500 dark:text-slate-400" />}
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#182235] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    audioManager.playSelect();
                    onSelectTheme('light');
                    setThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    themeMode === 'light' ? 'text-[#536DFE] font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sun size={14} className="text-amber-500" />
                    <span>Light</span>
                  </span>
                  {themeMode === 'light' && <Check size={13} className="text-[#536DFE]" />}
                </button>

                <button
                  onClick={() => {
                    audioManager.playSelect();
                    onSelectTheme('dark');
                    setThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    themeMode === 'dark' ? 'text-[#818CF8] font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Moon size={14} className="text-[#818CF8]" />
                    <span>Dark</span>
                  </span>
                  {themeMode === 'dark' && <Check size={13} className="text-[#818CF8]" />}
                </button>

                <button
                  onClick={() => {
                    audioManager.playSelect();
                    onSelectTheme('system');
                    setThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    themeMode === 'system' ? 'text-[#536DFE] dark:text-[#818CF8] font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Laptop size={14} className="text-slate-500" />
                    <span>System</span>
                  </span>
                  {themeMode === 'system' && <Check size={13} className="text-[#536DFE] dark:text-[#818CF8]" />}
                </button>
              </div>
            )}
          </div>

          {/* Compact Desktop WhatsApp Button */}
          <a
            href={WHATSAPP_CONFIG.directUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioManager.playSelect()}
            title="Chat directly on WhatsApp (+92 300 966 7001)"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-300/70 dark:border-emerald-700/60 rounded-xl transition-all shadow-2xs whitespace-nowrap focus-visible:outline-emerald-500"
            aria-label="Contact on WhatsApp: +92 300 966 7001"
          >
            <WhatsAppIcon size={14} className="text-[#25D366]" />
            <span>WhatsApp</span>
          </a>

          {/* AI Chat Assistant Trigger */}
          <button
            onClick={() => {
              audioManager.playSelect();
              onOpenChat();
            }}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#536DFE] to-[#9361F5] hover:opacity-95 rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0"
          >
            <Sparkles size={14} />
            <span>{t.assistant}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => {
              audioManager.playHover();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-6 py-4 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#536DFE] dark:hover:text-[#818CF8]"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPresentation();
              }}
              className="w-full py-2.5 text-xs font-semibold text-[#536DFE] dark:text-[#818CF8] bg-[#E8EEFF] dark:bg-[#818CF8]/20 rounded-xl flex items-center justify-center gap-2"
            >
              <Presentation size={15} />
              <span>{t.presentation}</span>
            </button>

            <a
              href={WHATSAPP_CONFIG.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                audioManager.playSelect();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <WhatsAppIcon size={16} className="text-[#25D366]" />
              <span>WhatsApp: +92 300 966 7001</span>
            </a>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono">Language / زبان</span>
              <button
                onClick={onToggleLocale}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                {locale === 'en' ? 'English (Switch to اردو)' : 'اردو (Switch to English)'}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono">Appearance Mode</span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => onSelectTheme('light')}
                  className={`px-2 py-1 rounded-lg text-xs ${themeMode === 'light' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500'}`}
                >
                  Light
                </button>
                <button
                  onClick={() => onSelectTheme('dark')}
                  className={`px-2 py-1 rounded-lg text-xs ${themeMode === 'dark' ? 'bg-[#182235] text-white shadow-2xs font-semibold' : 'text-slate-500'}`}
                >
                  Dark
                </button>
                <button
                  onClick={() => onSelectTheme('system')}
                  className={`px-2 py-1 rounded-lg text-xs ${themeMode === 'system' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-500'}`}
                >
                  System
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="w-full py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#536DFE] to-[#9361F5] rounded-xl text-center shadow-xs"
            >
              Open AI Chatbot
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
