import { trackContentSchema } from "@/content/schema";

export const aiEngineerTrack = trackContentSchema.parse({
  id: "ai-engineer",
  slug: "ai-engineer",
  title: "AI Engineer",
  subtitle: "From retrieval to agents in production",
  summary:
    "Applied AI for engineers who already ship software: models, retrieval, agents, and the production systems around them. Every topic, tool, library and code sample is JavaScript/TypeScript: AI products need a UI, the UI is TypeScript, and one language end to end means shared types and code between the frontend and the AI backend.",
  footer:
    'Durations are estimates. Curriculum adapted from Coder\'s Gyan, "Fastest AI Engineers Roadmap for 2027".',
  order: 2,
  identityHue: 62,
  sourceTitle: "AI Engineer Roadmap 2027",
  sourceUrl: "https://www.youtube.com/watch?v=CpI7pd5yGCw",
  phases: [
    {
      id: "ai-prerequisites",
      title: "Prerequisites",
      subtitle:
        "The Backend foundation this track assumes. Mirrored from your Backend progress; override any item you already know.",
      tip: "Nothing here adds calendar time. It exists so the AI track never asks you to learn HTTP, SQL, or deployment twice.",
      order: 1,
      topics: [
        {
          id: "ai-prereq-language",
          title: "Programming fluency",
          summary:
            "One language you can read, test, and debug without a tutorial. Mirrors your Backend language topic.",
          durationWeeks: 0,
          order: 1,
          tip: "If you can build and test a small service in one language, this prerequisite is already met.",
          outcome: null,
          flow: null,
          estimated: true,
          linkedTopicId: "pick-a-language",
          subtopics: [],
          resources: [],
        },
        {
          id: "ai-prereq-http",
          title: "HTTP and the web",
          summary:
            "Requests, responses, DNS, and the client-server model. Mirrors your Backend web fundamentals topic.",
          durationWeeks: 0,
          order: 2,
          tip: "AI applications are still web applications: a model call sits behind an HTTP boundary.",
          outcome: null,
          flow: null,
          estimated: true,
          linkedTopicId: "how-the-web-works",
          subtopics: [],
          resources: [],
        },
        {
          id: "ai-prereq-apis",
          title: "APIs and service design",
          summary:
            "Resources, validation, error handling, and versioning. Mirrors your Backend API topic.",
          durationWeeks: 0,
          order: 3,
          tip: "Every model provider is an API. Reading an API contract carefully is the core skill.",
          outcome: null,
          flow: null,
          estimated: true,
          linkedTopicId: "building-apis",
          subtopics: [],
          resources: [],
        },
        {
          id: "ai-prereq-data",
          title: "Databases and data modeling",
          summary:
            "Relational modeling, indexes, and queries. Mirrors your Backend database topic.",
          durationWeeks: 0,
          order: 4,
          tip: "Retrieval quality starts with clean source data, not a better vector index.",
          outcome: null,
          flow: null,
          estimated: true,
          linkedTopicId: "database-design",
          subtopics: [],
          resources: [],
        },
        {
          id: "ai-prereq-testing",
          title: "Testing and delivery",
          summary:
            "Automated tests and a repeatable release path. Mirrors your Backend testing topic.",
          durationWeeks: 0,
          order: 5,
          tip: "AI systems are probabilistic. Tests assert behaviour and bounds, not one exact string.",
          outcome: null,
          flow: null,
          estimated: true,
          linkedTopicId: "testing",
          subtopics: [],
          resources: [],
        },
        {
          id: "ai-prereq-security",
          title: "Security baseline",
          summary:
            "Authentication, authorization, secrets, and input trust. Mirrors your Backend security topic.",
          durationWeeks: 0,
          order: 6,
          tip: "Treat retrieved documents and model output as untrusted input at every boundary.",
          outcome: null,
          flow: null,
          estimated: true,
          linkedTopicId: "security",
          subtopics: [],
          resources: [],
        },
      ],
    },
    {
      id: "ai-foundations",
      title: "AI primitives",
      subtitle:
        "TypeScript end to end: language fluency, model APIs, prompts, and context budgets.",
      tip: "Build small, observable scripts before you build an application. The model is the easy part.",
      order: 2,
      topics: [
        {
          id: "typescript-for-ai-engineering",
          title: "TypeScript for AI engineering",
          summary:
            "Strict TypeScript as the only language of the track: async iterators and streaming, cancellation, validation, and tests.",
          durationWeeks: 1,
          order: 1,
          tip: "One language end to end means shared types and code between the frontend and the AI backend.",
          outcome:
            "Ship a streaming AI endpoint in strict TypeScript with cancellation, validation, and tests.",
          flow: "tsconfig strict → async iterator → ReadableStream → Zod → AbortController → test",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "ts-ai-1", title: "Strict tsconfig and project layout", order: 1 },
            {
              id: "ts-ai-2",
              title: "Async iterators and streaming (SSE, ReadableStream)",
              order: 2,
            },
            { id: "ts-ai-3", title: "AbortController, retries, and timeouts", order: 3 },
            { id: "ts-ai-4", title: "Zod schemas and env validation", order: 4 },
            { id: "ts-ai-5", title: "Vitest for AI code", order: 5 },
          ],
          resources: [
            {
              id: "ts-ai-handbook",
              title: "TypeScript handbook",
              url: "https://www.typescriptlang.org/docs/handbook/intro.html",
            },
            {
              id: "ts-ai-node",
              title: "Node.js documentation",
              url: "https://nodejs.org/docs/latest/api/",
            },
            {
              id: "ts-ai-zod",
              title: "Zod documentation",
              url: "https://zod.dev/",
            },
            {
              id: "ts-ai-vitest",
              title: "Vitest documentation",
              url: "https://vitest.dev/",
            },
          ],
        },
        {
          id: "ai-llm-fundamentals",
          title: "LLM fundamentals and APIs",
          summary:
            "Call models with the official TypeScript SDKs (OpenAI, Anthropic) and plain fetch first, then the Vercel AI SDK as the unified API.",
          durationWeeks: 1,
          order: 2,
          tip: "Start with plain fetch and an SDK. You need to feel the raw request before a framework hides it.",
          outcome:
            "Build a streaming chat endpoint in a Next.js route handler using generateText and streamText.",
          flow: "prompt → tokens → model → sampling → stream → route handler",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "llm-ts-1",
              title: "Tokens, context windows, and truncation",
              order: 1,
            },
            {
              id: "llm-ts-2",
              title: "Temperature, top-p, and deterministic-enough output",
              order: 2,
            },
            { id: "llm-ts-3", title: "OpenAI and Anthropic TypeScript SDKs", order: 3 },
            {
              id: "llm-ts-4",
              title: "Vercel AI SDK generateText and streamText",
              order: 4,
            },
            {
              id: "llm-ts-5",
              title: "Streaming chat endpoint in a Next.js route handler",
              order: 5,
            },
          ],
          resources: [
            {
              id: "llm-ts-openai",
              title: "OpenAI Node.js library",
              url: "https://github.com/openai/openai-node",
            },
            {
              id: "llm-ts-anthropic",
              title: "Anthropic TypeScript SDK",
              url: "https://docs.anthropic.com/en/docs/initial-setup/typescript",
            },
            {
              id: "llm-ts-ai-sdk",
              title: "Vercel AI SDK documentation",
              url: "https://ai-sdk.dev/docs/introduction",
            },
            {
              id: "llm-ts-next",
              title: "Next.js route handlers",
              url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers",
            },
          ],
        },
        {
          id: "ai-prompting",
          title: "Prompting",
          summary:
            "Prompts as typed template functions: instructions, examples, personas, versioning, and defences against injected input.",
          durationWeeks: 1,
          order: 3,
          tip: "A prompt that cannot be evaluated is a guess. Write the check first.",
          outcome:
            "Maintain a versioned prompt as a typed function with examples, failure cases, and an evaluation set.",
          flow: "task → instructions → examples → output contract → eval",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "prompt-ts-1",
              title: "System, developer, and user instructions",
              order: 1,
            },
            {
              id: "prompt-ts-2",
              title: "Few-shot examples and output contracts",
              order: 2,
            },
            {
              id: "prompt-ts-3",
              title: "Task decomposition and reasoning budgets",
              order: 3,
            },
            {
              id: "prompt-ts-4",
              title: "Prompt injection and instruction boundaries",
              order: 4,
            },
            {
              id: "prompt-ts-5",
              title: "Prompts as typed template functions and versioning",
              order: 5,
            },
          ],
          resources: [
            {
              id: "prompt-ts-openai",
              title: "Prompt engineering guide — OpenAI",
              url: "https://platform.openai.com/docs/guides/prompt-engineering",
            },
            {
              id: "prompt-ts-anthropic",
              title: "Prompt engineering overview — Anthropic",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
            },
          ],
        },
        {
          id: "ai-context-engineering",
          title: "Context engineering and model selection",
          summary:
            "Token counting, context bloat, truncation and summarization, model capabilities, and switching models through the AI SDK provider layer.",
          durationWeeks: 1,
          order: 4,
          tip: "Context is a budget. Spend it on the facts the answer needs, nothing else.",
          outcome:
            "Choose a model and context strategy for a task, and explain the cost, latency, and quality trade-off.",
          flow: "count → trim → summarize → select model → measure cost and latency",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "ctx-ts-1", title: "Token counting and context bloat", order: 1 },
            { id: "ctx-ts-2", title: "Truncation and summarization", order: 2 },
            {
              id: "ctx-ts-3",
              title: "Text, vision, and audio model capabilities",
              order: 3,
            },
            {
              id: "ctx-ts-4",
              title: "Switching models through the AI SDK provider layer",
              order: 4,
            },
            { id: "ctx-ts-5", title: "Cost and latency trade-offs", order: 5 },
          ],
          resources: [
            {
              id: "ctx-ts-ai-sdk",
              title: "Vercel AI SDK providers",
              url: "https://ai-sdk.dev/docs/foundations/providers-and-models",
            },
          ],
        },
      ],
    },
    {
      id: "ai-retrieval",
      title: "AI systems",
      subtitle:
        "Build each piece from scratch with a provider SDK or fetch plus Zod. No framework yet.",
      tip: "No framework until you have written the loop yourself. The framework is the last thing, not the first.",
      order: 3,
      topics: [
        {
          id: "ai-agent-loops",
          title: "Agent loop",
          summary:
            "Write your own loop in TypeScript: the model returns a tool call or a final answer, with max steps and stop conditions.",
          durationWeeks: 1,
          order: 1,
          tip: "An agent is a loop with tools and a stopping condition. If you cannot describe the stop, do not ship the loop.",
          outcome:
            "Build a bounded agent loop, then compare it with the Vercel AI SDK's ToolLoopAgent.",
          flow: "goal → model call → tool call or final → observe → stop",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "agent-loop-1", title: "The plan-act-observe loop", order: 1 },
            { id: "agent-loop-2", title: "Max steps and stop conditions", order: 2 },
            { id: "agent-loop-3", title: "Tool call parsing and dispatch", order: 3 },
            { id: "agent-loop-4", title: "Compare with ToolLoopAgent", order: 4 },
          ],
          resources: [
            {
              id: "agent-loop-ai-sdk",
              title: "Vercel AI SDK tool calling",
              url: "https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling",
            },
            {
              id: "agent-loop-anthropic",
              title: "Building effective agents — Anthropic",
              url: "https://www.anthropic.com/research/building-effective-agents",
            },
          ],
        },
        {
          id: "ai-structured-outputs",
          title: "Structured outputs",
          summary:
            "Zod schemas, JSON-schema-constrained output, validate and retry on failure, then the AI SDK structured output API.",
          durationWeeks: 1,
          order: 2,
          tip: "Validate every model output against a schema. Never trust model output.",
          outcome:
            "Generate and validate a typed object from a prompt, with retry on failure.",
          flow: "schema → constrained generation → parse → validate → retry",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "struct-1", title: "Zod schemas as output contracts", order: 1 },
            { id: "struct-2", title: "JSON-schema-constrained generation", order: 2 },
            { id: "struct-3", title: "Validate and retry on failure", order: 3 },
            { id: "struct-4", title: "AI SDK Output.object and Output.array", order: 4 },
          ],
          resources: [
            {
              id: "struct-openai",
              title: "Structured outputs guide — OpenAI",
              url: "https://platform.openai.com/docs/guides/structured-outputs",
            },
            {
              id: "struct-ai-sdk",
              title: "Generating structured data — AI SDK",
              url: "https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data",
            },
          ],
        },
        {
          id: "ai-tool-calling",
          title: "Tool calling",
          summary:
            "Typed tools with Zod input schemas and execute functions: a database query (Drizzle), web search, Google Calendar, sending email.",
          durationWeeks: 1,
          order: 3,
          tip: "Design tools like public APIs: narrow, named for intent, and impossible to misuse silently.",
          outcome:
            "Ship a tool-using endpoint with schema validation, retries, and a human confirmation gate.",
          flow: "user intent → tool schema → validated call → result → model",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "tools-1", title: "Tool schemas and JSON Schema", order: 1 },
            { id: "tools-2", title: "Typed execute functions with Zod", order: 2 },
            { id: "tools-3", title: "A Drizzle database query tool", order: 3 },
            {
              id: "tools-4",
              title: "Web search, Google Calendar, and email tools",
              order: 4,
            },
            {
              id: "tools-5",
              title: "Validate tool results and never trust model output",
              order: 5,
            },
          ],
          resources: [
            {
              id: "tools-openai",
              title: "Function calling guide — OpenAI",
              url: "https://platform.openai.com/docs/guides/function-calling",
            },
            {
              id: "tools-anthropic",
              title: "Tool use with Claude",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview",
            },
            {
              id: "tools-drizzle",
              title: "Drizzle ORM documentation",
              url: "https://orm.drizzle.team/docs/overview",
            },
            {
              id: "tools-google-calendar",
              title: "Google Calendar API overview",
              url: "https://developers.google.com/calendar/api/guides/overview",
            },
          ],
        },
        {
          id: "ai-memory",
          title: "Memory",
          summary:
            "Conversation history in Postgres: thread ids, windowing, and summarization for multi-turn chat.",
          durationWeeks: 1,
          order: 4,
          tip: "Memory is a query problem. Store everything, send only what the turn needs.",
          outcome:
            "Persist multi-turn conversations with thread ids and a windowing strategy.",
          flow: "message → thread id → store → window → summarize → prompt",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "mem-1", title: "Conversation history in Postgres", order: 1 },
            { id: "mem-2", title: "Thread ids and ownership", order: 2 },
            { id: "mem-3", title: "Windowing and summarization", order: 3 },
            { id: "mem-4", title: "Multi-turn chat end to end", order: 4 },
          ],
          resources: [
            {
              id: "mem-drizzle",
              title: "Drizzle ORM documentation",
              url: "https://orm.drizzle.team/docs/overview",
            },
            {
              id: "mem-pg",
              title: "PostgreSQL documentation",
              url: "https://www.postgresql.org/docs/",
            },
          ],
        },
        {
          id: "ai-workflows",
          title: "Workflows",
          summary:
            "Typed multi-step pipelines (search, refine, grade) as plain async functions or a small state machine.",
          durationWeeks: 1,
          order: 5,
          tip: "Prefer a state machine with a visible graph over an open-ended loop you cannot replay.",
          outcome: "Build a typed pipeline and explain when a workflow beats an agent.",
          flow: "input → step → state → next step → output",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "wf-1", title: "Typed multi-step pipelines", order: 1 },
            { id: "wf-2", title: "Plain async functions vs state machines", order: 2 },
            { id: "wf-3", title: "Search, refine, grade pipeline", order: 3 },
            { id: "wf-4", title: "When a workflow beats an agent", order: 4 },
          ],
          resources: [
            {
              id: "wf-ai-sdk",
              title: "Workflow patterns — AI SDK",
              url: "https://ai-sdk.dev/docs/agents/workflows",
            },
          ],
        },
        {
          id: "ai-rag",
          title: "RAG pipelines",
          summary:
            "Chunking, embeddings, pgvector with Drizzle, similarity search, reranking, citations, and an ingestion script.",
          durationWeeks: 2,
          order: 6,
          tip: "Most RAG failures are retrieval failures. Inspect what the model was given before you change the prompt.",
          outcome:
            "Ship a retrieval pipeline that answers with quoted, linked sources and degrades when nothing matches.",
          flow: "documents → chunks → embeddings → pgvector → retrieve → rerank → answer + citations",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "rag-1", title: "Chunking strategy and metadata", order: 1 },
            { id: "rag-2", title: "Embeddings and vector search", order: 2 },
            { id: "rag-3", title: "pgvector with Drizzle", order: 3 },
            { id: "rag-4", title: "Similarity search and reranking", order: 4 },
            { id: "rag-5", title: "Citations, grounding, and abstention", order: 5 },
            { id: "rag-6", title: "Ingestion script and support chatbot", order: 6 },
          ],
          resources: [
            {
              id: "rag-openai-emb",
              title: "Embeddings guide — OpenAI",
              url: "https://platform.openai.com/docs/guides/embeddings",
            },
            {
              id: "rag-pgvector",
              title: "pgvector",
              url: "https://github.com/pgvector/pgvector",
            },
            {
              id: "rag-drizzle",
              title: "Drizzle ORM documentation",
              url: "https://orm.drizzle.team/docs/overview",
            },
            {
              id: "rag-qdrant",
              title: "Qdrant concepts",
              url: "https://qdrant.tech/documentation/concepts/",
            },
          ],
        },
        {
          id: "ai-agentic-patterns",
          title: "Agentic patterns",
          summary:
            "Routing, parallelization, human-in-the-loop approval, reflection, and plan-and-execute as small TypeScript modules.",
          durationWeeks: 2,
          order: 7,
          tip: "One small module per pattern. A pattern you cannot read in one screen is not a pattern.",
          outcome:
            "Implement each pattern as a module and pick the right one for a given task.",
          flow: "pattern → module → test → compare",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "agentic-1", title: "Routing", order: 1 },
            { id: "agentic-2", title: "Parallelization with Promise.all", order: 2 },
            { id: "agentic-3", title: "Human-in-the-loop approval", order: 3 },
            { id: "agentic-4", title: "Reflection (one model checks another)", order: 4 },
            { id: "agentic-5", title: "Plan-and-execute", order: 5 },
          ],
          resources: [
            {
              id: "agentic-anthropic",
              title: "Building effective agents — Anthropic",
              url: "https://www.anthropic.com/research/building-effective-agents",
            },
          ],
        },
        {
          id: "ai-frameworks",
          title: "Frameworks",
          summary:
            "Only after the above: Vercel AI SDK, Mastra, LangGraph.js, and OpenAI Agents SDK for JS.",
          durationWeeks: 1,
          order: 8,
          tip: "Pick one and rebuild one of your earlier modules with it. That is the only way to learn the framework.",
          outcome: "Rebuild one earlier module with a chosen framework and compare.",
          flow: "choose → rebuild → compare → decide",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "fw-1",
              title:
                "Vercel AI SDK: agents, tools, structured output, MCP, tool approval",
              order: 1,
            },
            {
              id: "fw-2",
              title: "Mastra: agents, workflows, memory, RAG, evals",
              order: 2,
            },
            { id: "fw-3", title: "LangGraph.js and LangChain.js", order: 3 },
            { id: "fw-4", title: "OpenAI Agents SDK for JavaScript", order: 4 },
          ],
          resources: [
            {
              id: "fw-ai-sdk",
              title: "Vercel AI SDK documentation",
              url: "https://ai-sdk.dev/docs/introduction",
            },
            {
              id: "fw-mastra",
              title: "Mastra documentation",
              url: "https://mastra.ai/docs",
            },
            {
              id: "fw-langgraph",
              title: "LangGraph.js documentation",
              url: "https://langchain-ai.github.io/langgraphjs/",
            },
            {
              id: "fw-openai-agents",
              title: "OpenAI Agents SDK for JavaScript",
              url: "https://openai.github.io/openai-agents-js/",
            },
          ],
        },
      ],
    },
    {
      id: "ai-agents",
      title: "Production AI",
      subtitle:
        "Guardrails, observability, evals, self-hosting, MCP, fine-tuning, and billing.",
      tip: "Production AI is ordinary distributed systems work with a nondeterministic dependency in the middle.",
      order: 4,
      topics: [
        {
          id: "ai-guardrails",
          title: "Guardrails",
          summary:
            "Validate and screen input before it reaches the model, validate output against schemas, and allow-list tools.",
          durationWeeks: 1,
          order: 1,
          tip: "Treat retrieved documents and model output as untrusted input at every boundary.",
          outcome:
            "Implement input screening, output validation, and tool allow-lists as middleware or processors.",
          flow: "input → screen → model → validate output → allow-listed tools",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "guard-1", title: "Prompt-injection checks", order: 1 },
            { id: "guard-2", title: "PII redaction", order: 2 },
            { id: "guard-3", title: "Output validation against schemas", order: 3 },
            { id: "guard-4", title: "Tool allow-lists", order: 4 },
          ],
          resources: [
            {
              id: "guard-owasp",
              title: "OWASP Top 10 for LLM applications",
              url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
            },
          ],
        },
        {
          id: "ai-observability",
          title: "Observability",
          summary:
            "Trace every request and tool call with Langfuse, self-hostable via OpenTelemetry with AI SDK integration.",
          durationWeeks: 1,
          order: 2,
          tip: "Log the prompt version, model, token counts, and outcome for every call. Without them, incidents are guesswork.",
          outcome:
            "Instrument an AI endpoint with traces, token cost, p95 latency, and an explicit fallback.",
          flow: "request → span → model call → tokens → metric → alert",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "obs-1", title: "Traces, spans, and prompt versions", order: 1 },
            { id: "obs-2", title: "Token accounting and unit economics", order: 2 },
            { id: "obs-3", title: "Latency budgets and streaming UX", order: 3 },
            { id: "obs-4", title: "Fallback models and graceful degradation", order: 4 },
          ],
          resources: [
            {
              id: "obs-langfuse",
              title: "Langfuse TypeScript SDK",
              url: "https://langfuse.com/docs/sdk/typescript",
            },
            {
              id: "obs-otel",
              title: "OpenTelemetry documentation",
              url: "https://opentelemetry.io/docs/",
            },
            {
              id: "obs-latency",
              title: "Latency optimization — OpenAI",
              url: "https://platform.openai.com/docs/guides/latency-optimization",
            },
          ],
        },
        {
          id: "ai-evals",
          title: "Evals",
          summary:
            "Evals are tests for LLM behavior: datasets, rule-based and LLM-as-judge scorers, run in CI.",
          durationWeeks: 2,
          order: 3,
          tip: "Measure retrieval and generation separately, or you will fix the wrong half.",
          outcome:
            "Run a repeatable evaluation that reports retrieval hit rate and answer faithfulness per change.",
          flow: "golden set → retrieve → generate → score → compare",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "eval-1",
              title: "Build a golden question set from real usage",
              order: 1,
            },
            {
              id: "eval-2",
              title: "Retrieval metrics: recall, precision, and rank",
              order: 2,
            },
            {
              id: "eval-3",
              title: "Faithfulness, relevance, and answer quality",
              order: 3,
            },
            { id: "eval-4", title: "Rule-based and LLM-as-judge scorers", order: 4 },
            {
              id: "eval-5",
              title: "Regression runs in CI with Vitest or promptfoo",
              order: 5,
            },
          ],
          resources: [
            {
              id: "eval-promptfoo",
              title: "promptfoo documentation",
              url: "https://www.promptfoo.dev/docs/",
            },
            {
              id: "eval-openai",
              title: "Evals guide — OpenAI",
              url: "https://platform.openai.com/docs/guides/evals",
            },
          ],
        },
        {
          id: "ai-self-hosting",
          title: "Self-hosting open-source models",
          summary:
            "Serve open-weight models behind an OpenAI-compatible endpoint and call them from TypeScript.",
          durationWeeks: 2,
          order: 4,
          tip: "Needed when data cannot leave the country. Measure before you migrate.",
          outcome:
            "Run a model locally and in production behind an OpenAI-compatible endpoint, called through the AI SDK.",
          flow: "model → Ollama or vLLM → OpenAI-compatible endpoint → AI SDK provider → app",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "self-1", title: "Ollama locally", order: 1 },
            { id: "self-2", title: "vLLM on a server", order: 2 },
            { id: "self-3", title: "OpenAI-compatible provider in the AI SDK", order: 3 },
            {
              id: "self-4",
              title: "Transformers.js for small models in Node or the browser",
              order: 4,
            },
          ],
          resources: [
            {
              id: "self-ollama",
              title: "Ollama documentation",
              url: "https://ollama.com/",
            },
            {
              id: "self-vllm",
              title: "vLLM documentation",
              url: "https://docs.vllm.ai/en/latest/",
            },
            {
              id: "self-transformers",
              title: "Transformers.js documentation",
              url: "https://huggingface.co/docs/transformers.js",
            },
          ],
        },
        {
          id: "ai-mcp",
          title: "MCP",
          summary:
            "The MCP TypeScript SDK: build an MCP server (tools, resources) and an MCP client, then use MCP tools in an agent.",
          durationWeeks: 1,
          order: 5,
          tip: "An MCP server is a capability grant. Scope it like a database user, not like a plugin.",
          outcome:
            "Build and connect an MCP server that exposes one read-only tool with scoped credentials.",
          flow: "client → MCP server → tool → result",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "mcp-1", title: "MCP primitives: tools, resources, prompts", order: 1 },
            { id: "mcp-2", title: "Transports and server lifecycle", order: 2 },
            { id: "mcp-3", title: "Auth, scopes, and least privilege", order: 3 },
            { id: "mcp-4", title: "Build a small MCP server and client", order: 4 },
            {
              id: "mcp-5",
              title: "Use MCP tools inside an AI SDK or Mastra agent",
              order: 5,
            },
          ],
          resources: [
            {
              id: "mcp-intro",
              title: "MCP documentation",
              url: "https://modelcontextprotocol.io/docs",
            },
            {
              id: "mcp-ts-sdk",
              title: "MCP TypeScript SDK",
              url: "https://ts.sdk.modelcontextprotocol.io/v2/",
            },
          ],
        },
        {
          id: "ai-fine-tuning",
          title: "Fine-tuning",
          summary:
            "When to fine-tune versus prompt versus RAG. Prepare JSONL datasets in TypeScript and run hosted fine-tuning through provider APIs.",
          durationWeeks: 2,
          order: 6,
          tip: "Fine-tune last, after prompts and retrieval are measured. Most of the time you do not need it.",
          outcome:
            "Prepare a dataset, run hosted fine-tuning, and judge the tuned model with your own eval suite.",
          flow: "dataset (JSONL) → hosted fine-tuning → eval suite → compare",
          estimated: true,
          linkedTopicId: null,
          honestyNote:
            "Training open-weight models yourself is mostly done with Python tooling. As a TypeScript engineer you drive hosted fine-tuning and evaluation, and treat open-weight training as out of scope here.",
          subtopics: [
            { id: "ft-1", title: "When to fine-tune versus prompt versus RAG", order: 1 },
            { id: "ft-2", title: "Prepare JSONL datasets in TypeScript", order: 2 },
            { id: "ft-3", title: "Hosted fine-tuning through provider APIs", order: 3 },
            { id: "ft-4", title: "Judge the tuned model with your eval suite", order: 4 },
          ],
          resources: [
            {
              id: "ft-openai",
              title: "Fine-tuning guide — OpenAI",
              url: "https://platform.openai.com/docs/guides/fine-tuning",
            },
          ],
        },
        {
          id: "ai-auth-payments",
          title: "Auth, payments, and credits",
          summary:
            "Auth for AI endpoints, per-user rate limits, usage metering from token counts, credit balances, and billing.",
          durationWeeks: 1,
          order: 7,
          tip: "Meter every call. A feature you cannot bill for is a feature you cannot sustain.",
          outcome:
            "Protect an AI endpoint with auth, rate limits, metering, credits, and billing.",
          flow: "auth → rate limit (Redis) → meter tokens → credits (Postgres) → billing",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "authpay-1", title: "Auth for AI endpoints (Better Auth)", order: 1 },
            { id: "authpay-2", title: "Per-user rate limits with Redis", order: 2 },
            { id: "authpay-3", title: "Usage metering from token counts", order: 3 },
            { id: "authpay-4", title: "Credit balances in Postgres", order: 4 },
            { id: "authpay-5", title: "Billing with Stripe or Razorpay", order: 5 },
          ],
          resources: [
            {
              id: "authpay-better-auth",
              title: "Better Auth documentation",
              url: "https://www.better-auth.com/docs",
            },
            {
              id: "authpay-redis",
              title: "Redis documentation",
              url: "https://redis.io/docs/latest/",
            },
            {
              id: "authpay-stripe",
              title: "Stripe documentation",
              url: "https://docs.stripe.com/",
            },
            {
              id: "authpay-razorpay",
              title: "Razorpay documentation",
              url: "https://razorpay.com/docs/",
            },
          ],
        },
      ],
    },
    {
      id: "ai-production",
      title: "Leverage and build",
      subtitle:
        "Use AI coding tools as leverage only after the above. Then build products, not projects.",
      tip: "A narrow product that works beats a platform that demos. Ship the narrow one.",
      order: 5,
      topics: [
        {
          id: "ai-coding-tools",
          title: "AI coding tools as leverage",
          summary:
            "Use AI coding tools only after Phases 1-4. Before that, you skip the learning.",
          durationWeeks: 1,
          order: 1,
          tip: "The tool amplifies what you already know. It cannot substitute for it.",
          outcome:
            "Use an AI coding tool deliberately, with review and tests, on a codebase you understand.",
          flow: "understand → prompt → review → test → ship",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "aicoding-1", title: "When to reach for an AI coding tool", order: 1 },
            { id: "aicoding-2", title: "Review and test generated code", order: 2 },
            { id: "aicoding-3", title: "Keep the learning, skip the shortcut", order: 3 },
          ],
          resources: [
            {
              id: "aicoding-ai-sdk",
              title: "Vercel AI SDK documentation",
              url: "https://ai-sdk.dev/docs/introduction",
            },
          ],
        },
        {
          id: "ai-build-products",
          title: "Build products, not projects",
          summary:
            "UX, business thinking, monetization, and real users: the builder mindset.",
          durationWeeks: 2,
          order: 2,
          tip: "Ship to real users. Demos do not count.",
          outcome: "Scope, build, and charge for a small AI product with real users.",
          flow: "scope → build → charge → listen → iterate",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            { id: "buildprod-1", title: "UX for AI products", order: 1 },
            { id: "buildprod-2", title: "Business thinking and monetization", order: 2 },
            { id: "buildprod-3", title: "Real users and feedback loops", order: 3 },
            { id: "buildprod-4", title: "Builder mindset", order: 4 },
          ],
          resources: [],
        },
        {
          id: "ai-capstone",
          title: "Capstone: ship an AI product",
          summary:
            "Scope one real workflow, build it end to end, evaluate it, deploy it, and write the postmortem.",
          durationWeeks: 1,
          order: 3,
          tip: "A narrow product that works beats a platform that demos. Ship the narrow one.",
          outcome:
            "A deployed AI feature with a success metric, an evaluation set, monitoring, and a written postmortem.",
          flow: "scope → build → evaluate → deploy → monitor → review",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "capstone-1",
              title: "Choose a workflow and a success metric",
              order: 1,
            },
            {
              id: "capstone-2",
              title: "Build the smallest end-to-end version",
              order: 2,
            },
            { id: "capstone-3", title: "Evaluate, deploy, and monitor", order: 3 },
            {
              id: "capstone-4",
              title: "Write the postmortem and next iteration",
              order: 4,
            },
          ],
          resources: [
            {
              id: "capstone-agents",
              title: "Building effective agents — Anthropic",
              url: "https://www.anthropic.com/research/building-effective-agents",
            },
            {
              id: "capstone-production",
              title: "Production best practices — OpenAI",
              url: "https://platform.openai.com/docs/guides/production-best-practices",
            },
          ],
        },
      ],
    },
  ],
});
