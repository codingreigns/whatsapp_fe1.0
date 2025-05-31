import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { addFiles } from "../../app/features/chatSlice";
import { getFileTypeUtil } from "../../utils/file";

const PhotoAttachment = () => {
  const dispatch = useDispatch();
  const photoRef = useRef(null);

  // Constants for better maintainability
  const ALLOWED_FILE_TYPES = [
    // Image formats
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/svg+xml",
    // Video formats
    "video/mp4",
    "video/mov",
    "video/avi",
    "video/webm",
    "video/quicktime",
  ];

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  // Helper function to validate file type
  const isValidFileType = (fileType) => {
    return ALLOWED_FILE_TYPES.includes(fileType);
  };

  // Helper function to validate file size
  const isValidFileSize = (fileSize) => {
    return fileSize <= MAX_FILE_SIZE;
  };

  // Helper function to get media type (image/video)
  // const getMediaType = (file) => {
  //   return file.type.split("/")[0] || "unknown";
  // };

  // Helper function to determine if file is image or video
  // const isImageFile = (fileType) => {
  //   return fileType.startsWith("image/");
  // };

  // Helper function to process individual file
  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        // const mediaType = getMediaType(file);

        dispatch(
          addFiles({
            file: file,
            fileData: e.target.result, // Keep same property name for compatibility
            type: getFileTypeUtil(file.type),
            // isImage: getFileTypeUtil(file.type),
            // isVideo: getFileTypeUtil(file.type),
          })
        );
        resolve();
      };

      reader.onerror = (error) => {
        console.error(`Error reading file ${file.name}:`, error);
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  // Main file handler
  const imageHandler = async (e) => {
    try {
      const selectedFiles = Array.from(e.target.files);

      if (selectedFiles.length === 0) return;

      // Filter valid files
      const validFiles = selectedFiles.filter((file) => {
        // Check file type
        if (!isValidFileType(file.type)) {
          console.warn(`Invalid file type: ${file.name} (${file.type})`);
          return false;
        }

        // Check file size
        if (!isValidFileSize(file.size)) {
          console.warn(
            `File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(
              2
            )}MB)`
          );
          return false;
        }

        return true;
      });

      // Show user feedback for invalid files
      const invalidFileCount = selectedFiles.length - validFiles.length;
      if (invalidFileCount > 0) {
        // You can replace this with a toast notification or modal
        alert(
          `${invalidFileCount} file(s) were skipped due to invalid type or size (max 5MB)`
        );
      }

      // Process valid files
      if (validFiles.length > 0) {
        console.log(`Processing ${validFiles.length} valid media file(s)`);

        // Process files concurrently
        const processPromises = validFiles.map(processFile);
        await Promise.all(processPromises);

        console.log("All media files processed successfully");
      }
    } catch (error) {
      console.error("Error processing media files:", error);
      // You can add user-friendly error handling here
    } finally {
      // Reset the input value to allow selecting the same file again
      e.target.value = "";
    }
  };

  const handleButtonClick = () => {
    photoRef.current?.click();
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-500 cursor-pointer transition-colors">
      <button
        className="flex items-center gap-3 hover:cursor-pointer"
        type="button"
        onClick={handleButtonClick}
        aria-label="Select photos and videos"
      >
        {/* Use your actual PhotoIcon component here */}
        <div className="w-5 h-5 text-teal-400">
          {/* Fallback SVG - remove this when using PhotoIcon */}
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
          </svg>
        </div>
        <span className="text-white text-sm">Gallery</span>
      </button>

      <input
        ref={photoRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={imageHandler}
        hidden
        aria-hidden="true"
      />
    </div>
  );
};

export default PhotoAttachment;
