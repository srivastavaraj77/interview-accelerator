import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  UserCheck,
  Zap,
  Layers,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { extractTextFromFile } from '../utils/fileParser';
import { PRESET_PROFILES } from '../data/presets';

interface InputSectionProps {
  jobDescription: string;
  resume: string;
  onUpdateJobDescription: (text: string) => void;
  onUpdateResume: (text: string) => void;
  onStartAnalysis: () => void;
  isLoading: boolean;
  onSelectPreset: (presetId: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  jobDescription,
  resume,
  onUpdateJobDescription,
  onUpdateResume,
  onStartAnalysis,
  isLoading,
  onSelectPreset
}) => {
  const [jdFileName, setJdFileName] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [isParsingJd, setIsParsingJd] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('ai-engineer-intern');

  const jdFileInputRef = useRef<HTMLInputElement | null>(null);
  const resumeFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleJdFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsingJd(true);
    setJdFileName(file.name);
    try {
      const text = await extractTextFromFile(file);
      onUpdateJobDescription(text);
    } catch (err) {
      console.error('Failed to parse JD file:', err);
    } finally {
      setIsParsingJd(false);
    }
  };

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsingResume(true);
    setResumeFileName(file.name);
    try {
      const text = await extractTextFromFile(file);
      onUpdateResume(text);
    } catch (err) {
      console.error('Failed to parse Resume file:', err);
    } finally {
      setIsParsingResume(false);
    }
  };

  const handlePresetClick = (presetId: string) => {
    setActivePreset(presetId);
    onSelectPreset(presetId);
  };

  const isReady = jobDescription.trim().length > 30 && resume.trim().length > 30;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      {/* Ambient Background Glow Spots to create depth and contrast */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Topmost Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        {/* Pill Badge with pulse dot */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-5 shadow-lg shadow-indigo-500/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Multimodal Interview Simulation & Gap Analysis</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-[1.15]">
          Master your interview with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
            Hyper-Personalized AI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
          Deconstruct the target role, audit your resume against core competencies, and practice under realistic pressure with our 3-level adaptive voice & video simulator.
        </p>

        {/* 1-Click Profile Presets Card */}
        <div className="mt-8 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 px-2 py-1">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>1-Click Demo Profiles:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PRESET_PROFILES.map((preset) => {
              const isSelected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-400/40'
                      : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <span>{preset.title.split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dual Ingestion Deck - High Contrast Distinct Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-10">
        {/* Card 1: Job Description Input (Indigo Theme) */}
        <div className="glass-card-indigo glass-card-hover rounded-3xl p-6 sm:p-7 relative flex flex-col justify-between overflow-hidden border border-indigo-500/30">
          {/* Glowing Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-indigo-600" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold shadow-inner">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      Input 1
                    </span>
                    <h2 className="text-lg font-bold text-white tracking-tight">Job Description (JD)</h2>
                  </div>
                  <p className="text-xs text-slate-400">Target role requirements & expectations</p>
                </div>
              </div>

              {jobDescription.trim().length > 30 ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Loaded
                </span>
              ) : (
                <span className="text-xs text-slate-500 bg-slate-800/60 px-2.5 py-0.5 rounded-full border border-slate-700/50">
                  Required
                </span>
              )}
            </div>

            {/* Document Upload Area */}
            <div className="mb-4">
              <input
                type="file"
                ref={jdFileInputRef}
                onChange={handleJdFileUpload}
                accept=".pdf,.txt,.md,.doc,.docx"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => jdFileInputRef.current?.click()}
                disabled={isParsingJd}
                className="w-full py-3 px-4 rounded-2xl border border-dashed border-indigo-500/40 hover:border-indigo-400 bg-indigo-950/30 hover:bg-indigo-950/50 text-slate-200 text-xs font-medium flex items-center justify-center gap-2.5 transition-all group cursor-pointer"
              >
                <Upload className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>
                  {isParsingJd
                    ? 'Extracting text from document...'
                    : jdFileName
                    ? `Uploaded: ${jdFileName} (Click to replace)`
                    : 'Upload JD File (.pdf, .txt, .docx)'}
                </span>
              </button>
            </div>

            {/* Textarea with High Contrast Surface */}
            <div className="relative">
              <textarea
                value={jobDescription}
                onChange={(e) => onUpdateJobDescription(e.target.value)}
                placeholder="Paste the target job description here... (Responsibilities, required technical skills, preferred qualifications, tech stack)"
                className="w-full h-64 p-4 rounded-2xl bg-slate-950/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-inner resize-none transition-all leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 text-[11px] text-indigo-300 font-mono bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700 shadow-sm">
                {jobDescription.length.toLocaleString()} chars
              </div>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-indigo-300/80">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Extracts: Tech stack, core concepts & responsibilities
            </span>
          </div>
        </div>

        {/* Card 2: Candidate Resume Input (Purple Theme) */}
        <div className="glass-card-purple glass-card-hover rounded-3xl p-6 sm:p-7 relative flex flex-col justify-between overflow-hidden border border-purple-500/30">
          {/* Glowing Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center font-bold shadow-inner">
                  <UserCheck className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                      Input 2
                    </span>
                    <h2 className="text-lg font-bold text-white tracking-tight">Candidate Resume</h2>
                  </div>
                  <p className="text-xs text-slate-400">Candidate background, skills & projects</p>
                </div>
              </div>

              {resume.trim().length > 30 ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Loaded
                </span>
              ) : (
                <span className="text-xs text-slate-500 bg-slate-800/60 px-2.5 py-0.5 rounded-full border border-slate-700/50">
                  Required
                </span>
              )}
            </div>

            {/* Document Upload Area */}
            <div className="mb-4">
              <input
                type="file"
                ref={resumeFileInputRef}
                onChange={handleResumeFileUpload}
                accept=".pdf,.txt,.md,.doc,.docx"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => resumeFileInputRef.current?.click()}
                disabled={isParsingResume}
                className="w-full py-3 px-4 rounded-2xl border border-dashed border-purple-500/40 hover:border-purple-400 bg-purple-950/30 hover:bg-purple-950/50 text-slate-200 text-xs font-medium flex items-center justify-center gap-2.5 transition-all group cursor-pointer"
              >
                <Upload className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>
                  {isParsingResume
                    ? 'Extracting text from resume...'
                    : resumeFileName
                    ? `Uploaded: ${resumeFileName} (Click to replace)`
                    : 'Upload Resume File (.pdf, .txt, .docx)'}
                </span>
              </button>
            </div>

            {/* Textarea with High Contrast Surface */}
            <div className="relative">
              <textarea
                value={resume}
                onChange={(e) => onUpdateResume(e.target.value)}
                placeholder="Paste your candidate resume here... (Education, technical skills, projects, metrics, achievements, experience)"
                className="w-full h-64 p-4 rounded-2xl bg-slate-950/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-inner resize-none transition-all leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 text-[11px] text-purple-300 font-mono bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700 shadow-sm">
                {resume.length.toLocaleString()} chars
              </div>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-purple-300/80">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              Audits: Fit score, claims to challenge & gaps
            </span>
          </div>
        </div>
      </div>

      {/* CTA Action Deck */}
      <div className="flex flex-col items-center justify-center gap-4">
        <button
          onClick={onStartAnalysis}
          disabled={!isReady || isLoading}
          className={`w-full sm:w-auto min-w-[320px] px-9 py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-300 ${
            isReady && !isLoading
              ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] cursor-pointer border border-white/20'
              : 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Role & Candidate Fit...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>Start Role & Candidate Analysis</span>
              <ArrowRight className="w-4 h-4 text-indigo-200" />
            </>
          )}
        </button>

        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Client-Side Private Parsing
          </span>
          <span>•</span>
          <span>Adaptive 3-Level Dynamic Probing</span>
          <span>•</span>
          <span>Voice & Video Enabled</span>
        </div>
      </div>
    </div>
  );
};

