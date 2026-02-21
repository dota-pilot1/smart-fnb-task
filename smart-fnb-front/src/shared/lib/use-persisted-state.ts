import { useState, useCallback } from "react";

export function usePersistedState(key: string, defaultValue: number): [number, (value: number) => void] {
  const [state, setState] = useState<number>(() => {
    const saved = localStorage.getItem(key);
    return saved ? Number(saved) : defaultValue;
  });

  const setPersistedState = useCallback((value: number) => {
    setState(value);
    localStorage.setItem(key, String(value));
  }, [key]);

  return [state, setPersistedState];
}
