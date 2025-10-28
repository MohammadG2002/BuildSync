/**
 * Retry Strategy - Implements exponential backoff retry logic
 */
export class RetryStrategy {
  /**
   * Execute function with retry logic
   * @param {Function} fn - Async function to execute
   * @param {number} maxAttempts - Maximum retry attempts
   * @param {Function} shouldRetry - Function to determine if error should be retried
   * @returns {Promise} Result of successful execution
   * @throws {Error} Last error if all retries fail
   */
  static async execute(fn, maxAttempts, shouldRetry) {
    let lastError;

    for (let attempt = 0; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Don't retry if error indicates we shouldn't
        if (shouldRetry && !shouldRetry(error)) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < maxAttempts) {
          await this.delay(attempt);
        }
      }
    }

    throw lastError;
  }

  /**
   * Calculate delay with exponential backoff
   * @param {number} attempt - Current attempt number (0-based)
   * @returns {Promise} Promise that resolves after delay
   */
  static delay(attempt) {
    const delayMs = Math.pow(2, attempt) * 1000;
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
