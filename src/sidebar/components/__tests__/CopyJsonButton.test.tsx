// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import type { Warning } from '../../../rules/types.ts';
import { CopyJsonButton } from '../CopyJsonButton.tsx';

afterEach(cleanup);

const makeWarning = (overrides: Partial<Warning> = {}): Warning => ({
  ruleId: 'inline-no-dimensions',
  property: 'width',
  severity: 'warning',
  title: 'width has no effect',
  details: 'width has no effect on inline elements',
  suggestion: 'Use display: inline-block or block',
  ...overrides,
});

function mockClipboard(writeText: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    writable: true,
    configurable: true,
  });
}

describe('CopyJsonButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with "Copy JSON" label by default', () => {
    render(<CopyJsonButton data={[]} />);
    expect(screen.getByText('Copy JSON')).toBeDefined();
  });

  it('has correct aria-label in idle state', () => {
    render(<CopyJsonButton data={[]} />);
    expect(screen.getByLabelText('Copy JSON to clipboard')).toBeDefined();
  });

  it('shows "Copied!" after successful clipboard write', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);

    const warnings = [makeWarning()];
    render(<CopyJsonButton data={warnings} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copy JSON'));
    });

    expect(screen.getByText('Copied!')).toBeDefined();
    expect(screen.getByLabelText('JSON copied to clipboard')).toBeDefined();
    expect(writeText).toHaveBeenCalledWith(JSON.stringify(warnings, null, 2));
  });

  it('falls back to execCommand when clipboard API fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    mockClipboard(writeText);

    // happy-dom lacks execCommand — define it on document
    const execCommand = vi.fn().mockReturnValue(true);
    document.execCommand = execCommand;

    render(<CopyJsonButton data={[makeWarning()]} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copy JSON'));
    });

    expect(screen.getByText('Copied!')).toBeDefined();
    expect(execCommand).toHaveBeenCalledWith('copy');
  });

  it('shows "Failed" when both clipboard API and execCommand fail', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    mockClipboard(writeText);

    document.execCommand = vi.fn().mockReturnValue(false);

    render(<CopyJsonButton data={[makeWarning()]} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copy JSON'));
    });

    expect(screen.getByText('Failed')).toBeDefined();
    expect(screen.getByLabelText('Failed to copy JSON')).toBeDefined();
  });

  it('resets to idle after 1500ms', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);

    render(<CopyJsonButton data={[makeWarning()]} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copy JSON'));
    });

    expect(screen.getByText('Copied!')).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText('Copy JSON')).toBeDefined();
  });

  it('shows "Failed" when JSON.stringify throws (e.g. circular reference)', async () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const circular: Record<string, unknown> = { a: 1 };
    circular.self = circular;

    // @ts-expect-error intentionally passing circular reference to test error handling
    render(<CopyJsonButton data={circular} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copy JSON'));
    });

    expect(screen.getByText('Failed')).toBeDefined();
    expect(consoleWarn).toHaveBeenCalled();
    consoleWarn.mockRestore();
  });

  it('serializes data as pretty-printed JSON', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);

    const data = [makeWarning({ property: 'height' })];
    render(<CopyJsonButton data={data} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copy JSON'));
    });

    expect(writeText).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
  });
});
