// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary.tsx';

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

/** Helper component that throws on demand. */
let shouldThrow = false;

function ThrowingChild() {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Child content</div>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    shouldThrow = false;
    // Suppress React error boundary console.error noise in test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Hello</div>
      </ErrorBoundary>,
    );
    screen.getByText('Hello');
  });

  it('shows "Something went wrong" when a child throws', () => {
    shouldThrow = true;
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );
    screen.getByText('Something went wrong');
  });

  it('shows the error message when a child throws', () => {
    shouldThrow = true;
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );
    screen.getByText('Test error message');
  });

  it('shows a Retry button when in error state', () => {
    shouldThrow = true;
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );
    screen.getByText('Retry');
  });

  it('calls console.error at least once when a child throws', () => {
    shouldThrow = true;
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );
    // React calls console.error for the error boundary + componentDidCatch logs once
    // We verify console.error was actually called (not zero times)
    expect(console.error).toHaveBeenCalled();
  });

  it('recovers and re-renders children when Retry is clicked', () => {
    shouldThrow = true;
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    screen.getByText('Something went wrong');

    // Fix the error condition and click Retry
    shouldThrow = false;
    fireEvent.click(screen.getByText('Retry'));

    // Verify error UI is gone and children are rendered
    screen.getByText('Child content');
    expect(screen.queryByText('Something went wrong')).toBeNull();
    expect(screen.queryByText('Retry')).toBeNull();
  });
});
