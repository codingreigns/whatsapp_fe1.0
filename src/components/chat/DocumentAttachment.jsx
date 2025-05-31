import React, { useRef } from "react";
import { DocumentIcon } from "../../svg";
import { addFiles } from "../../app/features/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { getFileTypeUtil } from "../../utils/file";

const DocumentAttachment = () => {
  const { files } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const documentRef = useRef(null);

  // Constants for better maintainability
  const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "application/vnd.rar",
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

  // Helper function to get file type from file object
  // const getFileType = (file) => {
  //   return getFileTypeUtil(file.type.split("/")[1] || "unknown");
  // };

  // Helper function to process individual file
  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        dispatch(
          addFiles({
            file: file,
            fileData: e.target.result,
            type: getFileTypeUtil(file.type),
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
  const documentHandler = async (e) => {
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
        console.log(`Processing ${validFiles.length} valid file(s)`);

        // Process files concurrently
        const processPromises = validFiles.map(processFile);
        await Promise.all(processPromises);

        console.log("All files processed successfully");
      }
    } catch (error) {
      console.error("Error processing files:", error);
      // You can add user-friendly error handling here
    } finally {
      // Reset the input value to allow selecting the same file again
      e.target.value = "";
    }
  };

  const handleButtonClick = () => {
    documentRef.current?.click();
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-500 cursor-pointer transition-colors">
      <button
        className="flex items-center gap-3 hover:cursor-pointer"
        type="button"
        onClick={handleButtonClick}
        aria-label="Select document files"
      >
        {/* Use your actual DocumentIcon component here */}
        <div className="w-5 h-5 text-purple-400">
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        </div>
        <span className="text-white text-sm">Document</span>
      </button>

      <input
        ref={documentRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt,.ods,.odp,.zip,.rar"
        multiple
        onChange={documentHandler}
        hidden
        aria-hidden="true"
      />
    </div>
  );
};

export default DocumentAttachment;
