"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"
import { calculateTDistribution } from "@/lib/utils"

export function TDistributionCalculator() {
  const [df, setDf] = useState(10)
  const [value, setValue] = useState(1.96)
  const [probability, setProbability] = useState(0.95)
  const [tab, setTab] = useState("find-probability")

  const chartData = useMemo(() => {
    const data = []
    for (let x = -4; x <= 4; x += 0.1) {
      data.push({ x, y: calculateTDistribution(x, df) })
    }
    return data
  }, [df])

  const handleDfChange = (e) => {
    const newDf = Number.parseFloat(e.target.value)
    if (!isNaN(newDf) && newDf > 0) {
      setDf(newDf)
    }
  }

  const handleValueChange = (e) => {
    const newValue = Number.parseFloat(e.target.value)
    if (!isNaN(newValue)) {
      setValue(newValue)
    }
  }

  const handleProbabilityChange = (e) => {
    const newProbability = Number.parseFloat(e.target.value)
    if (!isNaN(newProbability) && newProbability > 0 && newProbability < 1) {
      setProbability(newProbability)
    }
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="text-foreground">Student's t Distribution Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          defaultValue="find-probability"
          className="w-[400px]"
          value={tab}
          onValueChange={(value) => setTab(value)}
        >
          <TabsList>
            <TabsTrigger value="find-probability">Find Probability</TabsTrigger>
            <TabsTrigger value="find-value">Find Value</TabsTrigger>
          </TabsList>
          <TabsContent value="find-probability">
            <div className="grid gap-2">
              <label htmlFor="degreesOfFreedom">Degrees of Freedom (df):</label>
              <Input type="number" id="degreesOfFreedom" value={df} onChange={handleDfChange} />
              <label htmlFor="tValue">t-value:</label>
              <Input type="number" id="tValue" value={value} onChange={handleValueChange} />
              <Button>Calculate Probability</Button>
              <div>Probability: {probability}</div>
            </div>
          </TabsContent>
          <TabsContent value="find-value">
            <div className="grid gap-2">
              <label htmlFor="probability">Probability:</label>
              <Input type="number" id="probability" value={probability} onChange={handleProbabilityChange} />
              <label htmlFor="degreesOfFreedomValue">Degrees of Freedom (df):</label>
              <Input type="number" id="degreesOfFreedomValue" value={df} onChange={handleDfChange} />
              <Button>Calculate t-value</Button>
              <div>t-value: {value}</div>
            </div>
          </TabsContent>
        </Tabs>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis
              dataKey="x"
              stroke="currentColor"
              type="number"
              domain={["auto", "auto"]}
              tickFormatter={(value) => value.toFixed(2)}
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

