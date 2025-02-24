"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CountingMethods() {
  const [n, setN] = useState(5)
  const [r, setR] = useState(3)
  const [result, setResult] = useState<string | null>(null)

  const calculateFactorial = () => {
    setResult(`${n}! = ${factorial(n).toLocaleString()}`)
  }

  const calculatePermutation = () => {
    setResult(`P(${n}, ${r}) = ${permutation(n, r).toLocaleString()}`)
  }

  const calculateCombination = () => {
    setResult(`C(${n}, ${r}) = ${combination(n, r).toLocaleString()}`)
  }

  const permutation = (n: number, r: number): number => {
    return factorial(n) / factorial(n - r)
  }

  const combination = (n: number, r: number): number => {
    return factorial(n) / (factorial(r) * factorial(n - r))
  }

  const factorial = (num: number): number => {
    if (num === 0 || num === 1) return 1
    return num * factorial(num - 1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Counting Methods Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="n">Total items (n)</label>
            <Input id="n" type="number" value={n} onChange={(e) => setN(Number(e.target.value))} min="0" />
          </div>
          <div>
            <label htmlFor="r">Items to choose (r)</label>
            <Input id="r" type="number" value={r} onChange={(e) => setR(Number(e.target.value))} min="0" max={n} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={calculateFactorial}>Calculate n!</Button>
          <Button onClick={calculatePermutation}>Calculate nPr</Button>
          <Button onClick={calculateCombination}>Calculate nCr</Button>
        </div>

        {result && (
          <div>
            <p>Result: {result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

