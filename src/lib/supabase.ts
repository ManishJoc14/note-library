import { createClient } from "@supabase/supabase-js";
import { Note, Quiz, User, QuizSummaryProps } from "../types";
import { encryptAnswer } from "./encrypt_decrypt";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseKey);

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
 * Save or fetch a user from the users table in Supabase.
 * @param user - The user data to be inserted.
 * @returns The user record from the database.
 */
export const saveUserToTable = async (user: User) => {
  try {
    // Check if the user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    // If no rows are found, fetchError will have code "PGRST116"
    if (fetchError && fetchError.code !== "PGRST116") {
      // If it's any other error, rethrow it
      throw fetchError;
    }

    // If the user exists, return the existing user data
    if (existingUser) {
      console.log("User already exists in Supabase:", existingUser);
      return existingUser;
    }

    // If the user does not exist, insert them into the table
    const { data: newUser, error: saveError } = await supabase
      .from("users")
      .insert({
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
      })
      .select()
      .single(); // Ensure we return the inserted row as a single object

    if (saveError) {
      throw saveError;
    }

    console.log("New user saved to Supabase:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error in saveUserToTable function:", error);
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

    if (fetchUserError) throw new Error("Failed to fetch user data.");

    const likedPostsIds: string[] = userData?.liked_posts || [];
    const hasLiked = likedPostsIds.includes(postId);

    // Update the user's liked_posts array
    const updatedLikedPostsIds = hasLiked
      ? likedPostsIds.filter((id) => id !== postId)
      : [...likedPostsIds, postId];

    const { error: updateUserError } = await supabase
      .from("users")
      .update({ liked_posts: updatedLikedPostsIds })
      .eq("id", userId);

    if (updateUserError) throw new Error("Failed to update user like status.");

    // Step 2: Update the liked_by array of the post
    const { data: likedByData, error: fetchLikedByError } = await supabase
      .from("notes")
      .select("liked_by")
      .eq("id", postId)
      .single();

    if (fetchLikedByError) throw new Error("Failed to fetch liked_by data.");

    const updatedLikedByData = hasLiked
      ? likedByData.liked_by.filter((id: string) => id !== userId)
      : [...likedByData.liked_by, userId];

    await supabase
      .from("notes")
      .update({ liked_by: updatedLikedByData })
      .eq("id", postId);

    // Step 3: Update the likes count
    const newLikes = updatedLikedByData.length;
    await supabase.from("notes").update({ likes: newLikes }).eq("id", postId);

    return {
      success: true,
      message: hasLiked
        ? "Post unliked successfully!"
        : "Post liked successfully!",
      likes: newLikes,
      isLiked: !hasLiked,
    };
  } catch (err) {
    console.error(
      `Error toggling like (UserID: ${userId}, PostID: ${postId}):`,
      err
    );
    return { success: false, message: (err as { message: string }).message };
  }
};

/**
 * increment views for a post.
 *
 * @param userId - The ID of the user viewing the post.
 * @param postId - The ID of the post being viewed.
 * @returns - {success, message, views }.
 */
