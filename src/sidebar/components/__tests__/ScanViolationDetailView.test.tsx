// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import type { ScanViolation } from '../../types.ts';
import { ScanViolationDetailView } from '../ScanViolationDetailView.tsx';

afterEach(cleanup);

const makeViolation = (overrides: Partial<ScanViolation> = {}): ScanViolation => ({
  index: 0,
  selector: 'div.container',
  warnings: [
    {
      ruleId: 'inline-no-dimensions',
      property: 'width',
      severity: 'warning',
      title: 'Width has no effect',
      details: 'Inline elements ignore width.',
      suggestion: 'Use display: inline-block.',
    },
  ],
  ...overrides,
});

describe('ScanViolationDetailView', () => {
  it('renders back button that calls onBack when clicked', () => {
    const onBack = vi.fn();
    render(
      <ScanViolationDetailView violation={makeViolation()} inspectError={null} onBack={onBack} />,
    );

    const backButton = screen.getByRole('button', { name: /back to results/i });
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders the violation selector in a code element', () => {
    render(
      <ScanViolationDetailView
        violation={makeViolation({ selector: 'span.highlight' })}
        inspectError={null}
        onBack={vi.fn()}
      />,
    );

    const code = screen.getByText('span.highlight');
    expect(code.tagName).toBe('CODE');
  });

  it('renders WarningCard for each warning', () => {
    const violation = makeViolation({
      warnings: [
        {
          ruleId: 'inline-no-dimensions',
          property: 'width',
          severity: 'warning',
          title: 'Width has no effect',
          details: 'Details for width',
          suggestion: 'Suggestion for width',
        },
        {
          ruleId: 'inline-no-dimensions',
          property: 'height',
          severity: 'warning',
          title: 'Height has no effect',
          details: 'Details for height',
          suggestion: 'Suggestion for height',
        },
      ],
    });

    render(<ScanViolationDetailView violation={violation} inspectError={null} onBack={vi.fn()} />);

    screen.getByText('Width has no effect');
    screen.getByText('Height has no effect');
  });

  it('renders inspectError when provided', () => {
    render(
      <ScanViolationDetailView
        violation={makeViolation()}
        inspectError="Could not inspect element"
        onBack={vi.fn()}
      />,
    );

    const errorEl = screen.getByRole('alert');
    expect(errorEl.textContent).toBe('Could not inspect element');
  });

  it('focuses the back button on mount', () => {
    render(
      <ScanViolationDetailView violation={makeViolation()} inspectError={null} onBack={vi.fn()} />,
    );
    const backButton = screen.getByRole('button', { name: /back to results/i });
    expect(document.activeElement).toBe(backButton);
  });

  it('does not render error when inspectError is null', () => {
    render(
      <ScanViolationDetailView violation={makeViolation()} inspectError={null} onBack={vi.fn()} />,
    );

    expect(screen.queryByRole('alert')).toBeNull();
  });
});
