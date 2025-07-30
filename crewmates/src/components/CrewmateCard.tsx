import React from "react";
import { Link } from "react-router-dom";
import { Crewmate } from "../types/crewmate";

interface CrewmateCardProps {
  crewmate: Crewmate;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onSelect?: (crewmate: Crewmate, isSelected: boolean) => void;
  isSelected?: boolean;
  showActions?: boolean;
}

const CrewmateCard: React.FC<CrewmateCardProps> = ({
  crewmate,
  onDelete,
  onToggleFavorite,
  onSelect,
  isSelected = false,
  showActions = true,
}) => {
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

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      onDelete &&
      window.confirm(`Are you sure you want to delete ${crewmate.name}?`)
    ) {
      onDelete(crewmate.id);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(crewmate.id);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(crewmate, e.target.checked);
    }
  };

  return (
    <div className={`relative ${isSelected ? "ring-2 ring-purple-500" : ""}`}>
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Favorite Button */}
      {onToggleFavorite && (
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 z-10 text-lg hover:scale-110 transition-transform duration-200"
          title={
            crewmate.is_favorite ? "Remove from favorites" : "Add to favorites"
          }
        >
          {crewmate.is_favorite ? "⭐" : "☆"}
        </button>
      )}

      <Link to={`/crewmate/${crewmate.id}`} className="block">
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 hover:border-purple-400 transition-all duration-200 group">
          {/* Crewmate Visual */}
          <div className="flex justify-center mb-4">
            <div
              className="w-20 h-24 rounded-full relative group-hover:scale-110 transition-transform duration-200"
              style={{
                backgroundColor: getCrewmateColorStyle(crewmate.color),
                clipPath: "ellipse(50% 60% at 50% 40%)",
              }}
            >
              {/* Crewmate visor */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-cyan-200 rounded-full opacity-80"></div>
              {/* Backpack */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gray-600 rounded-t-lg"></div>
            </div>
          </div>

          {/* Crewmate Info */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-white font-space">
              {crewmate.name}
            </h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>
                <span className="text-gray-400">Speed:</span> {crewmate.speed}{" "}
                mph
              </p>
              <p>
                <span className="text-gray-400">Color:</span>{" "}
                <span className="capitalize">{crewmate.color}</span>
              </p>
              {crewmate.category && (
                <p>
                  <span className="text-gray-400">Category:</span>{" "}
                  {crewmate.category}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 mt-4">
              <Link
                to={`/edit/${crewmate.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded transition-colors duration-200 text-center"
              >
                Edit Crewmate
              </Link>
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded transition-colors duration-200"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default CrewmateCard;
