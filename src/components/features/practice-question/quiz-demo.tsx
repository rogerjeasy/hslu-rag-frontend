"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  BookOpen,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample quiz questions
const quizQuestions = [
  {
    id: 1,
    question: "In the context of machine learning, what is the primary purpose of regularization techniques like L1 and L2?",
    options: [
      { id: "a", text: "To increase model complexity" },
      { id: "b", text: "To prevent overfitting" },
      { id: "c", text: "To speed up training time" },
      { id: "d", text: "To reduce hardware requirements" }
    ],
    correctAnswer: "b",
    explanation: "Regularization techniques like L1 (Lasso) and L2 (Ridge) are used to prevent overfitting in machine learning models by adding a penalty term to the loss function. This discourages the model from learning overly complex patterns that may not generalize well to new data.",
    source: "Machine Learning Fundamentals, Lecture 4: Regularization",
    difficulty: "Medium"
  },
  {
    id: 2,
    question: "Which of the following is NOT a type of clustering algorithm?",
    options: [
      { id: "a", text: "K-means" },
      { id: "b", text: "DBSCAN" },
      { id: "c", text: "Random Forest" },
      { id: "d", text: "Hierarchical clustering" }
    ],
    correctAnswer: "c",
    explanation: "Random Forest is a supervised learning algorithm used for classification and regression tasks, not a clustering algorithm. K-means, DBSCAN, and hierarchical clustering are all unsupervised learning algorithms used for clustering data points based on similarity.",
    source: "Statistical Methods for Data Science, Module 3: Clustering Techniques",
    difficulty: "Easy"
  },
  {
    id: 3,
    question: "What is the computational complexity of matrix multiplication for two n×n matrices using the standard algorithm?",
    options: [
      { id: "a", text: "O(n)" },
      { id: "b", text: "O(n²)" },
      { id: "c", text: "O(n³)" },
      { id: "d", text: "O(2ⁿ)" }
    ],
    correctAnswer: "c",
    explanation: "The standard algorithm for multiplying two n×n matrices requires n³ scalar multiplications, resulting in a time complexity of O(n³). There are more efficient algorithms like Strassen's algorithm which has a complexity of approximately O(n^2.8).",
    source: "Computational Methods for Data Science, Lecture 2: Computational Complexity",
    difficulty: "Hard"
  }
];

export function QuizDemo() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [activeTab, setActiveTab] = useState("question");
  
  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
  };
  
  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    
    if (selectedOption === quizQuestions[currentQuestion].correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Automatically switch to explanation tab when answer is checked
    setActiveTab("explanation");
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setActiveTab("question");
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectAnswers(0);
    setActiveTab("question");
  };
  
  const question = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="space-y-2 mb-4 md:mb-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold">Practice Quiz Demo</h3>
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800">
              Machine Learning
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </p>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>{correctAnswers} correct</span>
          </div>
          <div className="flex items-center space-x-1">
            <XCircle className="h-4 w-4 text-red-500" />
            <span>{isAnswered ? currentQuestion - correctAnswers : currentQuestion - correctAnswers}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Badge variant="outline" className="h-5 px-2 font-normal">{question.difficulty}</Badge>
          </div>
        </div>
      </div>
      
      <Progress value={progress} className="h-2 mb-8" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="question">Question</TabsTrigger>
          <TabsTrigger value="explanation" disabled={!isAnswered}>Explanation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="question" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {question.options.map((option) => (
                <motion.div 
                  key={option.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-colors
                    ${selectedOption === option.id 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' 
                      : 'hover:border-purple-200 dark:hover:border-purple-800'}
                    ${isAnswered && option.id === question.correctAnswer 
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                      : ''}
                    ${isAnswered && selectedOption === option.id && option.id !== question.correctAnswer 
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                      : ''}
                  `}
                >
                  <div className="flex items-start">
                    <div className={`
                      flex items-center justify-center w-6 h-6 rounded-full mr-3 mt-0.5 text-xs font-medium
                      ${selectedOption === option.id 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-muted text-muted-foreground'}
                      ${isAnswered && option.id === question.correctAnswer 
                        ? 'bg-green-500 text-white' 
                        : ''}
                      ${isAnswered && selectedOption === option.id && option.id !== question.correctAnswer 
                        ? 'bg-red-500 text-white' 
                        : ''}
                    `}>
                      {option.id.toUpperCase()}
                    </div>
                    <div className="text-sm flex-1">{option.text}</div>
                    {isAnswered && option.id === question.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                    )}
                    {isAnswered && selectedOption === option.id && option.id !== question.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-500 ml-2" />
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleRestart}
                disabled={currentQuestion === 0 && !isAnswered}
              >
                Restart
              </Button>
              {!isAnswered ? (
                <Button 
                  onClick={handleCheckAnswer} 
                  disabled={selectedOption === null}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Check Answer
                </Button>
              ) : (
                <Button 
                  onClick={handleNextQuestion}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="explanation" className="space-y-6">
          <AnimatePresence mode="wait">
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="bg-muted/50 border-b">
                    <CardTitle className="text-lg flex items-center">
                      <Info className="mr-2 h-5 w-5 text-purple-500" />
                      Explanation
                    </CardTitle>
                    <CardDescription>
                      Understand why this answer is correct
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50 border border-muted">
                        <div className="font-medium mb-2 flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Correct answer: {question.options.find(o => o.id === question.correctAnswer)?.text}
                        </div>
                        <p className="text-sm text-muted-foreground">{question.explanation}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>Source: {question.source}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("question")}>
                      Back to Question
                    </Button>
                    <Button 
                      onClick={handleNextQuestion}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}