"use client";

import { FC, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { LightbulbIcon, BookOpenIcon, GraduationCapIcon } from 'lucide-react';
import MissionPoints from './MissionPoints';

// Sub-component for the mission header
const MissionHeader: FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-3"
        >
          Our Purpose
        </motion.span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
          Our Mission
        </h2>
        <motion.div 
          className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mt-4 mb-6"
          initial={{ width: 0 }}
          animate={{ width: isInView ? "5rem" : 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        ></motion.div>
      </div>
     
      <p className="text-slate-700 dark:text-slate-300 text-lg">
        We&apos;re dedicated to transforming how HSLU MSc students in Applied Information and Data Science
        prepare for exams and understand complex concepts. By combining artificial intelligence with
        pedagogical best practices, we aim to create an educational tool that adapts to each student&apos;s
        needs and learning style.
      </p>
    </motion.div>
  );
};

// Sub-component for the quote panel
const MissionQuote: FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.7,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative h-[400px] rounded-xl overflow-hidden shadow-xl"
    >
      {/* Background with gradient and animated pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800">
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundSize: '150px 150px'
          }}
        />
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <LightbulbIcon className="h-6 w-6 text-white" />
      </motion.div>

      <motion.div
        className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
        animate={{ 
          y: [0, 10, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <GraduationCapIcon className="h-6 w-6 text-white" />
      </motion.div>

      <motion.div
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
        animate={{ 
          y: [0, -8, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <BookOpenIcon className="h-6 w-6 text-white" />
      </motion.div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center p-8 text-white">
        <div className="space-y-6 text-center max-w-md">
          <motion.h3 
            variants={itemVariants}
            className="text-2xl font-bold tracking-tight"
          >
            &quot;Education is not preparation for life; education is life itself.&quot;
          </motion.h3>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg opacity-80"
          >
            — John Dewey
          </motion.p>
         
          <motion.div 
            variants={itemVariants}
            className="flex justify-center pt-4"
          >
            <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
              Empowering Students Since 2025
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const AboutMission: FC = () => {
  // Background animation
  const backgroundRef = useRef(null);
  const isBackgroundInView = useInView(backgroundRef, { once: true });

  return (
    <section 
      ref={backgroundRef}
      className="w-full py-16 md:py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden"
    >
      {/* Background gradients */}
      <motion.div 
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isBackgroundInView ? 0.6 : 0 }}
        transition={{ duration: 1.2 }}
      />
      
      <motion.div 
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-100/50 dark:bg-indigo-900/20 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isBackgroundInView ? 0.6 : 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      />

      <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <MissionHeader />
            
            {/* Updated mission points component */}
            <MissionPoints />
          </div>
         
          <MissionQuote />
        </div>
      </div>
    </section>
  );
};

export default AboutMission;