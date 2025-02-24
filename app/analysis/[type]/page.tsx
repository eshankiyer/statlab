import { notFound } from "next/navigation"
import type React from "react"
import { CategoricalSingle } from "@/components/data-input/categorical-single"
import { RegressionAnalysis } from "@/components/data-analysis/regression"
import { DescriptiveStatistics } from "@/components/data-analysis/descriptive"

// Temporary placeholder component until we implement the rest
function PlaceholderAnalysis({ title }: { title: string }) {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground">This analysis tool is coming soon!</p>
    </div>
  )
}

const analysisComponents: Record<string, React.ComponentType<any>> = {
  "categorical-single": CategoricalSingle,
  "categorical-multiple": () => <PlaceholderAnalysis title="1 Categorical Variable, Multiple Groups" />,
  "categorical-two": () => <PlaceholderAnalysis title="2 Categorical Variables" />,
  "quantitative-single": DescriptiveStatistics,
  "quantitative-multiple": () => <PlaceholderAnalysis title="1 Quantitative Variable, Multiple Groups" />,
  "quantitative-two": () => <PlaceholderAnalysis title="2 Quantitative Variables" />,
  regression: RegressionAnalysis,
}

export default function AnalysisPage({ params }: { params: { type: string } }) {
  const AnalysisComponent = analysisComponents[params.type]

  if (!AnalysisComponent) {
    notFound()
  }

  return (
    <div className="container py-6">
      <AnalysisComponent />
    </div>
  )
}

