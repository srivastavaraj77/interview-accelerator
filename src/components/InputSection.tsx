import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Briefcase,
  UserCheck,
  Zap
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

  const isReady = jobDescription.trim().length > 30 && resume.trim().length > 30;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          AI-Powered Interview Accelerator
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Master your job interview with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Hyper-Personalized AI
          </span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          Paste or upload your target <strong className="text-slate-200">Job Description</strong> and <strong className="text-slate-200">Resume</strong>.
          Our AI analyzes role competencies, pinpoints preparation gaps, and conducts a 3-level adaptive voice & video mock interview.
        </p>

        {/* Quick Presets selector */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick 1-Click Profiles:
          </span>
          {PRESET_PROFILES.map(preset => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/70 hover:border-indigo-500/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all shadow-sm"
            >
              {preset.title.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Ingestion Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left: Job Description Input */}
        <div className="glass-card rounded-2xl p-6 relative flex flex-col justify-between border-slate-800/80">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">1. Job Description (JD)</h2>
                  <p className="text-xs text-slate-400">Paste JD text or upload a PDF / Doc file</p>
                </div>
              </div>
              {jobDescription.trim().length > 30 && (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle className="w-3.5 h-3.5" /> Ready
                </span>
              )}
            </div>

            {/* Upload Area */}
            <div className="mb-4">
              <input
                type="file"
                ref={jdFileInputRef}
                onChange={handleJdFileUpload}
                accept=".pdf,.txt,.md,.doc,.docx"
                className="hidden"
              />
              <button
                onClick={() => jdFileInputRef.current?.click()}
                disabled={isParsingJd}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500/70 bg-slate-900/50 hover:bg-slate-900/90 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>{isParsingJd ? 'Extracting text from document...' : jdFileName ? `Uploaded: ${jdFileName} (Click to change)` : 'Upload JD File (.pdf, .txt, .docx)'}</span>
              </button>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={jobDescription}
                onChange={(e) => onUpdateJobDescription(e.target.value)}
                placeholder="Paste the target job description here... (Responsibilities, required skills, preferred qualifications)"
                className="w-full h-64 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all"
              />
              <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                {jobDescription.length} characters
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Identifies: Responsibilities, Required/Preferred Skills, Tech Stack</span>
          </div>
        </div>

        {/* Right: Candidate Resume Input */}
        <div className="glass-card rounded-2xl p-6 relative flex flex-col justify-between border-slate-800/80">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">2. Candidate Resume</h2>
                  <p className="text-xs text-slate-400">Paste your resume or upload a PDF document</p>
                </div>
              </div>
              {resume.trim().length > 30 && (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle className="w-3.5 h-3.5" /> Ready
                </span>
              )}
            </div>

            {/* Upload Area */}
            <div className="mb-4">
              <input
                type="file"
                ref={resumeFileInputRef}
                onChange={handleResumeFileUpload}
                accept=".pdf,.txt,.md,.doc,.docx"
                className="hidden"
              />
              <button
                onClick={() => resumeFileInputRef.current?.click()}
                disabled={isParsingResume}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-700 hover:border-purple-500/70 bg-slate-900/50 hover:bg-slate-900/90 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Upload className="w-4 h-4 text-purple-400" />
                <span>{isParsingResume ? 'Extracting text from resume...' : resumeFileName ? `Uploaded: ${resumeFileName} (Click to change)` : 'Upload Resume File (.pdf, .txt, .docx)'}</span>
              </button>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={resume}
                onChange={(e) => onUpdateResume(e.target.value)}
                placeholder="Paste your candidate resume here... (Education, technical skills, projects, achievements, experience)"
                className="w-full h-64 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none transition-all"
              />
              <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                {resume.length} characters
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Extracts: Key Skills, Projects, Numerical Claims, Experience</span>
          </div>
        </div>
      </div>

      {/* CTA Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onStartAnalysis}
          disabled={!isReady || isLoading}
          className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all ${
            isReady && !isLoading
              ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
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
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
