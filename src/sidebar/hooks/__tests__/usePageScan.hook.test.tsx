// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
// Ensure rules are registered so validation and groupByRule work
import '../../../rules/engine.ts';
import { getAllRequiredProperties } from '../../../rules/registry.ts';
import { usePageScan } from '../usePageScan.ts';
import { createChromeMock } from './chrome-mock.ts';

/** Build a base computedStyles object that satisfies isScanElementData for any registered rules. */
function makeBaseStyles(overrides: Record<string, string> = {}): Record<string, string> {
  const styles: Record<string, string> = {};
  for (const key of getAllRequiredProperties()) {
    styles[key] = 'normal';
  }
  return { ...styles, display: 'block', width: 'auto', height: 'auto', ...overrides };
}

/** Creates a minimal valid ScanElementData inside a ChunkResult. */
function makeChunkResult(
  count: number,
  total: number,
  startIndex = 0,
  overrides: Record<string, string> = {},
) {
  const results = Array.from({ length: count }, (_, i) => ({
    index: startIndex + i,
    selector: `div.el-${startIndex + i}`,
    tagName: 'div',
    id: '',
    classList: [],
    computedStyles: makeBaseStyles(overrides),
  }));
  return { results, total };
}

describe('usePageScan (hook integration)', () => {
  let mock: ReturnType<typeof createChromeMock>;

  beforeEach(() => {
    mock = createChromeMock();
    vi.stubGlobal('chrome', mock.chrome);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('transitions from idle to scanning when scan() is called', () => {
    const { result } = renderHook(() => usePageScan());
    expect(result.current.status).toBe('idle');

    act(() => {
      result.current.scan();
    });
    expect(result.current.status).toBe('scanning');
  });

  it('completes single-chunk scan and computes groups', async () => {
    const { result } = renderHook(() => usePageScan());

    act(() => {
      result.current.scan();
    });

    // Resolve with a small set (< CHUNK_SIZE=200), so single chunk
    await act(async () => {
      await mock.resolveLastEval(makeChunkResult(5, 5));
    });

    expect(result.current.status).toBe('done');
    expect(result.current.progress).toEqual({ scanned: 5, total: 5 });
    // All clean elements → no groups
    expect(result.current.groups).toEqual([]);
  });

  it('handles multi-chunk scan with progress updates', async () => {
    const { result } = renderHook(() => usePageScan());

    act(() => {
      result.current.scan();
    });

    // First chunk: 200 of 300 elements
    await act(async () => {
      await mock.resolveLastEval(makeChunkResult(200, 300, 0));
    });

    expect(result.current.status).toBe('scanning');
    expect(result.current.progress).toEqual({ scanned: 200, total: 300 });

    // Second chunk: remaining 100 elements
    await act(async () => {
      await mock.resolveLastEval(makeChunkResult(100, 300, 200));
    });

    expect(result.current.status).toBe('done');
    expect(result.current.progress).toEqual({ scanned: 300, total: 300 });
  });

  it('cancels scan via clear() and ignores stale callback', async () => {
    const { result } = renderHook(() => usePageScan());

    act(() => {
      result.current.scan();
    });
    expect(result.current.status).toBe('scanning');

    act(() => {
      result.current.clear();
    });
    expect(result.current.status).toBe('idle');

    // Stale eval callback arrives after clear — should be ignored
    await act(async () => {
      await mock.resolveLastEval(makeChunkResult(5, 5));
    });
    expect(result.current.status).toBe('idle');
    expect(result.current.groups).toEqual([]);
  });

  it('re-scan cancels the previous in-progress scan', async () => {
    const { result } = renderHook(() => usePageScan());

    // Start first scan
    act(() => {
      result.current.scan();
    });

    // Start second scan before first completes
    act(() => {
      result.current.scan();
    });

    // Resolve the first scan's eval — should be ignored (stale scanId)
    await act(async () => {
      await mock.resolveEvalAt(0, makeChunkResult(5, 5));
    });
    expect(result.current.status).toBe('scanning');

    // Resolve the second scan's eval
    await act(async () => {
      await mock.resolveEvalAt(1, makeChunkResult(3, 3));
    });
    expect(result.current.status).toBe('done');
    expect(result.current.progress).toEqual({ scanned: 3, total: 3 });
  });

  it('sets status="error" when exceptionInfo is present', async () => {
    const { result } = renderHook(() => usePageScan());

    act(() => {
      result.current.scan();
    });

    await act(async () => {
      await mock.resolveLastEval(null, { isError: true });
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Scan failed');
  });

  it('sets status="error" when chunk result fails validation', async () => {
    const { result } = renderHook(() => usePageScan());

    act(() => {
      result.current.scan();
    });

    // Resolve with malformed data — results is not an array
    await act(async () => {
      await mock.resolveLastEval({ results: 'not-an-array', total: 5 });
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Invalid scan result');
  });

  it('inspectElement success keeps inspectError null', async () => {
    const { result } = renderHook(() => usePageScan());

    act(() => {
      result.current.inspectElement(0);
    });

    await act(async () => {
      await mock.resolveLastEval(true);
    });

    expect(result.current.inspectError).toBeNull();
  });

  it('inspectElement failure sets error that auto-clears after 3s', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePageScan());

    act(() => {
      result.current.inspectElement(0);
    });

    await act(async () => {
      await mock.resolveLastEval(false);
    });

    expect(result.current.inspectError).toBe(
      'Element not found — the page may have changed since the scan.',
    );

    // Advance past auto-clear timer
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.inspectError).toBeNull();
  });

  it('inspectElement clears previous timer on re-call', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePageScan());

    // First inspect fails
    act(() => {
      result.current.inspectElement(0);
    });
    await act(async () => {
      await mock.resolveLastEval(false);
    });
    expect(result.current.inspectError).not.toBeNull();

    // Second inspect also fails — should reset timer
    act(() => {
      result.current.inspectElement(1);
    });
    await act(async () => {
      await mock.resolveLastEval(false);
    });

    // Advance 2s — first timer's 3s would have fired, but it was cancelled
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    // Error should still be present (second timer hasn't fired yet)
    expect(result.current.inspectError).not.toBeNull();

    // Advance remaining 1s for second timer
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.inspectError).toBeNull();
  });

  it('inspectElement timer is cleaned up on unmount', async () => {
    vi.useFakeTimers();
    const { result, unmount } = renderHook(() => usePageScan());

    // Trigger inspect failure — starts 3s auto-clear timer
    act(() => {
      result.current.inspectElement(0);
    });
    await act(async () => {
      await mock.resolveLastEval(false);
    });
    expect(result.current.inspectError).not.toBeNull();

    // Capture state before unmount
    const errorBeforeUnmount = result.current.inspectError;

    // Unmount before the 3s timer fires
    unmount();

    // Advance past the auto-clear timer — should not cause stale setState
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    // State must not have changed (timer was cleared on unmount)
    expect(result.current.inspectError).toBe(errorBeforeUnmount);
  });

  it('clear() resets all state to idle', async () => {
    const { result } = renderHook(() => usePageScan());

    act(() => {
      result.current.scan();
    });

    // Resolve scan with violations (alignItems on non-flex container)
    await act(async () => {
      await mock.resolveLastEval(makeChunkResult(1, 1, 0, { alignItems: 'center' }));
    });
    expect(result.current.status).toBe('done');
    expect(result.current.groups.length).toBeGreaterThan(0);

    act(() => {
      result.current.clear();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.groups).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.progress).toEqual({ scanned: 0, total: 0 });
  });

  it('handles empty page gracefully (total=0)', async () => {
    const { result } = renderHook(() => usePageScan());

    act(() => {
      result.current.scan();
    });

    await act(async () => {
      await mock.resolveLastEval({ results: [], total: 0 });
    });

    expect(result.current.status).toBe('done');
    expect(result.current.groups).toEqual([]);
    expect(result.current.progress).toEqual({ scanned: 0, total: 0 });
  });

  it('scan() after done re-scans cleanly', async () => {
    const { result } = renderHook(() => usePageScan());

    // First scan
    act(() => {
      result.current.scan();
    });
    await act(async () => {
      await mock.resolveLastEval(makeChunkResult(3, 3));
    });
    expect(result.current.status).toBe('done');

    // Re-scan
    act(() => {
      result.current.scan();
    });
    expect(result.current.status).toBe('scanning');
    expect(result.current.groups).toEqual([]);
    expect(result.current.progress).toEqual({ scanned: 0, total: 0 });

    await act(async () => {
      await mock.resolveLastEval(makeChunkResult(2, 2));
    });
    expect(result.current.status).toBe('done');
    expect(result.current.progress).toEqual({ scanned: 2, total: 2 });
  });
});
