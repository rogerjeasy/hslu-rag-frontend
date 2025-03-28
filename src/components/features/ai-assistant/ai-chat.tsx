"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SendHorizonal, Bot, UserCircle, Paperclip, Clock, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  citations?: { text: string; source: string }[];
}

export function AIChat() {
  const [subject, setSubject] = useState<string>("all");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your HSLU Data Science Study Assistant. How can I help you today? You can ask me about course materials, concepts, or specific topics from your courses.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate API call to backend
    setTimeout(() => {
      const exampleResponses = [
        {
          content: "In machine learning, overfitting occurs when a model learns the training data too well, capturing noise rather than the underlying pattern. This results in poor generalization to new data.\n\nTo prevent overfitting, you can use techniques like:\n\n1. Cross-validation\n2. Regularization (L1, L2)\n3. Early stopping\n4. Dropout (for neural networks)\n5. Pruning (for decision trees)",
          citations: [
            { text: "Lecture 3: Model Evaluation", source: "Machine Learning Fundamentals" },
            { text: "Chapter 2.4: Overfitting", source: "Pattern Recognition and Machine Learning" }
          ]
        },
        {
          content: "Principal Component Analysis (PCA) is a dimensionality reduction technique that identifies the axes (principal components) along which the data varies the most. It transforms the data into a new coordinate system where the greatest variance lies on the first coordinate (first principal component), the second greatest variance on the second coordinate, and so on.\n\nThe steps to perform PCA are:\n\n1. Standardize the data\n2. Calculate the covariance matrix\n3. Calculate eigenvectors and eigenvalues\n4. Sort eigenvectors by eigenvalues\n5. Project data onto principal components",
          citations: [
            { text: "Lecture 5: Dimensionality Reduction", source: "Statistical Methods for Data Science" },
            { text: "Lab 3: PCA Implementation", source: "Statistical Methods for Data Science" }
          ]
        },
        {
          content: "The difference between supervised and unsupervised learning:\n\n**Supervised Learning**:\n- Requires labeled training data\n- Goal is to learn a mapping from inputs to outputs\n- Examples: classification, regression\n- Algorithms: Decision Trees, Neural Networks, SVM\n\n**Unsupervised Learning**:\n- Uses unlabeled data\n- Goal is to find hidden patterns or structures\n- Examples: clustering, dimensionality reduction\n- Algorithms: K-means, PCA, Autoencoders",
          citations: [
            { text: "Lecture 1: Introduction to Machine Learning", source: "Machine Learning Fundamentals" }
          ]
        }
      ];
      
      const randomResponse = exampleResponses[Math.floor(Math.random() * exampleResponses.length)];
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: randomResponse.content,
        timestamp: new Date(),
        citations: randomResponse.citations
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[700px] max-h-[80vh]">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 bg-blue-100 text-blue-700">
            <Bot className="h-4 w-4" />
          </Avatar>
          <div className="font-medium">AI Study Assistant</div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="ml">Machine Learning</SelectItem>
              <SelectItem value="stats">Statistical Methods</SelectItem>
              <SelectItem value="bigdata">Big Data</SelectItem>
              <SelectItem value="db">Database Systems</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-1" />
            History
          </Button>
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`
                    max-w-[80%] sm:max-w-[70%] rounded-lg p-4 
                    ${message.role === "user" 
                      ? "bg-blue-600 text-white ml-4" 
                      : "bg-muted border ml-0 mr-4"
                    }
                  `}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {message.role === "assistant" ? (
                      <Avatar className="h-6 w-6 bg-blue-100 text-blue-700">
                        <Bot className="h-3 w-3" />
                      </Avatar>
                    ) : (
                      <Avatar className="h-6 w-6 bg-blue-800 text-white">
                        <UserCircle className="h-3 w-3" />
                      </Avatar>
                    )}
                    <span className={`text-xs ${message.role === "user" ? "text-blue-100" : "text-muted-foreground"}`}>
                      {message.role === "assistant" ? "AI Assistant" : "You"} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="whitespace-pre-line">
                    {message.content}
                  </div>
                  
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-muted-foreground mb-2">Sources:</p>
                      <div className="space-y-1">
                        {message.citations.map((citation, index) => (
                          <div key={index} className="text-xs text-blue-500 dark:text-blue-400">
                            <span className="font-medium">{citation.source}</span>: {citation.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-center space-x-2 bg-muted p-4 rounded-lg max-w-[80%] border">
                  <div className="flex space-x-1">
                    <span className="animate-bounce delay-0 h-2 w-2 bg-blue-600 rounded-full"></span>
                    <span className="animate-bounce delay-150 h-2 w-2 bg-blue-600 rounded-full"></span>
                    <span className="animate-bounce delay-300 h-2 w-2 bg-blue-600 rounded-full"></span>
                  </div>
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex items-end space-x-2">
          <div className="flex-1 rounded-lg border bg-background overflow-hidden">
            <Textarea
              placeholder="Ask anything about your HSLU courses..."
              className="border-0 focus-visible:ring-0 resize-none min-h-[60px] py-3 px-4"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <div className="flex items-center p-2 border-t">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <div className="text-xs text-muted-foreground">
                Powered by ChatGPT AI
              </div>
              <div className="flex ml-auto">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </Button>
                <Button 
                  className="ml-2 rounded-full h-8 w-8 p-0"
                  onClick={handleSend}
                  disabled={input.trim() === "" || isLoading}
                >
                  <SendHorizonal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}