'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, ShieldCheck, BookOpen, Laptop, Lightbulb, Users } from 'lucide-react'

// FAQ categories
const categories = [
  { id: 'general', name: 'General', icon: <Lightbulb className="h-5 w-5"/> },
  { id: 'access', name: 'Access & Privacy', icon: <ShieldCheck className="h-5 w-5"/> },
  { id: 'courses', name: 'Courses', icon: <BookOpen className="h-5 w-5"/> },
  { id: 'technical', name: 'Technical', icon: <Laptop className="h-5 w-5"/> },
  { id: 'support', name: 'Support', icon: <MessageCircle className="h-5 w-5"/> }
];

// FAQ data
const faqItems = [
  {
    id: 'how-data-used',
    question: 'How is my data used?',
    answer: 'Your data is used solely to provide personalized learning experiences based on your course materials and interaction history. We do not share your data with third parties. All interactions are stored securely according to HSLU data protection policies and are linked to your university account. You can request deletion of your interaction history at any time through your profile settings.',
    category: 'access'
  },
  {
    id: 'answer-accuracy',
    question: 'How accurate are the answers?',
    answer: 'Answers are generated based directly on your HSLU course materials, which ensures high relevance and accuracy. The system uses Retrieval Augmented Generation (RAG) to find and present information from official course documents. However, as with any AI system, occasional inaccuracies may occur. We recommend verifying important information with your course materials or instructors, especially for exam preparation.',
    category: 'general'
  },
  {
    id: 'supported-courses',
    question: 'What courses are supported?',
    answer: 'Currently, we support all core modules in the MSc Applied Information and Data Science program at HSLU, including Machine Learning, Statistical Methods, Big Data Technologies, Data Visualization, Programming for Data Science, and Cloud Computing. We regularly add materials for new courses and update existing content based on curriculum changes. If you notice missing materials, please contact your program coordinator.',
    category: 'courses'
  },
  {
    id: 'access-info',
    question: 'How do I get access?',
    answer: 'Access is automatically provided to all enrolled students in the MSc Applied Information and Data Science program at HSLU. Simply log in with your university credentials (HSLU single sign-on). If you\'re having trouble accessing the system, please contact IT support or your program administrator. Guest access for prospective students is available upon request.',
    category: 'access'
  },
  {
    id: 'mobile-support',
    question: 'Is there mobile support?',
    answer: 'Yes, our platform is fully responsive and works on all devices including smartphones and tablets. You can access all features on mobile devices, though for coding examples and detailed visualizations, a larger screen is recommended. We also offer progressive web app (PWA) functionality, allowing you to install the application on your mobile device for offline access to previously viewed content.',
    category: 'technical'
  },
  {
    id: 'material-update',
    question: 'How often are course materials updated?',
    answer: 'Course materials are synchronized with the official HSLU curriculum and updated at the beginning of each semester. For ongoing courses, updates may be pushed throughout the semester when instructors provide new materials. The platform shows the last update date for each course to ensure you know when content was last refreshed.',
    category: 'courses'
  },
  {
    id: 'exam-prep',
    question: 'Can I use this for exam preparation?',
    answer: 'Absolutely! The system is specifically designed to help with exam preparation. You can generate practice questions, create study guides organized by importance, clarify complex concepts, and identify knowledge gaps in your understanding. The content is based directly on your course materials, making it highly relevant for exam preparation.',
    category: 'general'
  },
  {
    id: 'group-study',
    question: 'Can I use this for group study?',
    answer: 'While individual accounts are provided for personalized learning experiences, we offer collaborative features for group study. You can share generated study guides and practice questions with classmates via export options. For real-time collaboration, we recommend using the system alongside your preferred communication tools. Future updates will include more robust collaboration features.',
    category: 'general'
  },
  {
    id: 'technical-issues',
    question: 'What if I encounter technical issues?',
    answer: 'For technical issues, first check the support section for known issues and solutions. If your problem persists, you can contact technical support via email at datascienceapp-support@hslu.ch or use the in-app reporting feature. Please include details about the issue, your device, browser, and steps to reproduce the problem for faster resolution.',
    category: 'support'
  },
  {
    id: 'data-privacy',
    question: 'How is my privacy protected?',
    answer: 'We adhere to strict Swiss data protection regulations and HSLU privacy policies. Your interaction data is stored securely within HSLU\'s infrastructure and not shared with external parties. All communication is encrypted, and we implement role-based access controls. You can review our complete privacy policy under your account settings or contact the data protection officer for more information.',
    category: 'access'
  },
  {
    id: 'feature-requests',
    question: 'How can I suggest new features?',
    answer: 'We welcome feature suggestions! You can submit feature requests through the feedback form accessible from your dashboard or directly email the development team at datascienceapp-feedback@hslu.ch. We regularly review user suggestions and prioritize them for future releases. Many of our current features were inspired by student feedback.',
    category: 'support'
  },
  {
    id: 'code-execution',
    question: 'Can I run code examples directly in the platform?',
    answer: 'Yes, for Python and R code examples, we provide an integrated code execution environment where you can run, modify, and experiment with code snippets. This feature is available for most programming-related courses and exercises, allowing you to test your understanding without switching to another development environment. Code execution is performed in a secure sandbox with standard data science libraries pre-installed.',
    category: 'technical'
  }
];

export function Faq() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Filter FAQ items by active category
  const filteredItems = faqItems.filter(item => item.category === activeCategory);

  // If not mounted yet (server-side rendering), show a simplified version
  if (!isMounted) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our HSLU Data Science Exam Preparation Assistant.
            </p>
          </div>

          {/* Static version without animations for SSR */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`
                  flex items-center gap-2 
                  ${activeCategory === category.id ? 
                    'bg-blue-600 text-white hover:bg-blue-700' : 
                    'border-gray-200 text-gray-700 hover:bg-gray-50'}
                `}
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>

          <Card className="border-gray-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {filteredItems.map((item) => (
                  <AccordionItem key={item.id} value={item.id} className="border-b border-gray-100">
                    <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-blue-600 hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      <p>{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our HSLU Data Science Exam Preparation Assistant.
          </p>
        </div>

        {/* Category selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`
                flex items-center gap-2 
                ${activeCategory === category.id ? 
                  'bg-blue-600 text-white hover:bg-blue-700' : 
                  'border-gray-200 text-gray-700 hover:bg-gray-50'}
              `}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>

        {/* FAQ accordion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  {filteredItems.map((item, index) => (
                    <AccordionItem 
                      key={item.id} 
                      value={item.id} 
                      className="border-b border-gray-100"
                    >
                      <AccordionTrigger 
                        className="text-left font-medium text-gray-900 hover:text-blue-600 hover:no-underline"
                      >
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {item.question}
                        </motion.span>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
                        >
                          {item.answer}
                        </motion.p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Support callout */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span>Can&apos;t find what you&apos;re looking for?</span>
          </div>
          <h3 className="text-xl font-medium text-gray-900">Contact our support team for additional help</h3>
          <p className="mt-2 text-sm text-gray-600 max-w-lg mx-auto">
            Our dedicated support team is available to assist with any questions or issues you may have about the HSLU Data Science Exam Preparation Assistant.
          </p>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
}