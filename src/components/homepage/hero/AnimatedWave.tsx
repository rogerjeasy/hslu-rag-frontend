"use client";

import { motion } from 'framer-motion'

export function AnimatedWave() {
  return (
    <svg
      className="w-full h-auto text-white"
      viewBox="0 0 1440 120"
      fill="currentColor"
      preserveAspectRatio="none"
    >
      <motion.path
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
        d="M0,64 C288,88 480,8 720,8 C960,8 1200,88 1440,56 L1440,120 L0,120 Z"
      />
    </svg>
  )
}