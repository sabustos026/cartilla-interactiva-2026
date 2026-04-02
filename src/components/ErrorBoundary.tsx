import React, { Component, type ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center gap-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-lg font-semibold text-foreground">Algo salió mal</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            {this.state.error?.message || "Ocurrió un error inesperado. Por favor recarga la página."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-sm underline text-primary hover:opacity-70"
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
