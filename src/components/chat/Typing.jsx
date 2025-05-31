import { useState, useEffect } from "react";

export default function FancyTypingIndicator({ typing, username = "" }) {
  // Animation state for enhanced effects
  const [animationState, setAnimationState] = useState(0);

  // Cycle through animation states for extra flair
  useEffect(() => {
    if (!typing) return;

    const interval = setInterval(() => {
      setAnimationState((prev) => (prev + 1) % 3);
    }, 1500);

    return () => clearInterval(interval);
  }, [typing]);

  if (!typing) return null;

  return (
    <div className="relative">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 opacity-30 blur-xl rounded-full" />

      {/* Main container */}
      <div className="relative flex items-center space-x-2 py-3 px-5 bg-white dark:bg-gray-800 rounded-full shadow-lg max-w-fit my-2">
        {/* Animated avatar placeholder */}
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center animate-pulse">
          <span className="text-white text-xs font-bold">
            {username.charAt(0).toUpperCase()}
          </span>

          {/* Ripple effect */}
          <span className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75" />
        </div>

        {/* Text with typing animation */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {username}
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              typing
            </span>
            <div className="flex space-x-1 items-end h-5 overflow-hidden">
              {/* Animated dots */}
              <div
                className={`w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full ${
                  animationState === 0 ? "animate-bounce" : ""
                }`}
                style={{ animationDelay: "0ms" }}
              />

              <div
                className={`w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full ${
                  animationState === 1 ? "animate-bounce" : ""
                }`}
                style={{ animationDelay: "150ms" }}
              />

              <div
                className={`w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full ${
                  animationState === 2 ? "animate-bounce" : ""
                }`}
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>

        {/* Keyboard animation */}
        <div className="ml-1 hidden sm:block">
          <div className="flex space-x-px">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-1 h-3 bg-gray-300 dark:bg-gray-600 rounded-sm ${
                  i === animationState || (i === 3 && animationState === 0)
                    ? "opacity-100"
                    : "opacity-30"
                } transition-opacity duration-300`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Optional: Decorative particle effects */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75" />
      <div
        className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75"
        style={{ animationDelay: "400ms" }}
      />
    </div>
  );
}
