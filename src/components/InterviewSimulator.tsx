import React, { useState, useEffect, useRef } from 'react';
import {
  RoleAnalysis,
  CandidateAnalysis,
  InterviewLevel,
  InterviewerPersona,
  InterviewTurn
} from '../types';
import { INTERVIEWER_PERSONAS } from '../data/presets';
import { AIService } from '../services/aiService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { analyzeSpeechTelemetry } from '../utils/fileParser';
import { VideoRoom } from './VideoRoom';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Volume2,
  CheckCircle,
  MessageSquare,
  AlertCircle,
  Award,
  Layers
} from 'lucide-react';

interface InterviewSimulatorProps {
  roleAnalysis: RoleAnalysis;
  candidateAnalysis: CandidateAnalysis;
  onFinishInterview: (turns: InterviewTurn[], telemetry: any) => void;
  onBackToFit: () => void;
}

export const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({
  roleAnalysis,
  candidateAnalysis,
  onFinishInterview,
  onBackToFit
}) => {
  // Level state (1 = Screening, 2 = Competency, 3 = Deep Dive)
  const [currentLevel, setCurrentLevel] = useState<InterviewLevel>(1);
  const [selectedPersona, setSelectedPersona] = useState<InterviewerPersona>(INTERVIEWER_PERSONAS[0]);
  const [turns, setTurns] = useState<InterviewTurn[]>([]);
  const [isGeneratingNextQ, setIsGeneratingNextQ] = useState(false);
  const [isEvaluatingTurn, setIsEvaluatingTurn] = useState(false);

  // Current active question
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [currentCategory, setCurrentCategory] = useState('Screening: Initial Project Context');
  const [currentRationale, setCurrentRationale] = useState('');
  const [isAdaptiveFollowUp, setIsAdaptiveFollowUp] = useState(false);

  // Speech hooks
  const {
    transcript,
    interimTranscript,
    isListening,
    audioLevel,
    startListening,
    stopListening,
    resetTranscript,
    setManualTranscript,
    error: speechError
  } = useSpeechRecognition();

  const { isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis();

  // Timer & Telemetry tracking
  const [durationSec, setDurationSec] = useState(0);
  const timerRef = useRef<any>(null);

  // Total session telemetry accumulation
  const [totalSessionDuration, setTotalSessionDuration] = useState(0);

  // Initialize first question on mount
  useEffect(() => {
    loadNextQuestion(1, 0, []);
  }, []);

  // Timer for current question answer
  useEffect(() => {
    if (isListening) {
      timerRef.current = setInterval(() => {
        setDurationSec(prev => prev + 1);
        setTotalSessionDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isListening]);

  // Read question aloud when new question arrives
  useEffect(() => {
    if (currentQuestionText) {
      speak(currentQuestionText, {
        pitch: selectedPersona.greetingVoicePitch || 1.0,
        rate: selectedPersona.greetingVoiceRate || 1.0
      });
    }
  }, [currentQuestionText, selectedPersona]);

  // Load next question
  const loadNextQuestion = async (
    level: InterviewLevel,
    turnCount: number,
    previousTurns: InterviewTurn[]
  ) => {
    setIsGeneratingNextQ(true);
    resetTranscript();
    setDurationSec(0);

    try {
      const qData = await AIService.generateAdaptiveQuestion(
        roleAnalysis,
        candidateAnalysis,
        level,
        turnCount,
        previousTurns,
        selectedPersona
      );

      setCurrentQuestionText(qData.questionText);
      setCurrentCategory(qData.category);
      setCurrentRationale(qData.rationale);
      setIsAdaptiveFollowUp(Boolean(qData.contextProbeClaim || turnCount > 0));
    } catch (err) {
      console.error('Failed to load next question:', err);
    } finally {
      setIsGeneratingNextQ(false);
    }
  };

  // Switch level manually if candidate wants to jump
  const handleSelectLevel = (newLevel: InterviewLevel) => {
    setCurrentLevel(newLevel);
    const turnsForLevel = turns.filter(t => t.level === newLevel);
    loadNextQuestion(newLevel, turnsForLevel.length, turns);
  };

  // Submit candidate answer
  const handleSubmitAnswer = async () => {
    const finalAnswer = transcript.trim();
    if (!finalAnswer) return;

    stopListening();
    stopSpeaking();
    setIsEvaluatingTurn(true);

    const telemetry = analyzeSpeechTelemetry(finalAnswer, durationSec);

    // Evaluate turn
    const evaluation = await AIService.evaluateAnswer(
      currentQuestionText,
      finalAnswer,
      currentLevel,
      currentCategory
    );

    const newTurn: InterviewTurn = {
      id: `turn-${Date.now()}`,
      questionNumber: turns.length + 1,
      level: currentLevel,
      category: currentCategory,
      questionText: currentQuestionText,
      rationale: currentRationale,
      candidateAnswerText: finalAnswer,
      audioDurationSec: durationSec,
      wpm: telemetry.wpm,
      fillerWordsFound: Object.keys(telemetry.fillerCounts),
      answerScore: evaluation.score,
      answerFeedback: evaluation,
      timestamp: new Date().toLocaleTimeString()
    };

    const updatedTurns = [...turns, newTurn];
    setTurns(updatedTurns);
    setIsEvaluatingTurn(false);

    // Determine next step in the progression
    // 2 questions per level, then graduate to next level!
    const turnsInCurrentLevel = updatedTurns.filter(t => t.level === currentLevel).length;

    if (turnsInCurrentLevel >= 2) {
      if (currentLevel === 1) {
        setCurrentLevel(2);
        loadNextQuestion(2, 0, updatedTurns);
      } else if (currentLevel === 2) {
        setCurrentLevel(3);
        loadNextQuestion(3, 0, updatedTurns);
      } else {
        // Level 3 finished! Finalize and trigger performance report
        finalizeSession(updatedTurns);
      }
    } else {
      loadNextQuestion(currentLevel, turnsInCurrentLevel, updatedTurns);
    }
  };

  const finalizeSession = (finalTurns: InterviewTurn[]) => {
    // Compile aggregate telemetry
    let totalWords = 0;
    let totalFillers = 0;
    const fillerBreakdown: Record<string, number> = {};

    finalTurns.forEach(turn => {
      const text = turn.candidateAnswerText || '';
      const parsed = analyzeSpeechTelemetry(text, turn.audioDurationSec || 60);
      totalWords += parsed.wordCount;
      totalFillers += parsed.totalFillers;
      Object.entries(parsed.fillerCounts).forEach(([k, v]) => {
        fillerBreakdown[k] = (fillerBreakdown[k] || 0) + v;
      });
    });

    const totalMins = Math.max(totalSessionDuration / 60, 0.5);
    const avgWpm = Math.round(totalWords / totalMins);

    const sessionTelemetry = {
      totalDurationSec: totalSessionDuration,
      avgWpm: avgWpm || 135,
      totalFillerCount: totalFillers,
      fillerBreakdown,
      pacingVerdict: avgWpm > 170 ? 'Fast-Paced' : avgWpm < 100 ? 'Deliberate' : 'Optimal Conversational Speed (120-155 WPM)',
      fluencyScore: Math.max(95 - totalFillers * 2, 70)
    };

    onFinishInterview(finalTurns, sessionTelemetry);
  };

  // Real-time telemetry for current answer
  const currentTelemetry = analyzeSpeechTelemetry(transcript, durationSec);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
      {/* Top Header & Level Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Adaptive Multi-Level Simulator
            </span>
            <span className="text-xs text-slate-400">Target: {roleAnalysis.roleTitle}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            AI Interview Room
          </h1>
        </div>

        {/* Level Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
          {[
            { level: 1, label: 'L1: Screening' },
            { level: 2, label: 'L2: Competency' },
            { level: 3, label: 'L3: Deep-Dive' }
          ].map(lvl => (
            <button
              key={lvl.level}
              onClick={() => handleSelectLevel(lvl.level as InterviewLevel)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentLevel === lvl.level
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Finish / Early Report CTA */}
        <button
          onClick={() => finalizeSession(turns)}
          disabled={turns.length === 0}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
            turns.length > 0
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Generate Performance Report ({turns.length} Turns)</span>
        </button>
      </div>

      {/* Main Video & Audio Conference Room */}
      <VideoRoom
        interviewer={selectedPersona}
        currentLevel={currentLevel}
        questionNumber={turns.length + 1}
        currentQuestionText={currentQuestionText}
        category={currentCategory}
        isAiSpeaking={isSpeaking}
        isCandidateListening={isListening}
        audioLevel={audioLevel}
        durationSec={durationSec}
        wpm={currentTelemetry.wpm}
        fillerCount={currentTelemetry.totalFillers}
        pacingVerdict={currentTelemetry.pacingVerdict}
        onReplayAiVoice={() => speak(currentQuestionText)}
        isAdaptiveFollowUp={isAdaptiveFollowUp}
      />

      {/* Interaction Controls & Real-Time Transcript Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left 2 Cols: Answer Response Deck & Transcript Input */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Candidate Spoken Response & Live Transcript</span>
            </div>

            {speechError && (
              <span className="text-[11px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                {speechError}
              </span>
            )}
          </div>

          {/* Real-time editable transcript window */}
          <div className="relative">
            <textarea
              value={transcript || interimTranscript}
              onChange={(e) => setManualTranscript(e.target.value)}
              placeholder="Click 'Start Speaking' (or hold mic) to record your voice response. You can also type or edit your answer directly here..."
              className="w-full h-32 p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm font-sans focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all leading-relaxed"
            />
            {interimTranscript && (
              <div className="absolute bottom-3 left-3 text-[11px] text-indigo-300 italic animate-pulse">
                Transcribing: {interimTranscript}...
              </div>
            )}
          </div>

          {/* Voice Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              {/* Mic toggle */}
              <button
                onClick={() => {
                  if (isListening) {
                    stopListening();
                  } else {
                    startListening();
                  }
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-600/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.02]'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>Stop Recording Answer</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>Start Speaking Answer</span>
                  </>
                )}
              </button>

              {/* Reset transcript */}
              {transcript && (
                <button
                  onClick={resetTranscript}
                  title="Clear & Re-record"
                  className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium flex items-center gap-1 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-record</span>
                </button>
              )}
            </div>

            {/* Submit & Next Button */}
            <button
              onClick={handleSubmitAnswer}
              disabled={(!transcript.trim() && !interimTranscript.trim()) || isEvaluatingTurn || isGeneratingNextQ}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                transcript.trim() && !isEvaluatingTurn && !isGeneratingNextQ
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 cursor-pointer hover:scale-[1.02]'
                  : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
              }`}
            >
              {isEvaluatingTurn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating Answer...</span>
                </>
              ) : isGeneratingNextQ ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Adaptive Follow-up...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Answer & Next Question</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 1 Col: Persona Selector & Turn Feed */}
        <div className="space-y-4">
          {/* Persona Switcher */}
          <div className="glass-card rounded-2xl p-5 border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              AI Interviewer Persona
            </div>
            <div className="space-y-2">
              {INTERVIEWER_PERSONAS.map(persona => (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
                    selectedPersona.id === persona.id
                      ? 'bg-indigo-600/15 border-indigo-500/50 text-white'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${persona.avatarBg} flex items-center justify-center text-xl shrink-0`}>
                    {persona.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-white truncate">{persona.name}</div>
                    <div className="text-[10px] text-indigo-300/80 truncate">{persona.style}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Completed Turns Live History */}
          <div className="glass-card rounded-2xl p-5 border-slate-800 max-h-64 overflow-y-auto">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Completed Turns</span>
              <span className="font-mono text-indigo-400">{turns.length}</span>
            </div>

            {turns.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">
                No answers submitted yet. Speak your answer to begin!
              </p>
            ) : (
              <div className="space-y-2.5">
                {turns.map((turn, idx) => (
                  <div key={turn.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                      <span className="text-indigo-300">Q#{idx + 1} (L{turn.level})</span>
                      <span className="text-emerald-400 font-mono">{turn.answerScore}/100</span>
                    </div>
                    <p className="text-slate-300 line-clamp-1 italic">"{turn.candidateAnswerText}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
