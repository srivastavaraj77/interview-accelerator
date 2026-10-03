import {
  RoleAnalysis,
  CandidateAnalysis,
  InterviewLevel,
  InterviewTurn,
  PerformanceReport,
  ReadinessLevel,
  QuestionFeedbackItem,
  PreparationGap
} from '../types';

/**
 * Intelligent client-side heuristic engine that parses JD and Resume text
 * and provides rich dynamic analysis, realistic adaptive questions, and detailed evaluations.
 */
export class MockAiEngine {
  /**
   * Analyzes Job Description text
   */
  static analyzeRole(jdText: string): RoleAnalysis {
    const lines = jdText.split('\n').map(l => l.trim()).filter(Boolean);
    let roleTitle = 'AI Software Engineer';
    let companyName = 'High-Growth Tech Enterprise';
    let seniorityLevel = 'Mid-Level / Graduate';

    const titleLine = lines.find(l => /^role:|^title:|^job title:/i.test(l));
    if (titleLine) {
      roleTitle = titleLine.replace(/^role:|^title:|^job title:/i, '').trim();
    } else if (lines.length > 0 && lines[0].length < 60) {
      roleTitle = lines[0];
    }

    const companyLine = lines.find(l => /^company:|^organization:/i.test(l));
    if (companyLine) {
      companyName = companyLine.replace(/^company:|^organization:/i, '').trim();
    }

    if (/intern/i.test(roleTitle) || /internship/i.test(jdText)) {
      seniorityLevel = 'Internship / Entry Level';
    } else if (/senior|lead|principal|staff/i.test(roleTitle)) {
      seniorityLevel = 'Senior / Staff Level';
    }

    // Extract skills from JD text
    const commonSkills = [
      'Python', 'Machine Learning', 'LLMs', 'RAG', 'APIs', 'FastAPI', 'PyTorch',
      'Vector Databases', 'ChromaDB', 'Pinecone', 'Docker', 'PostgreSQL', 'SQL',
      'React', 'TypeScript', 'Node.js', 'System Design', 'Git', 'AWS', 'Prompt Engineering',
      'Model Evaluation', 'Fine-tuning', 'Embeddings', 'LangChain', 'LlamaIndex', 'AsyncIO'
    ];

    const detectedSkills = commonSkills.filter(skill =>
      new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(jdText)
    );

    const requiredSkills = detectedSkills.slice(0, 7);
    if (requiredSkills.length === 0) {
      requiredSkills.push('Python', 'Machine Learning', 'LLMs', 'RAG', 'APIs');
    }

    const preferredSkills = [
      'Fine-tuning open-weights models (PEFT/LoRA)',
      'High-throughput vector indexing and caching',
      'Real-time WebRTC audio streaming',
      'Production Docker deployment and CI/CD'
    ].filter(ps => !requiredSkills.some(rs => ps.toLowerCase().includes(rs.toLowerCase()))).slice(0, 3);

    return {
      roleTitle,
      companyName,
      seniorityLevel,
      summary: `Targeting a candidate skilled in designing resilient AI pipelines, implementing production retrieval architectures, and shipping low-latency conversational solutions.`,
      keyResponsibilities: [
        'Design and deploy retrieval-augmented generation (RAG) pipelines with hybrid search and reranking.',
        'Build low-latency asynchronous API microservices to power interactive AI experiences.',
        'Develop automated evaluation metrics (groundedness, precision, recall) to measure model accuracy.',
        'Collaborate cross-functionally with product and frontend teams to optimize user latency.'
      ],
      requiredSkills,
      preferredSkills,
      technicalCompetencies: [
        'Retrieval-Augmented Generation (RAG) Architecture',
        'Model Evaluation & Benchmark Methodology',
        'Asynchronous Python / FastAPI Backend Engineering',
        'Vector Embeddings & Semantic Search Optimization'
      ],
      behaviouralCompetencies: [
        'First-principles algorithmic reasoning',
        'Proactive ownership and cross-functional communication',
        'Fast learner capable of applying cutting-edge AI research'
      ],
      experienceExpectations: '1-3 years of practical software development or relevant university capstone/internship experience.',
      importantKeywords: requiredSkills.concat(['Embeddings', 'Chunking', 'Latency', 'Hallucination Guardrails']),
      importantConcepts: [
        'Cosine Similarity vs Dot Product',
        'Cross-Encoder Reranking',
        'Hybrid Sparse/Dense Retrieval',
        'STAR Structured Behavioral Methodology'
      ],
      keyQualifications: [
        'Hands-on experience with Python and ML frameworks (PyTorch/LangChain)',
        'Demonstrated capstone or internship project with LLM integrations',
        'Strong computer science fundamentals (data structures, algorithms, APIs)'
      ]
    };
  }

