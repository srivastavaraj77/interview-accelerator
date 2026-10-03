import { GeminiService } from './geminiService';
import { MockAiEngine } from './mockAiEngine';
import {
  RoleAnalysis,
  CandidateAnalysis,
  InterviewLevel,
  InterviewTurn,
  PerformanceReport,
  InterviewerPersona
} from '../types';

export class AIService {
  static isGeminiConfigured(): boolean {
    return GeminiService.hasApiKey();
  }

  static async analyzeRole(jdText: string): Promise<RoleAnalysis> {
    if (this.isGeminiConfigured()) {
      try {
        return await GeminiService.analyzeRole(jdText);
      } catch (err) {
        console.warn('Gemini API call failed, using intelligent offline engine:', err);
      }
    }
    // Fallback heuristic engine
    await new Promise(r => setTimeout(r, 600)); // Simulate brief realistic thinking
    return MockAiEngine.analyzeRole(jdText);
  }

  static async analyzeCandidateFit(jdText: string, resumeText: string, role: RoleAnalysis): Promise<CandidateAnalysis> {
    if (this.isGeminiConfigured()) {
      try {
        return await GeminiService.analyzeCandidate(jdText, resumeText, role);
      } catch (err) {
        console.warn('Gemini API call failed, using intelligent offline engine:', err);
      }
    }
    await new Promise(r => setTimeout(r, 700));
    return MockAiEngine.analyzeCandidate(jdText, resumeText, role);
  }

  static async generateAdaptiveQuestion(
    role: RoleAnalysis,
    candidate: CandidateAnalysis,
    level: InterviewLevel,
    turnCount: number,
    previousTurns: InterviewTurn[],
    interviewer: InterviewerPersona
  ): Promise<{
    questionText: string;
    category: string;
    rationale: string;
    contextProbeClaim?: string;
  }> {
    if (this.isGeminiConfigured()) {
      try {
        return await GeminiService.generateQuestion(role, candidate, level, turnCount, previousTurns, interviewer);
      } catch (err) {
        console.warn('Gemini Question generation failed, using intelligent offline engine:', err);
      }
    }
    await new Promise(r => setTimeout(r, 500));
    return MockAiEngine.generateQuestion(role, candidate, level, turnCount, previousTurns);
  }

  static async evaluateAnswer(
    question: string,
    answer: string,
    level: InterviewLevel,
    category: string
  ) {
    return MockAiEngine.evaluateAnswer(question, answer, level, category);
  }

  static async generateReport(
    role: RoleAnalysis,
    candidate: CandidateAnalysis,
    turns: InterviewTurn[],
    telemetryData: any
  ): Promise<PerformanceReport> {
    if (this.isGeminiConfigured()) {
      try {
        return await GeminiService.generateReport(role, candidate, turns, telemetryData);
      } catch (err) {
        console.warn('Gemini Report generation failed, using intelligent offline engine:', err);
      }
    }
    await new Promise(r => setTimeout(r, 900));
    return MockAiEngine.generateReport(role, candidate, turns, telemetryData);
  }
}
