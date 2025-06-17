# VISA Dossier Management System

A full-stack application for uploading and managing VISA documents, built with **Laravel (PHP 8.2+)** on the backend and **React 18 (Vite + Tailwind)** on the frontend.

## 🚀 Features

- Upload PDF/PNG/JPG files up to 4MB with progress tracking
- Categorize files into:
  - Identity Documents
  - Supporting Documents
  - Certificates
- View, preview, and delete files
- Responsive UI with real API integration
- Backend validation and error logging

## 🧱 Tech Stack

- **Frontend**: React 18.3.1, Vite, Tailwind CSS, Lucide Icons, XMLHttpRequest, Fetch API
- **Backend**: PHP 8.2.28, Laravel 12.18.0, MySQL, Eloquent ORM, Laravel Storage, CORS

## 📁 Project Structure

```
project-root/
├── backend-laravel/   # Laravel API
├── frontend-react/    # React app
```

## 🔧 Setup Instructions

### Backend (Laravel)
```bash
cd backend-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve
```

### Frontend (React)
```bash
cd frontend-react
npm install
cp .env.example .env
# Set API URL in .env: VITE_API_BASE_URL=http://localhost:8000/api
npm run dev
```

## 🔌 API Endpoints

- `POST /api/files` – Upload file (`file`, `category`)
- `GET /api/files` – List categorized files
- `DELETE /api/files/{id}` – Delete a file

## 📦 File Validation

- **Types**: PDF, PNG, JPG
- **Max Size**: 4MB
- **Categories**: `identity`, `supporting`, `certificates`

## ✅ Status & Production Notes

- Fully functional for local development
- Add authentication (e.g., Sanctum) and rate limiting for production
- Use `.env` files to configure environments
- Logging via `laravel.log` and custom toasts on frontend
