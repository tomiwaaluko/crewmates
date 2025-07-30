import React, { useState } from "react";
import { CREWMATE_COLORS, CrewmateFormData } from "../types/crewmate";

interface CrewmateFormProps {
  initialData?: Partial<CrewmateFormData>;
  onSubmit: (data: CrewmateFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitText?: string;
}

const CrewmateForm: React.FC<CrewmateFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitText = "Create Crewmate",
}) => {
  const [formData, setFormData] = useState<CrewmateFormData>({
    name: initialData.name || "",
    speed: initialData.speed || 50,
    color: initialData.color || "red",
    category: initialData.category || "",
    success_metric: initialData.success_metric || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CrewmateFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CrewmateFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (formData.speed < 0 || formData.speed > 100) {
      newErrors.speed = "Speed must be between 0 and 100";
    }

    if (!formData.color) {
      newErrors.color = "Color is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    field: keyof CrewmateFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Input */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white ${
            errors.name ? "border-red-500" : "border-gray-600"
          }`}
          placeholder="Enter crewmate name"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Speed Input */}
      <div>
        <label
          htmlFor="speed"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Speed: {formData.speed}
        </label>
        <input
          type="range"
          id="speed"
          min="0"
          max="100"
          value={formData.speed}
          onChange={(e) => handleInputChange("speed", parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          disabled={isLoading}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
        {errors.speed && (
          <p className="mt-1 text-sm text-red-500">{errors.speed}</p>
        )}
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Color:
        </label>
        <div className="grid grid-cols-4 gap-3">
          {CREWMATE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleInputChange("color", color)}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                formData.color === color
                  ? "border-purple-500 ring-2 ring-purple-300"
                  : "border-gray-600 hover:border-gray-400"
              }`}
              disabled={isLoading}
            >
              <div
                className="w-8 h-10 mx-auto rounded-full"
                style={{
                  backgroundColor: getCrewmateColorStyle(color),
                  clipPath: "ellipse(50% 60% at 50% 40%)",
                }}
              >
                {/* Simple crewmate visor */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-5 h-3 bg-cyan-200 rounded-full opacity-80"></div>
              </div>
              <p className="text-xs text-gray-300 mt-2 capitalize">{color}</p>
            </button>
          ))}
        </div>
        {errors.color && (
          <p className="mt-1 text-sm text-red-500">{errors.color}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 font-space"
        >
          {isLoading ? "Creating..." : submitText}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 font-space"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CrewmateForm;
