// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import type { ScanGroup } from '../../types.ts';
import { ScanRuleGroup } from '../ScanRuleGroup.tsx';

afterEach(cleanup);

vi.mock('../../../rules/registry.ts', () => ({
  getRuleLabel: (id: string) => `Label for ${id}`,
}));

const makeGroup = (overrides: Partial<ScanGroup> = {}): ScanGroup => ({
  ruleId: 'inline-no-dimensions',
  violations: [
    {
      index: 0,
      selector: 'span.item',
      warnings: [
        {
          ruleId: 'inline-no-dimensions',
          property: 'width',
          severity: 'warning',
          title: 'Width no-op',
          details: 'Details',
          suggestion: 'Suggestion',
        },
      ],
    },
  ],
  ...overrides,
});

describe('ScanRuleGroup', () => {
  const defaultProps = {
    group: makeGroup(),
    defaultOpen: false,
    onInspect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the ruleId badge', () => {
    render(<ScanRuleGroup {...defaultProps} />);
    screen.getByText('inline-no-dimensions');
  });

  it('renders the label from getRuleLabel', () => {
    render(<ScanRuleGroup {...defaultProps} />);
    screen.getByText('Label for inline-no-dimensions');
  });

  it('renders the violation count', () => {
    render(<ScanRuleGroup {...defaultProps} />);
    screen.getByText('(1)');
  });

  it('starts collapsed when defaultOpen is false', () => {
    const { container } = render(<ScanRuleGroup {...defaultProps} defaultOpen={false} />);
    const button = container.querySelector('button[aria-expanded="false"]');
    expect(button).not.toBeNull();
    expect(screen.queryByText('span.item')).toBeNull();
  });

  it('starts expanded when defaultOpen is true', () => {
    const { container } = render(<ScanRuleGroup {...defaultProps} defaultOpen={true} />);
    const button = container.querySelector('button[aria-expanded="true"]');
    expect(button).not.toBeNull();
    screen.getByText('span.item');
  });

  it('toggles expand/collapse on header click', () => {
    const { container } = render(<ScanRuleGroup {...defaultProps} defaultOpen={false} />);
    const button = container.querySelector('.scan-rule-group__header')!;

    // Expand
    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    screen.getByText('span.item');

    // Collapse
    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('span.item')).toBeNull();
  });

  it('shows "and X more" when violations exceed DISPLAY_LIMIT and renders exactly 50 rows', () => {
    const violations = Array.from({ length: 55 }, (_, i) => ({
      index: i,
      selector: `div.item-${i}`,
      warnings: [
        {
          ruleId: 'inline-no-dimensions',
          property: 'width',
          severity: 'warning' as const,
          title: 'No-op',
          details: 'Details',
          suggestion: 'Suggestion',
        },
      ],
    }));
    const group = makeGroup({ violations });

    const { container } = render(
      <ScanRuleGroup group={group} defaultOpen={true} onInspect={vi.fn()} />,
    );

    // Should show count (55) in header
    screen.getByText('(55)');
    // Should show overflow message (hellip renders as ...)
    screen.getByText(/and 5 more/);
    // Should render exactly 50 violation rows (DISPLAY_LIMIT)
    const rows = container.querySelectorAll('.scan-violation-row');
    expect(rows.length).toBe(50);
  });

  it('does not show overflow message when violations equal DISPLAY_LIMIT', () => {
    const violations = Array.from({ length: 50 }, (_, i) => ({
      index: i,
      selector: `div.item-${i}`,
      warnings: [
        {
          ruleId: 'inline-no-dimensions',
          property: 'width',
          severity: 'warning' as const,
          title: 'No-op',
          details: 'Details',
          suggestion: 'Suggestion',
        },
      ],
    }));
    const group = makeGroup({ violations });

    const { container } = render(
      <ScanRuleGroup group={group} defaultOpen={true} onInspect={vi.fn()} />,
    );

    // Should show count (50) in header
    screen.getByText('(50)');
    // Should NOT show overflow message at exactly 50
    expect(screen.queryByText(/and \d+ more/)).toBeNull();
    // Should render all 50 violation rows
    const rows = container.querySelectorAll('.scan-violation-row');
    expect(rows.length).toBe(50);
  });

  it('does not show overflow message when violations are within DISPLAY_LIMIT', () => {
    render(<ScanRuleGroup {...defaultProps} defaultOpen={true} />);
    expect(screen.queryByText(/and \d+ more/)).toBeNull();
  });

  it('calls onInspect with correct violation when a violation row is clicked (index=0)', () => {
    const onInspect = vi.fn();
    const { container } = render(
      <ScanRuleGroup {...defaultProps} defaultOpen={true} onInspect={onInspect} />,
    );

    // Click the violation row button
    const violationButton = container.querySelector('.scan-violation-row');
    fireEvent.click(violationButton!);
    expect(onInspect).toHaveBeenCalledWith(defaultProps.group.violations[0]);
  });

  it('calls onInspect with non-zero index violation to verify violation is passed through', () => {
    const onInspect = vi.fn();
    const group = makeGroup({
      violations: [
        {
          index: 42,
          selector: 'div.deep-nested',
          warnings: [
            {
              ruleId: 'inline-no-dimensions',
              property: 'width',
              severity: 'warning',
              title: 'Width no-op',
              details: 'Details',
              suggestion: 'Suggestion',
            },
          ],
        },
      ],
    });
    const { container } = render(
      <ScanRuleGroup group={group} defaultOpen={true} onInspect={onInspect} />,
    );

    const violationButton = container.querySelector('.scan-violation-row');
    fireEvent.click(violationButton!);
    expect(onInspect).toHaveBeenCalledWith(group.violations[0]);
  });

  it('aria-controls on header matches body region id', () => {
    const { container } = render(<ScanRuleGroup {...defaultProps} defaultOpen={true} />);
    const header = container.querySelector('.scan-rule-group__header')!;
    const controlsId = header.getAttribute('aria-controls');
    const body = container.querySelector(`#${controlsId}`);
    expect(body).not.toBeNull();
    expect(body!.getAttribute('role')).toBe('region');
  });
});
