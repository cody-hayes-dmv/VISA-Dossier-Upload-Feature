import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { FilePreview } from './components/FilePreview';
import { Notification } from './components/Notification';
import { useFileManager } from './hooks/useFileManager';
import { FileText, Shield, RefreshCw } from 'lucide-react';

function App() {
  const {
    files,
    uploadProgress,
    notifications,
    isLoading,
    uploadFiles,
    deleteFile,
    removeNotification,
    refreshFiles
  } = useFileManager();

  const [previewFile, setPreviewFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * @param {FileList} fileList
   * @param {string} category
   */
  const handleFileUpload = async (fileList, category) => {
    setIsUploading(true);
    await uploadFiles(fileList, category);
    setIsUploading(false);
  };

  const totalFiles = Object.values(files).reduce((sum, category) => sum + category.files.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  VISA Dossier Management
                </h1>
                <p className="text-sm text-gray-500">
                  Upload and manage your documents
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={refreshFiles}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                title="Refresh files"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {isLoading ? 'Loading...' : `${totalFiles} Documents`}
                </p>
                <p className="text-xs text-gray-500">
                  Total uploaded
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <FileUpload
              onFileUpload={handleFileUpload}
              uploadProgress={uploadProgress}
              disabled={isUploading || isLoading}
            />

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(files).map(([key, category]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600">{category.label}</span>
                      <span className="font-medium text-gray-900">
                        {category.files.length}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* File List Section */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            ) : (
              <FileList
                files={files}
                onDeleteFile={deleteFile}
                onPreviewFile={setPreviewFile}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals and Notifications */}
      <FilePreview
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

export default App;