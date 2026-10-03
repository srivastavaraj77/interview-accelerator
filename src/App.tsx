import React, { useState, useEffect } from 'react';
import {
  RoleAnalysis,
  CandidateAnalysis,
  InterviewTurn,
  PerformanceReport
} from './types';
import { PRESET_PROFILES } from './data/presets';
import { AIService } from './services/aiService';
import { Navbar } from './components/Navbar';
import { InputSection } from './components/InputSection';
import { RoleAnalysisView } from './components/RoleAnalysisView';
import { CandidateFitView } from './components/CandidateFitView';
import { InterviewSimulator } from './components/InterviewSimulator';
import { PerformanceReportView } from './components/PerformanceReportView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { HistoryModal } from './components/HistoryModal';

export function App() {
  // Navigation & Step tracking: 0 = Input, 1 = Role, 2 = Candidate Fit, 3 = Interview, 4 = Report
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Ingestion inputs (defaulting to the studentcredibility AI Engineer Intern challenge)
  const [jobDescription, setJobDescription] = useState<string>(PRESET_PROFILES[0].jobDescriptionText);
  const [resume, setResume] = useState<string>(PRESET_PROFILES[0].resumeText);

  // Computed state
  const [roleAnalysis, setRoleAnalysis] = useState<RoleAnalysis | null>(null);
  const [candidateAnalysis, setCandidateAnalysis] = useState<CandidateAnalysis | null>(null);
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);

  // Loading states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Modals & Storage
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(AIService.isGeminiConfigured());
  const [savedReports, setSavedReports] = useState<PerformanceReport[]>([]);

  // Load saved history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('interview_accelerator_reports');
      if (stored) {
        setSavedReports(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load stored reports:', e);
    }
  }, []);

  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_PROFILES.find(p => p.id === presetId);
    if (found) {
      setJobDescription(found.jobDescriptionText);
      setResume(found.resumeText);
      setRoleAnalysis(null);
      setCandidateAnalysis(null);
      setPerformanceReport(null);
      setCurrentStep(0);
    }
  };

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // 1. Analyze Role
      const roleResult = await AIService.analyzeRole(jobDescription);
      setRoleAnalysis(roleResult);

      // 2. Analyze Candidate Fit against Role
      const candidateResult = await AIService.analyzeCandidateFit(jobDescription, resume, roleResult);
      setCandidateAnalysis(candidateResult);

      // Advance to Step 1 (Role Analysis)
      setCurrentStep(1);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinishInterview = async (turns: InterviewTurn[], telemetry: any) => {
    if (!roleAnalysis || !candidateAnalysis) return;

    setIsAnalyzing(true);
    try {
      const report = await AIService.generateReport(roleAnalysis, candidateAnalysis, turns, telemetry);
      setPerformanceReport(report);

      // Save to localStorage
      const updatedReports = [report, ...savedReports.slice(0, 9)];
      setSavedReports(updatedReports);
      try {
        localStorage.setItem('interview_accelerator_reports', JSON.stringify(updatedReports));
      } catch (e) {}

      setCurrentStep(4);
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetakeInterview = () => {
    setCurrentStep(3);
  };

  const handleStartNewRole = () => {
    setCurrentStep(0);
  };

  const canNavigateTo = (step: number) => {
    if (step === 0) return true;
    if (step === 1) return Boolean(roleAnalysis);
    if (step === 2) return Boolean(candidateAnalysis);
    if (step === 3) return Boolean(roleAnalysis && candidateAnalysis);
    if (step === 4) return Boolean(performanceReport);
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <Navbar
        currentStep={currentStep}
        onNavigateStep={(step) => {
          if (canNavigateTo(step)) setCurrentStep(step);
        }}
        canNavigateTo={canNavigateTo}
        onOpenApiKey={() => setIsApiKeyModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        hasApiKey={hasApiKey}
        onSelectPreset={handleSelectPreset}
      />

      {/* Main Screen Content */}
      <main className="flex-1 flex flex-col justify-start">
        {currentStep === 0 && (
          <InputSection
            jobDescription={jobDescription}
            resume={resume}
            onUpdateJobDescription={setJobDescription}
            onUpdateResume={setResume}
            onStartAnalysis={handleStartAnalysis}
            isLoading={isAnalyzing}
            onSelectPreset={handleSelectPreset}
          />
        )}

        {currentStep === 1 && roleAnalysis && (
          <RoleAnalysisView
            roleAnalysis={roleAnalysis}
            onProceedToCandidate={() => setCurrentStep(2)}
            onProceedToInterview={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 2 && roleAnalysis && candidateAnalysis && (
          <CandidateFitView
            roleAnalysis={roleAnalysis}
            candidateAnalysis={candidateAnalysis}
            onStartInterview={() => setCurrentStep(3)}
            onBackToRole={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && roleAnalysis && candidateAnalysis && (
          <InterviewSimulator
            roleAnalysis={roleAnalysis}
            candidateAnalysis={candidateAnalysis}
            onFinishInterview={handleFinishInterview}
            onBackToFit={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && performanceReport && (
          <PerformanceReportView
            report={performanceReport}
            onRetakeInterview={handleRetakeInterview}
            onStartNewRole={handleStartNewRole}
          />
        )}
      </main>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={() => setHasApiKey(AIService.isGeminiConfigured())}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        savedReports={savedReports}
        onSelectReport={(report) => {
          setPerformanceReport(report);
          setCurrentStep(4);
        }}
        onClearHistory={() => {
          setSavedReports([]);
          localStorage.removeItem('interview_accelerator_reports');
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-400">Interview Accelerator</span> — AI Product Engineer Assignment 3
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Powered by Gemini & Web Voice AI</span>
            <span>•</span>
            <span className="text-indigo-400">studentcredibility.com Aligned</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
