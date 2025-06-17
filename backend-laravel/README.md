# VISA Dossier Backend API

A Laravel RESTful API backend for managing VISA dossier file uploads, built to be consumed by a React frontend.

## Features

- **File Upload**: Accepts PDF, PNG, JPG/JPEG uploads up to 4MB
- **File Categorization**: Three distinct categories:
  - Identity Documents (e.g., Passport, ID card)
  - Supporting Documents (e.g., bank statements, insurance)
  - Certificates (e.g., medical, criminal record)
- **File Listing**: List all files grouped by category
- **File Deletion**: Delete individual uploaded files
- **Validation**: Full validation with appropriate error messages
- **Error Logging**: Server-side logging for all exceptions

## Project Structure

```
backend-laravel/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           └── FileController.php  # Main controller for file operations
│   └── Models/
│       └── File.php                   # File model
├── routes/
│   └── api.php                        # API routes
├── database/
│   └── migrations/                   # File table migration
├── storage/app/public/files/         # Uploaded files (symlinked to public)
├── .env.example                      # Environment variables template
├── composer.json
└── README.md
```

## Technologies Used

- **Laravel 12.x** (PHP 8.2+)
- **Eloquent ORM**
- **MySQL** or any database supported by Laravel
- **Laravel Storage** for file management
- **Validation & Exception Handling**
- **PHP dotenv** for environment config

## Setup Instructions

1. **Clone and install dependencies**:
   ```bash
   git clone https://github.com/your-org/backend-laravel.git
   cd backend-laravel
   composer install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Configure your `.env` file**:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=visa_dossier
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

4. **Run migrations**:
   ```bash
   php artisan migrate
   ```

5. **Create storage symlink**:
   ```bash
   php artisan storage:link
   ```

6. **Start local development server**:
   ```bash
   php artisan serve
   ```

## API Endpoints

### POST `/api/files`
- Upload a file with the following form fields:
  - `file`: PDF, JPG, JPEG, PNG (max 4MB)
  - `category`: identity | supporting | certificates

**Response:**
```json
{
  "success": true,
  "file": {
    "id": 1,
    "name": "document.pdf",
    "type": "application/pdf",
    "size": 1024000,
    "category": "identity",
    "uploadedAt": "2025-01-18T10:30:00Z",
    "url": "/storage/files/document.pdf"
  }
}
```

### GET `/api/files`
- List all files grouped by category

**Response:**
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

### DELETE `/api/files/{id}`
- Delete a file by ID

**Response:**
```json
{
  "success": true
}
```

### Error Format
```json
{
  "success": false,
  "message": "Descriptive error message."
}
```

## File Validation

- **Accepted Types**: PDF, PNG, JPG, JPEG
- **Max File Size**: 4096 KB (4 MB)
- **Required Fields**: `file`, `category`
- **Valid Categories**: `identity`, `supporting`, `certificates`

## Backend Logic Summary

- File uploads are stored under `storage/app/public/files`
- Metadata is stored in the `files` table
- Laravel handles MIME-type validation, size limits, and category constraints
- Errors are logged using Laravel’s `Log` facade with stack traces
- FileController handles:
  - `store()` — uploading and saving metadata
  - `index()` — retrieving categorized file data
  - `destroy()` — file deletion by ID

## Production Considerations

- **Authentication**: Add auth middleware (e.g., Laravel Sanctum)
- **Rate Limiting**: Use Laravel’s built-in throttling
- **Validation Rules**: Can be extracted to Form Requests
- **File Access Security**: Validate file visibility and authorization per user (if multi-user)
- **Monitoring**: Set up centralized logging with tools like Sentry
- **Backup Strategy**: Backup file storage and DB regularly

## Development Notes

- Errors are logged to `storage/logs/laravel.log`
- API uses JSON responses only (designed for SPA consumption)
- Ensure CORS is properly configured for frontend access
- Uses route grouping under `/api/files`

---

For the corresponding React frontend, refer to the [`frontend-react`](https://github.com/your-org/frontend-react) repository.

