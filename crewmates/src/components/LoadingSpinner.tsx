import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  message = "Loading...",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
        {/* Spinning ring */}
        <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        {/* Inner crewmate */}
        <div
          className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
          style={{ clipPath: "ellipse(50% 60% at 50% 40%)" }}
        >
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-cyan-200 rounded-full opacity-80"></div>
        </div>
      </div>
      {message && (
        <p className="mt-4 text-gray-300 text-center animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

interface LoadingPageProps {
  title?: string;
  message?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  title = "Loading",
  message = "Please wait...",
}) => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-white mb-8 font-space">{title}</h1>
      <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
        <LoadingSpinner size="lg" message={message} />
      </div>
    </div>
  );
};

export default LoadingSpinner;
