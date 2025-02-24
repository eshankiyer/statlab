"use client"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"

export function ChiSquareCalculator() {
  const [df, setDf] = useState(5)
  const [value, setValue] = useState(11.07)
  const [probability, setProbability] = useState(0.95)
  const [tab, setTab] = useState("find-probability")

  // Function to calculate Chi-Square probability (simplified for demonstration)
  const calculateChiSquareProbability = useCallback((x: number, k: number) => {
    // This is a placeholder; replace with actual Chi-Square calculation
    return (Math.exp(-x / 2) * Math.pow(x / 2, k / 2 - 1)) / (Math.pow(2, k / 2) * gamma(k / 2))
  }, [])

  // Function to calculate gamma function (simplified for demonstration)
  const gamma = (z: number) => {
    if (z === 1) return 1
    if (z === 0.5) return Math.sqrt(Math.PI)
    return (z - 1) * gamma(z - 1)
  }

  const chartData = useMemo(() => {
    const data = []
    for (let i = 0; i <= value + 5; i += 0.1) {
      data.push({ x: i, y: calculateChiSquareProbability(i, df) })
    }
    return data
  }, [df, value, calculateChiSquareProbability])

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="text-foreground">Chi-Square Distribution Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="find-probability">Find Probability</TabsTrigger>
            <TabsTrigger value="find-value">Find Value</TabsTrigger>
          </TabsList>
          <TabsContent value="find-probability" className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="df">Degrees of Freedom (df)</label>
              <Input type="number" id="df" value={df} onChange={(e) => setDf(Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="value">Chi-Square Value (χ²)</label>
              <Input type="number" id="value" value={value} onChange={(e) => setValue(Number(e.target.value))} />
            </div>
            <Button variant="outline">Calculate Probability</Button>
            <div>Probability: {probability.toFixed(4)}</div>
          </TabsContent>
          <TabsContent value="find-value" className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="probability">Probability</label>
              <Input
                type="number"
                id="probability"
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="df-value">Degrees of Freedom (df)</label>
              <Input type="number" id="df-value" value={df} onChange={(e) => setDf(Number(e.target.value))} />
            </div>
            <Button variant="outline">Calculate Value</Button>
            <div>Chi-Square Value: {value.toFixed(4)}</div>
          </TabsContent>
        </Tabs>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis
              dataKey="x"
              stroke="currentColor"
              type="number"
              domain={[0, "auto"]}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <YAxis stroke="currentColor" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            />
            <Line type="monotone" dataKey="y" stroke="currentColor" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

