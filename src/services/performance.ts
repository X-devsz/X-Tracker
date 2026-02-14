import { useEffect, useRef } from 'react';

const now = () =>
  typeof globalThis?.performance?.now === 'function' ? globalThis.performance.now() : Date.now();

const getAppStartTime = () => {
  const globalWithStart = globalThis as typeof globalThis & {
    __APP_START_TIME__?: number;
  };
  if (typeof globalWithStart.__APP_START_TIME__ !== 'number') {
    globalWithStart.__APP_START_TIME__ = now();
  }
  return globalWithStart.__APP_START_TIME__!;
};

const appStartTime = getAppStartTime();
const COLD_START_BUDGET_MS = 2500;
const SCREEN_RENDER_BUDGET_MS = 300;
let coldStartLogged = false;

const logPerf = (label: string, elapsedMs: number, budgetMs: number) => {
  const message = `[Perf] ${label} ${elapsedMs}ms (budget ${budgetMs}ms)`;
  if (elapsedMs > budgetMs) {
    console.warn(`${message} SLOW`);
  } else {
    console.info(`${message} OK`);
  }
};

export const logColdStart = (label = 'app-ready', budgetMs = COLD_START_BUDGET_MS) => {
  if (coldStartLogged) return;
  coldStartLogged = true;
  const elapsed = Math.round(now() - appStartTime);
  logPerf(`Cold start ${label}`, elapsed, budgetMs);
};

export const useScreenRenderTimer = (
  screenName: string,
  ready: boolean,
  budgetMs = SCREEN_RENDER_BUDGET_MS,
) => {
  const startRef = useRef<number | null>(null);
  const loggedRef = useRef(false);

  useEffect(() => {
    if (startRef.current === null) {
      startRef.current = now();
    }
  }, []);

  useEffect(() => {
    if (!ready || loggedRef.current || startRef.current === null) return;
    loggedRef.current = true;
    const startTime = startRef.current;
    requestAnimationFrame(() => {
      const elapsed = Math.round(now() - startTime);
      logPerf(`${screenName} render`, elapsed, budgetMs);
    });
  }, [ready, screenName, budgetMs]);
};
