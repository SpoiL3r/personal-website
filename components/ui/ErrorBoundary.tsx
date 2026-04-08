"use client";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional fallback UI. Defaults to a small monospace error line. */
  fallback?: ReactNode;
}

interface State { hasError: boolean }

/**
 * React error boundary that catches render errors in its subtree.
 * Use to wrap API-dependent components so a single fetch failure
 * does not crash the whole page.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console in development; swap for Sentry/similar in production
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <p style={{
          fontSize: "0.72rem",
          fontFamily: "var(--font-mono, monospace)",
          color: "var(--text-dim)",
        }}>
          // failed to load
        </p>
      );
    }
    return this.props.children;
  }
}
