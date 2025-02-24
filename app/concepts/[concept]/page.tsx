import { notFound } from "next/navigation"
import type React from "react" // Import React

function PlaceholderConcept({ title }: { title: string }) {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground">This concept demonstration is coming soon!</p>
    </div>
  )
}

const concepts: Record<string, React.ComponentType<any>> = {
  "probability-intro": () => <PlaceholderConcept title="The Idea of Probability" />,
  "large-numbers": () => <PlaceholderConcept title="Law of Large Numbers" />,
  "sampling-dist": () => <PlaceholderConcept title="Simulating Sampling Distributions" />,
  "confidence-intervals": () => <PlaceholderConcept title="Simulating Confidence Intervals" />,
  significance: () => <PlaceholderConcept title="Logic of Significance Testing" />,
  power: () => <PlaceholderConcept title="Power" />,
  streakiness: () => <PlaceholderConcept title="Streakiness" />,
}

export default function ConceptPage({ params }: { params: { concept: string } }) {
  const Concept = concepts[params.concept]

  if (!Concept) {
    notFound()
  }

  return (
    <div className="container py-6">
      <Concept />
    </div>
  )
}

