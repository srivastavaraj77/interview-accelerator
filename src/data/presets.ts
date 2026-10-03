import { PresetProfile, InterviewerPersona } from '../types';

export const PRESET_PROFILES: PresetProfile[] = [
  {
    id: 'ai-engineer-intern',
    title: 'AI Engineer Intern (Student Credibility / LLM & RAG)',
    roleSubtitle: 'Focus on LLMs, RAG Pipelines, Vector DBs, Model Evaluation & Python APIs',
    tags: ['AI/ML', 'RAG', 'LLMs', 'Python', 'FastAPI'],
    jobDescriptionText: `Role: AI Engineer Intern
Company: Student Credibility AI Labs
Location: Remote / Hybrid

About the Role:
We are building state-of-the-art AI evaluation and interview intelligence systems that help students prove their real-world capabilities. As an AI Engineer Intern, you will work directly on our core LLM pipelines, Retrieval-Augmented Generation (RAG) architectures, and real-time evaluation agents.

Key Responsibilities:
- Design, implement, and benchmark RAG pipelines with advanced chunking, hybrid search, and cross-encoder reranking.
- Develop low-latency backend microservices in Python (FastAPI/AsyncIO) to serve real-time multi-turn conversational agents.
- Build rigorous evaluation frameworks (Ragas, TruLens, custom metric suites) to track hallucination rates, groundedness, and context recall.
- Optimize prompt engineering strategies, structured schema generation, and function-calling workflows with Gemini 2.0 and OpenAI models.
- Collaborate with the frontend engineering team to deliver sub-second voice and multimodal interview streaming.

Required Skills:
- Strong proficiency in Python (Data structures, OOP, AsyncIO, typing)
- Practical experience with LLMs, Prompt Engineering, and RAG architectures
- Hands-on experience with Vector Databases (ChromaDB, Pinecone, Qdrant, or FAISS)
- Familiarity with RESTful APIs, FastAPI, and asynchronous backend services
- Solid foundations in Machine Learning evaluation metrics (Precision, Recall, F1, Cosine Similarity, Groundedness)

Preferred Skills:
- Experience fine-tuning open-weights models (Llama, Mistral) or PEFT/LoRA techniques
- Experience with Speech-to-Text (Whisper) and WebRTC audio streaming
- Understanding of production caching (Redis) and Docker containerization

Behavioural Competencies:
- First-principles problem solving and algorithmic reasoning
- Proactive communication and technical articulation
- Rapid learning ability and curiosity for cutting-edge AI research`,
    resumeText: `Alex Rivera
Email: alex.rivera@cs.university.edu | GitHub: github.com/alexrivera-ai | LinkedIn: linkedin.com/in/alex-rivera-ai

EDUCATION:
B.S. in Computer Science & Artificial Intelligence, Class of 2025
GPA: 3.85 / 4.00
Relevant Coursework: Machine Learning, Natural Language Processing, Distributed Systems, Data Structures & Algorithms

TECHNICAL SKILLS:
- Languages: Python, JavaScript/TypeScript, SQL, C++
- AI/ML Frameworks: PyTorch, Hugging Face, LangChain, LlamaIndex, Scikit-Learn
- Databases & Storage: PostgreSQL, ChromaDB, Pinecone, Redis
- Tools & Cloud: FastAPI, Docker, Git, AWS (S3, EC2), Postman

PROJECTS:
1. RAG-Powered Academic Research Assistant (Capstone Project)
- Engineered an end-to-end RAG system indexing 50,000+ scientific research papers using ChromaDB and sentence-transformers embeddings.
- Implemented hierarchical chunking and BM25 + dense hybrid retrieval, boosting retrieval accuracy by 24% over naive semantic search.
- Designed a FastAPI microservice handling 100+ concurrent multi-turn chat sessions with streaming LLM completions.

2. Student Interview Feedback Synthesizer
- Built an automated speech-to-text and answer assessment engine using OpenAI Whisper and structured JSON prompting.
- Extracted key competencies from candidate answers and generated customized preparation plans.
- Improved model scoring accuracy by 18% compared to the baseline single-prompt pipeline.

3. Distributed Vector Search Benchmark Tool
- Benchmarked cosine vs. dot-product similarity search throughput across FAISS, Qdrant, and ChromaDB on a 1M vector dataset.

EXPERIENCE:
Undergraduate Machine Learning Teaching Assistant | CS Dept (Aug 2024 - Present)
- Mentored 60+ students in Python programming, neural network architectures, and PyTorch implementations.
- Conducted weekly office hours and graded homework assignments on transformers and optimization algorithms.`
  },
  {
    id: 'fullstack-engineer',
    title: 'Full-Stack Software Engineer (React + Node/Python)',
    roleSubtitle: 'Web applications, distributed API architecture, real-time collaboration',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'WebSockets'],
    jobDescriptionText: `Role: Full-Stack Software Engineer
Company: CloudScale Technologies
Location: San Francisco, CA / Remote

About the Role:
We are seeking a talented Full-Stack Engineer to build high-performance, real-time web applications with modern React, TypeScript, Node.js, and cloud backends.

Key Responsibilities:
- Architect and develop responsive, accessible web interfaces using React 19, TypeScript, and modern CSS/Tailwind.
- Build scalable backend APIs and WebSocket streaming services for real-time collaborative workflows.
- Design database schemas, optimize SQL queries in PostgreSQL, and manage Redis caching layers.
- Maintain comprehensive unit, integration, and end-to-end test suites (Jest, Playwright).
- Implement CI/CD deployment pipelines on AWS / Docker.

Required Skills:
- TypeScript, React, Next.js / Vite, State Management (Zustand / Redux)
- Node.js / Express or Fastify backend architecture
- PostgreSQL, Prisma / Drizzle ORM, database indexing and migrations
- RESTful & GraphQL API design, WebSocket protocols
- Web security (OAuth, JWT, CORS, rate limiting)

Preferred Skills:
- Experience with Docker, Kubernetes, AWS infrastructure
- Experience with WebRTC or browser media streams
- Microfrontends and performance optimization (bundle analysis, Core Web Vitals)

Behavioural Competencies:
- Strong system design intuition and clean code craftsmanship
- Ownership mindset from concept to production deployment
- Cross-functional collaboration with product and design teams`,
    resumeText: `Jordan Lee
Email: jordan.lee.dev@gmail.com | Portfolio: jordanlee.codes | GitHub: github.com/jordanleedev

EDUCATION:
B.Tech in Information Technology, 2024
Relevant Coursework: Database Management Systems, Web Architecture, Operating Systems, Cloud Computing

TECHNICAL SKILLS:
- Frontend: React, Next.js, TypeScript, TailwindCSS, Redux Toolkit, React Query
- Backend: Node.js, Express, Python, NestJS, Socket.io
- Database: PostgreSQL, MongoDB, Redis, Supabase
- DevOps & Tools: Docker, Git, Jest, Cypress, AWS (S3, Lambda)

EXPERIENCE & PROJECTS:
1. Real-Time Collaborative Canvas (Open Source)
- Created a collaborative whiteboard app supporting 50+ concurrent users with zero-conflict CRDT synchronization via WebSockets.
- Reduced initial bundle size by 42% through dynamic route code splitting and SVG virtualization.

2. E-Commerce Order Microservice API
- Built resilient checkout and payment processing services handling 500+ requests/sec using Node.js, BullMQ, and Redis.
- Implemented PostgreSQL transactions with row-level locking to guarantee zero double-spending anomalies.

3. Developer Portfolio & Blog Platform
- Built with Next.js App Router, TailwindCSS, and MDX, achieving 100/100 Lighthouse performance and SEO scores.`
  },
  {
    id: 'ai-product-manager',
    title: 'Associate Product Manager — AI Products',
    roleSubtitle: 'Product discovery, AI feature specs, user telemetry, experiment design',
    tags: ['Product Management', 'AI Strategy', 'User Research', 'A/B Testing'],
    jobDescriptionText: `Role: Associate Product Manager (AI & Data)
Company: NextGen EdTech
Location: New York, NY / Remote

About the Role:
We are looking for an analytical, user-obsessed Associate Product Manager to drive AI-powered student learning and interview coaching tools from conception to scale.

Key Responsibilities:
- Lead product discovery, user interviews, and competitive benchmarking for student preparation products.
- Author clear PRDs, user stories, and acceptance criteria for engineering and design sprints.
- Partner with AI/ML engineers to define model quality benchmarks, guardrails, and acceptable latency trade-offs.
- Define north star metrics, design A/B experiments, and analyze user funnel drop-offs with Amplitude and SQL.
- Drive go-to-market strategies and feedback loops with early pilot universities and bootcamps.

Required Skills:
- Proven experience driving software features through the full product lifecycle
- Deep understanding of AI/LLM capabilities, latency considerations, and user experience paradigms
- Strong data fluency (SQL, cohort retention analysis, conversion funnels)
- Exceptional written communication and stakeholder management
- Customer empathy and structured user interview methodology

Preferred Skills:
- Technical background or CS/Engineering degree
- Experience with AI evaluation benchmarks and conversational interfaces
- Prior ed-tech or hiring tech domain experience`,
    resumeText: `Samantha Patel
Email: samantha.patel@alumni.edu | LinkedIn: linkedin.com/in/samanthapatel-pm

EDUCATION:
B.S. in Science, Technology & Society (Minor in Computer Science)
Dean's Honor List

EXPERIENCE:
Product Management Intern | LearnHub (May 2024 - Aug 2024)
- Led discovery and MVP launch of an AI-assisted flashcard generator used by 12,000+ active university students.
- Conducted 30+ qualitative user interviews to identify student revision pain points, leading to a 28% increase in Day-7 user retention.
- Authored 10+ detailed PRDs and managed bi-weekly sprint planning meetings with a squad of 4 engineers and 1 designer.
- Analyzed onboarding funnel drop-offs using Mixpanel, recommending UX optimizations that improved signup conversion by 15%.

PROJECTS:
1. Campus Career Mentor Platform (University Venture)
- Prototyped and launched a resume review portal matching student job seekers with alumni mentors.
- Surveyed 350+ candidates and synthesized key preparation gaps into an automated prep checklist.
- Achieved 84% user satisfaction rating across 500+ completed review sessions.`
  }
];

