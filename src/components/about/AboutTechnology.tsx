'use client'

import { FC, useRef } from 'react'
// import { useInView } from 'framer-motion'

// Import sub-components
import { TechnologyCard } from './TechnologyCard'
import { TechSectionHeader } from './TechSectionHeader'
import { TechBackgroundEffects } from './TechBackgroundEffects'
import { TechFooter } from './TechFooter'
import { useTechCategories, TechCategoriesProvider } from './TechCategoryProvider'

// Main AboutTechnology component
const AboutTechnologyContent: FC = () => {
  const techCategories = useTechCategories()
  const ref = useRef(null)
  // const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  return (
    <section 
      ref={ref}
      className="w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-950 relative"
    >
      {/* Animated background effects */}
      <TechBackgroundEffects />
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        {/* Section header */}
        <TechSectionHeader 
          title="Our Technology Stack"
          subtitle="Built with cutting-edge technologies to deliver a responsive, reliable, and intelligent learning experience for HSLU students."
        />
        
        {/* Technology Cards */}
        <div className="max-w-4xl mx-auto space-y-6">
          {techCategories.map((category, index) => (
            <TechnologyCard
              key={category.title}
              index={index}
              icon={category.icon}
              title={category.title}
              technologies={category.technologies}
              accentColor={category.accentColor}
              delay={0.1 * index}
            />
          ))}
        </div>
        
        {/* Footer element */}
        <TechFooter text="Engineered for reliability and academic excellence" />
      </div>
    </section>
  )
}

// Wrap with provider for easier data management
const AboutTechnology: FC = () => {
  return (
    <TechCategoriesProvider>
      <AboutTechnologyContent />
    </TechCategoriesProvider>
  )
}

export default AboutTechnology