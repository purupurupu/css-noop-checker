// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import type { ElementData, Warning } from '../../../rules/types.ts';
import type { AnalysisStatus } from '../../hooks/useSelectedElement.ts';
import type { ScanStatus, ViewMode } from '../../types.ts';
import { PanelHeader } from '../PanelHeader.tsx';

afterEach(cleanup);

const makeElementData = (overrides: Partial<ElementData> = {}): ElementData => ({
  tagName: 'div',
  id: '',
  classList: [],
  computedStyles: {},
  parent: null,
  ...overrides,
});

describe('PanelHeader', () => {
  const elementData: ElementData | null = null;
  const status: AnalysisStatus = 'no-selection';
  const scanStatus: ScanStatus = 'idle';
  const warnings: Warning[] = [];

  const defaultProps = {
    elementData,
    status,
    scanStatus,
    warnings,
    viewMode: 'element' as ViewMode,
    onScan: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows "No element selected" when elementData is null', () => {
    render(<PanelHeader {...defaultProps} />);
    screen.getByText('No element selected');
  });

  it('displays tagName only when no id or classes', () => {
    render(<PanelHeader {...defaultProps} elementData={makeElementData({ tagName: 'span' })} />);
    screen.getByText('span');
  });

  it('displays tagName#id when id is present', () => {
    render(
      <PanelHeader
        {...defaultProps}
        elementData={makeElementData({ tagName: 'div', id: 'app' })}
      />,
    );
    screen.getByText('div#app');
  });

  it('displays tagName.class1.class2 when classes are present', () => {
    render(
      <PanelHeader
        {...defaultProps}
        elementData={makeElementData({ tagName: 'div', classList: ['foo', 'bar'] })}
      />,
    );
    screen.getByText('div.foo.bar');
  });

  it('displays full selector tagName#id.class', () => {
    render(
      <PanelHeader
        {...defaultProps}
        elementData={makeElementData({ tagName: 'section', id: 'main', classList: ['active'] })}
      />,
    );
    screen.getByText('section#main.active');
  });

  it('shows correct status label for each AnalysisStatus', () => {
    const statuses: [AnalysisStatus, string][] = [
      ['no-selection', 'No selection'],
      ['analyzing', 'Analyzing...'],
      ['ready', 'Ready'],
      ['error', 'Error'],
    ];

    for (const [status, label] of statuses) {
      const { unmount } = render(<PanelHeader {...defaultProps} status={status} />);
      screen.getByText(label);
      unmount();
    }
  });

  it('applies dynamic CSS class based on status', () => {
    const { container } = render(<PanelHeader {...defaultProps} status="analyzing" />);
    const statusSpan = container.querySelector('.panel-header__status--analyzing');
    expect(statusSpan).not.toBeNull();
  });

  it('shows "Scan Page" button when not scanning', () => {
    render(<PanelHeader {...defaultProps} scanStatus="idle" />);
    const button = screen.getByText('Scan Page');
    expect(button.hasAttribute('disabled')).toBe(false);
  });

  it('shows "Scanning\u2026" and disables button when scanStatus is scanning', () => {
    render(<PanelHeader {...defaultProps} scanStatus="scanning" />);
    const button = screen.getByText('Scanning\u2026');
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('calls onScan when Scan Page button is clicked', () => {
    const onScan = vi.fn();
    render(<PanelHeader {...defaultProps} onScan={onScan} />);
    fireEvent.click(screen.getByText('Scan Page'));
    expect(onScan).toHaveBeenCalledTimes(1);
  });

  it('does not call onScan when button is disabled (scanning)', () => {
    const onScan = vi.fn();
    render(<PanelHeader {...defaultProps} scanStatus="scanning" onScan={onScan} />);
    fireEvent.click(screen.getByText('Scanning\u2026'));
    expect(onScan).not.toHaveBeenCalled();
  });

  it('hides Scan Page button when viewMode is "scan"', () => {
    render(<PanelHeader {...defaultProps} viewMode="scan" />);
    expect(screen.queryByText('Scan Page')).toBeNull();
  });

  it('hides Scan Page button when viewMode is "scan-detail"', () => {
    render(<PanelHeader {...defaultProps} viewMode="scan-detail" />);
    expect(screen.queryByText('Scan Page')).toBeNull();
  });

  describe('Copy JSON button visibility', () => {
    const warning: Warning = {
      ruleId: 'inline-no-dimensions',
      property: 'width',
      severity: 'warning',
      title: 'width has no effect',
      details: 'width has no effect on inline elements',
      suggestion: 'Use display: inline-block or block',
    };

    it('shows Copy JSON when viewMode=element, status=ready, and warnings exist', () => {
      render(<PanelHeader {...defaultProps} status="ready" warnings={[warning]} />);
      expect(screen.queryByLabelText('Copy JSON to clipboard')).not.toBeNull();
    });

    it('hides Copy JSON when warnings are empty', () => {
      render(<PanelHeader {...defaultProps} status="ready" warnings={[]} />);
      expect(screen.queryByLabelText('Copy JSON to clipboard')).toBeNull();
    });

    it('hides Copy JSON when status is not ready', () => {
      render(<PanelHeader {...defaultProps} status="analyzing" warnings={[warning]} />);
      expect(screen.queryByLabelText('Copy JSON to clipboard')).toBeNull();
    });

    it('hides Copy JSON when viewMode is scan', () => {
      render(<PanelHeader {...defaultProps} viewMode="scan" status="ready" warnings={[warning]} />);
      expect(screen.queryByLabelText('Copy JSON to clipboard')).toBeNull();
    });

    it('hides Copy JSON when viewMode is scan-detail', () => {
      render(
        <PanelHeader
          {...defaultProps}
          viewMode="scan-detail"
          status="ready"
          warnings={[warning]}
        />,
      );
      expect(screen.queryByLabelText('Copy JSON to clipboard')).toBeNull();
    });
  });
});
