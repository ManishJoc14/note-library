
import React from "react";
import { Eye, Heart, Download, Share2, FileText } from "lucide-react";

interface Note {
  id: string;
  title: string;
  subject: string;
  grade: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  downloads: number;
  likes: number;
  views: number;
  uploadDate: string;
}

interface NoteCardProps {
  note: Note;
  onLike: () => void;
  onDownload: () => void;
  onShare: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onLike,
  onDownload,
  onShare,
}) => {
  return (
    <div className="border h-fit glass-card hover:bg-white/10 w-full border-gray-300 rounded-lg shadow-sm p-6 max-w-4xl flex flex-col space-y-6 hover:shadow-md transition duration-200">
      {/* Top Section */}
      <div className="flex flex-col text-center items-center justify-between md:flex-row  md:text-left md:items-baseline gap-4 mb-4 md:mb-0">
        {/* File Icon */}
        <div className="bg-gray-100 self-center rounded-lg p-2">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>

        {/* Title */}
        <div className="flex-1">
          <h3 className="text-white text-lg font-semibold">
            <a
              href={note.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-600 cursor-pointer text-lg font-semibold hover:underline"
            >
              {note.title}
            </a>
            <span className="text-xs text-gray-400"> • {note.fileSize}</span>
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {note.subject} • Grade {note.grade}
          </p>
        </div>

        <button
          className="flex items-center space-x-1 text-purple-400 hover:text-green-500 transition"
          onClick={onShare}
          title="Share"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Uploader Info */}
        <div className="flex items-center space-x-3">
          <img
            src="https://via.placeholder.com/32"
            alt="Uploader Avatar"
            className="rounded-full h-8 w-8 border border-gray-300"
          />
          <div>
            <p className="text-sm text-white">
              By <span className="font-medium">Manish</span>
            </p>
            <p className="text-xs text-gray-400">
              {new Date(note.uploadDate).toDateString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-6 text-gray-400 mt-4 md:mt-0">
          <button
            className="flex items-center space-x-1 hover:text-red-500 transition"
            onClick={onLike}
            title="Like"
          >
            <Heart className="h-4 w-4" />
            <span className="text-sm">{note.likes.toLocaleString()}</span>
          </button>
          <button
            className="flex items-center space-x-1 hover:text-blue-500 transition"
            onClick={onDownload}
            title="Download"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm">{note.downloads.toLocaleString()}</span>
          </button>

          <div className="flex items-center space-x-1 text-gray-400">
            <Eye className="h-4 w-4" />
            <span className="text-sm">{note.views.toLocaleString()} Views</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
