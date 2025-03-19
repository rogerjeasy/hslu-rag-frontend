# HSLU Data Science RAG - Frontend Client

## Overview

This frontend application serves as the client interface for the HSLU Data Science Exam Preparation RAG (Retrieval-Augmented Generation) system. Designed specifically for MSc students in Applied Information and Data Science at Lucerne University of Applied Sciences and Arts (HSLU), this application provides an intelligent study companion to help students prepare for exams using course-specific materials.

## Features

- **Course-Specific Question Answering**: Get answers based on your course materials
- **Exam Preparation Summaries**: Generate study guides and topic summaries
- **Practice Question Generation**: Test your knowledge with auto-generated questions
- **Concept Clarification**: Understand complex data science concepts with examples
- **Knowledge Gap Identification**: Identify areas that need additional focus

## Technology Stack

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Modern UI**: Shadcn UI
- **State Management**: Zustand
- **Authentication**: JWT with Firebase Auth
- **Real-time Communication**: Socket.io
- **Code Rendering**: CodeMirror/Monaco Editor
- **Data Visualization**: Chart.js/Recharts
- **Markdown Rendering**: React Markdown

## Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher
- Access to the HSLU RAG API endpoints

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
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:8001
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

The authentication system currently supports email/password login. Protected routes require authentication to access course materials and the chat interface.

### Chat Interface

The chat interface is the primary interaction point for students. It supports:

- Real-time messaging with the RAG system
- Message history and conversation management
- Code syntax highlighting
- Mathematical formula rendering
- File attachments for relevant course materials
- Citation of source materials in responses

### Course Selection

Students can browse available courses and select specific topics to focus their study sessions. This context helps the RAG system provide more targeted and relevant responses.

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run Jest tests
- `npm run cypress` - Run Cypress end-to-end tests

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

### Docker Deployment

```bash
# Build Docker image
docker build -t hslu-rag-frontend .

# Run Docker container
docker run -p 3000:3000 hslu-rag-frontend
```

### Static Export (Optional)

For static hosting environments:

```bash
npm run build
npm run export
```

The static files will be generated in the `out` directory.

## Integration with Backend

This frontend application communicates with the HSLU RAG API for all data retrieval and chat functionality. Ensure the backend services are properly configured and accessible.

The main integration points include:

- Authentication API endpoints
- WebSocket connections for real-time chat
- Vector search endpoints for content retrieval
- Document and course management APIs

## Security Considerations

- All API requests use JWT authentication
- HTTPS is enforced in production
- Input sanitization is implemented for all user inputs
- Content Security Policy (CSP) headers are configured
- Regular security audits are recommended

## Accessibility

The application is designed with accessibility in mind:

- Semantic HTML structure
- ARIA attributes where appropriate
- Keyboard navigation support
- High contrast mode support
- Screen reader compatibility

## Browser Support

The application supports all modern browsers:

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Opera (latest version)

Internet Explorer is not supported.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure your code passes all tests and linting checks before submitting a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- HSLU Faculty of Information Technology
- MSc Applied Information and Data Science program
- All contributors and maintainers

## Contact

For support or questions, please contact:
- Project maintainers: rogerjeasy@gmail.com
<!-- - HSLU IT Support: it-support@hslu.ch -->