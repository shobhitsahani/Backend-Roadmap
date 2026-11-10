import { trackContentSchema } from "@/content/schema";

export const aiEngineerTrack = trackContentSchema.parse({
  id: "ai-engineer",
  slug: "ai-engineer",
  title: "AI Engineer",
  subtitle: "From retrieval to agents in production",
  summary:
    "Applied AI for engineers who already ship software: models, retrieval, agents, and the production systems around them.",
  footer:
    "Durations are estimates. Curriculum adapted from Coder's Gyan, “Fastest AI Engineers Roadmap for 2027”.",
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
      title: "Python and LLM foundations",
      subtitle:
        "The working language of AI engineering, then how models actually behave.",
      tip: "Build small, observable scripts before you build an application. The model is the easy part.",
      order: 2,
      topics: [
        {
          id: "ai-python",
          title: "Python for AI engineers",
          summary:
            "Typed Python, async clients, packaging, and the shape of a small AI service.",
          durationWeeks: 3,
          order: 1,
          tip: "Most AI tooling is Python-first. Learn enough to read library source when the docs stop.",
          outcome:
            "Ship a typed Python service with one async model call, validation, and tests.",
          flow: "input → pydantic model → async client → typed response → test",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "ai-python-1",
              title: "Typing, dataclasses, and Pydantic models",
              order: 1,
            },
            {
              id: "ai-python-2",
              title: "Async I/O and HTTP clients",
              order: 2,
            },
            {
              id: "ai-python-3",
              title: "Packaging, environments, and dependency pinning",
              order: 3,
            },
            {
              id: "ai-python-4",
              title: "Turn a notebook into a tested module",
              order: 4,
            },
          ],
          resources: [
            {
              id: "ai-python-tutorial",
              title: "The Python Tutorial",
              url: "https://docs.python.org/3/tutorial/",
            },
            {
              id: "ai-python-asyncio",
              title: "asyncio — asynchronous I/O",
              url: "https://docs.python.org/3/library/asyncio.html",
            },
            {
              id: "ai-python-pydantic",
              title: "Pydantic documentation",
              url: "https://docs.pydantic.dev/latest/",
            },
            {
              id: "ai-python-fastapi",
              title: "FastAPI tutorial",
              url: "https://fastapi.tiangolo.com/tutorial/",
            },
          ],
        },
        {
          id: "ai-llm-fundamentals",
          title: "How LLMs work",
          summary:
            "Tokens, context windows, sampling, and the real cost and latency trade-offs between models.",
          durationWeeks: 2,
          order: 2,
          tip: "You do not need to train a model to engineer with one. You do need to know why output varies.",
          outcome:
            "Choose a model and settings for a task, and explain the cost, latency, and quality trade-off.",
          flow: "prompt → tokens → model → sampling → output",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "ai-llm-1",
              title: "Tokens, context windows, and truncation",
              order: 1,
            },
            {
              id: "ai-llm-2",
              title: "Temperature, top-p, and deterministic-enough output",
              order: 2,
            },
            {
              id: "ai-llm-3",
              title: "Model selection: quality, latency, and price",
              order: 3,
            },
            {
              id: "ai-llm-4",
              title: "Structured output and JSON schemas",
              order: 4,
            },
          ],
          resources: [
            {
              id: "ai-llm-hf-course",
              title: "Hugging Face LLM course",
              url: "https://huggingface.co/learn/llm-course",
            },
            {
              id: "ai-llm-gemini",
              title: "Gemini API documentation",
              url: "https://ai.google.dev/gemini-api/docs",
            },
            {
              id: "ai-llm-structured",
              title: "Structured outputs guide",
              url: "https://platform.openai.com/docs/guides/structured-outputs",
            },
          ],
        },
        {
          id: "ai-prompting",
          title: "Prompt engineering",
          summary:
            "Prompts as interfaces: instructions, examples, decomposition, and defenses against injected input.",
          durationWeeks: 3,
          order: 3,
          tip: "A prompt that cannot be evaluated is a guess. Write the check first.",
          outcome:
            "Maintain a versioned prompt with examples, failure cases, and an evaluation set.",
          flow: "task → instructions → examples → output contract → eval",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "ai-prompting-1",
              title: "System, developer, and user instructions",
              order: 1,
            },
            {
              id: "ai-prompting-2",
              title: "Few-shot examples and output contracts",
              order: 2,
            },
            {
              id: "ai-prompting-3",
              title: "Task decomposition and reasoning budgets",
              order: 3,
            },
            {
              id: "ai-prompting-4",
              title: "Prompt injection and instruction boundaries",
              order: 4,
            },
            {
              id: "ai-prompting-5",
              title: "Iterate against a small evaluation set",
              order: 5,
            },
          ],
          resources: [
            {
              id: "ai-prompting-openai",
              title: "Prompt engineering guide — OpenAI",
              url: "https://platform.openai.com/docs/guides/prompt-engineering",
            },
            {
              id: "ai-prompting-anthropic",
              title: "Prompt engineering overview — Anthropic",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
            },
            {
              id: "ai-prompting-guide",
              title: "Prompt Engineering Guide",
              url: "https://www.promptingguide.ai/",
            },
          ],
        },
      ],
    },
    {
      id: "ai-retrieval",
      title: "RAG and knowledge systems",
      subtitle:
        "Give a model your data: embeddings, retrieval, citations, and the evaluation that keeps it honest.",
      tip: "Most RAG failures are retrieval failures. Inspect what the model was given before you change the prompt.",
      order: 3,
      topics: [
        {
          id: "ai-embeddings",
          title: "Embeddings and vector search",
          summary:
            "Turn text into vectors, choose a similarity measure, chunk deliberately, and index for recall.",
          durationWeeks: 2,
          order: 1,
          tip: "Chunk size is a product decision: too small loses context, too large dilutes the match.",
          outcome:
            "Build a searchable index over a real document set and inspect nearest neighbours.",
          flow: "documents → chunks → embeddings → index → nearest neighbours",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "ai-embeddings-1",
              title: "Embedding models and dimensions",
              order: 1,
            },
            {
              id: "ai-embeddings-2",
              title: "Cosine, dot product, and distance metrics",
              order: 2,
            },
            {
              id: "ai-embeddings-3",
              title: "Chunking strategy and metadata",
              order: 3,
            },
            {
              id: "ai-embeddings-4",
              title: "Vector indexes and filtering",
              order: 4,
            },
          ],
          resources: [
            {
              id: "ai-embeddings-openai",
              title: "Embeddings guide — OpenAI",
              url: "https://platform.openai.com/docs/guides/embeddings",
            },
            {
              id: "ai-embeddings-qdrant",
              title: "Qdrant concepts",
              url: "https://qdrant.tech/documentation/concepts/",
            },
            {
              id: "ai-embeddings-pgvector",
              title: "pgvector",
              url: "https://github.com/pgvector/pgvector",
            },
          ],
        },
        {
          id: "ai-rag",
          title: "Retrieval pipelines",
          summary:
            "Ingestion, hybrid search, reranking, context assembly, and citations that point at real sources.",
          durationWeeks: 3,
          order: 2,
          tip: "A citation is only useful if it resolves to the passage the answer actually used.",
          outcome:
            "Ship a retrieval pipeline that answers with quoted, linked sources and degrades when nothing matches.",
          flow: "query → retrieve → rerank → assemble context → answer + citations",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "ai-rag-1",
              title: "Ingestion, deduplication, and metadata",
              order: 1,
            },
            {
              id: "ai-rag-2",
              title: "Hybrid search and reranking",
              order: 2,
            },
            {
              id: "ai-rag-3",
              title: "Context assembly and token budgets",
              order: 3,
            },
            {
              id: "ai-rag-4",
              title: "Citations, grounding, and abstention",
              order: 4,
            },
          ],
          resources: [
            {
              id: "ai-rag-llamaindex",
              title: "LlamaIndex documentation",
              url: "https://docs.llamaindex.ai/en/stable/",
            },
            {
              id: "ai-rag-contextual",
              title: "Contextual retrieval — Anthropic",
              url: "https://www.anthropic.com/research/contextual-retrieval",
            },
            {
              id: "ai-rag-qdrant",
              title: "Qdrant documentation",
              url: "https://qdrant.tech/documentation/concepts/",
            },
          ],
        },
        {
          id: "ai-rag-eval",
          title: "RAG evaluation",
          summary:
            "Golden sets, retrieval metrics, answer faithfulness, and regression runs that catch drift.",
          durationWeeks: 3,
          order: 3,
          tip: "Measure retrieval and generation separately, or you will fix the wrong half.",
          outcome:
            "Run a repeatable evaluation that reports retrieval hit rate and answer faithfulness per change.",
          flow: "golden set → retrieve → generate → score → compare",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "ai-rag-eval-1",
              title: "Build a golden question set from real usage",
              order: 1,
            },
            {
              id: "ai-rag-eval-2",
              title: "Retrieval metrics: recall, precision, and rank",
              order: 2,
            },
            {
              id: "ai-rag-eval-3",
              title: "Faithfulness, relevance, and answer quality",
              order: 3,
            },
            {
              id: "ai-rag-eval-4",
              title: "Regression runs and release gates",
              order: 4,
            },
          ],
          resources: [
            {
              id: "ai-rag-eval-openai",
              title: "Evals guide — OpenAI",
              url: "https://platform.openai.com/docs/guides/evals",
            },
            {
              id: "ai-rag-eval-ragas",
              title: "Ragas",
              url: "https://github.com/explodinggradients/ragas",
            },
            {
              id: "ai-rag-eval-langsmith",
              title: "LangSmith observability",
              url: "https://docs.langchain.com/langsmith/observability",
            },
          ],
        },
      ],
    },
    {
      id: "ai-agents",
      title: "Agents and tool use",
      subtitle:
        "Models that act: tool contracts, loop control, memory, and the boundaries that keep them safe.",
      tip: "An agent is a loop with tools and a stopping condition. If you cannot describe the stop, do not ship the loop.",
      order: 4,
      topics: [
        {
          id: "ai-tool-calling",
          title: "Tool calling and structured outputs",
          summary:
            "Give the model typed tools, validate arguments, handle failures, and require confirmation for side effects.",
          durationWeeks: 2,
          order: 1,
          tip: "Design tools like public APIs: narrow, named for intent, and impossible to misuse silently.",
          outcome:
            "Ship a tool-using endpoint with schema validation, retries, and a human confirmation gate.",
          flow: "user intent → tool schema → validated call → result → model",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "ai-tools-1",
              title: "Tool schemas and JSON Schema",
              order: 1,
            },
            {
              id: "ai-tools-2",
              title: "Parallel calls and result ordering",
              order: 2,
            },
            {
              id: "ai-tools-3",
              title: "Validation, retries, and error messages",
              order: 3,
            },
            {
              id: "ai-tools-4",
              title: "Confirmation gates for side effects",
              order: 4,
            },
          ],
          resources: [
            {
              id: "ai-tools-openai",
              title: "Function calling guide — OpenAI",
              url: "https://platform.openai.com/docs/guides/function-calling",
            },
            {
              id: "ai-tools-anthropic",
              title: "Tool use with Claude",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview",
            },
            {
              id: "ai-tools-structured",
              title: "Structured outputs guide",
              url: "https://platform.openai.com/docs/guides/structured-outputs",
            },
          ],
        },
        {
          id: "ai-agent-loops",
          title: "Agent loops and orchestration",
          summary:
            "ReAct-style loops, explicit state machines, memory, handoffs, and stopping conditions.",
          durationWeeks: 3,
          order: 2,
          tip: "Prefer a state machine with a visible graph over an open-ended loop you cannot replay.",
          outcome:
            "Build a bounded agent with persisted state, a step limit, and a trace you can replay.",
          flow: "goal → plan → act → observe → stop",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "ai-agents-1",
              title: "The plan-act-observe loop",
              order: 1,
            },
            {
              id: "ai-agents-2",
              title: "State machines and durable checkpoints",
              order: 2,
            },
            {
              id: "ai-agents-3",
              title: "Memory, summaries, and context hygiene",
              order: 3,
            },
            {
              id: "ai-agents-4",
              title: "Handoffs, step limits, and human review",
              order: 4,
            },
          ],
          resources: [
            {
              id: "ai-agents-anthropic",
              title: "Building effective agents — Anthropic",
              url: "https://www.anthropic.com/research/building-effective-agents",
            },
            {
              id: "ai-agents-langgraph",
              title: "LangGraph overview",
              url: "https://docs.langchain.com/oss/python/langgraph/overview",
            },
            {
              id: "ai-agents-openai-sdk",
              title: "OpenAI Agents SDK",
              url: "https://openai.github.io/openai-agents-python/",
            },
          ],
        },
        {
          id: "ai-mcp",
          title: "MCP and integrations",
          summary:
            "The Model Context Protocol: tools, resources, prompts, transports, and permission boundaries.",
          durationWeeks: 2,
          order: 3,
          tip: "An MCP server is a capability grant. Scope it like a database user, not like a plugin.",
          outcome:
            "Build and connect an MCP server that exposes one read-only tool with scoped credentials.",
          flow: "client → MCP server → tool → result",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "ai-mcp-1",
              title: "MCP primitives: tools, resources, prompts",
              order: 1,
            },
            {
              id: "ai-mcp-2",
              title: "Transports and server lifecycle",
              order: 2,
            },
            {
              id: "ai-mcp-3",
              title: "Auth, scopes, and least privilege",
              order: 3,
            },
            {
              id: "ai-mcp-4",
              title: "Build a small MCP server",
              order: 4,
            },
          ],
          resources: [
            {
              id: "ai-mcp-intro",
              title: "MCP — getting started",
              url: "https://modelcontextprotocol.io/docs/getting-started/intro",
            },
            {
              id: "ai-mcp-architecture",
              title: "MCP architecture",
              url: "https://modelcontextprotocol.io/docs/learn/architecture",
            },
          ],
        },
      ],
    },
    {
      id: "ai-production",
      title: "Production AI systems",
      subtitle:
        "Architecture, observability, safety, and one shipped product you can defend in an interview.",
      tip: "Production AI is ordinary distributed systems work with a nondeterministic dependency in the middle.",
      order: 5,
      topics: [
        {
          id: "ai-architecture",
          title: "AI backend architecture",
          summary:
            "Streaming responses, queues, caching, multi-tenant keys, and failure isolation around model calls.",
          durationWeeks: 2,
          order: 1,
          tip: "Put the model call behind a boundary you own. Providers change; your product should not.",
          outcome:
            "Design a service that streams answers, survives provider timeouts, and isolates tenant keys.",
          flow: "client → API → queue → model provider → stream → client",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "ai-arch-1",
              title: "Sync, async, and streaming responses",
              order: 1,
            },
            {
              id: "ai-arch-2",
              title: "Queues, retries, and idempotency",
              order: 2,
            },
            {
              id: "ai-arch-3",
              title: "Caching prompts and responses safely",
              order: 3,
            },
            {
              id: "ai-arch-4",
              title: "Multi-tenant keys and cost isolation",
              order: 4,
            },
          ],
          resources: [
            {
              id: "ai-arch-openai",
              title: "Production best practices — OpenAI",
              url: "https://platform.openai.com/docs/guides/production-best-practices",
            },
            {
              id: "ai-arch-12factor",
              title: "The Twelve-Factor App",
              url: "https://12factor.net/",
            },
          ],
        },
        {
          id: "ai-observability",
          title: "Observability, cost, and latency",
          summary:
            "Trace model calls, count tokens, set latency budgets, and know when to fall back.",
          durationWeeks: 2,
          order: 2,
          tip: "Log the prompt version, model, token counts, and outcome for every call. Without them, incidents are guesswork.",
          outcome:
            "Instrument an AI endpoint with traces, token cost, p95 latency, and an explicit fallback.",
          flow: "request → span → model call → tokens → metric → alert",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "ai-obs-1",
              title: "Traces, spans, and prompt versions",
              order: 1,
            },
            {
              id: "ai-obs-2",
              title: "Token accounting and unit economics",
              order: 2,
            },
            {
              id: "ai-obs-3",
              title: "Latency budgets and streaming UX",
              order: 3,
            },
            {
              id: "ai-obs-4",
              title: "Fallback models and graceful degradation",
              order: 4,
            },
          ],
          resources: [
            {
              id: "ai-obs-otel",
              title: "OpenTelemetry documentation",
              url: "https://opentelemetry.io/docs/",
            },
            {
              id: "ai-obs-langsmith",
              title: "LangSmith observability",
              url: "https://docs.langchain.com/langsmith/observability",
            },
            {
              id: "ai-obs-latency",
              title: "Latency optimization — OpenAI",
              url: "https://platform.openai.com/docs/guides/latency-optimization",
            },
          ],
        },
        {
          id: "ai-safety",
          title: "Safety, privacy, and evaluation",
          summary:
            "PII handling, prompt injection, content policy, human review, and release gates for probabilistic systems.",
          durationWeeks: 2,
          order: 3,
          tip: "Safety is a product surface: the refusal, the review queue, and the audit log are all UX.",
          outcome:
            "Write a threat model and an evaluation gate for an AI feature, then enforce both in code.",
          flow: "threat model → controls → eval gate → monitor → review",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "ai-safety-1",
              title: "PII, retention, and data boundaries",
              order: 1,
            },
            {
              id: "ai-safety-2",
              title: "Prompt injection and tool abuse",
              order: 2,
            },
            {
              id: "ai-safety-3",
              title: "Content policy and refusal design",
              order: 3,
            },
            {
              id: "ai-safety-4",
              title: "Human review and audit trails",
              order: 4,
            },
            {
              id: "ai-safety-5",
              title: "Evaluation gates before release",
              order: 5,
            },
          ],
          resources: [
            {
              id: "ai-safety-owasp",
              title: "OWASP Top 10 for LLM applications",
              url: "https://owasp.org/projects/top-10-for-large-language-model-applications",
            },
            {
              id: "ai-safety-nist",
              title: "NIST AI Risk Management Framework",
              url: "https://www.nist.gov/itl/ai-risk-management-framework",
            },
          ],
        },
        {
          id: "ai-capstone",
          title: "Capstone: ship an AI product",
          summary:
            "Scope one real workflow, build it end to end, evaluate it, deploy it, and write the postmortem.",
          durationWeeks: 1,
          order: 4,
          tip: "A narrow product that works beats a platform that demos. Ship the narrow one.",
          outcome:
            "A deployed AI feature with a success metric, an evaluation set, monitoring, and a written postmortem.",
          flow: "scope → build → evaluate → deploy → monitor → review",
          estimated: true,
          linkedTopicId: null,
          subtopics: [
            {
              id: "ai-capstone-1",
              title: "Choose a workflow and a success metric",
              order: 1,
            },
            {
              id: "ai-capstone-2",
              title: "Build the smallest end-to-end version",
              order: 2,
            },
            {
              id: "ai-capstone-3",
              title: "Evaluate, deploy, and monitor",
              order: 3,
            },
            {
              id: "ai-capstone-4",
              title: "Write the postmortem and next iteration",
              order: 4,
            },
          ],
          resources: [
            {
              id: "ai-capstone-agents",
              title: "Building effective agents — Anthropic",
              url: "https://www.anthropic.com/research/building-effective-agents",
            },
            {
              id: "ai-capstone-production",
              title: "Production best practices — OpenAI",
              url: "https://platform.openai.com/docs/guides/production-best-practices",
            },
          ],
        },
      ],
    },
  ],
});
