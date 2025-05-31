import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";

export default function ProfilePictureUpload({
  readablePicture,
  setReadablePicture,
  setPicture,
}) {
  //   const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    if (!file.type.match("image.*")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setPicture(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setReadablePicture(e.target.result);
    };
  };

  const removeImage = () => {
    setPicture(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center mb-6">
        {/* Preview or Placeholder */}
        <div className="relative mb-4">
          {preview ? (
            <div className="relative">
              <img
                src={readablePicture}
                alt="Profile Preview"
                className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300"
              onClick={triggerFileInput}
            >
              <Camera size={40} className="text-gray-500" />
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          name="picture"
          id="picture"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
        />

        {/* Visible Controls */}
        <div className="flex flex-col items-center w-full">
          <button
            type="button"
            onClick={triggerFileInput}
            className="flex items-center justify-center px-4 py-2 mb-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
          >
            <Upload size={18} className="mr-2" />
            {preview ? "Change Photo" : "Upload Photo"}
          </button>

          {/* Error Message */}
          {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
        </div>
      </div>
    </div>
  );
}
