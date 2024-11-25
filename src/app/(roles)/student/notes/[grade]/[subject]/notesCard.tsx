import React from "react";
import { Eye, Heart, Download, Share2, FileText } from "lucide-react";
import { Note } from "../../../../../../types";

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
      <div className="flex flex-col text-center items-center justify-between md:flex-row  md:text-left md:items-baseline gap-4 mb-4 md:mb-4">
        <div className="bg-gray-100 self-center rounded-lg p-2">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>

        <div className="flex-1">
          <h3>
            <a
              href={note.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white leading-8 hover:text-blue-500 cursor-pointer text-lg  font-semibold underline underline-offset-4 "
            >
              {note.title}
            </a>
            <span className="text-md text-gray-400 mt-1">
              &nbsp; • {note.subject} • grade {note.grade}
            </span>
            <span className="text-xs text-gray-400"> • {note.file_size}</span>
          </h3>

          <p className="text-lg text-white mt-1 ">{note.description}</p>
        </div>

        <button
          className="flex items-center space-x-1 text-green-400 hover:text-purple-500 transition"
          onClick={onShare}
          title="Share"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-3">
          <img
            src="https://via.placeholder.com/32"
            alt="Uploader Avatar"
            className="rounded-full h-8 w-8 border border-gray-300"
          />
          <div>
            <p className="text-md text-white">
              By <span className="font-medium">Manish</span>
            </p>
            <p className="text-xs text-gray-400">
              {new Date(note.upload_date).toDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-gray-400 mt-4 md:mt-0">
          <button
            className="flex items-center space-x-1 text-red-500 transition"
            onClick={onLike}
            title="Like"
          >
            <Heart className="h-5 w-5" />
            <span className="text-md">{note.likes.toLocaleString()}</span>
          </button>
          <button
            className="flex items-center space-x-1 text-blue-500 transition"
            onClick={onDownload}
            title="Download"
          >
            <Download className="h-5 w-5" />
            <span className="text-md">{note.downloads.toLocaleString()}</span>
          </button>
          <div className="flex items-center space-x-1 text-orange-500">
            <Eye className="h-5 w-5 " />
            <span className="text-md">{note.views.toLocaleString()} Views</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;