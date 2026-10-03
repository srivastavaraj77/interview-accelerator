import React from 'react';
import {
  RoleAnalysis
} from '../types';
import {
  Briefcase,
  CheckCircle2,
  Code2,
  Brain,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';

interface RoleAnalysisViewProps {
  roleAnalysis: RoleAnalysis;
  onProceedToCandidate: () => void;
  onProceedToInterview: () => void;
}

export const RoleAnalysisView: React.FC<RoleAnalysisViewProps> = ({
  roleAnalysis,
  onProceedToCandidate,
  onProceedToInterview
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2 border border-indigo-500/20">
            <Briefcase className="w-3.5 h-3.5" /> Step 1: Understand the Role
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>{roleAnalysis.roleTitle}</span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium border border-slate-700">
              {roleAnalysis.seniorityLevel}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            {roleAnalysis.summary}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onProceedToCandidate}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
          >
            <span>Candidate Fit Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Role Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Column 1: Key Responsibilities & Qualifications */}
        <div className="space-y-6">
          {/* Key Responsibilities */}
          <div className="glass-card rounded-2xl p-6 border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-4 text-indigo-400 font-bold text-sm uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Responsibilities</span>
            </div>
            <ul className="space-y-3">
              {roleAnalysis.keyResponsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Qualifications */}
          <div className="glass-card rounded-2xl p-6 border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-4 text-purple-400 font-bold text-sm uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Key Qualifications</span>
            </div>
            <ul className="space-y-2.5">
              {roleAnalysis.keyQualifications.map((qual, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                  <span className="text-purple-400 font-bold text-xs mt-0.5">✓</span>
                  <span>{qual}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-300">Experience Expectation:</strong> {roleAnalysis.experienceExpectations}
            </div>
          </div>
        </div>

        {/* Column 2: Required & Preferred Skills */}
        <div className="space-y-6">
          {/* Required Skills */}
          <div className="glass-card rounded-2xl p-6 border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                <Code2 className="w-4 h-4" />
                <span>Required Skills</span>
              </div>
              <span className="text-[11px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                Mandatory
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {roleAnalysis.requiredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          <div className="glass-card rounded-2xl p-6 border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Preferred / Bonus Skills</span>
              </div>
              <span className="text-[11px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
                Nice-to-Have
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {roleAnalysis.preferredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-cyan-300 border border-cyan-500/30 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Important Keywords */}
          <div className="glass-card rounded-2xl p-6 border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Important Keywords</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {roleAnalysis.importantKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-mono"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Technical & Behavioural Competencies & Concepts */}
        <div className="space-y-6">
          {/* Technical Competencies */}
          <div className="glass-card rounded-2xl p-6 border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-4 text-blue-400 font-bold text-sm uppercase tracking-wider">
              <Code2 className="w-4 h-4" />
              <span>Technical Competencies</span>
            </div>
            <div className="space-y-2.5">
              {roleAnalysis.technicalCompetencies.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-200 font-medium"
                >
                  {comp}
                </div>
              ))}
            </div>
          </div>

          {/* Behavioural Competencies */}
          <div className="glass-card rounded-2xl p-6 border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-4 text-rose-400 font-bold text-sm uppercase tracking-wider">
              <Brain className="w-4 h-4" />
              <span>Behavioural Competencies</span>
            </div>
            <div className="space-y-2.5">
              {roleAnalysis.behaviouralCompetencies.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-200"
                >
                  {comp}
                </div>
              ))}
            </div>
          </div>

          {/* Important Concepts */}
          <div className="glass-card rounded-2xl p-6 border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-indigo-400 font-bold text-sm uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Important Concepts to Master</span>
            </div>
            <div className="space-y-2">
              {roleAnalysis.importantConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="text-xs text-slate-300 flex items-center gap-2 bg-indigo-950/20 border border-indigo-500/20 px-3 py-1.5 rounded-lg"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span>{concept}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 glass-card rounded-2xl border-slate-800 gap-4">
        <div>
          <h2 className="text-base font-bold text-white">Next Step: Candidate Resume Fit Analysis</h2>
          <p className="text-xs text-slate-400">
            Compare candidate resume against these requirements to detect match score, missing skills, and claims to probe.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onProceedToInterview}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-all"
          >
            Skip to Interview Room
          </button>
          <button
            onClick={onProceedToCandidate}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
          >
            <span>Proceed to Candidate Fit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
