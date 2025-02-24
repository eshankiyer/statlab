"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"
import { calculateFDistribution } from "@/lib/utils"

export function FDistribution() {
  const [df1, setDf1] = useState(5)
  const [df2, setDf2] = useState(10)
  const [x, setX] = useState(2)
  const [result, setResult] = useState<number | null>(null)

  const chartData = useMemo(() => {
    const data = []
    for (let i = 0; i <= 5; i += 0.1) {
      data.push({
        x: i,
        y: calculateFDistribution(i, df1, df2),
      })
    }
    return data
  }, [df1, df2])

  const calculateProbability = () => {
    setResult(calculateFDistribution(x, df1, df2))
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="text-foreground">F Distribution Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-foreground">Numerator df (df₁)</label>
            <Input
              type="number"
              value={df1}
              onChange={(e) => setDf1(Number(e.target.value))}
              min="1"
              className="bg-white dark:bg-white text-black"
            />
          </div>
          <div>
            <label className="text-foreground">Denominator df (df₂)</label>
            <Input
              type="number"
              value={df2}
              onChange={(e) => setDf2(Number(e.target.value))}
              min="1"
              className="bg-white dark:bg-white text-black"
            />
          </div>
          <div>
            <label className="text-foreground">X value</label>
            <Input
              type="number"
              value={x}
              onChange={(e) => setX(Number(e.target.value))}
              min="0"
              step="0.1"
              className="bg-white dark:bg-white text-black"
            />
          </div>
        </div>

        <Button onClick={calculateProbability}>Calculate</Button>

        {result !== null && (
          <div className="p-4 bg-white dark:bg-white text-black rounded-lg">
            <p>
              f({x}; {df1}, {df2}) = {result.toFixed(6)}
            </p>
          </div>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="x" stroke="currentColor" />
            <YAxis stroke="currentColor" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid #ccc",
              }}
            />
            <Line type="monotone" dataKey="y" stroke="currentColor" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

