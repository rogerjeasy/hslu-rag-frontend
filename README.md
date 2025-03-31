# HSLU Data Science RAG - Frontend Client

## Overview

This frontend application serves as the client interface for the HSLU Data Science Exam Preparation RAG (Retrieval-Augmented Generation) system. Designed specifically for MSc students in Applied Information and Data Science at Lucerne University of Applied Sciences and Arts (HSLU), this application provides an intelligent study companion to help students prepare for exams using course-specific materials.

## Key Features
- **AI Study Assistant**: Get instant, accurate answers to your questions based on your specific HSLU course materials and textbooks.
- **Study Guide Generator**: Generate comprehensive study guides and concise summaries organized by importance and relevance to exams.
- **Practice Questions**: Test your knowledge with course-specific practice questions that reference specific lectures and concepts.
- **Authentication with Firebase** for secure user management and data storage.

## Technology Stack

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Modern UI**: Shadcn UI
- **State Management**: Zustand
- **Authentication**: JWT with Firebase Auth
- **Code Rendering**: CodeMirror/Monaco Editor
- **Data Visualization**: Chart.js/Recharts
- **Markdown Rendering**: React Markdown

## Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rogerjeasy/hslu-rag-frontend.git
   cd hslu-rag-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the necessary environment variables:
   ```
  
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:3000`

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Homepage
│   ├── chat/            # Chat interface
│   ├── courses/         # Course browsing
│   ├── login/           # Authentication pages
│   └── register/        # Registration pages
├── components/          # Reusable components
│   ├── auth/            # Authentication components
│   ├── chat/            # Chat interface components
│   ├── courses/         # Course-related components
│   ├── layout/          # Layout components
│   └── ui/              # UI components
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── services/            # API service integrations
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## Key Components

### Authentication
The authentication system supports email/password login via Firebase. Protected routes require authentication to access course materials and the chat interface.

### Chat Interface
The chat interface is the primary interaction point for students. It supports:
- Real-time messaging with the RAG system
- Message history and conversation management
- Code syntax highlighting
- Mathematical formula rendering
- Citation of source materials in responses

### Course Selection
Students can browse available courses and create topics to focus their study sessions. This context helps the RAG system provide more targeted and relevant responses.

### Study Guide Generator
The Study Guide Generator allows students to:
- Create comprehensive study guides tailored to specific courses and selected topics
- Generate concise summaries based on course materials
- Organize study materials by importance and conceptual relationships
- Export study guides in different formats (Markdown)
- Save and revisit previously generated guides

### Practice Question Engine
The Practice Question feature helps students test their knowledge through:
- Course-specific questions that reference lectures and textbooks (based on the selected course and topic)
- Difficulty levels that adapt based on student performance
- Detailed explanations with citations to course materials
- Custom quiz creation based on specific topics or weaknesses

## API Integration
The frontend communicates with the backend RAG system through a RESTful API. Key endpoints include:
- `/api/rag/query/conversation`: For real-time messaging with the AI assistant
- `/api/v1/courses`: For retrieving course information
- `/api/v1/rag/study-guides`: For generating and managing study guides
- `/api/v1/rag/practice-questions`: For generating and answering practice questions

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

### Code Style

This project uses ESLint and Prettier for code formatting. Please ensure your contributions follow the established code style:

```bash
# Check code style
npm run lint

# Fix code style issues automatically
npm run lint:fix
```

## Deployment

The frontend application can be deployed using various methods:
<!-- 
### Static Export (Optional)

For static hosting environments:

```bash
npm run build
npm run export
``` -->

The static files will be generated in the `out` directory.

## Integration with Backend

This frontend application communicates with the HSLU RAG API for all data retrieval and chat functionality. Ensure the backend services are properly configured and accessible.

The main integration points include:

- Authentication API endpoints
- Vector search endpoints for content retrieval
- Document and course management APIs

## Security Considerations

- All API requests use JWT authentication
- Input sanitization is implemented for all user inputs
- Firebase Auth is used for secure user management

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or questions, please contact:
- Project maintainers: rogerjeasy@gmail.com
<!-- - HSLU IT Support: it-support@hslu.ch -->