export const INTERVIEWER_PERSONAS: InterviewerPersona[] = [
  {
    id: 'dr-alex',
    name: 'Dr. Alex Vance',
    title: 'Principal AI Architect & Technical Lead',
    avatar: '👨‍💼',
    avatarBg: 'from-indigo-600 to-blue-700',
    accentColor: '#6366f1',
    style: 'Deep Technical & Rigorous Probing',
    description: 'Specializes in edge cases, algorithmic depth, architectural trade-offs, and probing specific numerical claims on your resume.',
    greetingVoicePitch: 0.95,
    greetingVoiceRate: 1.0
  },
  {
    id: 'sarah-recruiter',
    name: 'Sarah Jenkins',
    title: 'Lead Talent Partner & Hiring Lead',
    avatar: '👩‍💼',
    avatarBg: 'from-emerald-600 to-teal-700',
    accentColor: '#10b981',
    style: 'Role Fit, Motivation & Competencies',
    description: 'Evaluates your communication, alignment with role responsibilities, project ownership, and behavioral STAR situations.',
    greetingVoicePitch: 1.1,
    greetingVoiceRate: 1.05
  },
  {
    id: 'elena-director',
    name: 'Elena Rostova',
    title: 'VP of Engineering & Product Lead',
    avatar: '👩‍🔬',
    avatarBg: 'from-purple-600 to-pink-700',
    accentColor: '#a855f7',
    style: 'System Design & High Challenge',
    description: 'Challenges vague explanations, tests real-world problem-solving under pressure, and asks tough "Why" and "What If" questions.',
    greetingVoicePitch: 1.0,
    greetingVoiceRate: 0.98
  }
];
