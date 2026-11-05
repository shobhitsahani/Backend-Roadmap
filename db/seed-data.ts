import type { ActivityRow, phases, resources, subtopics, topics } from "./schema";

type TopicSeed = typeof topics.$inferInsert;
type SubtopicSeed = typeof subtopics.$inferInsert;
type ResourceSeed = typeof resources.$inferInsert;
export const phaseSeeds: (typeof phases.$inferInsert)[] = [
  {
    id: "foundation",
    title: "Foundation",
    subtitle:
      "Language, the web, and the server fundamentals underneath everything else.",
    order: 1,
  },
  {
    id: "core-backend",
    title: "Core backend",
    subtitle:
      "APIs, data, communication mechanisms, and the habits that keep them honest.",
    order: 2,
  },
  {
    id: "production-scaling",
    title: "Production and scaling",
    subtitle: "Ship it, secure it, scale it, and be able to see what it is doing.",
    order: 3,
  },
  {
    id: "hard-core-backend",
    title: "Hard core backend engineering",
    subtitle: "Design patterns, clean architecture, SOLID, and libraries of your own.",
    order: 4,
  },
];

export const topicSeeds: TopicSeed[] = [
  {
    id: "pick-a-language",
    phaseId: "foundation",
    title: "Pick a programming language",
    summary: "JavaScript, Golang, Java, Python. Clear the language fundamentals.",
    durationWeeks: 4,
    order: 1,
    tip: "Backend engineering is 80% understanding systems, 20% syntax. Once you think like an engineer, language doesn't matter.",
  },
  {
    id: "how-the-web-works",
    phaseId: "foundation",
    title: "How the web works",
    summary:
      "What happens when you type a URL? Follow the request from the browser to the server.",
    durationWeeks: 3,
    order: 2,
    tip: "Knowing HTTP & Linux early helps debug real systems later.",
    outcome:
      "Build an HTTP server and serve a static site. Understand how the web works.",
  },
  {
    id: "building-apis",
    phaseId: "core-backend",
    title: "Building APIs",
    summary:
      "Pick a backend framework, REST, GraphQL, CRUD / routing / controllers / middlewares, auth, error handling and API docs.",
    durationWeeks: 3,
    order: 1,
    tip: "Learn code readability & structure.",
    flow: "Frontend → API → Database → Response",
  },
  {
    id: "database-design",
    phaseId: "core-backend",
    title: "Database design",
    summary:
      "Normalisation, relations, indexes, pooling, and the ORM or query builder you choose.",
    durationWeeks: 3,
    order: 2,
    tip: "When traffic grows, the first bottleneck is your database.",
  },
  {
    id: "data-communication",
    phaseId: "core-backend",
    title: "Data communication mechanisms",
    summary: "WebSockets, WebRTC, server-sent events, and streaming.",
    durationWeeks: 3,
    order: 3,
    tip: "Build projects around this.",
  },
  {
    id: "testing",
    phaseId: "core-backend",
    title: "Testing",
    summary: "Unit, integration, e2e, Postman / Insomnia.",
    durationWeeks: 2,
    order: 4,
    tip: "",
  },
  {
    id: "deployment",
    phaseId: "production-scaling",
    title: "Deployment",
    summary:
      "Docker, CI/CD, cloud deployment, and separate environments for dev, staging, and production.",
    durationWeeks: 4,
    order: 1,
    tip: "At this stage you should be able to build a backend API and deploy it.",
  },
  {
    id: "security",
    phaseId: "production-scaling",
    title: "Security",
    summary: "Rate limiting, input validation, HTTPS, JWT safety, hashing / encryption.",
    durationWeeks: 2,
    order: 2,
    tip: "",
  },
  {
    id: "scaling",
    phaseId: "production-scaling",
    title: "Scaling and optimisations",
    summary:
      "System design basics, load balancers, caching, queues, partitioning and sharding, gRPC.",
    durationWeeks: 5,
    order: 3,
    tip: "Understand the tradeoffs in system design.",
  },
  {
    id: "observability",
    phaseId: "production-scaling",
    title: "Observability",
    summary: "Monitoring, metrics, logging and tracing.",
    durationWeeks: 1,
    order: 4,
    tip: "",
  },
  {
    id: "become-a-nerd",
    phaseId: "hard-core-backend",
    title: "Become a Nerd",
    summary:
      "Design patterns, clean architecture principles, SOLID principles, build your own libraries.",
    durationWeeks: 6,
    order: 1,
    tip: "At this stage, you will become unstoppable.",
  },
];

