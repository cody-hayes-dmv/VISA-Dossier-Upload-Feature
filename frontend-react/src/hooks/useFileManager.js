import { useState, useCallback, useEffect } from 'react';
import { ApiService } from '../services/api';

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
 * @typedef {Object} UploadProgress
 * @property {string} fileId
 * @property {number} progress
 * @property {'uploading' | 'success' | 'error'} status
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {'success' | 'error'} type
 * @property {string} message
 */

export function useFileManager() {
  const [files, setFiles] = useState({
    identity: {
      label: 'Identity Documents',
      description: 'Passport, ID cards, birth certificates',
      files: [],
    },
    supporting: {
      label: 'Supporting Documents', 
      description: 'Proof of status, insurance, bank statements',
      files: [],
    },
    certificates: {
      label: 'Certificates',
      description: 'Criminal record, medical certificates',
      files: [],
    },
  });

  const [uploadProgress, setUploadProgress] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @param {'success' | 'error'} type
   * @param {string} message
   */
  const addNotification = useCallback((type, message) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
  }, []);

  /**
   * @param {string} id
   */
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  /**
   * Load files from the server
   */
  const loadFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedFiles = await ApiService.fetchFiles();
      setFiles(fetchedFiles);
    } catch (error) {
      console.error('Failed to load files:', error);
      addNotification('error', error.message || 'Failed to load files');
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  // Load files on component mount
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  /**
   * @param {FileList} fileList
   * @param {string} category
   */
  const uploadFiles = useCallback(async (fileList, category) => {
    const filesToUpload = Array.from(fileList);
    
    // Initialize progress tracking
    const progressEntries = filesToUpload.map(file => ({
      fileId: Math.random().toString(36).substr(2, 9),
      fileName: file.name,
      progress: 0,
      status: 'uploading',
    }));
    
    setUploadProgress(progressEntries);

    // Upload files
    const uploadPromises = filesToUpload.map(async (file, index) => {
      const progressEntry = progressEntries[index];
      
      try {
        const uploadedFile = await ApiService.uploadFile(
          file, 
          category, 
          (progress) => {
            setUploadProgress(prev => 
              prev.map(p => 
                p.fileId === progressEntry.fileId 
                  ? { ...p, progress }
                  : p
              )
            );
          }
        );
        
        // Complete progress
        setUploadProgress(prev => 
          prev.map(p => 
            p.fileId === progressEntry.fileId 
              ? { ...p, progress: 100, status: 'success' }
              : p
          )
        );

        // Add file to state
        setFiles(prev => ({
          ...prev,
          [category]: {
            ...prev[category],
            files: [...prev[category].files, uploadedFile],
          },
        }));

        return uploadedFile;
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadProgress(prev => 
          prev.map(p => 
            p.fileId === progressEntry.fileId 
              ? { ...p, status: 'error' }
              : p
          )
        );
        throw error;
      }
    });

    try {
      const results = await Promise.allSettled(uploadPromises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      if (successful > 0) {
        addNotification('success', `Successfully uploaded ${successful} file${successful > 1 ? 's' : ''}`);
      }
      if (failed > 0) {
        // Get specific error messages
        const errors = results
          .filter(r => r.status === 'rejected')
          .map(r => r.reason.message)
          .filter((msg, index, arr) => arr.indexOf(msg) === index); // Remove duplicates
        
        if (errors.length === 1) {
          addNotification('error', errors[0]);
        } else {
          addNotification('error', `Failed to upload ${failed} file${failed > 1 ? 's' : ''}`);
        }
      }
    } catch (error) {
      console.error('Upload process failed:', error);
      addNotification('error', 'Upload failed. Please try again.');
    } finally {
      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress([]);
      }, 3000);
    }
  }, [addNotification]);

  /**
   * @param {string} fileId
   */
  const deleteFile = useCallback(async (fileId) => {
    try {
      await ApiService.deleteFile(fileId);
      
      setFiles(prev => {
        const newFiles = { ...prev };
        for (const category of Object.keys(newFiles)) {
          newFiles[category] = {
            ...newFiles[category],
            files: newFiles[category].files.filter(f => f.id !== fileId),
          };
        }
        return newFiles;
      });

      addNotification('success', 'File deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      addNotification('error', error.message || 'Failed to delete file. Please try again.');
    }
  }, [addNotification]);

  return {
    files,
    uploadProgress,
    notifications,
    isLoading,
    uploadFiles,
    deleteFile,
    removeNotification,
    refreshFiles: loadFiles,
  };
}