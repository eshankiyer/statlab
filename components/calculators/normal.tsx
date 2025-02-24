"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

// Normal distribution calculations
function erf(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)

  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return sign * y
}

function normalCDF(x: number, mean: number, stdDev: number): number {
  return 0.5 * (1 + erf((x - mean) / (Math.sqrt(2) * stdDev)))
}

function normalPDF(x: number, mean: number, stdDev: number): number {
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI))
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2))
  return coefficient * Math.exp(exponent)
}

export function NormalCalculator() {
  const [mean, setMean] = useState("0")
  const [sd, setSD] = useState("1")
  const [operation, setOperation] = useState("area")
  const [value, setValue] = useState("")
  const [result, setResult] = useState<string | null>(null)

  const handleCalculation = () => {
    const numValue = Number(value)
    const numMean = Number(mean)
    const numSD = Number(sd)

    if (isNaN(numValue)) {
      setResult("Please enter a valid number")
      return
    }

    if (operation === "area") {
      const area = normalCDF(numValue, numMean, numSD)
      setResult(`P(X ≤ ${value}) = ${area.toFixed(4)}`)
    }
  }

  const generateChartData = () => {
    const data = []
    const numMean = Number(mean)
    const numSD = Number(sd)
    for (let i = numMean - 4 * numSD; i <= numMean + 4 * numSD; i += numSD / 10) {
      data.push({
        x: i,
        y: normalPDF(i, numMean, numSD),
      })
    }
    return data
  }

  return (
    <Card className="bg-yale-blue">
      <CardHeader>
        <CardTitle className="text-foreground">Normal Distribution Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="mean" className="text-foreground">
              Mean (μ)
            </label>
            <Input
              id="mean"
              type="number"
              value={mean}
              onChange={(e) => setMean(e.target.value)}
              className="bg-space-cadet"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="sd" className="text-foreground">
              Standard Deviation (σ)
            </label>
            <Input
              id="sd"
              type="number"
              value={sd}
              onChange={(e) => setSD(e.target.value)}
              min="0"
              className="bg-space-cadet"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="value" className="text-foreground">
            X value
          </label>
          <Input
            id="value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="bg-space-cadet"
          />
        </div>

        <Button onClick={handleCalculation} className="w-full bg-lapis-lazuli hover:bg-cerulean">
          Calculate Area
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-space-cadet rounded-lg">
            <p className="font-mono text-foreground">{result}</p>
          </div>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={generateChartData()}>
            <XAxis dataKey="x" stroke="#9EB3C2" />
            <YAxis stroke="#9EB3C2" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#21295C",
                border: "none",
                color: "#ffffff",
              }}
            />
            <Line type="monotone" dataKey="y" stroke="#1C7293" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

