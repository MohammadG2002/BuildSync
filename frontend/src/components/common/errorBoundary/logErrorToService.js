// Log error to external service (e.g., Sentry, LogRocket, etc.)
const logErrorToService = (error, errorInfo) => {
  // TODO: Implement error logging to your preferred service
  // Example for Sentry:
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, {
  //     contexts: {
  //       react: {
  //         componentStack: errorInfo.componentStack,
  //       },
  //     },
  //   });
  // }

  console.error("Error logged:", error, errorInfo);
};

export default logErrorToService;
