import React, { useState } from 'react';
import { FileText, Image, Trash2, Download, Eye } from 'lucide-react';

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

/**
 * @param {Object} props
 * @param {FileCategories} props.files
 * @param {function(string): void} props.onDeleteFile
 * @param {function(UploadedFile): void} props.onPreviewFile
 */
export function FileList({ files, onDeleteFile, onPreviewFile }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  /**
   * @param {string} type
   */
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    }
    return <FileText className="h-5 w-5 text-red-500" />;
  };

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  /**
   * @param {string} fileId
   */
  const handleDeleteClick = (fileId) => {
    if (deleteConfirm === fileId) {
      onDeleteFile(fileId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(fileId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const categories = Object.entries(files);

  return (
    <div className="space-y-6">
      {categories.map(([categoryKey, category]) => (
        <div key={categoryKey} className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.label}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.description}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {category.files.length} {category.files.length === 1 ? 'file' : 'files'}
              </div>
            </div>
          </div>

          <div className="p-6">
            {category.files.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">
                  No files uploaded yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {category.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(file.uploadedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* File Preview Thumbnail */}
                    {file.type.startsWith('image/') && file.url && (
                      <div className="mr-3">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="h-12 w-12 object-cover rounded border"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onPreviewFile(file)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Preview file"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                        title="Download file"
                        disabled={!file.url}
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(file.id)}
                        className={`p-2 transition-colors ${
                          deleteConfirm === file.id
                            ? 'text-red-600 bg-red-50 rounded'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                        title={deleteConfirm === file.id ? 'Click again to confirm' : 'Delete file'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}