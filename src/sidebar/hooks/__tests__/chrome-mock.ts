import { vi } from 'vitest';

type EvalCallback = (result: unknown, exceptionInfo?: { isError?: boolean }) => void;

interface CapturedEval {
  script: string;
  callback: EvalCallback;
}

export function createChromeMock() {
  const capturedEvals: CapturedEval[] = [];
  const selectionListeners: Array<() => void> = [];

  const evalMock = vi.fn((script: string, callback: EvalCallback) => {
    capturedEvals.push({ script, callback });
  });

  const chromeMock = {
    devtools: {
      inspectedWindow: { eval: evalMock },
      panels: {
        elements: {
          onSelectionChanged: {
            addListener: vi.fn((fn: () => void) => {
              selectionListeners.push(fn);
            }),
            removeListener: vi.fn((fn: () => void) => {
              const idx = selectionListeners.indexOf(fn);
              if (idx >= 0) selectionListeners.splice(idx, 1);
            }),
          },
        },
      },
    },
  };

  function triggerSelectionChange() {
    for (const fn of [...selectionListeners]) fn();
  }

  /** Resolve a captured eval callback asynchronously via queueMicrotask. */
  function resolveEvalAt(
    index: number,
    result: unknown,
    exceptionInfo?: { isError?: boolean },
  ): Promise<void> {
    const captured = capturedEvals[index];
    if (!captured) throw new Error(`No captured eval at index ${index}`);
    return new Promise<void>((resolve) => {
      queueMicrotask(() => {
        captured.callback(result, exceptionInfo);
        resolve();
      });
    });
  }

  /** Resolve the most recent captured eval callback asynchronously. */
  function resolveLastEval(result: unknown, exceptionInfo?: { isError?: boolean }): Promise<void> {
    return resolveEvalAt(capturedEvals.length - 1, result, exceptionInfo);
  }

  return {
    chrome: chromeMock,
    evalMock,
    capturedEvals,
    triggerSelectionChange,
    resolveEvalAt,
    resolveLastEval,
  };
}
