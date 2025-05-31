import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { addFiles } from "../../app/features/chatSlice";
import { getFileTypeUtil } from "../../utils/file";

// Audio MIME types that are supported
const SUPPORTED_AUDIO_TYPES = new Set([
  "audio/mp3",
  "audio/mpeg", // Standard MIME type for MP3
  "audio/wav",
  "audio/m4a",
  "audio/opus",
  "audio/aac", // Fixed typo from "acc"
  "audio/flac",
  "audio/wma",
  "audio/aiff",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const AudioIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
  </svg>
);

const AudioAttachment = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const isValidAudioFile = (file) => {
    return SUPPORTED_AUDIO_TYPES.has(file.type) && file.size <= MAX_FILE_SIZE;
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      dispatch(
        addFiles({
          file: file,
          fileData: e.target.result,
          type: getFileTypeUtil(file.type.split("/")[1]),
        })
      );
    };
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(isValidAudioFile);

    validFiles.forEach(processFile);

    // Reset input to allow selecting the same file again if needed
    e.target.value = "";
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-500 cursor-pointer transition-colors">
      <button
        className="hover:cursor-pointer"
        type="button"
        onClick={handleButtonClick}
      >
        <div className="flex gap-3">
          <div className="w-5 h-5 text-blue-400">
            <AudioIcon />
          </div>
          <span className="text-white text-sm">Audio</span>
        </div>
      </button>
      <input
        accept=".mp3,.wav,.ogg,.m4a,.aac,.flac,.wma,.aiff,.opus"
        onChange={handleFileChange}
        hidden
        type="file"
        multiple
        ref={fileInputRef}
      />
    </div>
  );
};

export default AudioAttachment;
