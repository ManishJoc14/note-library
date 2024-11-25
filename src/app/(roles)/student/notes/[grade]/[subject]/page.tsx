"use client";

import React, { useState, useEffect } from "react";
import { fetchNotesByGradeAndSubject } from "../../../../../../lib/supabase";
import { Note } from "../../../../../../types";
import { useParams } from "next/navigation";
import NoteCard from "./notesCard";

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string>(""); 

  const params = useParams(); 
  const { grade, subject } = params as { grade: string; subject: string }; 

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const data = await fetchNotesByGradeAndSubject(grade, subject);
        setNotes(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch notes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [grade, subject]);

  // Handler for 'Like' action
  const handleLike = (noteId: string) => {
    console.log(`Liked the note with ID: ${noteId}`);
    // Implement like functionality
  };

  const handleDownload = (file_url: string) => {
    const a = document.createElement("a");
    a.href = file_url;
    a.download = file_url.split("/").pop() || "download"; // file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // Handler for 'Share' action
  const handleShare = (noteId: string) => {
    console.log(`Shared the note with ID: ${noteId}`);
    // Implement share functionality
  };

  // Loading, error, and no data states
  if (isLoading) {
    return <div className='text-white'>Loading notes...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!notes.length) {
    return <div className='text-white'>No notes available for this grade and subject.</div>;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-2">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onLike={() => handleLike(note.id)}
          onDownload={() => handleDownload(note.file_url)}
          onShare={() => handleShare(note.id)}
        />
      ))}
    </div>
  );
};

export default Notes;
