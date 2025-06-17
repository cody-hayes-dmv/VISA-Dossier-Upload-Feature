# VISA Dossier Management System

A React frontend for managing VISA document uploads, designed to work with a Laravel backend API.

## Features

- **File Upload**: Upload PDF, PNG, and JPG files up to 4MB with real-time progress tracking
- **Categorization**: Organize files into three categories:
  - Identity Documents (Passport, ID cards, birth certificates)
  - Supporting Documents (Proof of status, insurance, bank statements)  
  - Certificates (Criminal record, medical certificates)
- **File Management**: View, preview, and delete uploaded files
- **File Preview**: Image thumbnails and preview modal
- **Upload Progress**: Real-time upload progress indicators using XMLHttpRequest
- **Notifications**: Success/error feedback for all operations
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real API Integration**: Full HTTP API integration with proper error handling

## Project Structure

```
frontend-react/
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx      # File upload component with drag & drop
│   │   ├── FileList.jsx        # Categorized file listing
│   │   ├── FilePreview.jsx     # File preview modal
│   │   └── Notification.jsx    # Toast notifications
│   ├── hooks/
│   │   └── useFileManager.js   # File management logic with API calls
│   ├── services/
│   │   └── api.js             # API service layer for HTTP requests
│   ├── App.jsx                # Main application component
│   └── main.jsx              # Application entry point
├── .env.example              # Environment variables template
├── package.json
└── README.md
```

## Technologies Used

- **React 18** with JavaScript (ES6+)
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **JSDoc** for type annotations
- **XMLHttpRequest** for file upload progress tracking
- **Fetch API** for standard HTTP requests

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Backend Integration

This frontend is designed to work with a Laravel backend that provides:

### Required API Endpoints

- `POST /api/files` - Upload files
- `GET /api/files` - List all files grouped by category
- `DELETE /api/files/{id}` - Delete a specific file

### Expected API Responses

**Upload Response**:
```json
{
  "success": true,
  "file": {
    "id": "uuid",
    "name": "document.pdf",
    "type": "application/pdf",
    "size": 1024000,
    "category": "identity",
    "uploadedAt": "2025-01-18T10:30:00Z",
    "url": "/storage/files/document.pdf"
  }
}
```

**List Response**:
```json
{
  "success": true,
  "files": {
    "identity": [...],
    "supporting": [...],
    "certificates": [...]
  }
}
```

**Delete Response**:
```json
{
  "success": true
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

## API Service Layer

The application uses a dedicated `ApiService` class that handles:

- **File Upload**: Uses XMLHttpRequest for progress tracking
- **File Fetching**: Uses Fetch API for listing files
- **File Deletion**: Uses Fetch API for file removal
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Network Error Detection**: Handles connection issues gracefully

## File Validation

- **Allowed Types**: PDF, PNG, JPG only
- **Maximum Size**: 4MB per file
- **Multiple Files**: Supports bulk upload with individual progress tracking

## Features Demonstrated

1. **Real API Integration**: Full HTTP API integration with Laravel backend
2. **File Upload with Progress**: Real-time upload progress using XMLHttpRequest
3. **Error Handling**: Comprehensive error states and user feedback
4. **Loading States**: Loading indicators for all async operations
5. **Categorized Organization**: Files grouped by document type
6. **File Preview**: Image thumbnails and full preview modal
7. **Delete Confirmation**: Two-click delete to prevent accidents
8. **Responsive Design**: Mobile-first responsive layout
9. **Refresh Functionality**: Manual refresh button to reload files from server

## JavaScript Features Used

- **ES6+ Syntax**: Arrow functions, destructuring, template literals
- **JSDoc Type Annotations**: Type safety without TypeScript
- **React Hooks**: useState, useEffect, useCallback, useRef
- **Modern JavaScript**: Async/await, Promise.allSettled, Array methods
- **XMLHttpRequest**: For upload progress tracking
- **Fetch API**: For standard HTTP requests
- **Error Boundaries**: Proper error handling and user feedback

## Environment Configuration

The application uses environment variables for configuration:

- `VITE_API_BASE_URL`: Base URL for the Laravel API (default: http://localhost:8000/api)

## Testing the Application

1. **Upload Test**:
   - Select different file types (PDF, PNG, JPG)
   - Try uploading files larger than 4MB (should show validation error)
   - Upload to different categories
   - Watch real-time progress indicators

2. **File Management Test**:
   - View uploaded files in categorized lists
   - Preview images by clicking the eye icon
   - Delete files using the trash icon (requires confirmation)
   - Use refresh button to reload files from server

3. **Error Handling Test**:
   - Try uploading unsupported file types
   - Test with no internet connection
   - Test with invalid API responses

## Production Considerations

For production deployment:

1. **Environment Configuration**: Set proper API URLs for production
2. **Authentication**: Implement proper authentication/authorization
3. **Error Logging**: Add proper error logging and monitoring
4. **File Security**: Implement proper file validation on both client and server
5. **Performance**: Consider implementing file chunking for large uploads
6. **Caching**: Implement proper caching strategies for file listings
7. **CDN**: Use CDN for serving uploaded files
8. **Rate Limiting**: Implement rate limiting for API calls

## Development Notes

- All API calls are centralized in the `ApiService` class
- File upload progress is tracked using XMLHttpRequest
- Error handling provides user-friendly messages
- Loading states are implemented throughout the application
- JSDoc comments provide type safety and better IDE support
- Environment variables allow for easy configuration across environments