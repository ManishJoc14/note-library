"use client";

import NoteCard from "./notesCard";

const Notes = () => {
  const mockNote = [
    {
      id: "1",
      title: "Engineering Mathematics I | Solutions Book",
      subject: "Mathematics",
      grade: "12",
      fileUrl: "https://example.com/solutions-book.pdf",
      fileType: "PDF",
      fileSize: "1.5 MB",
      downloads: 320,
      likes: 20,
      views: 30,
      uploadDate: "2024-11-20",
    },
    {
      id: "2",
      title: "Engineering Mathematics I | Solutions Book",
      subject: "Mathematics",
      grade: "12",
      fileUrl: "https://example.com/solutions-book.pdf",
      fileType: "PDF",
      fileSize: "1.5 MB",
      downloads: 320,
      likes: 20,
      views: 30,
      uploadDate: "2024-11-20",
    },
  ];

  const handleLike = () => {
    console.log("Liked the note!");
  };

  const handleDownload = () => {
    console.log("Downloaded the note!");
  };

  const handleShare = () => {
    console.log("Shared the note!");
  };
  return (
    <div className=" min-h-screen grid grid-cols-1 md:grid-cols-2 gap-2">
      {mockNote.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onLike={handleLike}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      ))}
    </div>
  );
};

export default Notes;
