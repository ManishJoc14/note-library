"use client";

import React, { useState } from "react";
import { Plus, Minus, Upload } from "lucide-react";
import { Quiz, Question } from "../../../../types";
import { saveQuiz, uploadFile } from "../../../../lib/supabase";
import { validateFile } from "../../../../lib/helperfuntions";
import toast, { Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const SUBJECTS = [
  "Physics",
  "Chemistry",
  "Mathematics",
  "Nepali",
  "English",
  "ComputerScience",
];

const QuizCreator: React.FC = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("11");
  const [duration, setDuration] = useState(30);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Medium"
  );

  const [questions, setQuestions] = useState<Question[]>([
    { id: uuidv4(), text: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: uuidv4(), text: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (
    index: number,
    field: keyof Omit<Question, "id">,
    value: { index: number; text: string } | string | number
  ) => {
    const newQuestions = [...questions];

    if (field === "options") {
      const optionValue = value as { index: number; text: string };
      newQuestions[index].options[optionValue.index] = optionValue.text;
    } else {
      (newQuestions[index][field] as string | number) = value as
        | string
        | number;
    }

    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsUploading(true);

    try {
      if (!image) throw new Error("Please select a file");
      validateFile(image, "image");
      const path = `${grade}/${subject.toLowerCase()}`;
      const uploadedFile = await uploadFile(image, path, title, "quizzes");

      const metaData: Omit<Quiz, "id"> = {
        title,
        subject,
        grade,
        duration,
        difficulty,
        questions: questions.map((q, i) => ({ ...q, id: uuidv4() })), // add id's
        participants: 0,
        avg_score: 0,
        created_at: new Date().toISOString(),
        image: uploadedFile.publicUrl,
      };

      console.log(metaData);
      await saveQuiz(metaData);

      // Reset form
      setImage(null);
      setTitle("");
      setSubject("");

      console.log("Image uploaded and metadata(quiz) saved successfully.");
      toast.success("Quiz uplaoded!!", { duration: 3000 });
    } catch (error: any) {
      setError(error.message || "An error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white rounded-xl shadow-sm p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Title
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
              >
                <option value={"11"}>Grade 11</option>
                <option value={"12"}>Grade 12</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={duration || 1}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                min="1"
                required
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
                disabled={isUploading}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              onChange={(e) => {
                const selectedImage = e.target.files?.[0];
                if (selectedImage) {
                  try {
                    validateFile(selectedImage, "image");
                    setImage(selectedImage);
                    setError("");
                  } catch (err: any) {
                    setError(err.message);
                  }
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".png,.jpg,.jpeg"
              required
              disabled={isUploading}
            />
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {image
                  ? image.name
                  : "Drop your Image here, or click to select"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, JPEG up to 10MB
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((question, qIndex) => (
              <div
                key={question.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Question {qIndex + 1}</h3>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Minus size={20} />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "text", e.target.value)
                    }
                    placeholder="Enter question"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                    disabled={isUploading}
                  />

                  {question.options.map((option, oIndex) => (
                    <div
                      key={oIndex}
                      className="flex items-center gap-4"
                    >
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() =>
                          handleQuestionChange(qIndex, "correctAnswer", oIndex)
                        }
                        required
                        disabled={isUploading}
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleQuestionChange(qIndex, "options", {
                            index: oIndex,
                            text: e.target.value,
                          })
                        }
                        placeholder={`Option ${oIndex + 1}`}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                        disabled={isUploading}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddQuestion}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              disabled={isUploading}
            >
              <Plus size={20} />
              Add Question
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Create Quiz"}
          </button>
        </form>
      </div>
    </>
  );
};

export default QuizCreator;
