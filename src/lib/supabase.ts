import { createClient } from "@supabase/supabase-js";
import { Note, Quiz, User, QuizSummaryProps } from "../types";
import { encryptAnswer } from "./encrypt_decrypt";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Add a user to the users table in Supabase.
 * @param user - The user data to be inserted.
 * @returns The inserted user record.
 */
export const saveUserToTable = async (user: User) => {
  try {
    const { data, error } = await supabase.from("users").insert({
      id: user.id,
      full_name: user.fullName,
      email: user.email,
      grade: user.grade,
      phone: user.phone,
      role: user.role,
      quiz_data: user.quizData,
      liked_posts: user.likedPosts,
      viewed_posts: user.viewedPosts,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    });

    if (error) {
      console.error("Error saving user to table:", error);
      throw new Error("Failed to save user. Please try again.");
    }

    console.log("User saved successfully:", data);
    return data; // Return the saved user data
  } catch (error) {
    console.error("Error in saveUserToTable function:", error);
    throw error;
  }
};

/**
 * Fetch a user from users table in Supabase.
 * @param userid - The user to be fetched.
 * @returns The fetched user record.
 */
export const fetchUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to fetch user.");
  }
};

/**
 * Toggle like status for a post.
 * If the post is already liked by the user, it will be unliked; otherwise, it will be liked.
 *
 * @param userId - The ID of the user liking/unliking the post.
 * @param postId - The ID of the post being liked/unliked.
 * @returns - {success, message, likes, hasLiked}.
 */
export const togglePostLike = async (userId: string, postId: string) => {
  try {
    // Step 1: Fetch the user's liked posts
    const { data: userData, error: fetchUserError } = await supabase
      .from("users")
      .select("liked_posts")
      .eq("id", userId)
      .single();

    if (fetchUserError) {
      console.error(
        `Error fetching user data (UserID: ${userId}):`,
        fetchUserError
      );
      throw new Error("Failed to fetch user data.");
    }

    const likedPostsIds: string[] = userData?.liked_posts || [];
    const hasLiked = likedPostsIds.includes(postId);

    // Step 2: Update the user's liked posts list
    const updatedLikedPostsIds = hasLiked
      ? likedPostsIds.filter((id) => id !== postId) // Remove postId if already liked
      : [...likedPostsIds, postId]; // Add postId if not liked

    const { error: updateUserError } = await supabase
      .from("users")
      .update({ liked_posts: updatedLikedPostsIds })
      .eq("id", userId);

    if (updateUserError) throw new Error("Failed to update user like status.");

    // Step 3: Fetch the current likes count for the post
    const { data: postData, error: fetchPostError } = await supabase
      .from("notes")
      .select("likes")
      .eq("id", postId)
      .single();

    if (fetchPostError) throw new Error("Failed to fetch post data.");

    const currentLikes = postData?.likes || 0;
    const newLikes = hasLiked ? currentLikes - 1 : currentLikes + 1;

    // Step 4: Update the like count for the post
    const { error: updatePostError } = await supabase
      .from("notes")
      .update({ likes: newLikes })
      .eq("id", postId);

    if (updatePostError) throw new Error("Failed to update post like count.");

    return {
      success: true,
      message: hasLiked
        ? "Post unliked successfully!"
        : "Post liked successfully!",
      likes: newLikes,
      isLiked: !hasLiked,
    };
  } catch (error: any) {
    console.error(
      `Error toggling like status (UserID: ${userId}, PostID: ${postId}):`,
      error
    );
    return { success: false, message: error.message };
  }
};

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
      liked_by: "",
      viewed_by: "",
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
      .eq("subject", subject)
      .order("likes", { ascending: false });

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
      taken_by: "",
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

/**
 * Fetches the summary of a specific quiz for a user.
 * @param userId - The ID of the user whose quiz data is being fetched.
 * @param quizId - The ID of the quiz to fetch from the user's quiz_data.
 * @returns { success: boolean; message: string; data?: QuizSummaryProps }
 */
export const fetchQuizSummary = async (
  userId: string,
  quizId: string
): Promise<{ success: boolean; message: string; data?: QuizSummaryProps }> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("quiz_data")
      .eq("id", userId)
      .single();

    if (error || !data)
      return { success: false, message: "Failed to fetch user quiz data." };

    const quizData: QuizSummaryProps[] = data.quiz_data || [];
    const quizSummary = quizData.find((quiz) => quiz.id === quizId);

    if (!quizSummary) throw new Error("Quiz not found.");

    return {
      success: true,
      message: "Quiz summary fetched successfully.",
      data: quizSummary,
    };
  } catch (error) {
    console.error("Error fetching quiz summary:", error);
    return { success: false, message: "Failed to fetch quiz summary." };
  }
};

/**
 * Saves or updates a quiz summary for a user.
 * @param userId - The ID of the user whose quiz data is being updated.
 * @param quizSummary - The new quiz summary to save or update.
 * @returns { success: boolean; message: string }
 */
export const saveQuizSummary = async (
  userId: string,
  quizSummary: QuizSummaryProps
): Promise<{ success: boolean; message: string }> => {
  try {
    // Fetch the current quiz_data for the user
    const { data, error: fetchError } = await supabase
      .from("users")
      .select("quiz_data")
      .eq("id", userId)
      .single();

    if (fetchError || !data) {
      return { success: false, message: "Failed to fetch current quiz data." };
    }

    const currentQuizData: QuizSummaryProps[] = data.quiz_data || [];

    // Update the quiz_data by replacing or appending the new summary
    const updatedQuizData = [
      ...(currentQuizData?.filter((quiz) => quiz.id !== quizSummary.id)),
      quizSummary,
    ];

    // Save the updated quiz_data back to the database
    const { error: updateError } = await supabase
      .from("users")
      .update({ quiz_data: updatedQuizData })
      .eq("id", userId);

    if (updateError) {
      throw new Error("Failed to update quiz data.");
    }

    return { success: true, message: "Quiz summary saved successfully." };
  } catch (error) {
    console.error("Error saving quiz summary:", error);
    return {
      success: false,
      message: error as string,
    };
  }
};
