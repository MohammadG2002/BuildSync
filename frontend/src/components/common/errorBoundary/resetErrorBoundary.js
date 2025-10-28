// Reset error boundary state
const resetErrorBoundary = () => {
  return {
    hasError: false,
    error: null,
    errorInfo: null,
  };
};

export default resetErrorBoundary;
