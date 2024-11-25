"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import { uploadFile, saveFileMetadata } from "../../../../lib/supabase";
import { Note } from "../../../../types";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { validateFile } from "../../../../lib/helperfuntions";

const SUBJECTS = [
  "Physics",
  "Chemistry",
  "Mathematics",
  "Nepali",
  "English",
  "ComputerScience",
];

const NoteUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("11");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsUploading(true);

    try {
      if (!file) throw new Error("Please select a file");
      validateFile(file, "pdf");
      const path = `${grade}/${subject.toLowerCase()}`;
      const uploadedFile = await uploadFile(file, path, title, "notes");

      const metadata: Omit<Note, "id"> = {
        title,
        subject,
        grade,
        description,
        file_path: uploadedFile.path, // Structured path
        file_url: uploadedFile.publicUrl, // Public URL of the uploaded file
        file_type: file.type,
        file_size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        upload_date: new Date().toISOString(),
        downloads: 0,
        likes: 0,
        views: 0,
      };

      await saveFileMetadata(metadata);

      // Reset form
      setFile(null);
      setTitle("");
      setSubject("");
      setDescription("");

      console.log("File uploaded and metadata saved successfully.");
      toast.success("Note uploaded!", { duration: 3000 });
    } catch (error: any) {
      setError(error.message || "An error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-6 bg-white rounded-xl shadow-sm">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
              disabled={isUploading}
            >
              <option value="">Select Subject</option>
              {SUBJECTS.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
              disabled={isUploading}
            >
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              rows={3}
              required
              disabled={isUploading}
            />
          </div>

          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  try {
                    validateFile(selectedFile, "pdf");
                    setFile(selectedFile);
                    setError("");
                  } catch (err: any) {
                    setError(err.message);
                  }
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.doc,.docx"
              required
              disabled={isUploading}
            />
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {file ? file.name : "Drop your file here, or click to select"}
              </p>
              <p className="mt-1 text-xs text-gray-500">PDF, DOC up to 50MB</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Note"}
          </button>
        </form>
      </div>
    </>
  );
};

export default NoteUploader;
