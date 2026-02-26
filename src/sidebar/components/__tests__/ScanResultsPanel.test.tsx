// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import type { ScanGroup, ScanProgress, ScanStatus } from '../../types.ts';
import { ScanResultsPanel } from '../ScanResultsPanel.tsx';

afterEach(cleanup);

vi.mock('../../../rules/registry.ts', () => ({
  getRuleLabel: (id: string) => `Label for ${id}`,
}));

const makeGroup = (ruleId: string, violationCount: number, startIndex = 0): ScanGroup => ({
  ruleId,
  violations: Array.from({ length: violationCount }, (_, i) => ({
    index: startIndex + i,
    selector: `div.item-${startIndex + i}`,
    warnings: [
      {
        ruleId,
        property: 'width',
        severity: 'warning' as const,
        title: 'No-op',
        details: 'Details',
        suggestion: 'Suggestion',
      },
    ],
  })),
});

const defaultProps = {
  groups: [] as ScanGroup[],
  status: 'idle' as ScanStatus,
  error: null as string | null,
  inspectError: null as string | null,
  progress: { scanned: 0, total: 0 } as ScanProgress,
  onInspect: vi.fn(),
  onClear: vi.fn(),
};

describe('ScanResultsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when status is idle', () => {
    const { container } = render(<ScanResultsPanel {...defaultProps} status="idle" />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when status is idle even with groups', () => {
    const groups = [makeGroup('inline-no-dimensions', 2)];
    const { container } = render(
      <ScanResultsPanel {...defaultProps} status="idle" groups={groups} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows scanning message with progress', () => {
    render(
      <ScanResultsPanel {...defaultProps} status="scanning" progress={{ scanned: 5, total: 10 }} />,
    );
    screen.getByText('Scanning\u2026 (5/10 elements)');
  });

  it('shows scanning message without progress when total is 0', () => {
    render(
      <ScanResultsPanel {...defaultProps} status="scanning" progress={{ scanned: 0, total: 0 }} />,
    );
    screen.getByText('Scanning\u2026');
  });

  it('shows Cancel button during scanning', () => {
    render(<ScanResultsPanel {...defaultProps} status="scanning" />);
    screen.getByText('Cancel');
  });

  it('calls onClear when Cancel is clicked during scanning', () => {
    const onClear = vi.fn();
    render(<ScanResultsPanel {...defaultProps} status="scanning" onClear={onClear} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('shows error message when status is error', () => {
    render(<ScanResultsPanel {...defaultProps} status="error" error="Something broke" />);
    screen.getByText('Something broke');
  });

  it('shows fallback error message when error is null', () => {
    render(<ScanResultsPanel {...defaultProps} status="error" error={null} />);
    screen.getByText('Scan failed');
  });

  it('shows Back button when status is error', () => {
    render(<ScanResultsPanel {...defaultProps} status="error" />);
    screen.getByText('Back');
  });

  it('calls onClear when Back is clicked in error state', () => {
    const onClear = vi.fn();
    render(<ScanResultsPanel {...defaultProps} status="error" onClear={onClear} />);
    fireEvent.click(screen.getByText('Back'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('shows "No violations found." when done with empty groups', () => {
    render(<ScanResultsPanel {...defaultProps} status="done" groups={[]} />);
    screen.getByText('No violations found.');
  });

  it('shows Back button when done with no violations', () => {
    render(<ScanResultsPanel {...defaultProps} status="done" groups={[]} />);
    screen.getByText('Back');
  });

  it('calls onClear when Back is clicked in done-empty state', () => {
    const onClear = vi.fn();
    render(<ScanResultsPanel {...defaultProps} status="done" groups={[]} onClear={onClear} />);
    fireEvent.click(screen.getByText('Back'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('renders ScanSummaryBar with correct counts when done with results', () => {
    const groups = [makeGroup('inline-no-dimensions', 2), makeGroup('container-no-gap', 3, 2)];
    const { container } = render(
      <ScanResultsPanel {...defaultProps} status="done" groups={groups} />,
    );

    // ScanSummaryBar shows total violations via <strong> element
    const countEl = container.querySelector('.scan-summary__count');
    expect(countEl?.textContent).toBe('5');
    // Verify unique element count (5 unique indices: 0,1,2,3,4)
    const summarySpan = container.querySelector('.scan-summary > span');
    expect(summarySpan).not.toBeNull();
    expect(summarySpan!.textContent).toContain('5 elements');
    // Verify rule count
    expect(summarySpan!.textContent).toContain('2 rules');
    // ScanRuleGroup renders rule badges
    screen.getByText('inline-no-dimensions');
    screen.getByText('container-no-gap');
  });

  it('deduplicates overlapping element indices in uniqueElements count', () => {
    // Both groups share element indices 0 and 1
    const groups = [
      makeGroup('inline-no-dimensions', 3, 0), // indices: 0, 1, 2
      makeGroup('container-no-gap', 3, 1), // indices: 1, 2, 3
    ];
    const { container } = render(
      <ScanResultsPanel {...defaultProps} status="done" groups={groups} />,
    );

    // Total violations = 6, but unique elements = 4 (indices: 0, 1, 2, 3)
    const countEl = container.querySelector('.scan-summary__count');
    expect(countEl?.textContent).toBe('6');
    const summarySpan = container.querySelector('.scan-summary > span');
    expect(summarySpan).not.toBeNull();
    expect(summarySpan!.textContent).toContain('4 elements');
  });

  it('renders inspectError alert when present', () => {
    const groups = [makeGroup('inline-no-dimensions', 1)];
    const { container } = render(
      <ScanResultsPanel
        {...defaultProps}
        status="done"
        groups={groups}
        inspectError="Could not inspect element"
      />,
    );
    const alert = container.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    screen.getByText('Could not inspect element');
  });

  it('does not render inspectError when null', () => {
    const groups = [makeGroup('inline-no-dimensions', 1)];
    const { container } = render(
      <ScanResultsPanel {...defaultProps} status="done" groups={groups} inspectError={null} />,
    );
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it('first group is defaultOpen, second is collapsed', () => {
    const groups = [makeGroup('rule-a', 1), makeGroup('rule-b', 1, 1)];
    const { container } = render(
      <ScanResultsPanel {...defaultProps} status="done" groups={groups} />,
    );

    const headerButtons = container.querySelectorAll('.scan-rule-group__header');
    expect(headerButtons[0].getAttribute('aria-expanded')).toBe('true');
    expect(headerButtons[1].getAttribute('aria-expanded')).toBe('false');
  });
});
