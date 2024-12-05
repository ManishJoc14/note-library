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

export const timeAgo = (timestamp: string) => {
  const now = new Date();
  const date = new Date(timestamp);

  const diffMs = now.getTime() - date.getTime(); // Difference in milliseconds
  const diffSec = Math.floor(diffMs / 1000); // Seconds
  const diffMin = Math.floor(diffSec / 60); // Minutes
  const diffHours = Math.floor(diffMin / 60); // Hours
  const diffDays = Math.floor(diffHours / 24); // Days
  const diffWeeks = Math.floor(diffDays / 7); // Weeks
  const diffMonths = Math.floor(diffDays / 30); // Approx. months
  const diffYears = Math.floor(diffDays / 365); // Approx. years

  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
  if (diffMonths < 12) return `${diffMonths} months ago`;
  return `${diffYears} years ago`;
};

export const formatCustomDate = (inputDate: string) => {
  const date = new Date(inputDate);

  const day = date.toLocaleString("en-US", { weekday: "short" });
  const month = date.toLocaleString("en-US", { month: "short" });
  const dayNumber = date.toLocaleString("en-US", { day: "2-digit" });
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${day} ${month} ${dayNumber} ${time}`;
};