export const subtopicTitles: Record<string, string[]> = {
  "pick-a-language": [
    "Pick one: JavaScript, Golang, Java, or Python",
    "Clear the language fundamentals",
  ],
  "how-the-web-works": [
    "What happens when you type a URL",
    "Client-server architecture",
    "HTTP / DNS / IP / Ports / Servers",
    "Basic Linux commands",
    "Version control (Git)",
    "Build your own HTTP server and serve a static website",
  ],
  "building-apis": [
    "Pick a backend framework",
    "REST",
    "GraphQL",
    "CRUD / routing / controllers / middlewares",
    "Authentication & authorization",
    "Error handling / logging / config management",
    "API docs (Swagger / OpenAPI)",
    "Tooling",
  ],
  "database-design": [
    "Normalisation",
    "Relations and joins",
    "Indexing",
    "Connection pools",
    "ORM or query builder (Prisma, GORM, Sequelize)",
  ],
  "data-communication": ["WebSockets", "WebRTC", "Server-sent events", "Streaming"],
  testing: ["Unit", "Integration", "e2e", "Postman / Insomnia"],
  deployment: [
    "Docker & containers",
    "CI/CD basics",
    "Cloud deployment (AWS, Vercel, Render)",
    "Environment management (dev / staging / prod)",
  ],
  security: [
    "Rate limiting",
    "Input validation",
    "HTTPS",
    "JWT safety",
    "Hashing / encryption",
  ],
  scaling: [
    "System design basics",
    "Horizontal vs vertical scaling",
    "Load balancers and reverse proxies (Nginx)",
    "Caching (Redis, CDN basics)",
    "Message queues (Kafka, RabbitMQ)",
    "Database partitioning and sharding",
    "gRPC",
  ],
  observability: ["Monitoring", "Metrics", "Logging and tracing"],
  "become-a-nerd": [
    "Design patterns",
    "Clean architecture principles",
    "SOLID principles",
    "Build your own libraries",
  ],
};

