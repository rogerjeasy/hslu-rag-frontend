"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Zap, 
  BookOpen, 
  Check, 
  FileSearch, 
  Lightbulb,
  Library
} from "lucide-react";
import { AIChat } from "../features/ai-assistant/ai-chat";
import { FeatureHighlight } from "./feature-highlight";

export default function AIChatAssistantPage() {
  return (
    <div className="container py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 py-12 px-6 md:py-16 md:px-10">
        <div className="absolute inset-0 bg-grid-black/5 [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <Badge className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200">
            AI Chat Assistant
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Your Personal HSLU Study Assistant
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ask questions in natural language and get accurate answers based directly on your 
            HSLU course materials, with citations to specific sources.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="mr-2 h-4 w-4" />
              Try AI Chat Now
            </Button>
            <Button size="lg" variant="outline">
              <FileSearch className="mr-2 h-4 w-4" />
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Experience the AI Chat Assistant</h2>
          <p className="text-muted-foreground text-lg">
            Ask questions about your HSLU courses and get accurate, cited answers instantly.
          </p>
        </div>
        
        <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
          <AIChat />
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="space-y-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Powerful Features</h2>
          <p className="text-muted-foreground text-lg">
            Our AI Chat Assistant is specifically designed for HSLU data science students.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureHighlight 
            icon={<BookOpen className="h-5 w-5 text-blue-600" />}
            title="Course-Specific Knowledge"
            description="Access information from lectures, labs, and reading materials from your specific HSLU courses."
          />
          <FeatureHighlight 
            icon={<FileSearch className="h-5 w-5 text-blue-600" />}
            title="Source Citations"
            description="Every answer includes references to the specific lecture or document where the information comes from."
          />
          <FeatureHighlight 
            icon={<Zap className="h-5 w-5 text-blue-600" />}
            title="Instant Answers"
            description="Get immediate responses to complex questions without searching through course materials."
          />
          <FeatureHighlight 
            icon={<Lightbulb className="h-5 w-5 text-blue-600" />}
            title="Concept Explanations"
            description="Break down complex data science concepts into easy-to-understand explanations."
          />
          <FeatureHighlight 
            icon={<Library className="h-5 w-5 text-blue-600" />}
            title="Comprehensive Coverage"
            description="Access content from all your MSc Applied Information and Data Science courses."
          />
          <FeatureHighlight 
            icon={<Check className="h-5 w-5 text-blue-600" />}
            title="Accuracy Verification"
            description="All responses are verified against official course materials to ensure correctness."
          />
        </div>
      </section>

      {/* Use Cases */}
      <section className="space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">How Students Use It</h2>
          <p className="text-muted-foreground text-lg">
            Discover the many ways HSLU students are leveraging the AI Chat Assistant.
          </p>
        </div>
        
        <Tabs defaultValue="studying" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="studying">Daily Studying</TabsTrigger>
            <TabsTrigger value="revision">Exam Revision</TabsTrigger>
            <TabsTrigger value="projects">Project Work</TabsTrigger>
            <TabsTrigger value="labs">Lab Assistance</TabsTrigger>
          </TabsList>
          <TabsContent value="studying" className="p-6 border rounded-xl mt-6 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Enhance Daily Learning</h3>
                <p className="text-muted-foreground">
                  Students use the AI Chat Assistant during regular study sessions to clarify concepts,
                  get examples of data science applications, and deepen their understanding of course materials.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Clarify concepts right when you encounter them</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Get additional examples beyond what&apos;s covered in class</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Connect ideas across different modules and courses</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
                  alt="Students studying"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="revision" className="p-6 border rounded-xl mt-6 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Efficient Exam Preparation</h3>
                <p className="text-muted-foreground">
                  During exam periods, the AI Chat Assistant becomes an invaluable tool for 
                  efficient revision, helping students focus on key concepts and identify knowledge gaps.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Quiz yourself on important topics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Get explanations for complex problems</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Create custom flashcards from course content</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                  alt="Exam preparation"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="projects" className="p-6 border rounded-xl mt-6 bg-card">
            {/* Similar content structure for projects tab */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Project Support</h3>
                <p className="text-muted-foreground">
                  When working on data science projects, the AI Assistant helps with methodology selection,
                  code explanations, and connecting theoretical concepts to practical applications.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Get guidance on selecting appropriate methods</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Understand code examples from lectures</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Apply theoretical concepts to real-world problems</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                  alt="Project work"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="labs" className="p-6 border rounded-xl mt-6 bg-card">
            {/* Content for labs tab */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Lab Exercise Assistance</h3>
                <p className="text-muted-foreground">
                  During lab sessions, students use the AI Assistant to understand exercise requirements,
                  debug code, and get step-by-step explanations of complex technical procedures.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Understand lab exercise requirements</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Get help with debugging code</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Step-by-step walkthroughs of technical procedures</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                  alt="Lab work"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* FAQ Section */}
      <section className="space-y-8 rounded-3xl bg-muted/50 p-8 md:p-10 lg:p-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Common questions about the AI Chat Assistant feature.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="bg-background rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-lg mb-2">How accurate are the answers?</h3>
            <p className="text-muted-foreground">
              All answers are based directly on your HSLU course materials. The AI is trained 
              to provide citations and only answer with information that comes from official sources.
            </p>
          </div>
          
          <div className="bg-background rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-lg mb-2">Which courses are covered?</h3>
            <p className="text-muted-foreground">
              The assistant covers all core and elective courses in the MSc Applied Information 
              and Data Science program at HSLU, including the most recent materials and updates.
            </p>
          </div>
          
          <div className="bg-background rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-lg mb-2">Can it help with coding questions?</h3>
            <p className="text-muted-foreground">
              Yes, the AI can help explain code examples from your courses, suggest approaches to 
              coding problems, and provide guidance on implementing data science algorithms.
            </p>
          </div>
          
          <div className="bg-background rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-lg mb-2">Is my conversation history saved?</h3>
            <p className="text-muted-foreground">
              Yes, your conversations are saved to your account so you can reference them later. 
              All data is kept private and used only to improve your learning experience.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 py-12 px-6 md:py-16 md:px-10">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]" />
        
        <div className="relative max-w-3xl mx-auto text-center space-y-6 text-white">
          <h2 className="text-3xl font-bold">Ready to transform your study experience?</h2>
          <p className="text-blue-100 text-lg">
            Join thousands of HSLU students who are already using the AI Chat Assistant 
            to improve their understanding and save time.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button size="lg" variant="secondary">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Chatting Now
            </Button>
            <Button size="lg" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}