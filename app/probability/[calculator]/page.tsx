import { notFound } from "next/navigation"
import type React from "react" // Import React
import { CountingCalculator } from "@/components/calculators/counting"
import { NormalCalculator } from "@/components/calculators/normal"
import { BinomialCalculator } from "@/components/calculators/binomial"
import { PoissonCalculator } from "@/components/calculators/poisson"
import { TDistributionCalculator } from "@/components/calculators/t-distribution"
import { ChiSquareCalculator } from "@/components/calculators/chi-square"
import { FDistributionCalculator } from "@/components/calculators/f-distribution"

const calculators: Record<string, React.ComponentType> = {
  binomial: BinomialCalculator,
  counting: CountingCalculator,
  f: FDistributionCalculator,
  normal: NormalCalculator,
  poisson: PoissonCalculator,
  t: TDistributionCalculator,
  "chi-square": ChiSquareCalculator,
  discrete: NormalCalculator, // We'll use Normal as a placeholder for Discrete Random Variables
}

export default function CalculatorPage({ params }: { params: { calculator: string } }) {
  const Calculator = calculators[params.calculator]

  if (!Calculator) {
    notFound()
  }

  return (
    <div className="container py-6">
      <Calculator />
    </div>
  )
}

