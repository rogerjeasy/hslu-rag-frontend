import { Course } from '@/types/course';
import { 
  BarChart2, 
  Database, 
  BrainCircuit, 
  LineChart, 
  Code, 
  ServerCrash,
  BookOpen,
  Lightbulb,
  Cpu,
  Share2,
  ShieldCheck,
  Network
} from 'lucide-react';

export const courses: Course[] = [
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    icon: <BrainCircuit className="h-6 w-6 text-purple-500" />,
    description: 'Advanced machine learning algorithms, model optimization, and practical applications.',
    topics: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Model Evaluation', 'Feature Engineering'],
    sampleQuestion: 'What are the key differences between decision trees and random forests, and when would you choose one over the other?',
    difficulty: 'Advanced',
    color: 'purple',
    highlights: ['Hands-on lab exercises', 'Real-world case studies', 'Algorithm implementation']
  },
  {
    id: 'statistics',
    title: 'Statistical Methods',
    icon: <BarChart2 className="h-6 w-6 text-blue-500" />,
    description: 'Statistical analysis, hypothesis testing, and probabilistic modeling for data science.',
    topics: ['Probability Distributions', 'Hypothesis Testing', 'Regression Analysis', 'Bayesian Statistics', 'Experimental Design'],
    sampleQuestion: 'Explain the assumptions of linear regression and how to verify them in your analysis.',
    difficulty: 'Intermediate',
    color: 'blue',
    highlights: ['Interactive statistical tools', 'R programming examples', 'SPSS integration']
  },
  {
    id: 'big-data',
    title: 'Big Data Technologies',
    icon: <Database className="h-6 w-6 text-green-500" />,
    description: 'Processing, storing, and analyzing large-scale data using modern big data frameworks.',
    topics: ['Hadoop Ecosystem', 'Spark Processing', 'NoSQL Databases', 'Data Pipelines', 'Stream Processing'],
    sampleQuestion: 'Compare and contrast batch processing and stream processing in big data applications.',
    difficulty: 'Advanced',
    color: 'green',
    highlights: ['Cloud-based lab environments', 'Industry-standard tools', 'Scalable architectures']
  },
  {
    id: 'data-viz',
    title: 'Data Visualization',
    icon: <LineChart className="h-6 w-6 text-yellow-500" />,
    description: 'Effective visualization techniques to communicate insights from complex datasets.',
    topics: ['Visualization Principles', 'Interactive Dashboards', 'Geospatial Visualization', 'Storytelling with Data', 'Visualization Tools'],
    sampleQuestion: 'What considerations should you make when designing visualizations for different audience types?',
    difficulty: 'Intermediate',
    color: 'yellow',
    highlights: ['Portfolio development', 'Tableau & PowerBI training', 'Information design principles']
  },
  {
    id: 'programming',
    title: 'Python & R Programming',
    icon: <Code className="h-6 w-6 text-red-500" />,
    description: 'Advanced programming concepts and libraries for data analysis and modeling.',
    topics: ['Scientific Computing', 'Data Manipulation', 'Parallel Processing', 'Algorithm Design', 'Software Development Practices'],
    sampleQuestion: 'Implement a function to efficiently process a large dataset using parallel computation in Python.',
    difficulty: 'All Levels',
    color: 'red',
    highlights: ['Jupyter notebook tutorials', 'GitHub integration', 'Code reviews']
  },
  {
    id: 'cloud',
    title: 'Cloud Computing',
    icon: <ServerCrash className="h-6 w-6 text-indigo-500" />,
    description: 'Deploying data science solutions in cloud environments like AWS, Azure, and GCP.',
    topics: ['Infrastructure as Code', 'Serverless Computing', 'Container Orchestration', 'Cloud Storage Solutions', 'Deployment Strategies'],
    sampleQuestion: 'Design a scalable machine learning pipeline using serverless architecture on AWS.',
    difficulty: 'Advanced',
    color: 'indigo',
    highlights: ['AWS/Azure certification prep', 'Cost optimization strategies', 'Security best practices']
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    icon: <Network className="h-6 w-6 text-blue-600" />,
    description: 'Advanced neural network architectures and applications in various domains.',
    topics: ['CNN', 'RNN', 'Transformers', 'GANs', 'Transfer Learning', 'Model Deployment'],
    sampleQuestion: 'How would you approach building a computer vision system for medical image analysis?',
    difficulty: 'Advanced',
    color: 'blue',
    highlights: ['GPU-accelerated labs', 'TensorFlow & PyTorch', 'Research paper implementations']
  },
  {
    id: 'data-ethics',
    title: 'Data Ethics & Privacy',
    icon: <ShieldCheck className="h-6 w-6 text-teal-500" />,
    description: 'Ethical considerations, privacy regulations, and responsible AI development practices.',
    topics: ['GDPR Compliance', 'Algorithmic Bias', 'Privacy-Preserving ML', 'Ethics Frameworks', 'Auditing ML Systems'],
    sampleQuestion: 'How can you identify and mitigate potential biases in a machine learning model?',
    difficulty: 'Intermediate',
    color: 'teal',
    highlights: ['Case study discussions', 'Regulatory compliance', 'Ethical frameworks']
  },
  {
    id: 'data-engineering',
    title: 'Data Engineering',
    icon: <Cpu className="h-6 w-6 text-orange-500" />,
    description: 'Building robust data pipelines and infrastructure for data science workflows.',
    topics: ['ETL Processes', 'Data Warehousing', 'Data Quality', 'Distributed Systems', 'Real-time Processing'],
    sampleQuestion: 'Design a data pipeline that can handle both batch and streaming data with fault tolerance.',
    difficulty: 'Advanced',
    color: 'orange',
    highlights: ['Industry tools & frameworks', 'Performance optimization', 'Scalable architectures']
  },
  {
    id: 'nlp',
    title: 'Natural Language Processing',
    icon: <Share2 className="h-6 w-6 text-violet-500" />,
    description: 'Processing and analyzing text data for insights and applications.',
    topics: ['Text Classification', 'Sentiment Analysis', 'Named Entity Recognition', 'Language Models', 'Topic Modeling'],
    sampleQuestion: 'How would you build a system to automatically categorize customer feedback based on sentiment and topic?',
    difficulty: 'Advanced',
    color: 'violet',
    highlights: ['Multilingual applications', 'Latest LLM techniques', 'Information extraction methods']
  },
  {
    id: 'research-methods',
    title: 'Research Methods',
    icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
    description: 'Scientific research methodology, literature review, and thesis preparation.',
    topics: ['Research Design', 'Literature Review', 'Thesis Structure', 'Academic Writing', 'Research Ethics'],
    sampleQuestion: 'How do you design a research study that effectively addresses your research questions?',
    difficulty: 'Intermediate',
    color: 'amber',
    highlights: ['Publication guidance', 'Thesis preparation', 'Scientific communication']
  },
  {
    id: 'applied-projects',
    title: 'Applied Projects',
    icon: <BookOpen className="h-6 w-6 text-emerald-500" />,
    description: 'Hands-on project work with real-world datasets and industry partners.',
    topics: ['Project Management', 'Stakeholder Communication', 'Solution Design', 'Evaluation Methods', 'Presentation Skills'],
    sampleQuestion: 'How would you approach a data science project where the business problem is not clearly defined?',
    difficulty: 'All Levels',
    color: 'emerald',
    highlights: ['Industry partnerships', 'Portfolio building', 'End-to-end implementation']
  }
];