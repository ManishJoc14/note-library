"use client";

import React, { useState, useEffect } from "react";
import {
  fetchNotesByGradeAndSubject,
  togglePostLike,
} from "../../../../../../lib/supabase";
import { Note } from "../../../../../../types";
import { useParams } from "next/navigation";
import NoteCard from "./notesCard";
import { useAuth } from "../../../../../../context/AuthContext";
import { Toaster, toast } from "react-hot-toast";

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { user } = useAuth();

  const params = useParams();
  const { grade, subject } = params as { grade: string; subject: string };

  useEffect(() => {
    if (user) {
      const fetchNotes = async () => {
        try {
          setIsLoading(true);
          const data = await fetchNotesByGradeAndSubject(grade, subject);

          setNotes(
            data.map((note) => ({
              ...note,
              isLiked: user.likedPosts.includes(note.id),
            }))
          );
        } catch (err: any) {
          setError(err.message || "Failed to fetch notes.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchNotes();
    }
  }, [user, grade, subject]);

  // Handler for 'Like' action
  const handleLike = async (noteId: string) => {
    if (!user) {
      setError("User not authenticated.");
      return;
    }

    // optimistic ui update (toggle like)
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              likes: note.isLiked ? note.likes - 1 : note.likes + 1,
              isLiked: !note.isLiked,
            }
          : note
      )
    );

    const result = await togglePostLike(user.id, noteId);

    if (!result?.success) {
      // if it fails toggle again
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId
            ? {
                ...note,
                likes: note.isLiked ? note.likes - 1 : note.likes + 1,
                isLiked: !note.isLiked,
              }
            : note
        )
      );
      setError(result?.message || "Failed to toggle like.");
    }
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
    return <div className="text-white">Loading notes...</div>;
  }

  if (error) {
    toast.error(error);
    // return <div className="text-red-500">Error: {error}</div>;
  }

  if (!notes.length) {
    return (
      <div className="text-white">
        No notes available for this grade and subject.
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-2">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            setNotes={setNotes}
            note={note}
            onLike={() => handleLike(note.id)}
            onDownload={() => handleDownload(note.file_url)}
            onShare={() => handleShare(note.id)}
          />
        ))}
      </div>
    </>
  );
};

export default Notes;
