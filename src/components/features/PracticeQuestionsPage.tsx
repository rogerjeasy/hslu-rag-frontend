"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileQuestion, 
  CheckCircle, 
  BarChart, 
  Brain, 
  CheckCheck,
  BookOpen,
  ListChecks,
  PersonStanding,
  Clock,
  CopyCheck,
  Settings2
} from "lucide-react";
import { QuizDemo } from "./practice-question/quiz-demo";
import { StatCard } from "@/components/ui/stat-card";
import { FeatureCard } from "./practice-question/feature-card";

export default function PracticeQuestionsPage() {
  return (
    <div className="container py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 py-12 px-6 md:py-16 md:px-10">
        <div className="absolute inset-0 bg-grid-black/5 [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]" />
        
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="px-3 py-1 text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-100 hover:text-purple-800 dark:hover:bg-purple-900 dark:hover:text-purple-200">
              Practice Questions
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Test Your Knowledge and Ace Your Exams
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-3xl">
              Master data science concepts through interactive practice questions generated 
              directly from your HSLU course materials, with explanations and citations.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <FileQuestion className="mr-2 h-4 w-4" />
                Start Practice Quiz
              </Button>
              <Button size="lg" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Question Bank
              </Button>
            </div>
          </div>
          
          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
            <Image 
              src="https://images.pexels.com/photos/5428003/pexels-photo-5428003.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Student studying with practice questions"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Practice Questions"
          value="5,000+"
          description="Questions covering all HSLU courses"
          icon={<FileQuestion className="h-5 w-5 text-purple-600" />}
        />
        <StatCard 
          title="Accuracy Rate"
          value="99.8%"
          description="Verified against course materials"
          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
        />
        <StatCard 
          title="Active Users"
          value="1,200+"
          description="HSLU students using the platform"
          icon={<PersonStanding className="h-5 w-5 text-blue-600" />}
        />
        <StatCard 
          title="Test Preparation"
          value="89%"
          description="Average improvement in grades"
          icon={<BarChart className="h-5 w-5 text-amber-600" />}
        />
      </section>

      {/* Interactive Demo */}
      <section className="space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Try Out Practice Questions</h2>
          <p className="text-muted-foreground text-lg">
            Experience our interactive practice questions with detailed explanations.
          </p>
        </div>
        
        <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
          <QuizDemo />
        </div>
      </section>

      {/* Features */}
      <section className="space-y-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Comprehensive Practice Features</h2>
          <p className="text-muted-foreground text-lg">
            Our practice questions system is designed to optimize your learning.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Brain}
            title="Adaptive Learning"
            description="Questions adapt to your knowledge level, focusing more on areas where you need improvement."
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
          />
          <FeatureCard 
            icon={CheckCheck}
            title="Spaced Repetition"
            description="Questions reappear at optimal intervals to maximize long-term retention of knowledge."
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <FeatureCard 
            icon={CopyCheck}
            title="Detailed Explanations"
            description="Every question includes comprehensive explanations with references to course materials."
            iconColor="text-emerald-600"
            iconBgColor="bg-emerald-100"
          />
          <FeatureCard 
            icon={Clock}
            title="Timed Quizzes"
            description="Practice under exam-like conditions with timed quizzes to improve your speed and accuracy."
            iconColor="text-amber-600"
            iconBgColor="bg-amber-100"
          />
          <FeatureCard 
            icon={ListChecks}
            title="Custom Quiz Creation"
            description="Create personalized quizzes focused on specific topics or concepts you want to practice."
            iconColor="text-red-600"
            iconBgColor="bg-red-100"
          />
          <FeatureCard 
            icon={Settings2}
            title="Progress Tracking"
            description="Monitor your improvement over time with detailed analytics on your performance."
            iconColor="text-indigo-600"
            iconBgColor="bg-indigo-100"
          />
        </div>
      </section>

      {/* Quiz Modes */}
      <section className="space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Multiple Quiz Modes</h2>
          <p className="text-muted-foreground text-lg">
            Choose from different quiz formats tailored to your study needs.
          </p>
        </div>
        
        <Tabs defaultValue="course" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="course">Course-Based</TabsTrigger>
            <TabsTrigger value="topic">Topic-Based</TabsTrigger>
            <TabsTrigger value="exam">Exam Simulation</TabsTrigger>
            <TabsTrigger value="daily">Daily Challenge</TabsTrigger>
          </TabsList>
          
          <TabsContent value="course" className="p-6 border rounded-xl mt-6 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Course-Based Practice</h3>
                <p className="text-muted-foreground">
                  Focus on questions from specific HSLU courses to reinforce your understanding
                  of course-specific concepts and prepare for individual exams.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Questions sourced directly from course materials</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Filter by lecture, module, or topic</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Track your progress for each course separately</span>
                  </li>
                </ul>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Try Course-Based Quiz
                </Button>
              </div>
              <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                  alt="Course-based practice"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="topic" className="p-6 border rounded-xl mt-6 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Topic-Based Practice</h3>
                <p className="text-muted-foreground">
                  Focus on specific data science topics or concepts that span across multiple 
                  courses to build a comprehensive understanding.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Cross-course concept reinforcement</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Deep dive into specific data science areas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Build connections between related concepts</span>
                  </li>
                </ul>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Try Topic-Based Quiz
                </Button>
              </div>
              <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                  alt="Topic-based practice"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="exam" className="p-6 border rounded-xl mt-6 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Exam Simulation</h3>
                <p className="text-muted-foreground">
                  Experience realistic exam conditions with timed tests that mirror the format 
                  and difficulty of actual HSLU exams.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Timed test environment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Question distribution matching real exams</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Comprehensive performance analysis</span>
                  </li>
                </ul>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Try Exam Simulation
                </Button>
              </div>
              <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                  alt="Exam simulation"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="daily" className="p-6 border rounded-xl mt-6 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Daily Challenge</h3>
                <p className="text-muted-foreground">
                  Stay consistent with your studying through daily quiz challenges that cover
                  diverse topics and keep your knowledge fresh.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>New set of questions every day</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Track your daily streak</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>Compete with classmates on the leaderboard</span>
                  </li>
                </ul>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Take Today&apos;s Challenge
                </Button>
              </div>
              <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                  alt="Daily challenge"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Testimonials */}
      <section className="rounded-3xl bg-muted/50 p-8 md:p-10 lg:p-12 space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Student Success Stories</h2>
          <p className="text-muted-foreground text-lg">
            Hear from HSLU students who improved their exam results with our practice questions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-4 mb-4">
              <Image
                src="https://randomuser.me/api/portraits/women/32.jpg"
                alt="Student 1"
                width={56}
                height={56}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">Laura M.</p>
                <p className="text-sm text-muted-foreground">MSc Data Science, 3rd Semester</p>
              </div>
            </div>
            <p className="text-muted-foreground">
            &quot;The practice questions helped me identify gaps in my understanding that I didn&apos;t 
              even know I had. I was able to focus my studying more effectively and improved my 
              grade from a B to an A in Statistical Methods.&quot;
            </p>
          </div>
          
          <div className="bg-background rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-4 mb-4">
              <Image
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="Student 2"
                width={56}
                height={56}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">Marco T.</p>
                <p className="text-sm text-muted-foreground">MSc Data Science, 2nd Semester</p>
              </div>
            </div>
            <p className="text-muted-foreground">
            &quot;I love the daily challenges. They&apos;ve helped me develop a consistent study habit 
              instead of cramming before exams. The explanations for each question are thorough 
              and really help reinforce the concepts.&quot;
            </p>
          </div>
          
          <div className="bg-background rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-4 mb-4">
              <Image
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Student 3"
                width={56}
                height={56}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">Sophia K.</p>
                <p className="text-sm text-muted-foreground">MSc Data Science, 4th Semester</p>
              </div>
            </div>
            <p className="text-muted-foreground">
            &quot;The exam simulation mode was a game-changer for me. It helped me get comfortable 
              with the time pressure and question types I&apos;d face in the actual exam. I felt so 
              much more confident going into my finals.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 py-12 px-6 md:py-16 md:px-10">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]" />
        
        <div className="relative max-w-3xl mx-auto text-center space-y-6 text-white">
          <h2 className="text-3xl font-bold">Ready to test your knowledge?</h2>
          <p className="text-purple-100 text-lg">
            Start practicing with questions specifically tailored to your HSLU courses 
            and improve your exam performance.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button size="lg" variant="secondary">
              <FileQuestion className="mr-2 h-4 w-4" />
              Start Your First Quiz
            </Button>
            <Button size="lg" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
              Browse Questions
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}