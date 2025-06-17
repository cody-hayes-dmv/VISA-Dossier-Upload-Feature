<?php

namespace App\Http\Controllers\Api;

use App\Models\File;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class FileController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:4096',
            'category' => 'required|in:identity,supporting,certificates',
        ]);

        try {
            $file = $request->file('file');
            $path = $file->store('files', 'public');

            $fileRecord = File::create([
                'name' => basename($path),
                'original_name' => $file->getClientOriginalName(),
                'type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
                'category' => $request->input('category'),
                'path' => $path,
            ]);

            return response()->json([
                'success' => true,
                'file' => [
                    'id' => $fileRecord->id,
                    'name' => $fileRecord->original_name,
                    'type' => $fileRecord->type,
                    'size' => $fileRecord->size,
                    'category' => $fileRecord->category,
                    'uploadedAt' => $fileRecord->created_at->toISOString(),
                    'url' => Storage::url($fileRecord->path),
                ]
            ]);
        } catch (\Throwable $e) {
            Log::error('File upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['success' => false, 'message' => 'File upload failed.'], 500);
        }
    }

    public function index()
    {
        try {
            $files = File::all()->groupBy('category')->map(function ($group) {
                return $group->map(function ($file) {
                    return [
                        'id' => $file->id,
                        'name' => $file->original_name,
                        'type' => $file->type,
                        'size' => $file->size,
                        'uploadedAt' => $file->created_at->toISOString(),
                        'url' => Storage::url($file->path),
                    ];
                });
            });

            return response()->json([
                'success' => true,
                'files' => $files
            ]);
        } catch (\Throwable $e) {
            Log::error('File listing failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['success' => false, 'message' => 'Unable to fetch files.'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $file = File::findOrFail($id);
            Storage::disk('public')->delete($file->path);
            $file->delete();

            return response()->json(['success' => true]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning("File not found: $id");
            return response()->json(['success' => false, 'message' => 'File not found.'], 404);
        } catch (\Throwable $e) {
            Log::error('File deletion failed', [
                'file_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['success' => false, 'message' => 'File deletion failed.'], 500);
        }
    }
}
