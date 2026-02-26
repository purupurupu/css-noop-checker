// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import type { ScanViolation } from '../../types.ts';
import { ScanViolationRow } from '../ScanViolationRow.tsx';

afterEach(cleanup);

const makeViolation = (overrides: Partial<ScanViolation> = {}): ScanViolation => ({
  index: 0,
  selector: 'div.container',
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
  ...overrides,
});

describe('ScanViolationRow', () => {
  it('renders the selector in a code element', () => {
    render(<ScanViolationRow violation={makeViolation()} onInspect={vi.fn()} />);
    const code = screen.getByText('div.container');
    expect(code.tagName).toBe('CODE');
  });

  it('renders joined property names from warnings', () => {
    const violation = makeViolation({
      warnings: [
        {
          ruleId: 'r1',
          property: 'width',
          severity: 'warning',
          title: 't',
          details: 'd',
          suggestion: 's',
        },
        {
          ruleId: 'r2',
          property: 'height',
          severity: 'warning',
          title: 't',
          details: 'd',
          suggestion: 's',
        },
      ],
    });
    render(<ScanViolationRow violation={violation} onInspect={vi.fn()} />);
    screen.getByText('width, height');
  });

  it('calls onInspect when clicked', () => {
    const onInspect = vi.fn();
    render(<ScanViolationRow violation={makeViolation()} onInspect={onInspect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onInspect).toHaveBeenCalledTimes(1);
  });

  it('has correct aria-label with selector and single property', () => {
    const { container } = render(
      <ScanViolationRow violation={makeViolation()} onInspect={vi.fn()} />,
    );
    const button = container.querySelector('button[aria-label="Inspect div.container: width"]');
    expect(button).not.toBeNull();
  });

  it('has correct aria-label with selector and multiple properties', () => {
    const violation = makeViolation({
      warnings: [
        {
          ruleId: 'r1',
          property: 'width',
          severity: 'warning',
          title: 't',
          details: 'd',
          suggestion: 's',
        },
        {
          ruleId: 'r2',
          property: 'height',
          severity: 'warning',
          title: 't',
          details: 'd',
          suggestion: 's',
        },
      ],
    });
    const { container } = render(<ScanViolationRow violation={violation} onInspect={vi.fn()} />);
    const button = container.querySelector(
      'button[aria-label="Inspect div.container: width, height"]',
    );
    expect(button).not.toBeNull();
  });
});