export const resourceSeeds: ResourceSeed[] = [
  {
    id: "language-js",
    topicId: "pick-a-language",
    title: "MDN JavaScript guide",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
  },
  {
    id: "language-go",
    topicId: "pick-a-language",
    title: "A Tour of Go",
    url: "https://go.dev/tour/",
  },
  {
    id: "language-java",
    topicId: "pick-a-language",
    title: "dev.java — Learn Java",
    url: "https://dev.java/learn/",
  },
  {
    id: "language-python",
    topicId: "pick-a-language",
    title: "The Python Tutorial",
    url: "https://docs.python.org/3/tutorial/",
  },
  {
    id: "web-how",
    topicId: "how-the-web-works",
    title: "How the web works — MDN",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works",
  },
  {
    id: "web-http",
    topicId: "how-the-web-works",
    title: "HTTP overview — MDN",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
  },
  {
    id: "web-dns",
    topicId: "how-the-web-works",
    title: "How DNS works",
    url: "https://howdns.works/",
  },
  {
    id: "web-git",
    topicId: "how-the-web-works",
    title: "Pro Git",
    url: "https://git-scm.com/book/en/v2",
  },
  {
    id: "web-linux",
    topicId: "how-the-web-works",
    title: "Linux Journey",
    url: "https://linuxjourney.com/",
  },
  {
    id: "web-server",
    topicId: "how-the-web-works",
    title: "Create an HTTP server — Node.js",
    url: "https://nodejs.org/en/learn/http/create-an-http-server",
  },
  {
    id: "apis-rest",
    topicId: "building-apis",
    title: "REST API tutorial",
    url: "https://restfulapi.net/",
  },
  {
    id: "apis-graphql",
    topicId: "building-apis",
    title: "GraphQL learning path",
    url: "https://graphql.org/learn/",
  },
  {
    id: "apis-openapi",
    topicId: "building-apis",
    title: "OpenAPI specification",
    url: "https://swagger.io/specification/",
  },
  {
    id: "apis-auth",
    topicId: "building-apis",
    title: "OWASP authentication cheat sheet",
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html",
  },
  {
    id: "db-postgres",
    topicId: "database-design",
    title: "PostgreSQL documentation",
    url: "https://www.postgresql.org/docs/",
  },
  {
    id: "db-prisma",
    topicId: "database-design",
    title: "Prisma documentation",
    url: "https://www.prisma.io/docs",
  },
  {
    id: "db-gorm",
    topicId: "database-design",
    title: "GORM documentation",
    url: "https://gorm.io/docs/",
  },
  {
    id: "db-sequelize",
    topicId: "database-design",
    title: "Sequelize documentation",
    url: "https://sequelize.org/docs/v6/",
  },
  {
    id: "comm-websockets",
    topicId: "data-communication",
    title: "WebSocket API — MDN",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
  },
  {
    id: "comm-webrtc",
    topicId: "data-communication",
    title: "WebRTC — MDN",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API",
  },
  {
    id: "comm-sse",
    topicId: "data-communication",
    title: "Server-sent events — MDN",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events",
  },
  {
    id: "comm-streams",
    topicId: "data-communication",
    title: "Streams — Node.js",
    url: "https://nodejs.org/api/stream.html",
  },
  {
    id: "testing-postman",
    topicId: "testing",
    title: "Postman learning center",
    url: "https://learning.postman.com/",
  },
  {
    id: "testing-insomnia",
    topicId: "testing",
    title: "Insomnia documentation",
    url: "https://docs.insomnia.rest/",
  },
  {
    id: "testing-vitest",
    topicId: "testing",
    title: "Vitest guide",
    url: "https://vitest.dev/guide/",
  },
  {
    id: "deploy-docker",
    topicId: "deployment",
    title: "Docker get started",
    url: "https://docs.docker.com/get-started/",
  },
  {
    id: "deploy-actions",
    topicId: "deployment",
    title: "GitHub Actions quickstart",
    url: "https://docs.github.com/en/actions/quickstart",
  },
  {
    id: "deploy-vercel",
    topicId: "deployment",
    title: "Vercel documentation",
    url: "https://vercel.com/docs",
  },
  {
    id: "deploy-render",
    topicId: "deployment",
    title: "Render documentation",
    url: "https://render.com/docs",
  },
  {
    id: "security-owasp",
    topicId: "security",
    title: "OWASP cheat sheet series",
    url: "https://cheatsheetseries.owasp.org/",
  },
  {
    id: "security-jwt",
    topicId: "security",
    title: "Introduction to JSON Web Tokens",
    url: "https://jwt.io/introduction",
  },
  {
    id: "security-https",
    topicId: "security",
    title: "HTTPS — MDN",
    url: "https://developer.mozilla.org/en-US/docs/Glossary/HTTPS",
  },
  {
    id: "scaling-primer",
    topicId: "scaling",
    title: "The System Design Primer",
    url: "https://github.com/donnemartin/system-design-primer",
  },
  {
    id: "scaling-nginx",
    topicId: "scaling",
    title: "Nginx documentation",
    url: "https://nginx.org/en/docs/",
  },
  {
    id: "scaling-redis",
    topicId: "scaling",
    title: "Redis documentation",
    url: "https://redis.io/docs/latest/",
  },
  {
    id: "scaling-kafka",
    topicId: "scaling",
    title: "Apache Kafka documentation",
    url: "https://kafka.apache.org/documentation/",
  },
  {
    id: "scaling-rabbitmq",
    topicId: "scaling",
    title: "RabbitMQ tutorials",
    url: "https://www.rabbitmq.com/tutorials",
  },
  {
    id: "scaling-grpc",
    topicId: "scaling",
    title: "gRPC documentation",
    url: "https://grpc.io/docs/",
  },
  {
    id: "observability-prometheus",
    topicId: "observability",
    title: "Prometheus overview",
    url: "https://prometheus.io/docs/introduction/overview/",
  },
  {
    id: "observability-otel",
    topicId: "observability",
    title: "OpenTelemetry documentation",
    url: "https://opentelemetry.io/docs/",
  },
  {
    id: "observability-grafana",
    topicId: "observability",
    title: "Grafana documentation",
    url: "https://grafana.com/docs/",
  },
  {
    id: "nerd-patterns",
    topicId: "become-a-nerd",
    title: "Refactoring Guru — design patterns",
    url: "https://refactoring.guru/design-patterns",
  },
  {
    id: "nerd-solid",
    topicId: "become-a-nerd",
    title: "SOLID principles",
    url: "https://www.baeldung.com/solid-principles",
  },
  {
    id: "nerd-clean",
    topicId: "become-a-nerd",
    title: "The Clean Architecture",
    url: "https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html",
  },
  {
    id: "nerd-build",
    topicId: "become-a-nerd",
    title: "Build your own X",
    url: "https://github.com/codecrafters-io/build-your-own-x",
  },
];

export const subtopicSeeds: SubtopicSeed[] = Object.entries(subtopicTitles).flatMap(
  ([topicId, titles]) =>
    titles.map((title, index) => ({
      id: `${topicId}-${index + 1}`,
      topicId,
      title,
      done: false,
      order: index + 1,
    })),
);

export const activitySeeds: ActivityRow[] = [];
