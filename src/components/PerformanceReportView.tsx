import React, { useEffect } from 'react';
import {
  PerformanceReport
} from '../types';
import confetti from 'canvas-confetti';
import {
  Award,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Brain,
  MessageSquare,
  ShieldCheck,
  Zap,
  BookOpen
} from 'lucide-react';

interface PerformanceReportViewProps {
  report: PerformanceReport;
  onRetakeInterview: () => void;
  onStartNewRole: () => void;
}

export const PerformanceReportView: React.FC<PerformanceReportViewProps> = ({
  report,
  onRetakeInterview,
  onStartNewRole
}) => {
  useEffect(() => {
    if (report.overallScore >= 75) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [report.overallScore]);

  // Readiness badge config
  const readinessConfig = {
    'Strong Candidate': {
      emoji: '🟢',
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      description: 'Candidate demonstrates strong readiness for the role.'
    },
    'Interview Ready': {
      emoji: '🟡',
      color: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
      description: 'Candidate can reasonably attempt the interview.'
    },
    'Needs Preparation': {
      emoji: '🟠',
      color: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
      description: 'Some important gaps remain before target interview.'
    },
    'Not Ready': {
      emoji: '🔴',
      color: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
      description: 'Significant preparation required across core competencies.'
    }
  }[report.readiness] || {
    emoji: '🟡',
    color: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
    description: 'Interview Ready.'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/20">
            <Award className="w-3.5 h-3.5" /> Step 4: Interview Performance Report
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interview Evaluation & Preparation Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Target Role: <strong className="text-slate-200">{report.roleTitle}</strong> • Evaluated on {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3 no-print">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            <span>Print / Save PDF</span>
          </button>
          <button
            onClick={onRetakeInterview}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Interview</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Grid: Overall Score + Readiness + Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 1. Overall Score Card */}
        <div className="glass-card rounded-2xl p-6 border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Overall Interview Score
          </div>
          <div className="flex items-baseline gap-2 my-auto">
            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              {report.overallScore}
            </span>
            <span className="text-xl font-bold text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 mt-4">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              style={{ width: `${report.overallScore}%` }}
            />
          </div>
        </div>

        {/* 2. Readiness Assessment Card */}
        <div className={`glass-card rounded-2xl p-6 border ${readinessConfig.color} flex flex-col justify-between`}>
          <div className="text-xs font-bold uppercase tracking-wider">
            Final Interview Readiness
          </div>
          <div className="my-auto">
            <div className="text-2xl sm:text-3xl font-black flex items-center gap-2 text-white">
              <span>{readinessConfig.emoji}</span>
              <span>{report.readiness}</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {report.readinessSummary}
            </p>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2 font-mono">
            Benchmarked against industry hiring bar
          </div>
        </div>

        {/* 3. Speaking Telemetry Analytics Card */}
        <div className="glass-card rounded-2xl p-6 border-slate-800 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Speech & Delivery Telemetry
          </div>
          <div className="grid grid-cols-2 gap-3 my-auto">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Pacing</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">{report.telemetry.avgWpm} WPM</div>
              <div className="text-[10px] text-indigo-400">{report.telemetry.pacingVerdict.split(' ')[0]}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Filler Words</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">{report.telemetry.totalFillerCount}</div>
              <div className="text-[10px] text-amber-400">Total detected</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2 flex items-center justify-between font-mono">
            <span>Fluency Index:</span>
            <span className="text-emerald-400 font-bold">{report.telemetry.fluencyScore}/100</span>
          </div>
        </div>
      </div>

      {/* Competency Breakdown Radar / Progress Bars */}
      <div className="glass-card rounded-2xl p-6 border-slate-800 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-sm uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Core Competency Scores</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">Evaluated across all 3 levels</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Role Fit', score: report.competencyScores.roleFit, color: 'from-emerald-500 to-teal-500' },
            { label: 'Technical Knowledge', score: report.competencyScores.technicalKnowledge, color: 'from-indigo-500 to-blue-500' },
            { label: 'Problem Solving', score: report.competencyScores.problemSolving, color: 'from-purple-500 to-pink-500' },
            { label: 'Communication', score: report.competencyScores.communication, color: 'from-cyan-500 to-blue-500' },
            { label: 'Confidence', score: report.competencyScores.confidence, color: 'from-amber-500 to-orange-500' },
            { label: 'Depth of Understanding', score: report.competencyScores.depthOfUnderstanding, color: 'from-rose-500 to-pink-500' },
            { label: 'Behavioural Fit', score: report.competencyScores.behaviouralFit, color: 'from-teal-500 to-emerald-500' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">{item.label}</span>
                <span className="text-xs font-mono font-bold text-white">{item.score}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Demonstrated Strengths */}
        <div className="glass-card rounded-2xl p-6 border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center gap-2.5 mb-4 text-emerald-400 font-bold text-sm uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Key Strengths Demonstrated</span>
          </div>
          <ul className="space-y-3">
            {report.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Identified Weaknesses */}
        <div className="glass-card rounded-2xl p-6 border-rose-500/20 bg-rose-950/10">
          <div className="flex items-center gap-2.5 mb-4 text-rose-400 font-bold text-sm uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Identified Weaknesses & Gaps</span>
          </div>
          <ul className="space-y-3">
            {report.weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Question-Level Feedback Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Question-by-Question Detailed Assessment</span>
          </div>
          <span className="text-xs text-slate-500">{report.questionFeedbacks.length} Questions Evaluated</span>
        </div>

        <div className="space-y-6">
          {report.questionFeedbacks.map((item, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                    Question #{item.questionNumber} (Level {item.level})
                  </span>
                  <span className="text-xs text-slate-400">{item.category}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Score:</span>
                  <span className="text-sm font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {item.score}/100
                  </span>
                </div>
              </div>

              {/* The Question Asked */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Interviewer Question
                </div>
                <p className="text-sm font-semibold text-white">
                  "{item.question}"
                </p>
              </div>

              {/* Candidate Answer */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
                  Candidate Answer
                </div>
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  "{item.candidateAnswer}"
                </p>
              </div>

              {/* Assessment Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {/* What Was Good */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> What Was Good
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.whatWasGood}
                  </p>
                </div>

                {/* What Could Be Better */}
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
                  <div className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> What Could Be Better
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.whatCouldBeBetter}
                  </p>
                </div>

                {/* Ideal Direction */}
                <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
                  <div className="text-xs font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Ideal Direction
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.idealDirection}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Prioritized Preparation Plan */}
      <div className="glass-card rounded-2xl p-6 border-indigo-500/30 bg-indigo-950/10 mb-8">
        <div className="flex items-center gap-2.5 mb-2 text-indigo-300 font-bold text-sm uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>Actionable Preparation Plan & Study Roadmap</span>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Prioritized topics you must review before your real interview to close remaining gaps:
        </p>

        <div className="space-y-6">
          {report.preparationGaps.map((gap, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-slate-900/90 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Priority {gap.priority}: {gap.topic}
                </span>
              </div>

              {/* Review Topics */}
              <div className="mt-3">
                <div className="text-xs font-semibold text-slate-300 mb-1.5">Review Key Concepts:</div>
                <div className="flex flex-wrap gap-2">
                  {gap.reviewTopics.map((topic, tidx) => (
                    <span key={tidx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-mono">
                      • {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Plan */}
              <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
                <strong className="text-indigo-300">Action Plan:</strong> {gap.actionPlan}
              </div>

              {/* Sample Practice Question */}
              <div className="mt-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <strong className="text-amber-300">Practice Question:</strong> "{gap.sampleQuestionToPractice}"
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 glass-card rounded-2xl border-slate-800 gap-4 no-print">
        <div>
          <h2 className="text-base font-bold text-white">Ready for your next round?</h2>
          <p className="text-xs text-slate-400">
            Retake the interview to measure your improvement, or test another role profile.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onStartNewRole}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-all"
          >
            Try Another Role
          </button>
          <button
            onClick={onRetakeInterview}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Interview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
