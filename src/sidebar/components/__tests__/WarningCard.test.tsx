// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import type { Warning } from '../../../rules/types.ts';
import { WarningCard } from '../WarningCard.tsx';

afterEach(cleanup);

const makeWarning = (overrides: Partial<Warning> = {}): Warning => ({
  ruleId: 'inline-no-dimensions',
  property: 'width',
  severity: 'warning',
  title: 'Width has no effect',
  details: 'Inline elements ignore width.',
  suggestion: 'Use display: inline-block.',
  ...overrides,
});

describe('WarningCard', () => {
  it('renders the title', () => {
    render(<WarningCard warning={makeWarning({ title: 'Test title' })} />);
    screen.getByText('Test title');
  });

  it('renders the details', () => {
    render(<WarningCard warning={makeWarning({ details: 'Some details here' })} />);
    screen.getByText('Some details here');
  });

  it('renders the suggestion', () => {
    render(<WarningCard warning={makeWarning({ suggestion: 'Try this instead' })} />);
    screen.getByText('Try this instead');
  });

  it('renders the ruleId', () => {
    render(<WarningCard warning={makeWarning({ ruleId: 'container-no-gap' })} />);
    screen.getByText('container-no-gap');
  });

  it('renders warning icon with aria-label', () => {
    const { container } = render(<WarningCard warning={makeWarning()} />);
    const icon = container.querySelector('[aria-label="warning"]');
    expect(icon).not.toBeNull();
  });
});
