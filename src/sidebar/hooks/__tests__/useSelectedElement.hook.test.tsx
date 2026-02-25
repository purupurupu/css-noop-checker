// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
// Ensure rules are registered so isElementData checks required properties
import '../../../rules/engine.ts';
import { getAllRequiredProperties } from '../../../rules/registry.ts';
import { useSelectedElement } from '../useSelectedElement.ts';
import { createChromeMock } from './chrome-mock.ts';

const DEBOUNCE_MS = 150;

/** Build a base computedStyles object that satisfies isElementData for any registered rules. */
function makeBaseStyles(overrides: Record<string, string> = {}): Record<string, string> {
  const styles: Record<string, string> = {};
  for (const key of getAllRequiredProperties()) {
    styles[key] = 'normal';
  }
  return { ...styles, display: 'block', width: 'auto', height: 'auto', ...overrides };
}

const validElementData = {
  tagName: 'div',
  id: 'app',
  classList: ['container'],
  computedStyles: makeBaseStyles(),
};

describe('useSelectedElement (hook integration)', () => {
  let mock: ReturnType<typeof createChromeMock>;

  beforeEach(() => {
    vi.useFakeTimers();
    mock = createChromeMock();
    vi.stubGlobal('chrome', mock.chrome);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('triggers eval after 150ms debounce on mount', async () => {
    renderHook(() => useSelectedElement());

    expect(mock.evalMock).not.toHaveBeenCalled();
    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });
    expect(mock.evalMock).toHaveBeenCalledTimes(1);
  });

  it('sets data and status="ready" on successful eval', async () => {
    const { result } = renderHook(() => useSelectedElement());

    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });
    await act(async () => {
      await mock.resolveLastEval(validElementData);
    });

    expect(result.current.data).toEqual(validElementData);
    expect(result.current.status).toBe('ready');
  });

  it('sets status="no-selection" when result is null', async () => {
    const { result } = renderHook(() => useSelectedElement());

    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });
    await act(async () => {
      await mock.resolveLastEval(null);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.status).toBe('no-selection');
  });

  it('sets status="error" when exceptionInfo is present', async () => {
    const { result } = renderHook(() => useSelectedElement());

    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });
    await act(async () => {
      await mock.resolveLastEval(null, { isError: true });
    });

    expect(result.current.data).toBeNull();
    expect(result.current.status).toBe('error');
  });

  it('sets status="error" when data fails isElementData validation', async () => {
    const { result } = renderHook(() => useSelectedElement());

    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });
    await act(async () => {
      await mock.resolveLastEval({ tagName: 'div' }); // missing required fields
    });

    expect(result.current.data).toBeNull();
    expect(result.current.status).toBe('error');
  });

  it('ignores stale eval callback resolved after a newer one', async () => {
    const { result } = renderHook(() => useSelectedElement());

    // First eval (mount debounce)
    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });
    expect(mock.evalMock).toHaveBeenCalledTimes(1);

    // Trigger second eval via selection change
    act(() => {
      mock.triggerSelectionChange();
    });
    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });
    expect(mock.evalMock).toHaveBeenCalledTimes(2);

    // Resolve second (newer) eval first
    await act(async () => {
      await mock.resolveEvalAt(1, validElementData);
    });
    expect(result.current.status).toBe('ready');
    expect(result.current.data).toEqual(validElementData);

    // Now resolve first (stale) eval — should be ignored
    await act(async () => {
      await mock.resolveEvalAt(0, null);
    });
    expect(result.current.status).toBe('ready');
    expect(result.current.data).toEqual(validElementData);
  });

  it('re-evaluates with debounce on selection change', async () => {
    renderHook(() => useSelectedElement());

    // Initial eval
    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });
    expect(mock.evalMock).toHaveBeenCalledTimes(1);

    // Selection change triggers new debounced eval
    act(() => {
      mock.triggerSelectionChange();
    });
    expect(mock.evalMock).toHaveBeenCalledTimes(1); // not yet
    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });
    expect(mock.evalMock).toHaveBeenCalledTimes(2);
  });

  it('coalesces multiple rapid selection changes into a single eval', async () => {
    renderHook(() => useSelectedElement());

    // Initial eval
    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });
    expect(mock.evalMock).toHaveBeenCalledTimes(1);

    // 3 rapid selection changes within debounce window
    act(() => {
      mock.triggerSelectionChange();
    });
    await act(async () => {
      vi.advanceTimersByTime(50);
    });
    act(() => {
      mock.triggerSelectionChange();
    });
    await act(async () => {
      vi.advanceTimersByTime(50);
    });
    act(() => {
      mock.triggerSelectionChange();
    });
    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });

    // Only one additional eval (not three)
    expect(mock.evalMock).toHaveBeenCalledTimes(2);
  });

  it('removes listener and invalidates pending eval on unmount', async () => {
    const { result, unmount } = renderHook(() => useSelectedElement());

    // Trigger eval
    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });
    expect(mock.evalMock).toHaveBeenCalledTimes(1);

    // Capture state before unmount — should be 'analyzing' with no data
    expect(result.current.status).toBe('analyzing');
    const statusBeforeUnmount = result.current.status;
    const dataBeforeUnmount = result.current.data;

    unmount();

    // Verify listener was removed
    expect(
      mock.chrome.devtools.panels.elements.onSelectionChanged.removeListener,
    ).toHaveBeenCalled();

    // Resolve the eval after unmount — stale guard must prevent state mutation
    await act(async () => {
      await mock.resolveLastEval(validElementData);
    });

    // State must not have changed (stale guard blocked the callback)
    expect(result.current.status).toBe(statusBeforeUnmount);
    expect(result.current.data).toBe(dataBeforeUnmount);
  });
});