export const incrementViews = async (userId: string, postId: string) => {
  try {
    const { data: userData, error: fetchUserError } = await supabase
      .from("users")
      .select("viewed_posts")
      .eq("id", userId)
      .single();

    if (fetchUserError) throw new Error("Failed to fetch user data.");

    const viewedPostsIds: string[] = userData?.viewed_posts || [];
    if (viewedPostsIds.includes(postId)) {
      return {
        success: false,
        message: "Already viewed",
        views: viewedPostsIds.length,
      };
    }

    const updatedViewedPostsIds = [...viewedPostsIds, postId];

    const { error: updateUserError } = await supabase
      .from("users")
      .update({ viewed_posts: updatedViewedPostsIds })
      .eq("id", userId);

    if (updateUserError) throw new Error("Failed to update viewed posts.");

    // Update the viewed_by array for the post
    const { data: postViewedData, error: fetchViewedByError } = await supabase
      .from("notes")
      .select("viewed_by")
      .eq("id", postId)
      .single();

    if (fetchViewedByError)
      throw new Error("Failed to fetch post viewed_by data.");

    const updatedViewedByData = [...postViewedData?.viewed_by, userId];
    const newViews = updatedViewedByData.length;

    await supabase
      .from("notes")
      .update({ viewed_by: updatedViewedByData, views: newViews })
      .eq("id", postId);

    return {
      success: true,
      message: "Post viewed successfully!",
      views: newViews,
    };
  } catch (err) {
    console.error(
      `Error incrementing views (UserID: ${userId}, PostID: ${postId}):`,
      err
    );
    return { success: false, message: (err as { message: string }).message };
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

    const { error } = await supabase.storage
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
 * @returns nothing.
 */
export const saveFileMetadata = async (metadata: Omit<Note, "id">) => {
  try {
    const { error } = await supabase.from("notes").insert({
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
      liked_by: [],
      viewed_by: [],
    });

    if (error) throw error;
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
 * @returns nothing.
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

    const { error } = await supabase.from("quizzes").insert({
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
      ...currentQuizData?.filter((quiz) => quiz.id !== quizSummary.id),
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

/**
 * Fetch a user's activities from the database.
 * @param userId - The ID of the user whose activities are being fetched.
 * @returns The activities of the user.
 */
export const fetchUserActivities = async (userId: string) => {
  try {
    const { data, error: fetchError } = await supabase
      .from("user_activities")
      .select("activities")
      .eq("user_id", userId)
      .single();

    if (fetchError || !data) {
      throw new Error("Failed to fetch current user activites.");
    }

    return data.activities;
  } catch (error) {
    console.error("Error fetching user activities:", error);
    throw new Error("Failed to fetch activities.");
  }
};

interface NewActivity {
  type: string;
  title: string;
  date: string;
  score?: number;
}
/**
 * Update a user's activities from the database.
 * @param userId - The ID of the user whose activities are being updated.
 * @param newActivity - New activity of user to be inserted.
 * @returns The updated user activities.
 */
export const updateUserActivities = async (
  userId: string,
  newActivity: NewActivity
) => {
  try {
    const data = await fetchUserActivities(userId);

    const updatedUserActivites: NewActivity[] = [...data, newActivity];
    const { error } = await supabase
      .from("user_activities")
      .update({ activities: updatedUserActivites })
      .eq("user_id", userId);

    const updatedData = await fetchUserActivities(userId);
    if (!updatedData || error)
      throw new Error("failed to update user activities");

    return data.activites;
  } catch (error) {
    console.error("Error fetching user activities:", error);
    throw new Error("Failed to fetch activities.");
  }
};

/**
 * Add a user's activity to the database.
 * @param userId - The ID of the user whose activity is being added.
 * @param newActivity - New activity of user to be inserted.
 * @returns notihing.
 */
export const addUserActivities = async (
  userId: string,
  newActivity: NewActivity
) => {
  try {
    const { error } = await supabase.from("user_activities").insert({
      user_id: userId,
      activities: [newActivity],
    });

    if (error) throw new Error("Failed to add user activity");
  } catch (error) {
    console.error("Error adding user activity:", error);
  }
};

/**
 * Save upcoming_quiz in upcoming_quizzes table.
 * @param upcoming_quiz - The upcoming_quiz data to be inserted.
 * @returns saved upcoming_quiz.
 */
export const saveUpcomingQuiz = async (upcoming_quiz: {
  subject: string;
  topic: string;
  date: string;
}) => {
  try {
    const { data, error } = await supabase.from("upcoming_quizzes").insert({
      subject: upcoming_quiz.subject,
      topic: upcoming_quiz.topic,
      date: upcoming_quiz.date,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error saving upcoming quiz:", error);
  }
};

/**
 * Fetch upcoming quiz from upcoming_quizzes table.
 * @returns Array of upcoming quizzes from today.
 */
export const getUpcomingQuizes = async () => {
  try {
    const todaysDate = new Date().toISOString();
    const { data, error } = await supabase
      .from("upcoming_quizzes")
      .select("*")
      .gte("date", todaysDate)
      .order("date", { ascending: true });

    if (error || !data) throw error;

    return data;
  } catch (error) {
    console.error("Error saving upcoming quiz:", error);
  }
};
