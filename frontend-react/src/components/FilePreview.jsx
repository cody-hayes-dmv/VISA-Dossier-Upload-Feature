import React from 'react';
import { X, FileText, Download } from 'lucide-react';

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
 * @param {Object} props
 * @param {UploadedFile | null} props.file
 * @param {function(): void} props.onClose
 */
export function FilePreview({ file, onClose }) {
  if (!file) return null;

  /**
   * @param {number} bytes
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * @param {Date} date
   */
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {file.name}
            </h3>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)}
              </p>
              <p className="text-sm text-gray-500">
                Uploaded {formatDate(file.uploadedAt)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => window.open(file.url, '_blank')}
              className="p-2 text-gray-400 hover:text-green-500 transition-colors"
              title="Download file"
              disabled={!file.url}
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[calc(90vh-120px)] overflow-auto">
          {file.type.startsWith('image/') ? (
            <div className="flex justify-center">
              <img
                src={file.url}
                alt={file.name}
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
          ) : file.type === 'application/pdf' ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">PDF Document</p>
              <p className="text-sm text-gray-500 mb-4">
                Preview not available for PDF files
              </p>
              <button
                onClick={() => window.open(file.url, '_blank')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={!file.url}
              >
                <Download className="h-4 w-4 mr-2" />
                Open PDF
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">File Preview</p>
              <p className="text-sm text-gray-500">
                Preview not available for this file type
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}