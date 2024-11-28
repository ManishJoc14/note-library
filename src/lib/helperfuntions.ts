export const validateFile = (file: File, type: "pdf" | "image") => {
  const allowedPdfTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];

  let allowedTypes: string[];
  let maxSize: number;

  if (type === "pdf") {
    allowedTypes = allowedPdfTypes;
    maxSize = 50 * 1024 * 1024; // 50MB
  } else if (type === "image") {
    allowedTypes = allowedImageTypes;
    maxSize = 10 * 1024 * 1024; // 10MB
  } else {
    throw new Error("Invalid file type specified.");
  }

  // Check if file type is allowed
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      type === "pdf"
        ? "Only PDF and Word documents are allowed."
        : "Only JPEG and PNG images are allowed."
    );
  }

  // Check if file size exceeds the limit
  if (file.size > maxSize) {
    throw new Error("File size must be less than 50MB.");
  }
};


export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};