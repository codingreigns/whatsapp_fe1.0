import React, { useRef, useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addFiles } from "../../app/features/chatSlice";

const CameraIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
  </svg>
);

const CloseIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
  </svg>
);

const CaptureIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      fill="white"
    />
    <circle cx="12" cy="12" r="4" fill="currentColor" />
  </svg>
);

const SwitchCameraIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
    <path d="M16,7V3H14V7H10V3H8V7H8C6.89,7 6,7.89 6,9V19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V9C18,7.89 17.11,7 16,7M16,19H8V9H16V19M12,10.5A2.5,2.5 0 0,0 9.5,13A2.5,2.5 0 0,0 12,15.5A2.5,2.5 0 0,0 14.5,13A2.5,2.5 0 0,0 12,10.5Z" />
  </svg>
);

const CameraAttachment = () => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Check for multiple cameras on mount
  useEffect(() => {
    const checkCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setHasMultipleCameras(videoDevices.length > 1);
      } catch (err) {
        console.log("Could not enumerate devices:", err);
      }
    };

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      checkCameras();
    }
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setError(null);
  }, []);

  const startCamera = useCallback(async () => {
    // Check if browser supports camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera not supported in this browser");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
        audio: false,
      };

      console.log("Requesting camera with constraints:", constraints);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((err) => {
            console.error("Error playing video:", err);
            setError("Failed to start video preview");
          });
        };
      }

      setIsCameraOpen(true);
      console.log("Camera started successfully");
    } catch (err) {
      console.error("Camera error:", err);
      let message;

      if (err.name === "NotAllowedError") {
        message =
          "Camera access denied. Please allow camera permissions and try again.";
      } else if (err.name === "NotFoundError") {
        message = "No camera found on this device.";
      } else if (err.name === "NotSupportedError") {
        message = "Camera not supported in this browser.";
      } else if (err.name === "OverconstrainedError") {
        message = "Camera constraints not supported. Trying basic settings...";
        // Try with basic constraints
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          streamRef.current = basicStream;
          if (videoRef.current) {
            videoRef.current.srcObject = basicStream;
            videoRef.current.play();
          }
          setIsCameraOpen(true);
          setError(null);
        } catch (basicErr) {
          setError("Failed to access camera with basic settings");
          console.log(basicErr);
        }
      } else {
        message = `Camera error: ${err.message || "Unknown error occurred"}`;
      }

      if (message) {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [facingMode]);

  const switchCamera = useCallback(async () => {
    if (!hasMultipleCameras) return;

    const newFacingMode = facingMode === "user" ? "environment" : "user";
    stopCamera();

    // Small delay to ensure camera is properly stopped
    setTimeout(() => {
      setFacingMode(newFacingMode);
    }, 200);
  }, [facingMode, hasMultipleCameras, stopCamera]);

  // Restart camera when facing mode changes
  useEffect(() => {
    if (isCameraOpen && !isLoading) {
      startCamera();
    }
  }, [facingMode]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) {
      setError("Camera not ready for capture");
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Ensure video is playing and has dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setError("Video not ready, please wait and try again");
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const fileName = `camera-photo-${timestamp}.jpg`;

            // Create a File object
            const file = new File([blob], fileName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            // Convert to data URL for preview
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = (e) => {
              dispatch(
                addFiles({
                  file: file,
                  imageData: e.target.result,
                  type: "jpeg",
                })
              );
            };

            // Close camera after successful capture
            stopCamera();
          } else {
            setError("Failed to capture photo");
          }
        },
        "image/jpeg",
        0.9
      );
    } catch (err) {
      console.error("Capture error:", err);
      setError("Failed to capture photo: " + err.message);
    }
  }, [dispatch, stopCamera]);

  const handleCameraClick = () => {
    if (isCameraOpen) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Camera interface
  if (isCameraOpen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Camera Header */}
        <div className="flex justify-between items-center p-4 bg-black/80 text-white">
          <button
            onClick={stopCamera}
            className="p-2 rounded-full bg-gray-800/70 hover:bg-gray-700/70 transition-colors"
            aria-label="Close camera"
          >
            <CloseIcon />
          </button>

          <div className="text-center">
            <span className="text-sm">Camera</span>
            {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
          </div>

          {hasMultipleCameras && (
            <button
              onClick={switchCamera}
              className="p-2 rounded-full bg-gray-800/70 hover:bg-gray-700/70 transition-colors"
              aria-label="Switch camera"
            >
              <SwitchCameraIcon />
            </button>
          )}

          {!hasMultipleCameras && <div className="w-10 h-10"></div>}
        </div>

        {/* Camera View */}
        <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            className="max-w-full max-h-full object-contain"
            playsInline
            muted
            autoPlay
          />

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <svg
                  className="animate-spin w-8 h-8 mx-auto mb-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                </svg>
                <div>Starting camera...</div>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {error && !isLoading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-center p-4">
              <div>
                <div className="text-red-400 mb-2">{error}</div>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Camera Controls */}
          {!isLoading && !error && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <button
                onClick={capturePhoto}
                className="p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white transition-colors shadow-lg"
                aria-label="Take photo"
              >
                <CaptureIcon />
              </button>
            </div>
          )}
        </div>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  // Main button
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-500 cursor-pointer transition-colors">
      <button
        className="hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
        onClick={handleCameraClick}
        disabled={isLoading}
      >
        <div className="flex gap-3">
          <div className="w-5 h-5 text-purple-400">
            {isLoading ? (
              <svg
                className="animate-spin w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
              </svg>
            ) : (
              <CameraIcon />
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white text-sm">
              {isLoading ? "Starting Camera..." : "Camera"}
            </span>
            {error && !isCameraOpen && (
              <span className="text-red-400 text-xs mt-1 max-w-32 truncate">
                {error}
              </span>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};

export default CameraAttachment;
