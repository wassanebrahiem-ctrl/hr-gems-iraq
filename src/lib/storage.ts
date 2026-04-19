// localStorage-backed reactive store

import { useEffect, useState, useCallback } from "react";

const PREFIX = "hr-iraq:";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("hr-storage", { detail: { key } }));
}

export function useStore<T>(key: string, initial: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => read(key, initial));

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.key === key) setValue(read(key, initial));
    };
    window.addEventListener("hr-storage", handler);
    return () => window.removeEventListener("hr-storage", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (val: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof val === "function" ? (val as (p: T) => T)(prev) : val;
        write(key, next);
        return next;
      });
    },
    [key],
  );

  return [value, update];
}

export function uid(prefix = ""): string {
  return prefix + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function exportAllData(): string {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) {
      data[k.slice(PREFIX.length)] = JSON.parse(localStorage.getItem(k) || "null");
    }
  }
  return JSON.stringify({ exportedAt: new Date().toISOString(), data }, null, 2);
}

export function importAllData(json: string) {
  const parsed = JSON.parse(json);
  const data = parsed.data || parsed;
  Object.entries(data).forEach(([k, v]) => {
    localStorage.setItem(PREFIX + k, JSON.stringify(v));
  });
  window.dispatchEvent(new CustomEvent("hr-storage", { detail: { key: "*" } }));
}

export function clearAllData() {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
  window.dispatchEvent(new CustomEvent("hr-storage", { detail: { key: "*" } }));
}
