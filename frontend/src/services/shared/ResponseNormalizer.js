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
    return response.data?.[key] || response.data || response;
  }

  /**
   * Normalize single item response
   * @param {Object} response - API response
   * @param {string} key - Key to extract from response.data
   * @returns {Object} Normalized object
   */
  static normalizeItem(response, key) {
    return response.data?.[key] || response.data || response;
  }

  /**
   * Normalize delete/action response
   * @param {Object} response - API response
   * @returns {Object} Normalized response
   */
  static normalizeAction(response) {
    return response.data || response;
  }
}
