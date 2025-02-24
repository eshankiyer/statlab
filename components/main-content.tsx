"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion" // new import for framer-motion

interface Section {
  title: string
  items: string[]
  subsections?: { title: string; items: string[] }[]
}

const sections: Section[] = [
  {
    title: "Data Analysis",
    items: [],
    subsections: [
      {
        title: "Categorical Analysis",
        items: [
          "1 Categorical Variable, Single Group",
          "1 Categorical Variable, Multiple Groups",
          "2 Categorical Variables",
        ],
      },
      {
        title: "Quantitative Analysis",
        items: [
          "1 Quantitative Variable, Single Group",
          "1 Quantitative Variable, Multiple Groups",
          "2 Quantitative Variables",
        ],
      },
      {
        title: "Multiple Regression",
        items: ["Multiple Regression Analysis"],
      },
    ],
  },
  {
    title: "Probability",
    items: [],
    subsections: [
      {
        title: "Distributions",
        items: [
          "Normal Distributions",
          "Discrete Random Variables",
          "Binomial Distributions",
          "Poisson Distributions",
          "t Distributions",
          "χ² Distributions",
          "F Distributions",
        ],
      },
      {
        title: "Statistical Tests",
        items: ["Hypothesis Testing", "Confidence Intervals", "Power Analysis"],
      },
    ],
  },
  {
    title: "Concepts",
    items: [
      "The Idea of Probability",
      "Law of Large Numbers",
      "Sampling Distributions",
      "Confidence Intervals",
      "Significance Testing",
      "Power Analysis",
    ],
  },
  {
    title: "Activities",
    items: [
      "Parkinson's Detection",
      "Hiring Discrimination",
      "Correlation Game",
      "Lyrics Analysis",
      "Fan Studies",
      "Sampling Studies",
    ],
  },
]

export function MainContent() {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    )
  }

  // Define animation variants for smooth transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <motion.main
      className="container py-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      {sections.map((section) => (
        <div key={section.title} className="space-y-2">
          <h2 className="font-semibold text-lg">{section.title}</h2>
          {section.subsections ? (
            section.subsections.map((subsection) => (
              <div key={subsection.title} className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-between font-medium"
                  onClick={() => toggleSection(subsection.title)}
                >
                  {subsection.title}
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      expandedSections.includes(subsection.title) && "rotate-90",
                    )}
                  />
                </Button>
                {expandedSections.includes(subsection.title) && (
                  <div className="pl-4 space-y-1">
                    {subsection.items.map((item) => (
                      <Button key={item} variant="ghost" className="w-full justify-start text-sm font-normal">
                        {item}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="space-y-1">
              {section.items.map((item) => (
                <Button key={item} variant="ghost" className="w-full justify-start text-sm font-normal">
                  {item}
                </Button>
              ))}
            </div>
          )}
        </div>
      ))}
    </motion.main>
  )
}