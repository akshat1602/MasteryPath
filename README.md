# MasteryPath

An AI and Cloud-Driven Adaptive Retention & Concept-Transfer Learning Platform for Technical Learners.

## The Problem
Every programmer today has access to unlimited learning content, but this abundance has created a new problem: **Learners complete content without actually retaining or understanding it.**

This manifests as:
1. **"Vibe Coding":** Learners copy AI-generated or tutorial code that works, without understanding *why* it works[cite: 6].
2. **Fundamentals Decay:** While racing ahead through roadmaps (e.g., DSA → System Design), earlier concepts are silently forgotten because no existing platform tracks and resurfaces fading knowledge[cite: 6].

## The Solution
MasteryPath is an adaptive engine that builds a personalized mastery graph, tests actual understanding (transfer vs. recall), and uses a cloud-scheduled spaced-repetition algorithm to ensure fundamentals stay strong[cite: 6].

It replaces static multiple-choice quizzes with RAG-grounded "explain-it-back" checkpoints and novel problem variations[cite: 6]. Furthermore, every AI-generated educational explanation is independently validated against source evidence before the learner sees it[cite: 6].

## Core Architecture

### 1. Roadmap Ingestion (Directed Acyclic Graph)
Parses technical roadmaps into a structured topic graph (DAG) with explicit prerequisite relationships[cite: 6].

### 2. Understanding Checkpoints (Transfer Gap Metric)
Moves beyond recall. The system generates novel, structurally identical but surface-varied problems grounded in curated "Pattern DNA" via RAG[cite: 6]. It measures both recall accuracy and transfer accuracy—the gap between them (the **Transfer Gap**) proves true understanding over memorization[cite: 6].

### 3. Automated Code Verification
Generated problem variations are strictly verified via sandboxed code execution (Judge0 CE/Piston) before they are ever presented to the user[cite: 6]. 

### 4. Independent Answer Validation Layer
A secondary, isolated LLM call checks every generated explanation or grading rationale against the retrieved source evidence to flag unsupported claims and eliminate educational hallucinations[cite: 6].

### 5. Adaptive Retention Engine (Modified SM-2)
A modified spaced-repetition scheduling algorithm decides when to resurface a topic before it decays. This computation runs as an asynchronous cloud batch job[cite: 6].

## Tech Stack (100% Free-Tier Infrastructure)
- **Frontend & Backend:** Next.js 14 (App Router)[cite: 6]
- **UI/Visualization:** Tailwind CSS, React Flow (for the Mastery Graph)[cite: 6]
- **Database:** PostgreSQL with `pgvector` (via Supabase)[cite: 6]
- **AI & RAG:** Google Gemini API[cite: 6] 
- **Code Execution:** Judge0 Community Edition / Piston API[cite: 6]
- **Cloud/Async:** AWS (SQS, EventBridge) / GCP (Cloud Scheduler, Pub/Sub)[cite: 6]
- **Hosting:** Vercel[cite: 6]

## Current MVP Scope (DSA Fundamentals)
The V1 MVP focuses on a lightly curated topic graph for Data Structures and Algorithms (e.g., Two Pointers, Sliding Window)[cite: 6]. It includes:
- Live API ingestion of topics into the React Flow dashboard[cite: 5, 6].
- AI problem-generation pipeline verified via sandboxed code execution[cite: 5, 6].
- SM-2 retention scoring stored in Supabase[cite: 5, 6].

## Setup for Local Development

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/your-org/masterypath.git
cd masterypath
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a \`.env.local\` file in the root directory and add the following:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_key
\`\`\`

### 4. Run the development server
\`\`\`bash
npm run dev
\`\`\`
Visit \`http://localhost:3000\` to view the Mastery Graph dashboard.

## Team
- **Akshat (Backend & Cloud Infrastructure):** [github.com/akshat1602](https://github.com/akshat1602)
- **Alfee (Frontend UI/UX & React Flow):** [github.com/Alfee123-web](https://github.com/Alfee123-web)
- **Anshika (AI/RAG Pipeline & Validation Layer):** [github.com/Anshika-Srivastava-9](https://github.com/Anshika-Srivastava-9)
