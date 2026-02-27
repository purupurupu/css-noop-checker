// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInspectElement } from '../useInspectElement.ts';
import { createChromeMock } from './chrome-mock.ts';

describe('useInspectElement', () => {
  let mock: ReturnType<typeof createChromeMock>;

  beforeEach(() => {
    mock = createChromeMock();
    vi.stubGlobal('chrome', mock.chrome);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('inspectElement success keeps inspectError null', async () => {
    const { result } = renderHook(() => useInspectElement());

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
    const { result } = renderHook(() => useInspectElement());

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
    const { result } = renderHook(() => useInspectElement());

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

  it('clearInspectError clears error and cancels auto-clear timer', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useInspectElement());

    act(() => {
      result.current.inspectElement(0);
    });
    await act(async () => {
      await mock.resolveLastEval(false);
    });
    expect(result.current.inspectError).not.toBeNull();

    act(() => {
      result.current.clearInspectError();
    });
    expect(result.current.inspectError).toBeNull();
  });

  it('inspectElement timer is cleaned up on unmount', async () => {
    vi.useFakeTimers();
    const { result, unmount } = renderHook(() => useInspectElement());

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
});
