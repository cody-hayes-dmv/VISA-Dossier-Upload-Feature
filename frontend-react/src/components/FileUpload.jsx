import React, { useRef, useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
const MAX_SIZE = 4 * 1024 * 1024; // 4MB

/**
 * @typedef {Object} UploadProgress
 * @property {string} fileId
 * @property {number} progress
 * @property {'uploading' | 'success' | 'error'} status
 */

/**
 * @param {Object} props
 * @param {function(FileList, string): void} props.onFileUpload
 * @param {UploadProgress[]} props.uploadProgress
 * @param {boolean} props.disabled
 */
export function FileUpload({ onFileUpload, uploadProgress = [], disabled }) {
  const fileInputRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('identity');
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');

  /**
   * @param {FileList} files
   * @returns {string | null}
   */
  const validateFiles = (files) => {
    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return `Invalid file type: ${file.name}. Only PDF, PNG, and JPG files are allowed.`;
      }
      if (file.size > MAX_SIZE) {
        return `File too large: ${file.name}. Maximum size is 4MB.`;
      }
    }
    return null;
  };

  /**
   * @param {FileList | null} files
   */
  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;

    const error = validateFiles(files);
    if (error) {
      setValidationError(error);
      setTimeout(() => setValidationError(''), 5000);
      return;
    }

    setValidationError('');
    onFileUpload(files, selectedCategory);
  };

  /**
   * @param {React.DragEvent} e
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  /**
   * @param {React.DragEvent} e
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  /**
   * @param {React.DragEvent} e
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const categories = [
    { value: 'identity', label: 'Identity Documents' },
    { value: 'supporting', label: 'Supporting Documents' },
    { value: 'certificates', label: 'Certificates' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h2>
      
      {/* Category Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Document Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={disabled}
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-gray-500">
          Supports PDF, PNG, JPG files up to 4MB
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-red-700">{validationError}</p>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadProgress.map((progress) => (
            <div key={progress.fileId} className="bg-gray-50 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Uploading...</span>
                <div className="flex items-center">
                  {progress.status === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {progress.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-600 ml-1">
                    {progress.progress}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progress.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}