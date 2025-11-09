/**
 * Response Normalizer - Normalizes API responses to consistent format
 * Backend returns various formats: { success, data: { items } }, { data: item }, or direct data
 */
export class ResponseNormalizer {
  /**
   * Normalize list response
   * @param {Object} response - API response
   * @param {string} key - Key to extract from response.data
   * @returns {Array} Normalized array
   */
  static normalizeList(response, key) {
    // Prefer nested data key if present
    if (response && response.data && response.data[key] !== undefined) {
      return response.data[key];
    }
    // Handle flat top-level key (e.g., { tags: [...] })
    if (response && response[key] !== undefined) {
      return response[key];
    }
    // Fallback: if response itself is an array, return it; else empty array
    if (Array.isArray(response)) return response;
    return [];
  }

  /**
   * Normalize single item response
   * @param {Object} response - API response
   * @param {string} key - Key to extract from response.data
   * @returns {Object} Normalized object
   */
  static normalizeItem(response, key) {
    if (response && response.data && response.data[key] !== undefined) {
      return response.data[key];
    }
    if (response && response[key] !== undefined) {
      return response[key];
    }
    // Fallback to entire response if it's an object
    return response?.data || response || null;
  }

  /**
   * Normalize delete/action response
   * @param {Object} response - API response
   * @returns {Object} Normalized response
   */
  static normalizeAction(response) {
    return response?.data || response || null;
  }
}
