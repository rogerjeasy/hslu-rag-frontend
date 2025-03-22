// src/components/study-guides/StudyGuideTips.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, ArrowRight, Clock, Brain, Target, BookOpen, XCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const StudyGuideTips = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [showTips, setShowTips] = useState(true)

  // Study tips content
  const studyTips = [
    {
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      title: "Spaced Repetition",
      description: "Study in short, focused sessions with breaks in between. Review material at increasing intervals to strengthen retention.",
    },
    {
      icon: <Brain className="h-5 w-5 text-purple-500" />,
      title: "Active Recall",
      description: "Test yourself repeatedly instead of passively re-reading. This forces your brain to retrieve information, strengthening neural pathways.",
    },
    {
      icon: <Target className="h-5 w-5 text-green-500" />,
      title: "Focus on Weaknesses",
      description: "Identify areas where you struggle and prioritize them. Our personalized guides highlight topics that need more attention.",
    },
    {
      icon: <BookOpen className="h-5 w-5 text-indigo-500" />,
      title: "Explain Concepts",
      description: "Try explaining complex topics in your own words. Teaching a concept solidifies your understanding and reveals knowledge gaps.",
    },
  ]

  // Function to show the next tip
  const showNextTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % studyTips.length)
  }

  // Hide the tips card
  const hideTips = () => {
    setShowTips(false)
  }

  return (
    <div className="space-y-6">
      {/* Quick study tip carousel */}
      <AnimatePresence>
        {showTips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-l-4 border-l-yellow-400 bg-yellow-50">
              <CardHeader className="pb-2 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 text-gray-400 hover:text-gray-500"
                  onClick={hideTips}
                >
                  <XCircle className="h-4 w-4" />
                  <span className="sr-only">Close tips</span>
                </Button>
                <div className="flex items-center">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                  <CardTitle className="text-sm font-medium text-gray-900">Study Tip</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTipIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {studyTips[currentTipIndex].icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{studyTips[currentTipIndex].title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{studyTips[currentTipIndex].description}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
              <CardFooter className="pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-yellow-700 hover:text-yellow-800 hover:bg-yellow-100 p-0 h-8"
                  onClick={showNextTip}
                >
                  Next tip
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Study guide usage instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How to Use Study Guides</CardTitle>
          <CardDescription>Make the most of your study sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm">Types of Study Guides</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex">
                    <FileText className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Summary Guides</span>
                      <p className="text-gray-600 text-xs">Condensed overviews of key course topics with highlighted exam focus areas.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <Brain className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Concept Maps</span>
                      <p className="text-gray-600 text-xs">Visual representations showing relationships between concepts and theories.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <ListChecks className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Practice Tests</span>
                      <p className="text-gray-600 text-xs">Sample questions similar to those you&apos;ll encounter on exams with detailed explanations.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <Cards className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Flashcard Sets</span>
                      <p className="text-gray-600 text-xs">Interactive flashcards for memorizing key terms, concepts, and formulas.</p>
                    </div>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-sm">Effective Study Strategies</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-0.5">1</div>
                    <p><span className="font-medium text-gray-800">Start with summaries</span> to get a comprehensive overview of your course content</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-0.5">2</div>
                    <p><span className="font-medium text-gray-800">Deepen understanding</span> with concept maps that show connections between ideas</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-0.5">3</div>
                    <p><span className="font-medium text-gray-800">Test your knowledge</span> using practice tests and identify weak spots</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-0.5">4</div>
                    <p><span className="font-medium text-gray-800">Use flashcards</span> for quick reviews before exams to cement your memory</p>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-sm">Tracking Your Progress</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>Your study progress is automatically tracked as you use the guides:</p>
                  <ul className="space-y-1.5 pl-5 list-disc">
                    <li>Complete sections are marked as finished</li>
                    <li>The system identifies concepts you struggle with</li>
                    <li>Your performance on practice tests is analyzed</li>
                    <li>Recommendations are updated based on your learning patterns</li>
                  </ul>
                  <p className="text-xs bg-blue-50 p-2 rounded border border-blue-100 mt-2">
                    <span className="font-semibold text-blue-700">Pro tip:</span> Use the &quot;Recommended&quot; tab to see personalized suggestions based on your study patterns and performance.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

// Icon components to avoid repeating imports
const FileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
)

const ListChecks = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 7 3 3 3-3" />
    <path d="M6 10V5a2 2 0 0 1 4 0v2a2 2 0 0 0 4 0v-1a2 2 0 0 1 4 0v3" />
    <path d="M9 13c-.6.7-1.4 1.1-2.5 1.1-2.5 0-3.5-1.9-3.5-4.2C3 7.2 4 5 6.5 5" />
    <path d="M21 5.3C20.5 5.1 20 5 19.5 5c-1.5 0-2.6.4-3.5 1.5" />
    <line x1="3" x2="21" y1="19" y2="19" />
    <line x1="3" x2="21" y1="15" y2="15" />
  </svg>
)

const Cards = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="14" x="3" y="5" rx="2" />
    <path d="M7 15h0" />
    <path d="M7 11h0" />
    <path d="M11 15h0" />
    <path d="M11 11h0" />
    <path d="M15 15h0" />
    <path d="M15 11h0" />
  </svg>
)