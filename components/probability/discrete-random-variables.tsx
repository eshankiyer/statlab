"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface Outcome {
  value: number
  probability: number
}

export function DiscreteRandomVariables() {
  const [outcomes, setOutcomes] = useState<Outcome[]>([
    { value: 0, probability: 0.5 },
    { value: 1, probability: 0.5 },
  ])
  const [results, setResults] = useState<{
    expectedValue: number
    variance: number
  } | null>(null)

  const addOutcome = () => {
    setOutcomes([...outcomes, { value: 0, probability: 0 }])
  }

  const updateOutcome = (index: number, field: keyof Outcome, value: number) => {
    const newOutcomes = [...outcomes]
    newOutcomes[index][field] = value
    setOutcomes(newOutcomes)
  }

  const removeOutcome = (index: number) => {
    if (outcomes.length > 2) {
      setOutcomes(outcomes.filter((_, i) => i !== index))
    }
  }

  const calculateStatistics = () => {
    const totalProbability = outcomes.reduce((sum, outcome) => sum + outcome.probability, 0)
    if (Math.abs(totalProbability - 1) > 0.00001) {
      alert("Probabilities must sum to 1")
      return
    }

    const expectedValue = outcomes.reduce((sum, outcome) => sum + outcome.value * outcome.probability, 0)
    const variance = outcomes.reduce(
      (sum, outcome) => sum + Math.pow(outcome.value - expectedValue, 2) * outcome.probability,
      0,
    )

    setResults({ expectedValue, variance })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discrete Random Variables Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Value</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outcomes.map((outcome, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    type="number"
                    value={outcome.value}
                    onChange={(e) => updateOutcome(index, "value", Number(e.target.value))}
                    step="any"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={outcome.probability}
                    onChange={(e) => updateOutcome(index, "probability", Number(e.target.value))}
                    step="0.01"
                    min="0"
                    max="1"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeOutcome(index)}
                    disabled={outcomes.length <= 2}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex gap-2">
          <Button onClick={addOutcome}>Add Outcome</Button>
          <Button onClick={calculateStatistics}>Calculate Statistics</Button>
        </div>

        {results && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Expected Value: {results.expectedValue.toFixed(4)}</p>
                <p>Variance: {results.variance.toFixed(4)}</p>
                <p>Standard Deviation: {Math.sqrt(results.variance).toFixed(4)}</p>
              </CardContent>
            </Card>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={outcomes}>
                <XAxis dataKey="value" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="probability" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

