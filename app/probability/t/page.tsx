import { TDistributionCalculator } from "@/components/probability/t-distribution"
import { ToolLayout } from "@/components/tool-layout"

export default function TDistributionPage() {
  return (
    <ToolLayout title="Student's t Distribution">
      <TDistributionCalculator />
    </ToolLayout>
  )
}

