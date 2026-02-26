// ─── ErrorBoundary ────────────────────────────────────────────────────────────
//
// Wraps any section so that if it throws a runtime error, only that section
// shows a fallback message — the rest of the page continues to work normally.
//
// Usage:
//   <ErrorBoundary>
//     <SomeSection />
//   </ErrorBoundary>
//
// Custom fallback:
//   <ErrorBoundary fallback={<p>Custom error message</p>}>
//     <SomeSection />
//   </ErrorBoundary>
//
// ─────────────────────────────────────────────────────────────────────────────

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Optional custom UI shown when the section crashes. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="py-10 text-center text-gray-400 text-sm">
            This section is temporarily unavailable. Please refresh the page.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
