import { createClient } from "@supabase/supabase-js";
import { Note, Quiz } from "../types";
import { encryptAnswer } from "./encrypt_decrypt"; 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload a file to Supabase storage.
 * @param file   - The file to upload.
 * @param path   - The path where the file will be stored.
 * @param title  - The title of the file.
 * @param bucket - The bucket where the file will be stored.
 * @returns Uploaded file data.
 */
export const uploadFile = async (
  file: File,
  path: string,
  title: string,
  bucket: "notes" | "quizzes"
) => {
  try {
    const fileExt = file.name.split(".").pop();
    const uniqueTitle = `${title}-${Date.now()}`;
    const fileName = `${uniqueTitle}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const { publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath).data;

    if (!publicUrl) throw new Error("Failed to retrieve public URL");

    return { path: filePath, publicUrl };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload file. Please try again.");
  }
};

/**
 * Save file metadata to Supabase database.
 * @param metadata - Metadata for the uploaded file
 * @returns Inserted metadata record.
 */
export const saveFileMetadata = async (metadata: Omit<Note, "id">) => {
  try {
    const { data, error } = await supabase.from("notes").insert({
      title: metadata.title,
      subject: metadata.subject.toLowerCase(),
      grade: metadata.grade,
      description: metadata.description,
      file_path: metadata.file_path,
      file_url: metadata.file_url,
      file_type: metadata.file_type,
      file_size: metadata.file_size,
      upload_date: metadata.upload_date || new Date().toISOString(),
      downloads: metadata.downloads || 0,
      likes: metadata.likes || 0,
      views: metadata.views || 0,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error saving metadata:", error);
    throw new Error("Failed to save metadata. Please try again.");
  }
};

/**
 * Fetch all notes metadata from the Supabase database.
 * @returns List of notes metadata based on grade and subject.
 */
export const fetchNotesByGradeAndSubject = async (
  grade: string,
  subject: string
) => {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("grade", grade)
      .eq("subject", subject);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw new Error("Failed to fetch notes.");
  }
};

/**
 * Save a quiz to the Supabase database.
 * @param metaData - The quiz data to be saved.
 * @returns Inserted quiz record.
 */
export const saveQuiz = async (metaData: Omit<Quiz, "id">) => {
 
  try {
    // Encrypt the correct answers for each question
    const encryptedQuestions = metaData.questions.map((question) => {
      return {
        ...question,
        correctAnswer: encryptAnswer(question.correctAnswer.toString()), 
      };
    });
    
    const { data, error } = await supabase.from("quizzes").insert({
      title: metaData.title,
      subject: metaData.subject,
      grade: metaData.grade,
      duration: metaData.duration,
      difficulty: metaData.difficulty,
      questions: encryptedQuestions,
      participants: metaData.participants || 0,
      avg_score: metaData.avg_score || 0,
      created_at: metaData.created_at || new Date().toISOString(),
      image: metaData.image,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error saving quiz:", error);
    throw new Error("Failed to save quiz. Please try again.");
  }
};

/**
 * Fetch all quizzes from the Supabase database.
 * Quizzes are sorted by creation date in descending order (most recent first).
 * @param grade - The grade for which quizzes should be fetched.
 * @returns List of quizzes metadata based on grade.
 */
export const fetchAllQuiz = async (grade: string) => {
  try {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("grade", grade)
      .order("created_at", { ascending: false }); // Sort by created_at in descending order

    if (error) throw error;


    console.log(data);
    return data; 
  } catch (error) {
    console.error("Error fetching the latest quiz:", error);
    throw new Error("Failed to fetch the latest quiz.");
  }
};


/**
 * Fetch a quiz by its unique ID from the Supabase database.
 * @param id The unique identifier of the quiz.
 * @returns The quiz data. 
 */
export const fetchQuizById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("quizzes") 
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching quiz by ID:", error);
    throw new Error("Failed to fetch quiz.");
  }
};



