/**
 * Structured portfolio data injected as context into the AI chat.
 * Keep this file updated whenever skills / projects change.
 */

const developer = {
  name: "Abhiyank Kumar",
  email: "abhiyankgujjar00@gmail.com",
  role: "Full-Stack & AI/ML Developer",
  summary:
    "Passionate developer specializing in full-stack web development and AI/ML solutions. " +
    "Experienced in building production-ready applications with modern tech stacks, " +
    "RAG pipelines, and intelligent chatbot systems.",

  skills: {
    languages: ["Python", "JavaScript", "TypeScript", "SQL", "HTML/CSS"],
    frontend: ["React.js", "Redux", "Next.js", "Tailwind CSS", "Bootstrap"],
    backend: ["Node.js", "Express.js", "FastAPI", "Flask", "REST APIs"],
    ai_ml: [
      "LangChain",
      "LlamaIndex",
      "OpenAI API",
      "Hugging Face Transformers",
      "Pinecone (Vector DB)",
      "RAG (Retrieval-Augmented Generation)",
      "Prompt Engineering",
      "Fine-tuning",
    ],
    databases: ["MongoDB", "PostgreSQL", "MySQL", "Pinecone", "ChromaDB"],
    devops: ["Docker", "Git", "GitHub Actions", "Vercel", "Render"],
    tools: ["VS Code", "Postman", "Figma", "Jupyter Notebook"],
  },

  projects: [
    {
      id: 1,
      name: "AI Medical Chatbot",
      description:
        "A production-grade medical Q&A chatbot powered by Retrieval-Augmented Generation (RAG). " +
        "Users can ask medical questions and the bot retrieves accurate answers from a curated " +
        "knowledge base of medical documents.",
      tech: [
        "Python",
        "LangChain",
        "Pinecone",
        "OpenAI GPT-4",
        "FastAPI",
        "React",
        "HuggingFace Embeddings",
      ],
      highlights: [
        "RAG pipeline with Pinecone vector store for semantic document retrieval",
        "LangChain orchestration for chaining LLM calls and retrievers",
        "Custom prompt engineering for medical accuracy and safety disclaimers",
        "FastAPI backend with streaming responses",
        "React frontend with real-time chat UI",
      ],
      status: "Completed",
      category: "AI/ML",
    },
    {
      id: 2,
      name: "Myntra Clone",
      description:
        "A feature-complete e-commerce platform replicating core Myntra functionality " +
        "with product browsing, cart management, wishlist, and checkout flow.",
      tech: ["React.js", "Redux", "JavaScript", "CSS", "REST APIs"],
      highlights: [
        "Redux state management for cart, wishlist, and user session",
        "Responsive design matching Myntra's UI/UX",
        "Product filtering, sorting, and search functionality",
        "Multi-step checkout flow with order summary",
      ],
      status: "Completed",
      category: "Full-Stack",
    },
    {
      id: 3,
      name: "Developer Portfolio Backend",
      description:
        "This very backend — a modular Express.js API powering the portfolio site with " +
        "contact management, visitor analytics, AI chat, and dynamic project data.",
      tech: ["Node.js", "Express", "MongoDB", "OpenAI API", "Nodemailer"],
      highlights: [
        "AI-powered chat endpoint with portfolio context",
        "Visitor analytics tracking with geo/device data",
        "Email notifications via Nodemailer",
        "Rate limiting and input validation for security",
      ],
      status: "In Progress",
      category: "Backend",
    },
  ],

  experience: [
    {
      role: "Full-Stack Developer (Personal Projects & Freelance)",
      duration: "2022 – Present",
      highlights: [
        "Built AI/ML applications using LangChain, RAG pipelines, and vector databases",
        "Developed full-stack web apps with React, Node.js, and Python backends",
        "Integrated third-party APIs including OpenAI, HuggingFace, and payment gateways",
      ],
    },
  ],

  education: {
    degree: "Bachelor of Engineering / Technology",
    field: "Computer Science",
    note: "Focused on AI/ML coursework and open-source projects",
  },

  contact: {
    email: "abhiyankgujjar00@gmail.com",
    github: "https://github.com/abhiyank",
    linkedin: "https://linkedin.com/in/abhiyank",
  },
};

/**
 * Returns a compact plain-text summary used as system context for the AI.
 */
function buildAIContext() {
  const { name, role, summary, skills, projects, experience } = developer;

  const projectList = projects
    .map(
      (p) =>
        `• ${p.name} [${p.category}] — ${p.description}\n  Tech: ${p.tech.join(", ")}\n  Highlights: ${p.highlights.join("; ")}`
    )
    .join("\n\n");

  const skillList = Object.entries(skills)
    .map(([cat, list]) => `  ${cat}: ${list.join(", ")}`)
    .join("\n");

  const expList = experience
    .map((e) => `• ${e.role} (${e.duration}): ${e.highlights.join("; ")}`)
    .join("\n");

  return `
You are a helpful assistant on ${name}'s developer portfolio website.
Your job is to answer questions about ${name} accurately and professionally.
Only answer based on the information below. If something is not covered, say so politely.

=== ABOUT ${name.toUpperCase()} ===
Role: ${role}
Summary: ${summary}

=== SKILLS ===
${skillList}

=== PROJECTS ===
${projectList}

=== EXPERIENCE ===
${expList}

=== CONTACT ===
Email: ${developer.contact.email}
GitHub: ${developer.contact.github}
LinkedIn: ${developer.contact.linkedin}

Always be concise, friendly, and professional. Speak in third person about ${name}.
`.trim();
}

module.exports = { developer, buildAIContext };
