"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useCollaborativeData } from "@/hooks/use-collaborative-data"

interface GroupData {
  name: string
  values: number[]
}

export function QuantitativeMultiple() {
  const [localData, setLocalData] = useState<GroupData[]>([
    { name: "Group 1", values: [0] },
    { name: "Group 2", values: [0] },
  ])
  const { data: collaborativeData, updateData } = useCollaborativeData<GroupData[]>("quantitative-multiple", [
    { name: "Group 1", values: [0] },
    { name: "Group 2", values: [0] },
  ])
  const [results, setResults] = useState<{
    anova: {
      fValue: number
      pValue: number
    }
    groupStats: {
      name: string
      mean: number
      median: number
      standardDeviation: number
    }[]
  } | null>(null)

  useEffect(() => {
    setLocalData(collaborativeData)
  }, [collaborativeData])

  const addGroup = () => {
    const newData = [...localData, { name: `Group ${localData.length + 1}`, values: [0] }]
    setLocalData(newData)
    updateData(newData)
  }

  const addValue = (groupIndex: number) => {
    const newData = [...localData]
    newData[groupIndex].values.push(0)
    setLocalData(newData)
    updateData(newData)
  }

  const updateValue = (groupIndex: number, valueIndex: number, value: number) => {
    const newData = [...localData]
    newData[groupIndex].values[valueIndex] = value
    setLocalData(newData)
    updateData(newData)
  }

  const removeValue = (groupIndex: number, valueIndex: number) => {
    if (localData[groupIndex].values.length > 1) {
      const newData = [...localData]
      newData[groupIndex].values.splice(valueIndex, 1)
      setLocalData(newData)
      updateData(newData)
    }
  }

  const calculateStatistics = () => {
    // Calculate group statistics
    const groupStats = localData.map((group) => {
      const values = group.values
      const mean = values.reduce((a, b) => a + b, 0) / values.length
      const sortedValues = [...values].sort((a, b) => a - b)
      const median =
        values.length % 2 === 0
          ? (sortedValues[values.length / 2 - 1] + sortedValues[values.length / 2]) / 2
          : sortedValues[Math.floor(values.length / 2)]
      const variance = values.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / values.length
      const standardDeviation = Math.sqrt(variance)

      return {
        name: group.name,
        mean,
        median,
        standardDeviation,
      }
    })

    // Calculate ANOVA
    const grandMean =
      localData.flatMap((g) => g.values).reduce((a, b) => a + b, 0) / localData.flatMap((g) => g.values).length
    const ssb = localData.reduce((sum, group) => {
      const groupMean = group.values.reduce((a, b) => a + b, 0) / group.values.length
      return sum + group.values.length * Math.pow(groupMean - grandMean, 2)
    }, 0)
    const ssw = localData.reduce((sum, group) => {
      const groupMean = group.values.reduce((a, b) => a + b, 0) / group.values.length
      return sum + group.values.reduce((s, v) => s + Math.pow(v - groupMean, 2), 0)
    }, 0)
    const dfb = localData.length - 1
    const dfw = localData.reduce((sum, group) => sum + group.values.length, 0) - localData.length
    const msb = ssb / dfb
    const msw = ssw / dfw
    const fValue = msb / msw
    const pValue = 1 - fDistribution(fValue, dfb, dfw)

    setResults({
      anova: { fValue, pValue },
      groupStats,
    })
  }

  // F-distribution CDF approximation
  const fDistribution = (x: number, d1: number, d2: number) => {
    const p = d1 / 2
    const q = d2 / 2
    const beta = (x * p) / (x * p + q)
    return 1 - incompleteBeta(p, q, beta)
  }

  // Incomplete beta function approximation
  const incompleteBeta = (a: number, b: number, x: number) => {
    const maxIterations = 100
    const epsilon = 1e-8
    let sum = 0
    let term = 1
    for (let i = 0; i < maxIterations; i++) {
      term *= ((a + i) * x) / (a + b + i)
      sum += term
      if (term < epsilon) break
    }
    return (sum * Math.pow(x, a) * Math.pow(1 - x, b)) / a
  }

  const generateChartData = (group: { name: string; values: number[] }) => {
    return group.values.map((value, index) => ({
      index,
      value,
    }))
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Quantitative Variable Analysis (Multiple Groups)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {localData.map((group, groupIndex) => (
          <Card key={groupIndex}>
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Value</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.values.map((value, valueIndex) => (
                    <TableRow key={valueIndex}>
                      <TableCell>
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => updateValue(groupIndex, valueIndex, Number(e.target.value))}
                          step="any"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeValue(groupIndex, valueIndex)}
                          disabled={group.values.length <= 1}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={() => addValue(groupIndex)} className="mt-2">
                Add Value
              </Button>
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-2">
          <Button onClick={addGroup}>Add Group</Button>
          <Button onClick={calculateStatistics}>Analyze Data</Button>
        </div>

        {results && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ANOVA Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p>F-value: {results.anova.fValue.toFixed(4)}</p>
                <p>p-value: {results.anova.pValue.toFixed(4)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Group Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Group</TableHead>
                      <TableHead>Mean</TableHead>
                      <TableHead>Median</TableHead>
                      <TableHead>Standard Deviation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.groupStats.map((stat, index) => (
                      <TableRow key={index}>
                        <TableCell>{stat.name}</TableCell>
                        <TableCell>{stat.mean.toFixed(4)}</TableCell>
                        <TableCell>{stat.median.toFixed(4)}</TableCell>
                        <TableCell>{stat.standardDeviation.toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localData.map((group) => (
                <ResponsiveContainer key={group.name} width="100%" height={200}>
                  <LineChart data={generateChartData(group)}>
                    <XAxis dataKey="index" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#000000" />
                  </LineChart>
                </ResponsiveContainer>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function quantile(arr: number[], q: number) {
  const sorted = [...arr].sort((a, b) => a - b)
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  } else {
    return sorted[base]
  }
}

export default QuantitativeMultiple

