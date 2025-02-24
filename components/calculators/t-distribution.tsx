"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { jstat } from "jstat"

export function TDistributionCalculator() {
  const [df, setDf] = useState("10")
  const [operation, setOperation] = useState("area")
  const [value, setValue] = useState("")
  const [result, setResult] = useState<string | null>(null)

  const calculateArea = (x: number) => {
    return jstat.studentt.cdf(x, Number(df))
  }

  const calculateInverse = (p: number) => {
    return jstat.studentt.inv(p, Number(df))
  }

  const handleCalculation = () => {
    const numValue = Number(value)
    if (isNaN(numValue)) {
      setResult("Please enter a valid number")
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
    const numDf = Number(df)
    for (let i = -4; i <= 4; i += 0.1) {
      data.push({
        x: i,
        y: jstat.studentt.pdf(i, numDf),
      })
    }
    return data
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>t Distribution Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="df">Degrees of Freedom</label>
          <Input id="df" type="number" value={df} onChange={(e) => setDf(e.target.value)} min="1" />
        </div>

        <div className="grid gap-2">
          <label htmlFor="operation">Operation</label>
          <Select value={operation} onValueChange={setOperation}>
            <SelectTrigger id="operation">
              <SelectValue placeholder="Select operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">Calculate area under the t curve</SelectItem>
              <SelectItem value="inverse">Calculate inverse of t distribution</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <label htmlFor="value">{operation === "area" ? "t value" : "Probability"}</label>
          <Input id="value" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
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

