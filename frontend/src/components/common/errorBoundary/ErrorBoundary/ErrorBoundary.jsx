import { Component } from "react";
import ErrorFallback from "../ErrorFallback/ErrorFallback";
import logErrorToService from "../../../../utils/common/errorBoundary/logErrorToService";
import resetErrorBoundary from "../../../../utils/common/errorBoundary/resetErrorBoundary";
import getErrorState from "../../../../utils/common/errorBoundary/getErrorState";

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
    return getErrorState(error);
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Log error to external service
    logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState(resetErrorBoundary());
    // Optionally reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