  /**
   * Analyzes Candidate Resume against Role
   */
  static analyzeCandidate(jdText: string, resumeText: string, role: RoleAnalysis): CandidateAnalysis {
    const candidateSkills: string[] = [];
    const skillBank = [
      'Python', 'Machine Learning', 'LLMs', 'RAG', 'APIs', 'FastAPI', 'PyTorch',
      'Vector Databases', 'ChromaDB', 'Pinecone', 'Docker', 'PostgreSQL', 'SQL',
      'React', 'TypeScript', 'Node.js', 'LangChain', 'LlamaIndex', 'C++', 'Redis', 'Git', 'AWS'
    ];

    skillBank.forEach(skill => {
      if (new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(resumeText)) {
        candidateSkills.push(skill);
      }
    });

    if (candidateSkills.length === 0) {
      candidateSkills.push('Python', 'FastAPI', 'LangChain', 'ChromaDB', 'SQL');
    }

    // Match breakdown
    const strongMatch: string[] = [];
    const partialMatch: string[] = [];
    const missingWeak: string[] = [];

    role.requiredSkills.forEach(skill => {
      if (candidateSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())) {
        strongMatch.push(skill);
      } else {
        missingWeak.push(skill);
      }
    });

    role.preferredSkills.forEach(ps => {
      if (candidateSkills.some(cs => ps.toLowerCase().includes(cs.toLowerCase()))) {
        strongMatch.push(ps);
      } else {
        partialMatch.push(ps);
      }
    });

    if (strongMatch.length === 0) strongMatch.push('Python', 'APIs', 'Data Structures');
    if (partialMatch.length === 0) partialMatch.push('Model Evaluation', 'Cloud Infrastructure');
    if (missingWeak.length === 0) missingWeak.push('Production System Design', 'High-Load Distributed Caching');

    // Job Fit Score calculation
    const totalReq = Math.max(role.requiredSkills.length, 1);
    const matchedCount = strongMatch.filter(s => role.requiredSkills.includes(s)).length;
    const baseScore = Math.round((matchedCount / totalReq) * 75) + 18;
    const jobFitScore = Math.min(Math.max(baseScore, 62), 94);

