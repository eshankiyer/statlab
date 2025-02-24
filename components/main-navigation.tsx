"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

const sections = {
  "Data Analysis": [
    {
      name: "Categorical Analysis",
      subsections: [
        { name: "Single Group", path: "/analysis/categorical-single" },
        { name: "Multiple Groups", path: "/analysis/categorical-multiple" },
        { name: "Two Variables", path: "/analysis/categorical-two" },
      ],
    },
    {
      name: "Quantitative Analysis",
      subsections: [
        { name: "Single Group", path: "/analysis/quantitative-single" },
        { name: "Multiple Groups", path: "/analysis/quantitative-multiple" },
        { name: "Two Variables", path: "/analysis/quantitative-two" },
      ],
    },
    {
      name: "Multiple Regression",
      path: "/analysis/regression",
    },
  ],
  Probability: [
    {
      name: "Distributions",
      subsections: [
        { name: "Normal Distribution", path: "/probability/normal" },
        { name: "Binomial Distribution", path: "/probability/binomial" },
        { name: "Poisson Distribution", path: "/probability/poisson" },
        { name: "t Distribution", path: "/probability/t" },
        { name: "Chi-Square Distribution", path: "/probability/chi-square" },
        { name: "F Distribution", path: "/probability/f" },
      ],
    },
  ],
}

export function MainNavigation() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
      {Object.entries(sections).map(([title, items]) => (
        <div key={title} className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.name} className="space-y-2">
                {item.subsections ? (
                  <>
                    <div className="text-lg font-medium text-foreground px-4 py-2">{item.name}</div>
                    <div className="pl-4 space-y-2">
                      {item.subsections.map((subsection) => (
                        <Link
                          key={subsection.path}
                          href={subsection.path}
                          className="flex items-center justify-between w-full px-4 py-2 text-left text-sm font-medium bg-card hover:bg-accent hover:text-accent-foreground rounded-lg border border-border transition-colors"
                        >
                          {subsection.name}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.path}
                    className="flex items-center justify-between w-full px-4 py-2 text-left text-sm font-medium bg-card hover:bg-accent hover:text-accent-foreground rounded-lg border border-border transition-colors"
                  >
                    {item.name}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

