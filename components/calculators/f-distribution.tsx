"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { jstat } from "jstat"

export function FDistributionCalculator() {
  const [dfNumerator, setDfNumerator] = useState("5")
  const [dfDenominator, setDfDenominator] = useState("10")
  const [operation, setOperation] = useState("area")
  const [value, setValue] = useState("")
  const [result, setResult] = useState<string | null>(null)

  const calculateArea = (x: number) => {
    return jstat.centralF.cdf(x, Number(dfNumerator), Number(dfDenominator))
  }

  const calculateInverse = (p: number) => {
    return jstat.centralF.inv(p, Number(dfNumerator), Number(dfDenominator))
  }

  const handleCalculation = () => {
    const numValue = Number(value)
    if (isNaN(numValue) || numValue < 0) {
      setResult("Please enter a valid non-negative number")
      return
    }

    if (operation === "area") {
      setResult(`P(X ≤ ${value}) = ${calculateArea(numValue).toFixed(4)}`)
    } else {
      setResult(`X = ${calculateInverse(numValue).toFixed(4)}`)
    }
  }

  const generateChartData = () => {
    const data = []
    const numDfNumerator = Number(dfNumerator)
    const numDfDenominator = Number(dfDenominator)
    const maxX = jstat.centralF.inv(0.999, numDfNumerator, numDfDenominator)
    for (let i = 0; i <= maxX; i += maxX / 100) {
      data.push({
        x: i,
        y: jstat.centralF.pdf(i, numDfNumerator, numDfDenominator),
      })
    }
    return data
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>F Distribution Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="df-numerator">Numerator Degrees of Freedom</label>
            <Input
              id="df-numerator"
              type="number"
              value={dfNumerator}
              onChange={(e) => setDfNumerator(e.target.value)}
              min="1"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="df-denominator">Denominator Degrees of Freedom</label>
            <Input
              id="df-denominator"
              type="number"
              value={dfDenominator}
              onChange={(e) => setDfDenominator(e.target.value)}
              min="1"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="operation">Operation</label>
          <Select value={operation} onValueChange={setOperation}>
            <SelectTrigger id="operation">
              <SelectValue placeholder="Select operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">Calculate area under the F curve</SelectItem>
              <SelectItem value="inverse">Calculate inverse of F distribution</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <label htmlFor="value">{operation === "area" ? "F value" : "Probability"}</label>
          <Input id="value" type="number" value={value} onChange={(e) => setValue(e.target.value)} min="0" />
        </div>

        <Button onClick={handleCalculation}>Calculate</Button>

        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-mono">{result}</p>
          </div>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={generateChartData()}>
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

