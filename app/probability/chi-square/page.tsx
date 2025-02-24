import { ChiSquareCalculator } from "@/components/probability/chi-square"
import { ToolLayout } from "@/components/tool-layout"

export default function ChiSquarePage() {
  return (
    <ToolLayout title="Chi-Square Distribution">
      <ChiSquareCalculator />
    </ToolLayout>
  )
}

