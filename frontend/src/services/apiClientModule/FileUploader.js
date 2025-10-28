import { ERROR_MESSAGES } from "../../config/api.config";
import { TokenManager } from "./TokenManager";

/**
 * File Uploader - Handles file uploads with progress tracking
 */
export class FileUploader {
  /**
   * Upload file with progress tracking
   * @param {string} url - Upload endpoint URL
   * @param {FormData} formData - Form data containing file
   * @param {Function} onProgress - Progress callback (0-100)
   * @param {number} timeout - Upload timeout in ms
   * @returns {Promise} Upload response
   */
  static async upload(url, formData, onProgress, timeout) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Progress tracking
      if (onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
      });

      xhr.addEventListener("timeout", () => {
        reject(new Error("Upload timeout"));
      });

      xhr.open("POST", url);

      const token = TokenManager.getToken();
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.timeout = timeout;
      xhr.send(formData);
    });
  }
}
