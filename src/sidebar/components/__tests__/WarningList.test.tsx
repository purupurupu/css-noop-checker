// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import type { Warning } from '../../../rules/types.ts';
import { WarningList } from '../WarningList.tsx';

afterEach(cleanup);

const makeWarning = (overrides: Partial<Warning> = {}): Warning => ({
  ruleId: 'inline-no-dimensions',
  property: 'width',
  severity: 'warning',
  title: 'Width has no effect on inline elements',
  details: 'Inline elements ignore width.',
  suggestion: 'Use display: inline-block or block.',
  ...overrides,
});

describe('WarningList', () => {
  it('returns null when status is no-selection', () => {
    const { container } = render(<WarningList warnings={[]} status="no-selection" />);
    expect(container.innerHTML).toBe('');
  });

  it('shows error message when status is error', () => {
    render(<WarningList warnings={[]} status="error" />);
    screen.getByText('Analysis failed. Try selecting another element.');
  });

  it('shows "Analyzing..." when status is analyzing', () => {
    render(<WarningList warnings={[]} status="analyzing" />);
    screen.getByText('Analyzing...');
  });

  it('shows "No issues detected" when status is ready with empty warnings', () => {
    render(<WarningList warnings={[]} status="ready" />);
    screen.getByText('No issues detected.');
  });

  it('renders WarningCard for each warning when ready with warnings', () => {
    const warnings: Warning[] = [
      makeWarning({ ruleId: 'inline-no-dimensions', property: 'width', title: 'Width no-op' }),
      makeWarning({
        ruleId: 'inline-no-vertical-margin',
        property: 'margin-top',
        title: 'Margin no-op',
      }),
    ];
    render(<WarningList warnings={warnings} status="ready" />);
    screen.getByText('Width no-op');
    screen.getByText('Margin no-op');
  });

  it('does not render "No issues detected" when there are warnings', () => {
    render(<WarningList warnings={[makeWarning()]} status="ready" />);
    expect(screen.queryByText('No issues detected.')).toBeNull();
  });
});
