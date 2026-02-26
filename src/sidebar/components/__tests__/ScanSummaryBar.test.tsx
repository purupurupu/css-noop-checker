// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { ScanSummaryBar } from '../ScanSummaryBar.tsx';

afterEach(cleanup);

describe('ScanSummaryBar', () => {
  const defaultProps = {
    totalViolations: 5,
    totalElements: 3,
    ruleCount: 2,
    onClear: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays violation count in the strong element', () => {
    const { container } = render(<ScanSummaryBar {...defaultProps} />);
    const countEl = container.querySelector('.scan-summary__count');
    expect(countEl?.textContent).toBe('5');
  });

  it('displays summary text with elements and rules', () => {
    const { container } = render(<ScanSummaryBar {...defaultProps} />);
    const summarySpan = container.querySelector('.scan-summary > span');
    expect(summarySpan?.textContent).toContain('3 elements');
    expect(summarySpan?.textContent).toContain('2 rules');
  });

  it('renders clear button with correct aria-label', () => {
    const { container } = render(<ScanSummaryBar {...defaultProps} />);
    const button = container.querySelector('button[aria-label="Clear results"]');
    expect(button).not.toBeNull();
  });

  it('calls onClear when clear button is clicked', () => {
    const onClear = vi.fn();
    const { container } = render(<ScanSummaryBar {...defaultProps} onClear={onClear} />);
    const button = container.querySelector('button[aria-label="Clear results"]');
    fireEvent.click(button!);
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
