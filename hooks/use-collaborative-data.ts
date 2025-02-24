"use client"

import { useState, useEffect } from "react"
import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

export function useCollaborativeData<T>(key: string, initialData: T) {
  const [data, setData] = useState<T>(initialData)

  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:3001") // Replace with your actual server URL
    }

    socket.emit("join", key)

    socket.on("data", (newData: T) => {
      setData(newData)
    })

    return () => {
      socket?.off("data")
    }
  }, [key])

  const updateData = (newData: T) => {
    setData(newData)
    socket?.emit("update", { key, data: newData })
  }

  return { data, updateData }
}

