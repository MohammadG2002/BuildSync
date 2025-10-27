import { Component } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./Button";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Optionally reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>

              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Oops! Something went wrong
              </h1>

              <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-6">
                We're sorry, but something unexpected happened. Don't worry,
                your data is safe.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="w-full mb-6">
                  <details className="text-left bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Error Details (Development Only)
                    </summary>
                    <div className="text-xs text-red-600 font-mono whitespace-pre-wrap break-words">
                      {this.state.error.toString()}
                      {this.state.errorInfo && (
                        <div className="mt-2 text-gray-600 dark:text-gray-400 dark:text-gray-500">
                          {this.state.errorInfo.componentStack}
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="primary" onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => (window.location.href = "/")}
                >
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
