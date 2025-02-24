"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface CategoryData {
  [key: string]: { [key: string]: number }
}

export function CategoricalTwo() {
  const [data, setData] = useState<CategoryData>({
    "Category 1": { "Subcategory 1": 0, "Subcategory 2": 0 },
    "Category 2": { "Subcategory 1": 0, "Subcategory 2": 0 },
  })
  const [results, setResults] = useState<{
    chiSquare: number
    pValue: number
    cramerV: number
  } | null>(null)

  const addCategory = () => {
    const newCategory = `Category ${Object.keys(data).length + 1}`
    setData({
      ...data,
      [newCategory]: { ...Object.fromEntries(Object.keys(data[Object.keys(data)[0]]).map((sub) => [sub, 0])) },
    })
  }

  const addSubcategory = () => {
    const newSubcategory = `Subcategory ${Object.keys(data[Object.keys(data)[0]]).length + 1}`
    setData(
      Object.fromEntries(Object.entries(data).map(([cat, subCats]) => [cat, { ...subCats, [newSubcategory]: 0 }])),
    )
  }

  const updateValue = (category: string, subcategory: string, value: number) => {
    setData({
      ...data,
      [category]: {
        ...data[category],
        [subcategory]: value,
      },
    })
  }

  const calculateStatistics = () => {
    const categories = Object.keys(data)
    const subcategories = Object.keys(data[categories[0]])
    const observed = categories.map((cat) => subcategories.map((sub) => data[cat][sub]))

    const rowSums = observed.map((row) => row.reduce((a, b) => a + b, 0))
    const colSums = subcategories.map((_, i) => observed.reduce((sum, row) => sum + row[i], 0))
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

  // Chi-square CDF approximation (same as in previous components)
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
        <CardTitle>Two Categorical Variables Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              {Object.keys(data[Object.keys(data)[0]]).map((subcategory) => (
                <TableHead key={subcategory}>{subcategory}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(data).map(([category, subcategories]) => (
              <TableRow key={category}>
                <TableCell>{category}</TableCell>
                {Object.entries(subcategories).map(([subcategory, value]) => (
                  <TableCell key={subcategory}>
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => updateValue(category, subcategory, Number(e.target.value))}
                      min="0"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex gap-2">
          <Button onClick={addCategory}>Add Category</Button>
          <Button onClick={addSubcategory}>Add Subcategory</Button>
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
              <BarChart
                data={Object.entries(data).map(([category, subcategories]) => ({ category, ...subcategories }))}
              >
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(data[Object.keys(data)[0]]).map((subcategory, index) => (
                  <Bar
                    key={subcategory}
                    dataKey={subcategory}
                    fill={`hsl(${(index * 360) / Object.keys(data[Object.keys(data)[0]]).length}, 70%, 50%)`}
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

