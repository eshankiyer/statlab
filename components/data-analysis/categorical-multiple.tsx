"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface GroupData {
  name: string
  categories: { [key: string]: number }
}

export function CategoricalMultiple() {
  const [groups, setGroups] = useState<GroupData[]>([
    { name: "Group 1", categories: { "Category 1": 0, "Category 2": 0 } },
    { name: "Group 2", categories: { "Category 1": 0, "Category 2": 0 } },
  ])
  const [results, setResults] = useState<{
    chiSquare: number
    pValue: number
    cramerV: number
  } | null>(null)

  const addGroup = () => {
    const newGroup = {
      name: `Group ${groups.length + 1}`,
      categories: { ...groups[0].categories },
    }
    setGroups([...groups, newGroup])
  }

  const addCategory = () => {
    const newCategory = `Category ${Object.keys(groups[0].categories).length + 1}`
    setGroups(
      groups.map((group) => ({
        ...group,
        categories: { ...group.categories, [newCategory]: 0 },
      })),
    )
  }

  const updateValue = (groupIndex: number, category: string, value: number) => {
    const newGroups = [...groups]
    newGroups[groupIndex].categories[category] = value
    setGroups(newGroups)
  }

  const calculateStatistics = () => {
    const categories = Object.keys(groups[0].categories)
    const observed = groups.map((group) => categories.map((cat) => group.categories[cat]))

    const rowSums = observed.map((row) => row.reduce((a, b) => a + b, 0))
    const colSums = categories.map((_, i) => observed.reduce((sum, row) => sum + row[i], 0))
    const total = rowSums.reduce((a, b) => a + b, 0)

    let chiSquare = 0
    for (let i = 0; i < observed.length; i++) {
      for (let j = 0; j < observed[i].length; j++) {
        const expected = (rowSums[i] * colSums[j]) / total
        chiSquare += Math.pow(observed[i][j] - expected, 2) / expected
      }
    }

    const df = (observed.length - 1) * (observed[0].length - 1)
    const pValue = 1 - chiSquareCDF(chiSquare, df)

    const cramerV = Math.sqrt(chiSquare / (total * Math.min(observed.length - 1, observed[0].length - 1)))

    setResults({ chiSquare, pValue, cramerV })
  }

  // Chi-square CDF approximation (same as in categorical-single.tsx)
  const chiSquareCDF = (x: number, k: number) => {
    if (k <= 0) return 0
    const m = x / 2.0
    let sum = Math.exp(-m)
    let term = sum
    for (let i = 1; i < k / 2; i++) {
      term *= m / i
      sum += term
    }
    return Math.max(0, Math.min(1, sum))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorical Variable Analysis (Multiple Groups)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group</TableHead>
              {Object.keys(groups[0].categories).map((category) => (
                <TableHead key={category}>{category}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group, groupIndex) => (
              <TableRow key={groupIndex}>
                <TableCell>{group.name}</TableCell>
                {Object.entries(group.categories).map(([category, value]) => (
                  <TableCell key={category}>
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => updateValue(groupIndex, category, Number(e.target.value))}
                      min="0"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex gap-2">
          <Button onClick={addGroup}>Add Group</Button>
          <Button onClick={addCategory}>Add Category</Button>
          <Button onClick={calculateStatistics}>Analyze Data</Button>
        </div>

        {results && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Chi-Square: {results.chiSquare.toFixed(4)}</p>
                <p>P-value: {results.pValue.toFixed(4)}</p>
                <p>Cramer's V: {results.cramerV.toFixed(4)}</p>
              </CardContent>
            </Card>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groups}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(groups[0].categories).map((category, index) => (
                  <Bar
                    key={category}
                    dataKey={`categories.${category}`}
                    fill={`hsl(${(index * 360) / Object.keys(groups[0].categories).length}, 70%, 50%)`}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

