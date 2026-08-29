"use client"

import { useState } from "react"

// Local per-session state. This previously synced across browser tabs/users
// via a socket.io server that was never deployed (it pointed at
// localhost:3001), so every "collaborative" session was actually just local
// state anyway. Keeping the same { data, updateData } shape means the
// consuming components need no changes.
export function useCollaborativeData<T>(_key: string, initialData: T) {
  const [data, setData] = useState<T>(initialData)

  const updateData = (newData: T) => {
    setData(newData)
  }

  return { data, updateData }
}
