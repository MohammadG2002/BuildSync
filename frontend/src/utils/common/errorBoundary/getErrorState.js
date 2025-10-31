// Get error state from error
const getErrorState = (error) => {
  return {
    hasError: true,
    error,
    errorInfo: null,
  };
};

export default getErrorState;
