export interface RoleAnalysis {
  roleTitle: string;
  companyName?: string;
  seniorityLevel: string;
  summary: string;
  keyResponsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  technicalCompetencies: string[];
  behaviouralCompetencies: string[];
  experienceExpectations: string;
  importantKeywords: string[];
  importantConcepts: string[];
  keyQualifications: string[];
}

export interface RelevantExperience {
  role: string;
  company: string;
  duration?: string;
  highlight: string;
}

export interface RelevantProject {
  title: string;
  tech: string[];
  impact: string;
  claims?: string[];
}

export interface ResumeClaimToProbe {
  claim: string;
  context: string;
  probeAngle: string;
}

export interface CandidateAnalysis {
  candidateName?: string;
  candidateKeySkills: string[];
  relevantExperience: RelevantExperience[];
  relevantProjects: RelevantProject[];
  relevantAchievements: string[];
  strengthsAgainstJD: string[];
  missingSkills: string[];
  weakAreas: string[];
  resumeClaimsToProbe: ResumeClaimToProbe[];
  areasRequiringPrep: string[];
  jobFitScore: number; // e.g. 78
  matchBreakdown: {
    strongMatch: string[];
    partialMatch: string[];
    missingWeak: string[];
  };
}

export type InterviewLevel = 1 | 2 | 3;

export interface InterviewerPersona {
  id: string;
  name: string;
  title: string;
  avatar: string;
  avatarBg: string;
  accentColor: string;
  style: string;
  description: string;
  greetingVoicePitch?: number;
  greetingVoiceRate?: number;
}

export interface QuestionFeedbackItem {
  questionNumber: number;
  level: InterviewLevel;
  category: string;
  question: string;
  candidateAnswer: string;
  score: number;
  assessment: string;
  whatWasGood: string;
  whatCouldBeBetter: string;
  idealDirection: string;
}

export interface InterviewTurn {
  id: string;
  questionNumber: number;
  level: InterviewLevel;
  category: string;
  questionText: string;
  rationale?: string;
  contextProbeClaim?: string;
  candidateAnswerText?: string;
  audioDurationSec?: number;
  wpm?: number;
  fillerWordsFound?: string[];
  answerScore?: number;
  answerFeedback?: {
    score?: number;
    assessment: string;
    whatWasGood: string;
    whatCouldBeBetter: string;
    idealDirection: string;
  };
  timestamp: string;
}

export type ReadinessLevel = 'Not Ready' | 'Needs Preparation' | 'Interview Ready' | 'Strong Candidate';

export interface PreparationGap {
  priority: number;
  topic: string;
  reviewTopics: string[];
  actionPlan: string;
  sampleQuestionToPractice: string;
}

export interface PerformanceReport {
  id: string;
  createdAt: string;
  roleTitle: string;
  overallScore: number; // 0-100
  readiness: ReadinessLevel;
  readinessBadgeColor: 'red' | 'orange' | 'yellow' | 'green';
  readinessSummary: string;
  competencyScores: {
    roleFit: number;
    technicalKnowledge: number;
    problemSolving: number;
    communication: number;
    confidence: number;
    depthOfUnderstanding: number;
    behaviouralFit: number;
  };
  strengths: string[];
  weaknesses: string[];
  questionFeedbacks: QuestionFeedbackItem[];
  preparationGaps: PreparationGap[];
  telemetry: {
    totalDurationSec: number;
    avgWpm: number;
    totalFillerCount: number;
    fillerBreakdown: Record<string, number>;
    pacingVerdict: string;
    fluencyScore: number;
  };
}

export interface PresetProfile {
  id: string;
  title: string;
  roleSubtitle: string;
  jobDescriptionText: string;
  resumeText: string;
  tags: string[];
}
