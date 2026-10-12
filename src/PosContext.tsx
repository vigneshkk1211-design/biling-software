import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { DEFAULT_POS_DATA, validatePosData } from './posModel'
import type { PosData } from './posModel'

type PosContextValue = { data: PosData; setData: Dispatch<SetStateAction<PosData>>; storageAvailable: boolean; replaceData: (input: unknown) => { ok: boolean; error?: string }; resetData: () => void }
const PosContext = createContext<PosContextValue | null>(null)
const STORAGE_KEY = 'scoop-co-pos-demo-v1'

function loadData(): PosData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_POS_DATA)
    const parsed = validatePosData(JSON.parse(raw))
    return parsed.ok ? parsed.data : structuredClone(DEFAULT_POS_DATA)
  } catch { return structuredClone(DEFAULT_POS_DATA) }
}

export function PosProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PosData>(loadData)
  const [storageAvailable, setStorageAvailable] = useState(true)
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); setStorageAvailable(true) }
    catch { setStorageAvailable(false) }
  }, [data])
  const replaceData = useCallback((input: unknown) => {
    const result = validatePosData(input)
    if (!result.ok) return result
    setData(result.data)
    return { ok: true }
  }, [])
  const resetData = useCallback(() => setData(structuredClone(DEFAULT_POS_DATA)), [])
  return <PosContext.Provider value={{ data, setData, storageAvailable, replaceData, resetData }}>{children}</PosContext.Provider>
}

export function usePos() {
  const value = useContext(PosContext)
  if (!value) throw new Error('usePos must be used inside PosProvider.')
  return value
}
