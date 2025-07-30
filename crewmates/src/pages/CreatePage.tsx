import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrewmateForm from "../components/CrewmateForm";
import { CrewmateFormData } from "../types/crewmate";
import { crewmateService } from "../utils/crewmateService";

const CreatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData: CrewmateFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await crewmateService.createCrewmate(formData);
      // Redirect to gallery after successful creation
      navigate("/gallery");
    } catch (err) {
      console.error("Error creating crewmate:", err);
      setError(
        "Failed to create crewmate. Please check your Supabase connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/gallery");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 font-space">
          Create a New Crewmate
        </h1>

        {/* Crewmate Characters Display */}
        <div className="flex justify-center space-x-2 mb-6">
          {["red", "blue", "green", "pink", "orange", "yellow"].map((color) => (
            <div
              key={color}
              className="w-8 h-10 rounded-full relative"
              style={{
                backgroundColor: getCrewmateColor(color),
                clipPath: "ellipse(50% 60% at 50% 40%)",
              }}
            >
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-5 h-3 bg-cyan-200 rounded-full opacity-80"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <CrewmateForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          submitText="Create Crewmate"
        />
      </div>
    </div>
  );
};

// Helper function to get crewmate colors
const getCrewmateColor = (color: string): string => {
  const colorMap: Record<string, string> = {
    red: "#c51111",
    blue: "#1919c7",
    green: "#00b04f",
    pink: "#ee54bb",
    orange: "#f07c1d",
    yellow: "#f5f557",
    black: "#3f474e",
    white: "#d6e0f0",
    purple: "#6b2fbb",
    brown: "#71491e",
    cyan: "#50ef39",
    lime: "#50ef39",
  };
  return colorMap[color] || "#3f474e";
};

export default CreatePage;
