import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-red-500/20 rounded-lg p-8">
            <div className="text-6xl mb-6">🚨</div>
            <h2 className="text-3xl font-bold text-white mb-4 font-space">
              Something went wrong!
            </h2>
            <p className="text-gray-300 mb-6">
              The crewmate creator encountered an unexpected error. This might
              be a temporary issue.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 font-space mr-4"
              >
                Reload Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 font-space"
              >
                Try Again
              </button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 p-4 bg-red-900/20 border border-red-500/20 rounded text-sm text-red-300 overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
