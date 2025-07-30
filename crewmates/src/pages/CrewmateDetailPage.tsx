import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Crewmate } from "../types/crewmate";
import { crewmateService } from "../utils/crewmateService";

const CrewmateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [crewmate, setCrewmate] = useState<Crewmate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCrewmate(id);
    }
  }, [id]);

  const loadCrewmate = async (crewmateId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await crewmateService.getCrewmateById(crewmateId);
      if (data) {
        setCrewmate(data);
      } else {
        setError("Crewmate not found");
      }
    } catch (err) {
      console.error("Error loading crewmate:", err);
      setError("Failed to load crewmate");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!crewmate) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${crewmate.name}? This action cannot be undone.`
      )
    ) {
      try {
        await crewmateService.deleteCrewmate(crewmate.id);
        navigate("/gallery");
      } catch (err) {
        console.error("Error deleting crewmate:", err);
        alert("Failed to delete crewmate. Please try again.");
      }
    }
  };

  const getCrewmateColorStyle = (color: string): string => {
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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
          <p className="text-gray-300">Loading crewmate...</p>
        </div>
      </div>
    );
  }

  if (error || !crewmate) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
          <p className="text-red-300 mb-4">{error || "Crewmate not found"}</p>
          <Link
            to="/gallery"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="mb-6">
        <Link
          to="/gallery"
          className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
        >
          ← Back to Gallery
        </Link>
      </div>

      <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Crewmate Visual */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div
                className="w-40 h-48 rounded-full relative"
                style={{
                  backgroundColor: getCrewmateColorStyle(crewmate.color),
                  clipPath: "ellipse(50% 60% at 50% 40%)",
                }}
              >
                {/* Crewmate visor */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-cyan-200 rounded-full opacity-80"></div>
                {/* Backpack */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gray-600 rounded-t-lg"></div>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2 font-space">
              Crewmate: {crewmate.name}
            </h1>
          </div>

          {/* Crewmate Stats */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white font-space">Stats:</h2>

            <div className="space-y-4 text-lg">
              <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300">Color:</span>
                <span className="text-white capitalize font-semibold">
                  {crewmate.color}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300">Speed:</span>
                <span className="text-white font-semibold">
                  {crewmate.speed} mph
                </span>
              </div>

              {crewmate.category && (
                <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Category:</span>
                  <span className="text-white font-semibold">
                    {crewmate.category}
                  </span>
                </div>
              )}

              {crewmate.success_metric && (
                <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Success Metric:</span>
                  <span className="text-white font-semibold">
                    {crewmate.success_metric}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300">Created:</span>
                <span className="text-white font-semibold">
                  {new Date(crewmate.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="pt-6 text-center">
              <p className="text-gray-400 mb-6">
                You may find a Crewmate with more speed. It's not a bad idea! 😊
              </p>

              {/* Action Icons */}
              <div className="flex justify-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">💀</span>
                </div>
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">💖</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-600">
          <Link
            to={`/edit/${crewmate.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors duration-200 font-space"
          >
            Update Crewmate
          </Link>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 font-space"
          >
            Delete Crewmate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrewmateDetailPage;
