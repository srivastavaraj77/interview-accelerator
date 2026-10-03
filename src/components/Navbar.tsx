import React from 'react';
import {
  Sparkles,
  Key,
  History,
  FileText,
  Video,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  currentStep: number;
  onNavigateStep: (step: number) => void;
  canNavigateTo: (step: number) => boolean;
  onOpenApiKey: () => void;
  onOpenHistory: () => void;
  hasApiKey: boolean;
  onSelectPreset: (presetId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  onNavigateStep,
  canNavigateTo,
  onOpenApiKey,
  onOpenHistory,
  hasApiKey,
  onSelectPreset
}) => {
  const steps = [
    { id: 0, label: '1. Documents', icon: FileText },
    { id: 1, label: '2. Role Analysis', icon: CheckCircle2 },
    { id: 2, label: '3. Candidate Fit', icon: Sparkles },
    { id: 3, label: '4. AI Interview', icon: Video },
    { id: 4, label: '5. Report & Prep', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            onClick={() => onNavigateStep(0)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Interview Accelerator
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI Voice & Video
                </span>
              </div>
              <p className="text-xs text-slate-400">Personalized Role & Candidate Preparation</p>
            </div>
          </div>

          {/* Stepper Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            {steps.map(step => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isAccessible = canNavigateTo(step.id);

              return (
                <button
                  key={step.id}
                  disabled={!isAccessible}
                  onClick={() => onNavigateStep(step.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : isAccessible
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      : 'text-slate-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Demo Dropdown */}
            <div className="relative group">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700/80 text-slate-200 hover:border-indigo-500 hover:text-white transition-all flex items-center gap-1.5">
                <span>⚡ Demo Presets</span>
              </button>
              <div className="absolute right-0 mt-2 w-64 p-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Load Realistic Sample
                </div>
                <button
                  onClick={() => onSelectPreset('ai-engineer-intern')}
                  className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-indigo-600/20 hover:text-indigo-200 transition-colors text-slate-200"
                >
                  <span className="font-semibold block text-white">🤖 AI Engineer Intern</span>
                  <span className="text-[10px] text-slate-400">Student Credibility RAG & LLM Challenge</span>
                </button>
                <button
                  onClick={() => onSelectPreset('fullstack-engineer')}
                  className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-indigo-600/20 hover:text-indigo-200 transition-colors text-slate-200"
                >
                  <span className="font-semibold block text-white">💻 Full-Stack React & Node</span>
                  <span className="text-[10px] text-slate-400">Distributed Web & WebSocket Architecture</span>
                </button>
                <button
                  onClick={() => onSelectPreset('ai-product-manager')}
                  className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-indigo-600/20 hover:text-indigo-200 transition-colors text-slate-200"
                >
                  <span className="font-semibold block text-white">📊 Associate PM (AI)</span>
                  <span className="text-[10px] text-slate-400">Product Discovery & Metric Strategy</span>
                </button>
              </div>
            </div>

            {/* Past History */}
            <button
              onClick={onOpenHistory}
              title="View past reports"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800 transition-all"
            >
              <History className="w-4 h-4" />
            </button>

            {/* API Key settings */}
            <button
              onClick={onOpenApiKey}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                hasApiKey
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{hasApiKey ? 'Gemini Live' : 'API Key'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
