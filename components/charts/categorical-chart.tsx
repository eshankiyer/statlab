"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface CategoryData {
  name: string
  frequency: number
}

interface CategoricalChartProps {
  data: CategoryData[]
}

export function CategoricalChart({ data }: CategoricalChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="frequency" fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  )
}

