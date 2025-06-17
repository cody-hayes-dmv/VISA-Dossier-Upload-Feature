/**
 * @typedef {Object} UploadedFile
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {number} size
 * @property {'identity' | 'supporting' | 'certificates'} category
 * @property {Date} uploadedAt
 * @property {string} [url]
 */

/**
 * @typedef {Object} FileCategory
 * @property {string} label
 * @property {string} description
 * @property {UploadedFile[]} files
 */

/**
 * @typedef {Object} FileCategories
 * @property {FileCategory} identity
 * @property {FileCategory} supporting
 * @property {FileCategory} certificates
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * API service for file operations
 */
export class ApiService {
  /**
   * Upload a file to the server
   * @param {File} file - The file to upload
   * @param {string} category - The category for the file
   * @param {function(number): void} onProgress - Progress callback
   * @returns {Promise<UploadedFile>}
   */
  static async uploadFile(file, category, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              // Convert uploadedAt string to Date object
              const file = {
                ...response.file,
                uploadedAt: new Date(response.file.uploadedAt)
              };
              resolve(file);
            } else {
              reject(new Error(response.message || 'Upload failed'));
            }
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new Error(errorResponse.message || `HTTP ${xhr.status}: ${xhr.statusText}`));
          } catch {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error occurred'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Request timeout'));
      });

      xhr.open('POST', `${API_BASE_URL}/files`);
      xhr.timeout = 30000; // 30 second timeout
      xhr.send(formData);
    });
  }

  /**
   * Fetch all files grouped by category
   * @returns {Promise<FileCategories>}
   */
  static async fetchFiles() {
    try {
      const response = await fetch(`${API_BASE_URL}/files`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch files');
      }

      // Transform the API response to match our expected structure
      const transformedFiles = {
        identity: {
          label: 'Identity Documents',
          description: 'Passport, ID cards, birth certificates',
          files: (data.files.identity || []).map(file => ({
            ...file,
            uploadedAt: new Date(file.uploadedAt)
          })),
        },
        supporting: {
          label: 'Supporting Documents',
          description: 'Proof of status, insurance, bank statements',
          files: (data.files.supporting || []).map(file => ({
            ...file,
            uploadedAt: new Date(file.uploadedAt)
          })),
        },
        certificates: {
          label: 'Certificates',
          description: 'Criminal record, medical certificates',
          files: (data.files.certificates || []).map(file => ({
            ...file,
            uploadedAt: new Date(file.uploadedAt)
          })),
        },
      };

      return transformedFiles;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      throw error;
    }
  }

  /**
   * Delete a file by ID
   * @param {string} fileId - The ID of the file to delete
   * @returns {Promise<void>}
   */
  static async deleteFile(fileId) {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to delete file');
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      throw error;
    }
  }
}