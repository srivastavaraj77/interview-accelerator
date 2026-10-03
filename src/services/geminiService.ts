import {
  RoleAnalysis,
  CandidateAnalysis,
  InterviewLevel,
  InterviewTurn,
  PerformanceReport,
  InterviewerPersona
} from '../types';

export class GeminiService {
  private static API_KEY_STORAGE = 'interview_accelerator_gemini_key';

  static getApiKey(): string {
    return localStorage.getItem(this.API_KEY_STORAGE) || '';
  }

  static setApiKey(key: string): void {
    localStorage.setItem(this.API_KEY_STORAGE, key.trim());
  }

  static hasApiKey(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.length > 5);
  }

  static removeApiKey(): void {
    localStorage.removeItem(this.API_KEY_STORAGE);
  }

  /**
   * Helper to call Google Gemini REST API
   */
  private static async callGemini(prompt: string, systemInstruction?: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('No Gemini API key provided.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const body: any = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json'
      }
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Empty response received from Gemini.');
    }

    return rawText;
  }

  /**
   * AI Analysis of Role/JD
   */
  static async analyzeRole(jdText: string): Promise<RoleAnalysis> {
    const prompt = `
You are an expert technical recruiter and AI talent architect. Analyze the following Job Description (JD) and return a JSON object with this exact schema:
{
  "roleTitle": string,
  "companyName": string (if found or "Target Enterprise"),
  "seniorityLevel": string (e.g. "Entry Level", "Internship", "Senior", etc.),
  "summary": string (concise 2-sentence summary of role essence),
  "keyResponsibilities": string[] (4-6 key duties),
  "requiredSkills": string[] (5-8 hard skills/technologies),
  "preferredSkills": string[] (3-5 bonus/preferred skills),
  "technicalCompetencies": string[] (3-5 deep technical capabilities),
  "behaviouralCompetencies": string[] (3-4 behavioural traits),
  "experienceExpectations": string,
  "importantKeywords": string[] (8-12 keywords),
  "importantConcepts": string[] (4-6 conceptual foundations to test),
  "keyQualifications": string[] (3-5 required credentials/degrees)
}

Job Description:
${jdText}
`;

    const raw = await this.callGemini(prompt, 'You are a meticulous AI recruiter. Output valid JSON only.');
    return JSON.parse(raw) as RoleAnalysis;
  }

  /**
   * AI Analysis of Candidate Fit
   */
  static async analyzeCandidate(jdText: string, resumeText: string, role: RoleAnalysis): Promise<CandidateAnalysis> {
    const prompt = `
Analyze the candidate's resume against the target Job Description (JD) and role requirements.
Return a JSON object with this exact structure:
{
  "candidateName": string,
  "candidateKeySkills": string[],
  "relevantExperience": [
    { "role": string, "company": string, "duration": string, "highlight": string }
  ],
  "relevantProjects": [
    { "title": string, "tech": string[], "impact": string, "claims": string[] }
  ],
  "relevantAchievements": string[],
  "strengthsAgainstJD": string[] (3-5 clear strengths),
  "missingSkills": string[] (skills required by JD but missing on resume),
  "weakAreas": string[] (areas where candidate profile is light or unproven),
  "resumeClaimsToProbe": [
    { "claim": string, "context": string, "probeAngle": string }
  ],
  "areasRequiringPrep": string[],
  "jobFitScore": number (0-100 realistic match percentage based on required skills),
  "matchBreakdown": {
    "strongMatch": string[],
    "partialMatch": string[],
    "missingWeak": string[]
  }
}

Job Description:
${jdText}

Role Requirements:
${JSON.stringify(role.requiredSkills)}

Candidate Resume:
${resumeText}
`;

    const raw = await this.callGemini(prompt, 'You are an objective hiring assessor. Output strictly valid JSON.');
    return JSON.parse(raw) as CandidateAnalysis;
  }

  /**
   * Generates dynamic adaptive question based on Level and prior responses
   */
  static async generateQuestion(
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
    const lastTurn = previousTurns[previousTurns.length - 1];
    const conversationHistory = previousTurns.map(t => ({
      q: t.questionText,
      a: t.candidateAnswerText || '(No answer provided)',
      level: t.level
    }));

    const prompt = `
You are conducting an AI-powered mock interview as "${interviewer.name}" (${interviewer.title}, Style: ${interviewer.style}).
Current Interview Level: ${level} (1 = Screening, 2 = Competency, 3 = Deep Dive).
Turn Number: ${turnCount + 1}.

Candidate Context:
- Target Role: ${role.roleTitle}
- Candidate Name: ${candidate.candidateName || 'Candidate'}
- Key Projects: ${JSON.stringify(candidate.relevantProjects)}
- Resume Claims to Probe: ${JSON.stringify(candidate.resumeClaimsToProbe)}
- Strengths: ${JSON.stringify(candidate.strengthsAgainstJD)}
- Missing/Weak Areas: ${JSON.stringify(candidate.missingSkills.concat(candidate.weakAreas))}

Conversation History So Far:
${JSON.stringify(conversationHistory, null, 2)}

Level Guidelines:
- Level 1 (Screening): Focus on candidate background, project ownership, motivation, and role fit. Instead of generic "tell me about yourself", reference an actual project or skill from their resume!
- Level 2 (Competency): Progressively challenge technical depth, problem-solving, architectural choices, and practical application.
- Level 3 (Deep Dive): Rigorous challenge! Probe specific claims made in their resume or previous answers ("You claimed X%, how did you measure it?"), challenge vague answers, test edge cases, and ask tough "Why" and "How" questions.

Output valid JSON matching:
{
  "questionText": string (the exact spoken question by the interviewer),
  "category": string (e.g. "Screening: Project Contribution", "Deep-Dive: Evaluation Metrics", etc.),
  "rationale": string (why this question was chosen based on context),
  "contextProbeClaim": string (optional claim probed)
}
`;

    const raw = await this.callGemini(prompt, 'You are an expert interview simulator. Output valid JSON.');
    return JSON.parse(raw);
  }

  /**
   * Evaluates entire session and generates detailed Performance Report
   */
  static async generateReport(
    role: RoleAnalysis,
    candidate: CandidateAnalysis,
    turns: InterviewTurn[],
    telemetryData: any
  ): Promise<PerformanceReport> {
    const prompt = `
Evaluate the candidate's interview session for the role of "${role.roleTitle}".
Analyze their answers across each turn, identifying strengths, weaknesses, question-level scores, and actionable preparation roadmap.

Candidate Profile & Context:
- Role: ${role.roleTitle}
- Candidate: ${candidate.candidateName}
- Required Skills: ${JSON.stringify(role.requiredSkills)}

Interview Turns:
${JSON.stringify(turns.map(t => ({
  question: t.questionText,
  answer: t.candidateAnswerText,
  level: t.level,
  category: t.category
})), null, 2)}

Telemetry:
${JSON.stringify(telemetryData)}

Output valid JSON matching this schema:
{
  "overallScore": number (0-100),
  "readiness": "Not Ready" | "Needs Preparation" | "Interview Ready" | "Strong Candidate",
  "readinessBadgeColor": "red" | "orange" | "yellow" | "green",
  "readinessSummary": string (2-3 sentences explaining readiness verdict),
  "competencyScores": {
    "roleFit": number (0-100),
    "technicalKnowledge": number (0-100),
    "problemSolving": number (0-100),
    "communication": number (0-100),
    "confidence": number (0-100),
    "depthOfUnderstanding": number (0-100),
    "behaviouralFit": number (0-100)
  },
  "strengths": string[] (3-5 specific strengths demonstrated),
  "weaknesses": string[] (3-5 specific weaknesses or missing depth),
  "questionFeedbacks": [
    {
      "questionNumber": number,
      "level": number (1, 2, or 3),
      "category": string,
      "question": string,
      "candidateAnswer": string,
      "score": number (0-100),
      "assessment": string (detailed evaluation of the answer),
      "whatWasGood": string (concrete positive highlight),
      "whatCouldBeBetter": string (actionable critique, not generic),
      "idealDirection": string (how a top 1% candidate would answer)
    }
  ],
  "preparationGaps": [
    {
      "priority": 1,
      "topic": string,
      "reviewTopics": string[] (3-5 concepts to study),
      "actionPlan": string,
      "sampleQuestionToPractice": string
    },
    {
      "priority": 2,
      "topic": string,
      "reviewTopics": string[],
      "actionPlan": string,
      "sampleQuestionToPractice": string
    },
    {
      "priority": 3,
      "topic": string,
      "reviewTopics": string[],
      "actionPlan": string,
      "sampleQuestionToPractice": string
    }
  ]
}
`;

    const raw = await this.callGemini(prompt, 'You are an authoritative hiring committee chairperson. Output strictly valid JSON.');
    const parsed = JSON.parse(raw);

    return {
      id: `report-${Date.now()}`,
      createdAt: new Date().toISOString(),
      roleTitle: role.roleTitle,
      overallScore: parsed.overallScore || 76,
      readiness: parsed.readiness || 'Interview Ready',
      readinessBadgeColor: parsed.readinessBadgeColor || 'yellow',
      readinessSummary: parsed.readinessSummary || 'Solid foundation with key areas for further refinement.',
      competencyScores: parsed.competencyScores || {
        roleFit: 80,
        technicalKnowledge: 78,
        problemSolving: 75,
        communication: 82,
        confidence: 79,
        depthOfUnderstanding: 74,
        behaviouralFit: 80
      },
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      questionFeedbacks: parsed.questionFeedbacks || [],
      preparationGaps: parsed.preparationGaps || [],
      telemetry: {
        totalDurationSec: telemetryData?.totalDurationSec || 240,
        avgWpm: telemetryData?.avgWpm || 135,
        totalFillerCount: telemetryData?.totalFillerCount || 3,
        fillerBreakdown: telemetryData?.fillerBreakdown || {},
        pacingVerdict: telemetryData?.pacingVerdict || 'Optimal Conversational Speed',
        fluencyScore: telemetryData?.fluencyScore || 90
      }
    };
  }
}
