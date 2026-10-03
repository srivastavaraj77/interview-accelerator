import React from 'react';
import {
  RoleAnalysis,
  CandidateAnalysis
} from '../types';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Search,
  Code2,
  FolderGit2,
  ArrowRight,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

interface CandidateFitViewProps {
  roleAnalysis: RoleAnalysis;
  candidateAnalysis: CandidateAnalysis;
  onStartInterview: () => void;
  onBackToRole: () => void;
}

export const CandidateFitView: React.FC<CandidateFitViewProps> = ({
  roleAnalysis,
  candidateAnalysis,
  onStartInterview,
  onBackToRole
}) => {
  const { jobFitScore, matchBreakdown } = candidateAnalysis;

  // Color and rating based on fit score
  let scoreColor = 'text-amber-400 border-amber-400/40 bg-amber-500/10';
  let scoreBadge = 'Moderate Match (Gaps to address)';
  if (jobFitScore >= 80) {
    scoreColor = 'text-emerald-400 border-emerald-400/40 bg-emerald-500/10';
    scoreBadge = 'Strong Fit for Role';
  } else if (jobFitScore < 65) {
    scoreColor = 'text-rose-400 border-rose-400/40 bg-rose-500/10';
    scoreBadge = 'High Gaps Identified';
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header & Job Fit Score Hero */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-2 border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Step 2: Candidate & Job Fit Analysis
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>{candidateAnalysis.candidateName || 'Candidate Profile'}</span>
            <span className="text-slate-500 text-lg font-normal">vs.</span>
            <span className="text-indigo-400 text-xl font-bold">{roleAnalysis.roleTitle}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Objective alignment between candidate claims, skills, projects, and target role expectations.
          </p>
        </div>

        {/* Job Fit Radial / Badge Widget */}
        <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 ${scoreColor} shadow-lg font-mono`}>
            <span className="text-2xl font-black">{jobFitScore}%</span>
            <span className="text-[10px] uppercase font-bold tracking-wider">Job Fit</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assessment</div>
            <div className="text-sm font-bold text-white mt-0.5">{scoreBadge}</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-emerald-400">✓ {matchBreakdown.strongMatch.length} Strong</span>
              <span className="text-amber-400">~ {matchBreakdown.partialMatch.length} Partial</span>
              <span className="text-rose-400">✗ {matchBreakdown.missingWeak.length} Gaps</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Match Breakdown (Strong, Partial, Missing/Weak) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Strong Match */}
        <div className="glass-card rounded-2xl p-5 border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Strong Match</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              {matchBreakdown.strongMatch.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">Skills & experiences matching target requirements:</p>
          <div className="flex flex-wrap gap-1.5">
            {matchBreakdown.strongMatch.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-medium"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Partial Match */}
        <div className="glass-card rounded-2xl p-5 border-amber-500/20 bg-amber-950/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Partial Match</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
              {matchBreakdown.partialMatch.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">Competencies requiring minor refinement:</p>
          <div className="flex flex-wrap gap-1.5">
            {matchBreakdown.partialMatch.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-medium"
              >
                ~ {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing / Weak */}
        <div className="glass-card rounded-2xl p-5 border-rose-500/20 bg-rose-950/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>Missing / Weak</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold">
              {matchBreakdown.missingWeak.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">Role expectations unproven on candidate resume:</p>
          <div className="flex flex-wrap gap-1.5">
            {matchBreakdown.missingWeak.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-medium"
              >
                ✗ {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Analysis Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column: Strengths & Claims to Probe */}
        <div className="space-y-6">
          {/* Strengths Against JD */}
          <div className="glass-card rounded-2xl p-6 border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-4 text-emerald-400 font-bold text-sm uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Demonstrated Strengths Against JD</span>
            </div>
            <ul className="space-y-3">
              {candidateAnalysis.strengthsAgainstJD.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CRITICAL: Resume Claims to Probe */}
          <div className="glass-card rounded-2xl p-6 border-indigo-500/30 bg-indigo-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2.5 mb-3 text-indigo-300 font-bold text-sm uppercase tracking-wider">
              <Search className="w-4 h-4 text-indigo-400" />
              <span>Potential Resume Claims to Probe (Level 3 Deep-Dive)</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Specific claims and numbers identified from your resume that the AI interviewer will rigorously test:
            </p>
            <div className="space-y-3">
              {candidateAnalysis.resumeClaimsToProbe.map((claimItem, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/20 text-xs sm:text-sm">
                  <div className="text-indigo-200 font-semibold mb-1 flex items-center gap-1.5">
                    <span className="text-amber-400 font-mono">#{idx + 1}</span>
                    <span>"{claimItem.claim}"</span>
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    <strong className="text-slate-300">Context:</strong> {claimItem.context}
                  </div>
                  <div className="text-amber-300/90 text-xs mt-1.5 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                    <strong className="text-amber-200">Interviewer Probe Angle:</strong> {claimItem.probeAngle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Projects, Key Skills & Areas Requiring Prep */}
        <div className="space-y-6">
          {/* Key Projects */}
          <div className="glass-card rounded-2xl p-6 border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-4 text-purple-400 font-bold text-sm uppercase tracking-wider">
              <FolderGit2 className="w-4 h-4" />
              <span>Relevant Projects & Impact</span>
            </div>
            <div className="space-y-4">
              {candidateAnalysis.relevantProjects.map((proj, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">{proj.title}</span>
                    <div className="flex gap-1">
                      {proj.tech.slice(0, 3).map((t, tidx) => (
                        <span key={tidx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{proj.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Areas Requiring Prep */}
          <div className="glass-card rounded-2xl p-6 border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Areas That Require Additional Preparation</span>
            </div>
            <ul className="space-y-2.5">
              {candidateAnalysis.areasRequiringPrep.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                  <span className="text-amber-400 font-bold text-xs mt-0.5">!</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Candidate Key Skills Cloud */}
          <div className="glass-card rounded-2xl p-5 border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-3 text-slate-300 font-bold text-xs uppercase tracking-wider">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Candidate Skill Inventory</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {candidateAnalysis.candidateKeySkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 glass-card rounded-2xl border-slate-800 gap-4">
        <div>
          <h2 className="text-base font-bold text-white">Next Step: Launch AI Interview Simulator</h2>
          <p className="text-xs text-slate-400">
            Experience Level 1 (Screening) ➔ Level 2 (Competency) ➔ Level 3 (Deep-Dive) with real-time voice, video & telemetry.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onBackToRole}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-all"
          >
            Back to Role
          </button>
          <button
            onClick={onStartInterview}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/30 hover:scale-[1.02] transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Launch AI Interview Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
