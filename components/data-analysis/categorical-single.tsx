"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface CategoryData {
  name: string
  frequency: number
}

export function CategoricalSingle() {
  const [variableName, setVariableName] = useState("")
  const [categories, setCategories] = useState<CategoryData[]>([
    { name: "", frequency: 0 },
    { name: "", frequency: 0 },
  ])
  const [showResults, setShowResults] = useState(false)

  const addCategory = () => {
    setCategories([...categories, { name: "", frequency: 0 }])
  }

  const removeCategory = (index: number) => {
    if (categories.length > 1) {
      setCategories(categories.filter((_, i) => i !== index))
    }
  }

  const updateCategory = (index: number, field: keyof CategoryData, value: string | number) => {
    const newCategories = [...categories]
    newCategories[index] = {
      ...newCategories[index],
      [field]: field === "frequency" ? Number(value) || 0 : value,
    }
    setCategories(newCategories)
  }

  const handleAnalysis = () => {
    if (!variableName || categories.some((cat) => !cat.name || cat.frequency <= 0)) {
      alert("Please fill in all fields with valid values")
      return
    }
    setShowResults(true)
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="text-foreground">Categorical Variable Analysis (Single Group)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="variable-name" className="text-foreground">
              Variable name:
            </label>
            <Input
              id="variable-name"
              value={variableName}
              onChange={(e) => setVariableName(e.target.value)}
              placeholder="Enter variable name"
              className="bg-white dark:bg-white text-black"
            />
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-card">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-foreground">Category Name</th>
                <th className="text-left text-foreground">Frequency</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={index} className="border-t border-border">
                  <td className="py-2">
                    <Input
                      value={category.name}
                      onChange={(e) => updateCategory(index, "name", e.target.value)}
                      placeholder="Category name"
                      className="bg-white dark:bg-white text-black"
                    />
                  </td>
                  <td className="py-2">
                    <Input
                      type="number"
                      value={category.frequency || ""}
                      onChange={(e) => updateCategory(index, "frequency", e.target.value)}
                      placeholder="Frequency"
                      min="0"
                      className="bg-white dark:bg-white text-black"
                    />
                  </td>
                  <td className="py-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategory(index)}
                      disabled={categories.length <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="outline" size="sm" onClick={addCategory} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleAnalysis}>Begin analysis</Button>
          <Button
            variant="outline"
            onClick={() => {
              setVariableName("")
              setCategories([
                { name: "", frequency: 0 },
                { name: "", frequency: 0 },
              ])
              setShowResults(false)
            }}
          >
            Reset
          </Button>
        </div>

        {showResults && categories.some((cat) => cat.frequency > 0) && (
          <div className="mt-8 p-4 bg-card rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Results</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={categories}>
                <XAxis dataKey="name" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    color: "black",
                    border: "1px solid #ccc",
                  }}
                />
                <Bar dataKey="frequency" fill="currentColor" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

