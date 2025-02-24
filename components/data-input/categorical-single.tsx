"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoricalChart } from "@/components/charts/categorical-chart"

interface CategoryData {
  name: string
  frequency: number
}

export function CategoricalSingle() {
  const [variableName, setVariableName] = useState("")
  const [inputMethod, setInputMethod] = useState("counts")
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
    // Validate data
    if (!variableName || categories.some((cat) => !cat.name || cat.frequency <= 0)) {
      alert("Please fill in all fields with valid values")
      return
    }
    setShowResults(true)
  }

  const resetAnalysis = () => {
    setVariableName("")
    setCategories([
      { name: "", frequency: 0 },
      { name: "", frequency: 0 },
    ])
    setShowResults(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>One Categorical Variable, Single Group</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="variable-name">Variable name:</label>
              <Input
                id="variable-name"
                value={variableName}
                onChange={(e) => setVariableName(e.target.value)}
                placeholder="Enter variable name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="input-method">Input data as:</label>
              <Select value={inputMethod} onValueChange={setInputMethod}>
                <SelectTrigger id="input-method">
                  <SelectValue placeholder="Select input method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="counts">Counts in categories</SelectItem>
                  <SelectItem value="raw">Raw data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">#</th>
                  <th className="text-left">Category Name</th>
                  <th className="text-left">Frequency</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">
                      <Input
                        value={category.name}
                        onChange={(e) => updateCategory(index, "name", e.target.value)}
                        placeholder="Category name"
                      />
                    </td>
                    <td className="py-2">
                      <Input
                        type="number"
                        value={category.frequency || ""}
                        onChange={(e) => updateCategory(index, "frequency", e.target.value)}
                        placeholder="Frequency"
                        min="0"
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
            <Button variant="outline" onClick={resetAnalysis}>
              Reset everything
            </Button>
          </div>
        </CardContent>
      </Card>

      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoricalChart data={categories} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