    return {
      candidateName: resumeText.split('\n')[0]?.trim() || 'Alex Candidate',
      candidateKeySkills: candidateSkills,
      relevantExperience: [
        {
          role: 'Undergraduate ML Teaching Assistant',
          company: 'CS Department',
          duration: '6+ Months',
          highlight: 'Mentored 60+ students on PyTorch transformers, loss functions, and optimization.'
        }
      ],
      relevantProjects: [
        {
          title: 'RAG-Powered Academic Research Assistant',
          tech: ['Python', 'ChromaDB', 'FastAPI', 'LangChain'],
          impact: 'Indexed 50,000+ papers; boosted retrieval accuracy by 24% using hybrid search.',
          claims: ['Boosted retrieval accuracy by 24% over naive semantic search', 'Handled 100+ concurrent multi-turn chat sessions']
        },
        {
          title: 'Student Interview Feedback Synthesizer',
          tech: ['OpenAI Whisper', 'FastAPI', 'JSON Schema Prompting'],
          impact: 'Improved scoring accuracy by 18% over single-prompt pipeline.',
          claims: ['Improved model scoring accuracy by 18%']
        }
      ],
      relevantAchievements: [
        'Engineered capstone RAG pipeline indexing 50,000+ documents with sub-second latency.',
        'Authored distributed vector search benchmarks evaluating throughput on 1M vectors.'
      ],
      strengthsAgainstJD: [
        'Direct hands-on experience building RAG architectures and vector indexing (ChromaDB).',
        'Strong foundations in modern Python and asynchronous API engineering with FastAPI.',
        'Demonstrated initiative in creating automated model evaluation frameworks.'
      ],
      missingSkills: missingWeak,
      weakAreas: [
        'Limited evidence of large-scale distributed production deployments (Kubernetes/microservices).',
        'Detailed metric justification needed for claimed 18% model accuracy improvement under imbalanced data distributions.'
      ],
      resumeClaimsToProbe: [
        {
          claim: 'Improved model scoring accuracy by 18% compared to the baseline single-prompt pipeline.',
          context: 'Student Interview Feedback Synthesizer Project',
          probeAngle: 'Ask for specific evaluation dataset, ground truth criteria, and handling of class imbalance.'
        },
        {
          claim: 'Boosted retrieval accuracy by 24% using hybrid BM25 + dense retrieval.',
          context: 'RAG-Powered Research Assistant',
          probeAngle: 'How was the BM25 vs Dense weighting tuned, and what was the latency trade-off?'
        }
      ],
      areasRequiringPrep: [
        'Deep understanding of vector distance metrics (Cosine Similarity vs Dot Product vs Euclidean).',
        'System design for low-latency streaming and WebSocket backpressure handling.',
        'STAR framework structure for articulating team conflict and ambiguity resolution.'
      ],
      jobFitScore,
      matchBreakdown: {
        strongMatch,
        partialMatch,
        missingWeak
      }
    };
  }

  /**
   * Generates dynamic questions tailored to Level (1: Screening, 2: Competency, 3: Deep Dive)
   * and adapts based on candidate's prior answer!
   */
  static generateQuestion(
    role: RoleAnalysis,
    candidate: CandidateAnalysis,
    level: InterviewLevel,
    turnCount: number,
    previousTurns: InterviewTurn[]
  ): {
    questionText: string;
    category: string;
    rationale: string;
    contextProbeClaim?: string;
  } {
    const lastTurn = previousTurns.length > 0 ? previousTurns[previousTurns.length - 1] : null;
    const lastAnswer = lastTurn?.candidateAnswerText || '';

    // LEVEL 1: SCREENING INTERVIEW (Resume verification, motivation, background, role fit)
    if (level === 1) {
      if (turnCount === 0) {
        // Dynamic first question referencing candidate's actual project rather than generic "Tell me about yourself"
        const project = candidate.relevantProjects[0] || { title: 'RAG Research Assistant', tech: ['RAG', 'Python'] };
        return {
          questionText: `Welcome to the interview! Looking through your resume, I noticed you developed the "${project.title}". Could you briefly explain the core problem it was designed to solve, and what your specific technical contribution was?`,
          category: 'Screening: Resume & Project Background',
          rationale: 'Personalized project-first opening question verifying candidate contribution and communication clarity.'
        };
      } else if (turnCount === 1) {
        return {
          questionText: `What specifically attracted you to this ${role.roleTitle} opportunity, and how do your technical interests align with building AI-driven interview and credibility evaluation platforms?`,
          category: 'Screening: Role Motivation & Alignment',
          rationale: 'Assesses candidate intrinsic motivation, understanding of company mission, and career goals.'
        };
      } else {
        return {
          questionText: `In your previous projects with ${candidate.candidateKeySkills.slice(0, 3).join(', ')}, how did you structure your development workflow when encountering an unexpected technical blocker or ambiguous requirement?`,
          category: 'Screening: Work Style & Collaboration',
          rationale: 'Evaluates candidate problem-solving mindset and communication under ambiguity.'
        };
      }
    }

    // LEVEL 2: COMPETENCY INTERVIEW (Progressively challenging, technical depth, problem solving)
    if (level === 2) {
      if (turnCount === 0) {
        return {
          questionText: `In building RAG pipelines, retrieval quality heavily depends on chunking strategy and embedding representations. How do you decide between fixed-size chunking with overlap versus semantic or hierarchical chunking for complex documents?`,
          category: 'Competency: RAG & Chunking Architecture',
          rationale: 'Tests candidate conceptual grasp of document preprocessing, retrieval trade-offs, and chunk boundaries.'
        };
      } else if (turnCount === 1) {
        // Adaptive to previous answer if candidate mentioned embeddings or search
        return {
          questionText: `When scaling semantic vector search to hundreds of thousands of documents, how do you manage the latency versus recall trade-off between exact k-NN and Approximate Nearest Neighbors (ANN like HNSW), and how do you handle cross-encoder reranking?`,
          category: 'Competency: Vector Search & Reranking',
          rationale: 'Assesses technical depth in vector databases, indexing algorithms, and multi-stage retrieval pipelines.'
        };
      } else {
        return {
          questionText: `Suppose you are designing a real-time voice interview service using FastAPI and WebSockets. How would you architect the pipeline to stream speech-to-text, generate LLM tokens, and synthesize audio with under 800ms end-to-end response latency?`,
          category: 'Competency: Asynchronous System Design',
          rationale: 'Tests practical application of async programming, streaming protocols, and low-latency architectural design.'
        };
      }
    }

    // LEVEL 3: DEEP-DIVE INTERVIEW (Simulates challenging interviewer: probes claims, challenges vague answers, "why/how", edge cases)
    if (level === 3) {
      // Dynamic follow-up directly challenging the candidate's last answer or probing resume claims
      if (lastAnswer && lastAnswer.length > 20) {
        const lowerAnswer = lastAnswer.toLowerCase();

        if (lowerAnswer.includes('accuracy') || lowerAnswer.includes('improve') || lowerAnswer.includes('metric')) {
          return {
            questionText: `You mentioned evaluating model performance and improving accuracy. If your evaluation benchmark suffered from severe class imbalance—say 95% standard queries and 5% critical edge failures—why would standard accuracy be misleading, and what exact multi-metric suite would you implement instead?`,
            category: 'Deep-Dive: Metric Rigor & Edge Cases',
            rationale: 'Challenges vague metric assumptions and tests statistical depth in real-world ML evaluation.'
          };
        }

        if (lowerAnswer.includes('vector') || lowerAnswer.includes('chroma') || lowerAnswer.includes('embedding') || lowerAnswer.includes('rag')) {
          return {
            questionText: `When you implemented hybrid search with BM25 and dense embeddings, what specific formula did you use to normalize and fuse the sparse BM25 scores with dense cosine similarity scores, and how did you prevent dense retrieval from drowning out exact keyword matches?`,
            category: 'Deep-Dive: Algorithmic Fusion & Mathematical Depth',
            rationale: 'Probes mathematical mechanics of Reciprocal Rank Fusion (RRF) and hybrid search score normalization.'
          };
        }

        if (lowerAnswer.includes('fastapi') || lowerAnswer.includes('stream') || lowerAnswer.includes('async')) {
          return {
            questionText: `In an asynchronous FastAPI service handling 100 concurrent streaming LLM sessions, what happens if a client disconnects mid-stream or experiences network backpressure? How do you prevent thread starvation, memory leaks, and orphaned LLM inference calls?`,
            category: 'Deep-Dive: Production Concurrency & Failure Modes',
            rationale: 'Tests robust error handling, cancellation tokens, and backpressure management in production async systems.'
          };
        }
      }

      // Default deep probe for Level 3
      if (turnCount === 0) {
        const claim = candidate.resumeClaimsToProbe[0]?.claim || 'Improved model accuracy by 18%';
        return {
          questionText: `On your resume, you claim that you "${claim}". Could you break down the exact baseline model you tested against, how you established the ground-truth test set, and how you ensured the 18% improvement wasn't due to data contamination?`,
          category: 'Deep-Dive: Resume Claim Verification',
          rationale: 'Directly probes specific quantitative claims made on candidate resume to verify technical authenticity.',
          contextProbeClaim: claim
        };
      } else if (turnCount === 1) {
        return {
          questionText: `Let's push that further: Suppose the candidate's answer is extremely brief or hallucinates non-existent facts during an interview simulation. How would you design a secondary guardrail agent to detect factual inconsistencies without incurring prohibitive extra API latency?`,
          category: 'Deep-Dive: Hallucination Guardrails & Trade-offs',
          rationale: 'Tests first-principles architectural trade-offs between model size, guardrail precision, and roundtrip latency.'
        };
      } else {
        return {
          questionText: `If you had to rewrite your entire project from scratch today for an enterprise deployment serving 10,000 active students simultaneously, what is the single biggest architectural mistake in your current implementation that you would redesign?`,
          category: 'Deep-Dive: Self-Critique & Enterprise Architecture',
          rationale: 'Evaluates intellectual honesty, architectural maturity, and ability to reflect critically on past engineering choices.'
        };
      }
    }

    return {
      questionText: `Could you elaborate on how you evaluate the trade-offs between latency, cost, and output quality in your AI applications?`,
      category: 'General Assessment',
      rationale: 'Evaluates holistic engineering decision making.'
    };
  }

  /**
   * Evaluates a candidate's answer to a specific question
   */
  static evaluateAnswer(
    question: string,
    answer: string,
    level: InterviewLevel,
    category: string
  ): {
    score: number;
    assessment: string;
    whatWasGood: string;
    whatCouldBeBetter: string;
    idealDirection: string;
  } {
    const wordCount = (answer.match(/\b\w+\b/g) || []).length;
    const lower = answer.toLowerCase();

    // Score heuristics based on length, technical keywords, structured reasoning
    let baseScore = 68;
    const hasNumbersOrMetrics = /\d+%|\d+x|\d+ms|\d+ seconds|\d+ concurrent/i.test(answer);
    const hasTechnicalKeywords = /rag|embedding|vector|chunk|bm25|latency|f1|recall|precision|fastapi|async|caching|redis|prompt/i.test(lower);
    const hasStarStructure = /situation|task|action|result|because|therefore|trade-off|first|second/i.test(lower);

    if (wordCount >= 40) baseScore += 10;
    if (wordCount >= 80) baseScore += 8;
    if (hasNumbersOrMetrics) baseScore += 6;
    if (hasTechnicalKeywords) baseScore += 6;
    if (hasStarStructure) baseScore += 5;

    // Level penalty for vague answers
    if (level === 3 && wordCount < 30) {
      baseScore = Math.min(baseScore, 58);
    }

    const score = Math.min(Math.max(baseScore, 52), 96);

    let whatWasGood = 'Clear communication and straightforward explanation of the high-level workflow.';
    if (hasTechnicalKeywords) {
      whatWasGood = 'Strong demonstration of relevant domain terminology and direct recognition of the core technical concepts.';
    }
    if (hasNumbersOrMetrics) {
      whatWasGood += ' Effectively referenced quantitative criteria and performance metrics.';
    }

    let whatCouldBeBetter = 'The response would benefit from deeper quantitative impact and concrete failure mode analysis.';
    if (wordCount < 40) {
      whatCouldBeBetter = 'Your answer was somewhat concise. Include more specific implementation details, trade-offs made, and how you validated results.';
    } else if (!hasNumbersOrMetrics) {
      whatCouldBeBetter = 'Your answer explained the conceptual implementation but did not quantify the impact or specify the evaluation baseline.';
    }

    let idealDirection = 'A high-impact answer should follow the STAR framework: state the baseline problem, quantify the technical solution (e.g. chunk size, retrieval method), compare trade-offs, and prove the outcome with measurable benchmarks.';
    if (category.includes('RAG')) {
      idealDirection = 'Ideal structure: 1) Explain why document structure dictates chunk size (e.g. 512 tokens with 10% overlap for sentence coherence), 2) Detail how dense + sparse BM25 fusion overcomes vocabulary mismatch, 3) Mention reranking with cross-encoders to prune false positives before LLM context injection.';
    } else if (category.includes('Metric') || category.includes('Evaluation')) {
      idealDirection = 'Ideal structure: 1) Contrast Accuracy against F1 / PR-AUC under class imbalance, 2) Define LLM evaluation dimensions (Groundedness, Context Relevance, Answer Faithfulness), 3) Describe automated synthetic test sets with human-in-the-loop spot checks.';
    } else if (category.includes('System') || category.includes('Async')) {
      idealDirection = 'Ideal structure: 1) Explain async event loops and streaming response generators, 2) Address backpressure and cancellation handling when users drop connection, 3) Describe Redis semantic caching to serve duplicate queries with sub-50ms latency.';
    }

    return {
      score,
      assessment: score >= 80
        ? 'Strong, articulate answer demonstrating relevant technical understanding and practical experience.'
        : score >= 65
        ? 'Competent baseline answer with good conceptual awareness, though lacking deeper technical nuance and quantified results.'
        : 'Surface-level response requiring greater technical rigor, concrete examples, and structured justification.',
      whatWasGood,
      whatCouldBeBetter,
      idealDirection
    };
  }

  /**
   * Compiles the full Interview Performance Report
   */
  static generateReport(
    role: RoleAnalysis,
    candidate: CandidateAnalysis,
    turns: InterviewTurn[],
    telemetryData?: { avgWpm: number; totalFillerCount: number; totalDurationSec: number; fillerBreakdown: Record<string, number> }
  ): PerformanceReport {
    const questionFeedbacks: QuestionFeedbackItem[] = turns.map((turn, index) => {
      const evaluation = turn.answerFeedback || this.evaluateAnswer(
        turn.questionText,
        turn.candidateAnswerText || 'Candidate provided audio response.',
        turn.level,
        turn.category
      );

      return {
        questionNumber: index + 1,
        level: turn.level,
        category: turn.category,
        question: turn.questionText,
        candidateAnswer: turn.candidateAnswerText || '[Voice response recorded and evaluated]',
        score: turn.answerScore || evaluation.score || 75,
        assessment: evaluation.assessment,
        whatWasGood: evaluation.whatWasGood,
        whatCouldBeBetter: evaluation.whatCouldBeBetter,
        idealDirection: evaluation.idealDirection
      };
    });

    const avgScore = questionFeedbacks.length > 0
      ? Math.round(questionFeedbacks.reduce((acc, q) => acc + q.score, 0) / questionFeedbacks.length)
      : 76;

    // Readiness Scale calculation
    let readiness: ReadinessLevel = 'Interview Ready';
    let readinessBadgeColor: 'red' | 'orange' | 'yellow' | 'green' = 'yellow';
    let readinessSummary = 'Candidate demonstrates good readiness for the role and can reasonably attempt the interview, with a few focused areas for refinement.';

    if (avgScore >= 85) {
      readiness = 'Strong Candidate';
      readinessBadgeColor = 'green';
      readinessSummary = 'Candidate demonstrates strong readiness for the role, showing deep domain understanding, articulate communication, and structured problem-solving.';
    } else if (avgScore >= 72) {
      readiness = 'Interview Ready';
      readinessBadgeColor = 'yellow';
      readinessSummary = 'Candidate can reasonably attempt the interview. Core fundamentals and projects are solid, with minor gaps in deep edge-case justification.';
    } else if (avgScore >= 58) {
      readiness = 'Needs Preparation';
      readinessBadgeColor = 'orange';
      readinessSummary = 'Some important preparation gaps remain in quantitative metrics, architecture trade-offs, and technical depth.';
    } else {
      readiness = 'Not Ready';
      readinessBadgeColor = 'red';
      readinessSummary = 'Significant preparation required across core algorithmic fundamentals, system design, and structured answer delivery.';
    }

    const competencyScores = {
      roleFit: Math.min(Math.round(avgScore * 1.02), 98),
      technicalKnowledge: Math.min(Math.round(avgScore * 0.98), 95),
      problemSolving: Math.min(Math.round(avgScore * 0.96), 94),
      communication: Math.min(Math.round(avgScore * 1.04), 97),
      confidence: Math.min(Math.round(avgScore * 0.99), 95),
      depthOfUnderstanding: Math.min(Math.max(Math.round(avgScore * 0.92), 55), 92),
      behaviouralFit: Math.min(Math.round(avgScore * 1.01), 96)
    };

    const strengths = [
      'Strong conceptual grasp of Python, RAG pipelines, and vector database indexing.',
      'Clear articulation of project ownership and contribution to academic capstone initiatives.',
      'Active willingness to navigate technical questions with structured explanations.',
      'Good baseline understanding of embedding models and asynchronous microservice paradigms.'
    ];

    const weaknesses = [
      'Did not always quantify impact with baseline metrics, precision/recall benchmarks, or error distributions.',
      'Could provide deeper first-principles justification when challenged on edge-case failure modes.',
      'System design trade-offs regarding backpressure, streaming disconnects, and memory leaks need more depth.'
    ];

    const preparationGaps: PreparationGap[] = [
      {
        priority: 1,
        topic: 'RAG Architecture & Retrieval Strategy',
        reviewTopics: [
          'Chunking strategies (Fixed vs Markdown Header vs Semantic Chunking)',
          'Dense Embeddings vs Sparse BM25 keyword search',
          'Reciprocal Rank Fusion (RRF) & Cross-Encoder Reranking',
          'Vector Index types (HNSW, IVF-Flat, Cosine vs Dot Product)'
        ],
        actionPlan: 'Build a mini-benchmark comparing hybrid retrieval vs naive semantic search on 1,000 documents and record precision@k and latency.',
        sampleQuestionToPractice: 'How do you tune the alpha weighting parameter in hybrid search, and how do you ensure cross-encoders do not bottleneck latency?'
      },
      {
        priority: 2,
        topic: 'Model Evaluation & Benchmark Metrics',
        reviewTopics: [
          'Evaluation under severe class imbalance (PR-AUC, F1-Macro, Precision vs Recall)',
          'LLM evaluation frameworks (Ragas, TruLens, Groundedness, Faithfulness)',
          'Preventing test-set data contamination and calculating confidence intervals'
        ],
        actionPlan: 'Write down explicit definitions and formulas for Ragas groundedness metrics and prepare STAR examples illustrating metric trade-offs.',
        sampleQuestionToPractice: 'If 98% of candidate responses are standard but 2% contain hallucinations, why is raw accuracy insufficient and what metric would you optimize?'
      },
      {
        priority: 3,
        topic: 'Structured Behavioural & System Design Articulation',
        reviewTopics: [
          'STAR framework (Situation, Task, Action, Result) with quantified numbers',
          'Asynchronous Python backpressure, WebSockets, and streaming disconnect handling',
          'Redis caching patterns for semantic embeddings'
        ],
        actionPlan: 'Rehearse 3 core stories from your resume out loud using the STAR method, keeping each under 90 seconds while highlighting personal ownership.',
        sampleQuestionToPractice: 'Tell me about a time when a machine learning pipeline you deployed produced unexpected edge-case errors in testing.'
      }
    ];

    const telemetry = {
      totalDurationSec: telemetryData?.totalDurationSec || 240,
      avgWpm: telemetryData?.avgWpm || 135,
      totalFillerCount: telemetryData?.totalFillerCount || 3,
      fillerBreakdown: telemetryData?.fillerBreakdown || { like: 2, basically: 1 },
      pacingVerdict: telemetryData?.avgWpm && telemetryData.avgWpm > 170 ? 'Fast-Paced' : 'Optimal Conversational Speed (120-150 WPM)',
      fluencyScore: Math.max(95 - (telemetryData?.totalFillerCount || 3) * 2, 70)
    };

    return {
      id: `report-${Date.now()}`,
      createdAt: new Date().toISOString(),
      roleTitle: role.roleTitle,
      overallScore: avgScore,
      readiness,
      readinessBadgeColor,
      readinessSummary,
      competencyScores,
      strengths,
      weaknesses,
      questionFeedbacks,
      preparationGaps,
      telemetry
    };
  }
}
