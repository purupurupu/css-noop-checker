import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[css-noop-checker]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="panel" style={{ padding: 16, textAlign: 'center' }}>
          <p style={{ color: 'var(--warning-color)', fontWeight: 600 }}>Something went wrong</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 4 }}>
            {this.state.error.message}
          </p>
          <button
            type="button"
            className="scan-message__back"
            style={{ marginTop: 8 }}
            onClick={() => this.setState({ error: null })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
