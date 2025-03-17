import { RefObject } from "react";

// Message role types
export type MessageRole = 'user' | 'assistant' | 'system';

// Message interface
export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: string;
  citations?: Citation[];
  attachments?: Attachment[];
}

// Citation for referencing source material
export interface Citation {
  id: string;
  text: string;
  source: string;
  page?: number;
  url?: string;
}

// Attachment for files
export interface Attachment {
  id: string;
  type: 'image' | 'pdf' | 'document';
  url: string;
  name: string;
  size: number;
}

// Study subject
export interface Subject {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

// AI model configuration
export interface AIModel {
  id: string;
  name: string;
  description?: string;
  capabilities?: string[];
  context_length?: number;
}

// Conversation history
export interface Conversation {
  id: string;
  title: string;
  subject: Subject | null;
  model: AIModel | null;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  pinned?: boolean;
}

// Chat Message List Props
export interface ChatMessageListProps {
    messages: Message[];
    isLoading: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement> | React.MutableRefObject<HTMLDivElement | null>;
  }

// Chat Message Props
export interface ChatMessageProps {
  message: Message;
  showTimestamp?: boolean;
}

// Chat Header Props
export interface ChatHeaderProps {
    subject: Subject | null;
    model: AIModel | null;
    onSubjectChange: (subject: Subject | null) => void;
    onModelChange: (model: AIModel | null) => void;
    onToggleSidebar: () => void;
    isLoading?: boolean;
    sidebarVisible?: boolean;
  }

// Chat Input Props
export interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

// Chat Controls Props
export interface ChatControlsProps {
  onStartNewConversation: () => void;
  onClearConversation: () => void;
  hasActiveConversation: boolean;
  isLoading?: boolean;
}

// Chat History Sidebar Props
export interface ChatHistorySidebarProps {
    conversations: Conversation[];
    currentConversationId: string | undefined;
    onSelectConversation: (conversationId: string) => void;
    onStartNewConversation: () => void;
    isLoading?: boolean;
  }

// Subject Selector Props
export interface SubjectSelectorProps {
    selectedSubject: Subject | null;
    onSubjectChange: (subject: Subject | null) => void;
    subjects: Subject[];
    isLoading?: boolean;
  }

// Model Selector Props
export interface ModelSelectorProps {
    selectedModel: AIModel | null;
    onModelChange: (model: AIModel | null) => void;
    models: AIModel[];
    isLoading?: boolean;
  }

// Empty State Props
export interface EmptyStateProps {
    subject: Subject | null;
    onStartConversation: (message: string) => void;
    isMobile?: boolean;
  }