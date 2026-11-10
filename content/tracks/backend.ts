import { trackContentSchema } from "@/content/schema";

export const backendTrack = trackContentSchema.parse({
  id: "backend",
  slug: "backend",
  title: "Backend Engineer",
  subtitle: "36 weeks · 4 phases",
  summary:
    "A field plan for moving from language fundamentals to systems that hold up in production.",
  footer: null,
  order: 1,
  identityHue: 150,
  sourceTitle: null,
  sourceUrl: null,
  phases: [
    {
      id: "foundation",
      title: "Foundation",
      subtitle:
        "Language, the web, and the server fundamentals underneath everything else.",
      tip: "",
      order: 1,
      topics: [
        {
          id: "pick-a-language",
          title: "Pick a programming language",
          summary: "JavaScript, Golang, Java, Python. Clear the language fundamentals.",
          durationWeeks: 4,
          order: 1,
          tip: "Backend engineering is 80% understanding systems, 20% syntax. Once you think like an engineer, language doesn't matter.",
          outcome: null,
          flow: null,
          estimated: false,
          linkedTopicId: null,
          subtopics: [
            {
              id: "pick-a-language-1",
              title: "Pick one: JavaScript, Golang, Java, or Python",
              order: 1,
            },
            {
              id: "pick-a-language-2",
              title: "Clear the language fundamentals",
              order: 2,
            },
          ],
          resources: [
            {
              id: "language-js",
              title: "MDN JavaScript guide",
              url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
            },
            {
              id: "language-go",
              title: "A Tour of Go",
              url: "https://go.dev/tour/",
            },
            {
              id: "language-java",
              title: "dev.java — Learn Java",
              url: "https://dev.java/learn/",
            },
            {
              id: "language-python",
              title: "The Python Tutorial",
              url: "https://docs.python.org/3/tutorial/",
            },
          ],
        },
        {
          id: "how-the-web-works",
          title: "How the web works",
          summary:
            "What happens when you type a URL? Follow the request from the browser to the server.",
          durationWeeks: 3,
          order: 2,
          tip: "Knowing HTTP & Linux early helps debug real systems later.",
          outcome:
            "Build an HTTP server and serve a static site. Understand how the web works.",
          flow: null,
          estimated: false,
          linkedTopicId: null,
          subtopics: [
            {
              id: "how-the-web-works-1",
              title: "What happens when you type a URL",
              order: 1,
            },
            {
              id: "how-the-web-works-2",
              title: "Client-server architecture",
              order: 2,
            },
            {
              id: "how-the-web-works-3",
              title: "HTTP / DNS / IP / Ports / Servers",
              order: 3,
            },
            {
              id: "how-the-web-works-4",
              title: "Basic Linux commands",
              order: 4,
            },
            {
              id: "how-the-web-works-5",
              title: "Version control (Git)",
              order: 5,
            },
            {
              id: "how-the-web-works-6",
              title: "Build your own HTTP server and serve a static website",
              order: 6,
            },
          ],
          resources: [
            {
              id: "web-how",
              title: "How the web works — MDN",
              url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works",
            },
            {
              id: "web-http",
              title: "HTTP overview — MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
            },
            {
              id: "web-dns",
              title: "How DNS works",
              url: "https://howdns.works/",
            },
            {
              id: "web-git",
              title: "Pro Git",
              url: "https://git-scm.com/book/en/v2",
            },
            {
              id: "web-linux",
              title: "Linux Journey",
              url: "https://linuxjourney.com/",
            },
            {
              id: "web-server",
              title: "Create an HTTP server — Node.js",
              url: "https://nodejs.org/en/learn/http/create-an-http-server",
            },
          ],
        },
      ],
    },
    {
      id: "core-backend",
      title: "Core backend",
      subtitle:
        "APIs, data, communication mechanisms, and the habits that keep them honest.",
      tip: "",
      order: 2,
      topics: [
        {
          id: "building-apis",
          title: "Building APIs",
          summary:
            "Pick a backend framework, REST, GraphQL, CRUD / routing / controllers / middlewares, auth, error handling and API docs.",
          durationWeeks: 3,
          order: 1,
          tip: "Learn code readability & structure.",
          outcome: null,
          flow: "Frontend → API → Database → Response",
          estimated: false,
          linkedTopicId: null,
          subtopics: [
            {
              id: "building-apis-1",
              title: "Pick a backend framework",
              order: 1,
            },
            {
              id: "building-apis-2",
              title: "REST",
              order: 2,
            },
            {
              id: "building-apis-3",
              title: "GraphQL",
              order: 3,
            },
            {
              id: "building-apis-4",
              title: "CRUD / routing / controllers / middlewares",
              order: 4,
            },
            {
              id: "building-apis-5",
              title: "Authentication & authorization",
              order: 5,
            },
            {
              id: "building-apis-6",
              title: "Error handling / logging / config management",
              order: 6,
            },
            {
              id: "building-apis-7",
              title: "API docs (Swagger / OpenAPI)",
              order: 7,
            },
            {
              id: "building-apis-8",
              title: "Tooling",
              order: 8,
            },
          ],
          resources: [
            {
              id: "apis-rest",
              title: "REST API tutorial",
              url: "https://restfulapi.net/",
            },
            {
              id: "apis-graphql",
              title: "GraphQL learning path",
              url: "https://graphql.org/learn/",
            },
            {
              id: "apis-openapi",
              title: "OpenAPI specification",
              url: "https://swagger.io/specification/",
            },
            {
              id: "apis-auth",
              title: "OWASP authentication cheat sheet",
              url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html",
            },
          ],
        },
        {
          id: "database-design",
          title: "Database design",
          summary:
            "Normalisation, relations, indexes, pooling, and the ORM or query builder you choose.",
          durationWeeks: 3,
          order: 2,
          tip: "When traffic grows, the first bottleneck is your database.",
          outcome: null,
          flow: null,
          estimated: false,
          linkedTopicId: null,
          subtopics: [
            {
              id: "database-design-1",
              title: "Normalisation",
              order: 1,
            },
            {
              id: "database-design-2",
              title: "Relations and joins",
              order: 2,
            },
            {
              id: "database-design-3",
              title: "Indexing",
              order: 3,
            },
            {
              id: "database-design-4",
              title: "Connection pools",
              order: 4,
            },
            {
              id: "database-design-5",
              title: "ORM or query builder (Prisma, GORM, Sequelize)",
              order: 5,
            },
          ],
          resources: [
            {
              id: "db-postgres",
              title: "PostgreSQL documentation",
              url: "https://www.postgresql.org/docs/",
            },
            {
              id: "db-prisma",
              title: "Prisma documentation",
              url: "https://www.prisma.io/docs",
            },
            {
              id: "db-gorm",
              title: "GORM documentation",
              url: "https://gorm.io/docs/",
            },
            {
              id: "db-sequelize",
              title: "Sequelize documentation",
              url: "https://sequelize.org/docs/v6/",
            },
          ],
        },
        {
          id: "data-communication",
          title: "Data communication mechanisms",
          summary: "WebSockets, WebRTC, server-sent events, and streaming.",
          durationWeeks: 3,
          order: 3,
          tip: "Build projects around this.",
          outcome: null,
          flow: null,
          estimated: false,
          linkedTopicId: null,
          subtopics: [
            {
              id: "data-communication-1",
              title: "WebSockets",
              order: 1,
            },
            {
              id: "data-communication-2",
              title: "WebRTC",
              order: 2,
            },
            {
              id: "data-communication-3",
              title: "Server-sent events",
              order: 3,
            },
            {
              id: "data-communication-4",
              title: "Streaming",
              order: 4,
            },
          ],
          resources: [
            {
              id: "comm-websockets",
              title: "WebSocket API — MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
            },
            {
              id: "comm-webrtc",
              title: "WebRTC — MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API",
            },
            {
              id: "comm-sse",
              title: "Server-sent events — MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events",
            },
            {
              id: "comm-streams",
              title: "Streams — Node.js",
              url: "https://nodejs.org/api/stream.html",
            },
          ],
        },
        {
          id: "testing",
          title: "Testing",
          summary: "Unit, integration, e2e, Postman / Insomnia.",
          durationWeeks: 2,
          order: 4,
          tip: "",
          outcome: null,
          flow: null,
          estimated: false,
          linkedTopicId: null,
          subtopics: [
            {
              id: "testing-1",
              title: "Unit",
              order: 1,
            },
            {
              id: "testing-2",
              title: "Integration",
              order: 2,
            },
            {
              id: "testing-3",
              title: "e2e",
              order: 3,
            },
            {
              id: "testing-4",
              title: "Postman / Insomnia",
              order: 4,
            },
          ],
          resources: [
            {
              id: "testing-postman",
              title: "Postman learning center",
              url: "https://learning.postman.com/",
            },
            {
              id: "testing-insomnia",
              title: "Insomnia documentation",
              url: "https://docs.insomnia.rest/",
            },
            {
              id: "testing-vitest",
              title: "Vitest guide",
              url: "https://vitest.dev/guide/",
            },
          ],
        },
      ],
    },
    {
      id: "production-scaling",
      title: "Production and scaling",
      subtitle: "Ship it, secure it, scale it, and be able to see what it is doing.",
      tip: "",
      order: 3,
      topics: [
        {
          id: "deployment",
          title: "Deployment",
          summary:
            "Docker, CI/CD, cloud deployment, and separate environments for dev, staging, and production.",
          durationWeeks: 4,
          order: 1,
          tip: "At this stage you should be able to build a backend API and deploy it.",
          outcome: null,
          flow: null,
          estimated: false,
          linkedTopicId: null,
          subtopics: [
            {
              id: "deployment-1",
              title: "Docker & containers",
              order: 1,
            },
            {
              id: "deployment-2",
              title: "CI/CD basics",
              order: 2,
            },
            {
              id: "deployment-3",
              title: "Cloud deployment (AWS, Vercel, Render)",
              order: 3,
            },
            {
              id: "deployment-4",
              title: "Environment management (dev / staging / prod)",
              order: 4,
            },
          ],
          resources: [
            {
              id: "deploy-docker",
              title: "Docker get started",
              url: "https://docs.docker.com/get-started/",
            },
            {
              id: "deploy-actions",
              title: "GitHub Actions quickstart",
              url: "https://docs.github.com/en/actions/quickstart",
            },
            {
              id: "deploy-vercel",
              title: "Vercel documentation",
              url: "https://vercel.com/docs",
            },
            {
              id: "deploy-render",
              title: "Render documentation",
              url: "https://render.com/docs",
            },
          ],
        },
        {
          id: "security",
          title: "Security",
          summary:
            "Rate limiting, input validation, HTTPS, JWT safety, hashing / encryption.",
          durationWeeks: 2,
          order: 2,
          tip: "",
          outcome: null,
          flow: null,
          estimated: false,
          linkedTopicId: null,
          subtopics: [
            {
              id: "security-1",
              title: "Rate limiting",
              order: 1,
            },
            {
              id: "security-2",
              title: "Input validation",
              order: 2,
            },
            {
              id: "security-3",
              title: "HTTPS",
              order: 3,
            },
            {
              id: "security-4",
              title: "JWT safety",
              order: 4,
            },
            {
              id: "security-5",
              title: "Hashing / encryption",
              order: 5,
            },
          ],
          resources: [
            {
              id: "security-owasp",
              title: "OWASP cheat sheet series",
              url: "https://cheatsheetseries.owasp.org/",
            },
            {
              id: "security-jwt",
              title: "Introduction to JSON Web Tokens",
              url: "https://jwt.io/introduction",
            },
            {
              id: "security-https",
              title: "HTTPS — MDN",
              url: "https://developer.mozilla.org/en-US/docs/Glossary/HTTPS",
            },
          ],
        },
        {
          id: "scaling",
          title: "Scaling and optimisations",
          summary:
            "System design basics, load balancers, caching, queues, partitioning and sharding, gRPC.",
          durationWeeks: 5,
          order: 3,
          tip: "Understand the tradeoffs in system design.",
          outcome: null,
          flow: null,
          estimated: false,
          linkedTopicId: null,
          subtopics: [
            {
              id: "scaling-1",
              title: "System design basics",
              order: 1,
            },
            {
              id: "scaling-2",
              title: "Horizontal vs vertical scaling",
              order: 2,
            },
            {
              id: "scaling-3",
              title: "Load balancers and reverse proxies (Nginx)",
              order: 3,
            },
            {
              id: "scaling-4",
              title: "Caching (Redis, CDN basics)",
              order: 4,
            },
            {
              id: "scaling-5",
              title: "Message queues (Kafka, RabbitMQ)",
              order: 5,
            },
            {
              id: "scaling-6",
              title: "Database partitioning and sharding",
              order: 6,
            },
            {
              id: "scaling-7",
              title: "gRPC",
              order: 7,
            },
          ],
          resources: [
            {
              id: "scaling-primer",
              title: "The System Design Primer",
              url: "https://github.com/donnemartin/system-design-primer",
            },
            {
              id: "scaling-nginx",
              title: "Nginx documentation",
              url: "https://nginx.org/en/docs/",
            },
            {
              id: "scaling-redis",
              title: "Redis documentation",
              url: "https://redis.io/docs/latest/",
            },
            {
              id: "scaling-kafka",
              title: "Apache Kafka documentation",
              url: "https://kafka.apache.org/documentation/",
            },
            {
              id: "scaling-rabbitmq",
              title: "RabbitMQ tutorials",
              url: "https://www.rabbitmq.com/tutorials",
            },
            {
              id: "scaling-grpc",
              title: "gRPC documentation",
              url: "https://grpc.io/docs/",
            },
          ],
        },
        {
          id: "observability",
          title: "Observability",
          summary: "Monitoring, metrics, logging and tracing.",
          durationWeeks: 1,
          order: 4,
          tip: "",
          outcome: null,
          flow: null,
          estimated: false,
          linkedTopicId: null,
          subtopics: [
            {
              id: "observability-1",
              title: "Monitoring",
              order: 1,
            },
            {
              id: "observability-2",
              title: "Metrics",
              order: 2,
            },
            {
              id: "observability-3",
              title: "Logging and tracing",
              order: 3,
            },
          ],
          resources: [
            {
              id: "observability-prometheus",
              title: "Prometheus overview",
              url: "https://prometheus.io/docs/introduction/overview/",
            },
            {
              id: "observability-otel",
              title: "OpenTelemetry documentation",
              url: "https://opentelemetry.io/docs/",
            },
            {
              id: "observability-grafana",
              title: "Grafana documentation",
              url: "https://grafana.com/docs/",
            },
          ],
        },
      ],
    },
    {
      id: "hard-core-backend",
      title: "Hard core backend engineering",
      subtitle: "Design patterns, clean architecture, SOLID, and libraries of your own.",
      tip: "",
      order: 4,
      topics: [
        {
          id: "become-a-nerd",
          title: "Become a Nerd",
          summary:
            "Design patterns, clean architecture principles, SOLID principles, build your own libraries.",
          durationWeeks: 6,
          order: 1,
          tip: "At this stage, you will become unstoppable.",
          outcome: null,
          flow: null,
          estimated: false,
          linkedTopicId: null,
          subtopics: [
            {
              id: "become-a-nerd-1",
              title: "Design patterns",
              order: 1,
            },
            {
              id: "become-a-nerd-2",
              title: "Clean architecture principles",
              order: 2,
            },
            {
              id: "become-a-nerd-3",
              title: "SOLID principles",
              order: 3,
            },
            {
              id: "become-a-nerd-4",
              title: "Build your own libraries",
              order: 4,
            },
          ],
          resources: [
            {
              id: "nerd-patterns",
              title: "Refactoring Guru — design patterns",
              url: "https://refactoring.guru/design-patterns",
            },
            {
              id: "nerd-solid",
              title: "SOLID principles",
              url: "https://www.baeldung.com/solid-principles",
            },
            {
              id: "nerd-clean",
              title: "The Clean Architecture",
              url: "https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html",
            },
            {
              id: "nerd-build",
              title: "Build your own X",
              url: "https://github.com/codecrafters-io/build-your-own-x",
            },
          ],
        },
      ],
    },
  ],
});
