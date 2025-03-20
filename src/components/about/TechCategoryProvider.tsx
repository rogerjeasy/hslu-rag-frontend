'use client'

import { createContext, useContext, ReactNode } from 'react'
import { 
  Zap, 
  Database, 
  Code, 
  Server, 
  Globe, 
  Layers, 
  LineChart, 
  Shield 
} from 'lucide-react'
import { Technology } from './TechnologyCard'

export interface TechStackCategory {
  icon: React.ReactNode
  title: string
  accentColor: string
  technologies: Technology[]
}

// Create the technology categories
const techCategories: TechStackCategory[] = [
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Frontend Technologies",
    accentColor: "blue",
    technologies: [
      {
        name: "Next.js",
        description: "React framework with hybrid static & server-side rendering",
        url: "https://nextjs.org/",
      },
      {
        name: "TypeScript",
        description: "Strongly typed programming language that builds on JavaScript",
        url: "https://www.typescriptlang.org/",
      },
      {
        name: "React",
        description: "JavaScript library for building user interfaces",
        url: "https://reactjs.org/",
      },
      {
        name: "Tailwind CSS",
        description: "Utility-first CSS framework for rapid UI development",
        url: "https://tailwindcss.com/",
      },
      {
        name: "ShadCN UI",
        description: "Re-usable components built with Radix UI and Tailwind CSS",
        url: "https://ui.shadcn.com/",
      },
      {
        name: "Framer Motion",
        description: "Production-ready motion library for React",
        url: "https://www.framer.com/motion/",
      }
    ]
  },
  {
    icon: <Server className="h-6 w-6" />,
    title: "Backend Infrastructure",
    accentColor: "emerald",
    technologies: [
      {
        name: "FastAPI",
        description: "High-performance web framework for building APIs with Python",
        url: "https://fastapi.tiangolo.com/",
      },
      {
        name: "Python",
        description: "Programming language known for its simplicity and readability",
        url: "https://www.python.org/",
      },
      {
        name: "Socket.io",
        description: "Library for real-time web applications",
        url: "https://socket.io/",
      },
      {
        name: "JWT",
        description: "JSON Web Tokens for secure authentication",
        url: "https://jwt.io/",
      },
      {
        name: "Uvicorn",
        description: "ASGI server implementation for Python web apps",
        url: "https://www.uvicorn.org/",
      },
      {
        name: "Pydantic",
        description: "Data validation and settings management using Python type hints",
        url: "https://pydantic-docs.helpmanual.io/",
      }
    ]
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Data Storage Solutions",
    accentColor: "violet",
    technologies: [
      {
        name: "ChromaDB",
        description: "Open-source embedding database for AI applications",
        url: "https://www.trychroma.com/",
      },
      {
        name: "PostgreSQL",
        description: "Powerful, open source object-relational database system",
        url: "https://www.postgresql.org/",
      },
      {
        name: "Redis",
        description: "In-memory data structure store used as cache",
        url: "https://redis.io/",
      },
      {
        name: "MongoDB",
        description: "Document-oriented NoSQL database for high volume data storage",
        url: "https://www.mongodb.com/",
      },
      {
        name: "MinIO",
        description: "High-performance object storage for large raw files",
        url: "https://min.io/",
      }
    ]
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "AI & Machine Learning",
    accentColor: "amber",
    technologies: [
      {
        name: "LangChain",
        description: "Framework for developing applications powered by language models",
        url: "https://langchain.com/",
      },
      {
        name: "GPT-4",
        description: "Advanced language model by OpenAI for generating human-like text",
        url: "https://openai.com/gpt-4",
      },
      {
        name: "Claude",
        description: "AI assistant by Anthropic designed for helpful, harmless interactions",
        url: "https://www.anthropic.com/claude",
      },
      {
        name: "Sentence Transformers",
        description: "Python framework for state-of-the-art sentence embeddings",
        url: "https://www.sbert.net/",
      },
      {
        name: "Hugging Face Transformers",
        description: "State-of-the-art Natural Language Processing library",
        url: "https://huggingface.co/transformers/",
      },
      {
        name: "PyTorch",
        description: "Open source machine learning framework",
        url: "https://pytorch.org/",
      }
    ]
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "DevOps & Infrastructure",
    accentColor: "rose",
    technologies: [
      {
        name: "Docker",
        description: "Platform for developing, shipping, and running applications in containers",
        url: "https://www.docker.com/",
      },
      {
        name: "Kubernetes",
        description: "Container orchestration system for automated deployment & scaling",
        url: "https://kubernetes.io/",
      },
      {
        name: "GitHub Actions",
        description: "CI/CD platform integrated with GitHub",
        url: "https://github.com/features/actions",
      },
      {
        name: "Prometheus",
        description: "Monitoring system and time series database",
        url: "https://prometheus.io/",
      },
      {
        name: "Grafana",
        description: "Analytics & monitoring solution for metrics visualization",
        url: "https://grafana.com/",
      }
    ]
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Security & Authentication",
    accentColor: "indigo",
    technologies: [
      {
        name: "OAuth 2.0",
        description: "Industry-standard protocol for authorization",
        url: "https://oauth.net/2/",
      },
      {
        name: "HTTPS/TLS",
        description: "Secure communications protocol for encrypted data transfer",
        url: "https://en.wikipedia.org/wiki/HTTPS",
      },
      {
        name: "RBAC",
        description: "Role-based access control for permissions management",
        url: "https://en.wikipedia.org/wiki/Role-based_access_control",
      },
      {
        name: "HSLU SSO",
        description: "Single Sign-On integration with HSLU's authentication system",
        url: "#",
      }
    ]
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Analytics & Monitoring",
    accentColor: "cyan",
    technologies: [
      {
        name: "Google Analytics",
        description: "Web analytics service for tracking website traffic",
        url: "https://analytics.google.com/",
      },
      {
        name: "Hotjar",
        description: "Behavior analytics and user feedback tool",
        url: "https://www.hotjar.com/",
      },
      {
        name: "Sentry",
        description: "Error tracking that helps developers monitor and fix crashes",
        url: "https://sentry.io/",
      },
      {
        name: "ELK Stack",
        description: "Elasticsearch, Logstash & Kibana for log analysis",
        url: "https://www.elastic.co/elastic-stack",
      }
    ]
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Specialized Data Science Tooling",
    accentColor: "orange",
    technologies: [
      {
        name: "Jupyter Integration",
        description: "For notebook display and interactive execution",
        url: "https://jupyter.org/",
      },
      {
        name: "MathJax",
        description: "JavaScript display engine for mathematics notation",
        url: "https://www.mathjax.org/",
      },
      {
        name: "Pandas",
        description: "Data analysis and manipulation library",
        url: "https://pandas.pydata.org/",
      },
      {
        name: "NetworkX",
        description: "For knowledge graph visualization",
        url: "https://networkx.github.io/",
      },
      {
        name: "Scikit-learn",
        description: "Machine learning library for Python",
        url: "https://scikit-learn.org/",
      }
    ]
  }
]

// Create a context for tech categories
const TechCategoriesContext = createContext<TechStackCategory[]>(techCategories)

// Provider component for tech categories
export const TechCategoriesProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TechCategoriesContext.Provider value={techCategories}>
      {children}
    </TechCategoriesContext.Provider>
  )
}

// Hook to access tech categories
export const useTechCategories = () => {
  return useContext(TechCategoriesContext)
}