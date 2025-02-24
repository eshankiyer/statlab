import { notFound } from "next/navigation"
import type React from "react" // Import React

function PlaceholderActivity({ title }: { title: string }) {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground">This activity is coming soon!</p>
    </div>
  )
}

const activities: Record<string, React.ComponentType<any>> = {
  parkinsons: () => <PlaceholderActivity title="Can You Smell Parkinson's?" />,
  hiring: () => <PlaceholderActivity title="Hiring Discrimination" />,
  correlation: () => <PlaceholderActivity title="Guess the Correlation" />,
  lyrics: () => <PlaceholderActivity title="Does Beyoncé Write Her Own Lyrics?" />,
  "swift-1": () => <PlaceholderActivity title="How Much Do Fans Like Taylor Swift? Part 1" />,
  "swift-2": () => <PlaceholderActivity title="How Much Do Fans Like Taylor Swift? Part 2" />,
  sunflowers: () => <PlaceholderActivity title="Sampling Sunflowers" />,
  "free-throws": () => <PlaceholderActivity title="Is Mrs. Gallas a Good Free Throw Shooter?" />,
  candy: () => <PlaceholderActivity title="M&M's/Skittles/Froot Loops" />,
  "old-faithful": () => <PlaceholderActivity title="Old Faithful" />,
}

export default function ActivityPage({ params }: { params: { activity: string } }) {
  const Activity = activities[params.activity]

  if (!Activity) {
    notFound()
  }

  return (
    <div className="container py-6">
      <Activity />
    </div>
  )
}

