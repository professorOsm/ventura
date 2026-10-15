import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, Info, RefreshCw } from 'lucide-react';

export type ServiceStatus = 'operational' | 'demo_mode' | 'degraded' | 'unavailable' | 'unknown';

interface HealthData {
  status: string;
  app: string;
  uptime: number;
  geminiConfigured: boolean;
  timestamp: string;
}

interface SystemStatusProps {
  compact?: boolean;
  className?: string;
  showDetails?: boolean;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  compact = false,
  className = '',
  showDetails = false
}) => {
  const [status, setStatus] = useState<ServiceStatus>('unknown');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [lastChecked, setLastChecked] = useState<string>('');
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const checkHealth = async () => {
    setIsRefreshing(true);
    const start = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const res = await fetch('/api/health', {
        signal: controller.signal,
        headers: { Accept: 'application/json' }
      });
      clearTimeout(timeoutId);
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);

      if (res.ok) {
        const data: HealthData = await res.json();
        setHealthData(data);
        setStatus(data.geminiConfigured ? 'operational' : 'demo_mode');
      } else {
        setStatus('degraded');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      // If server unreachable, gracefully indicate local demo mode
      setStatus('demo_mode');
      setLatencyMs(null);
    } finally {
      setIsRefreshing(false);
      setLastChecked(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    checkHealth();
    // Poll at a restrained 45-second interval
    const interval = setInterval(checkHealth, 45000);
    return () => clearInterval(interval);
  }, []);

  const config = {
    operational: {
      label: 'Operational',
      sublabel: healthData?.geminiConfigured ? 'Gemini Live Active' : 'Local Engine Ready',
      colorClass: 'text-emerald-700 dark:text-emerald-400',
      dotColor: 'bg-emerald-500',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40',
      icon: CheckCircle2,
      description: 'Backend services responding normally. Server-side proxy and API endpoints are actively reachable.'
    },
    demo_mode: {
      label: 'Demo Mode',
      sublabel: 'Local Deterministic Engine',
      colorClass: 'text-[#536DFE] dark:text-[#818CF8]',
      dotColor: 'bg-[#536DFE] dark:bg-[#818CF8]',
      bgClass: 'bg-[#E8EEFF]/80 dark:bg-[#818CF8]/10 border-[#536DFE]/25 dark:border-[#818CF8]/30',
      icon: Activity,
      description: 'Portfolio operates with full client-side deterministic models and verified offline samples. No external API keys required.'
    },
    degraded: {
      label: 'Degraded',
      sublabel: 'High Latency / Partial',
      colorClass: 'text-amber-700 dark:text-amber-400',
      dotColor: 'bg-amber-500',
      bgClass: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40',
      icon: AlertTriangle,
      description: 'Backend is reachable but returning non-200 responses. Automatic fallback to local simulation is active.'
    },
    unavailable: {
      label: 'Unavailable',
      sublabel: 'Offline Fallback',
      colorClass: 'text-rose-700 dark:text-rose-400',
      dotColor: 'bg-rose-500',
      bgClass: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40',
      icon: XCircle,
      description: 'API endpoint cannot be reached. Portfolio is currently serving from client-side fallback.'
    },
    unknown: {
      label: 'Checking Status',
      sublabel: 'Verifying Services...',
      colorClass: 'text-slate-600 dark:text-slate-400',
      dotColor: 'bg-slate-400',
      bgClass: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
      icon: Activity,
      description: 'Querying /api/health probe...'
    }
  }[status];

  const IconComponent = config.icon;

  if (compact) {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <button
          onClick={() => setIsTooltipOpen(!isTooltipOpen)}
          onMouseEnter={() => setIsTooltipOpen(true)}
          onMouseLeave={() => setIsTooltipOpen(false)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border transition-colors ${config.bgClass} ${config.colorClass} focus:outline-none focus:ring-2 focus:ring-[#536DFE]`}
          aria-label={`System status: ${config.label}. Click or hover for details.`}
        >
          <span className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`} aria-hidden="true" />
          <span className="font-semibold">{config.label}</span>
          {latencyMs !== null && (
            <span className="opacity-75 text-[10px]">· {latencyMs}ms</span>
          )}
        </button>

        {/* Accessible Hover/Click Tooltip */}
        {isTooltipOpen && (
          <div
            role="tooltip"
            className="absolute top-full left-0 mt-2 z-50 w-64 p-3 bg-white dark:bg-[#182235] rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl text-xs space-y-2 text-slate-700 dark:text-slate-200 backdrop-blur-md"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800 font-mono text-[11px]">
              <span className="font-bold flex items-center gap-1">
                <IconComponent size={12} className={config.colorClass} />
                <span>Health Monitor</span>
              </span>
              <span className="text-slate-400">{lastChecked}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-sans">
              {config.description}
            </p>
            <div className="text-[10px] font-mono text-slate-400 pt-1 flex items-center justify-between">
              <span>Probe: /api/health</span>
              {latencyMs && <span>{latencyMs}ms RTT</span>}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl border transition-colors ${config.bgClass} ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className={`w-3 h-3 rounded-full ${config.dotColor}`} />
            <span className={`absolute w-3 h-3 rounded-full ${config.dotColor} animate-ping opacity-40`} />
          </div>
          <div>
            <div className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${config.colorClass}`}>
              <span>System Status:</span>
              <span>{config.label}</span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-sans mt-0.5">
              {config.sublabel} {latencyMs && `(${latencyMs}ms roundtrip)`}
            </div>
          </div>
        </div>

        <button
          onClick={checkHealth}
          disabled={isRefreshing}
          title="Refresh system health probe"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors focus:outline-none"
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <p className="text-[11px] leading-relaxed font-sans">{config.description}</p>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
            <span>Checked: {lastChecked || 'Just now'}</span>
            <span>Target: Express Backend /api/health</span>
          </div>
        </div>
      )}
    </div>
  );
};
