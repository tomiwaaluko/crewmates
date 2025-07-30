import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CrewmateForm from "../components/CrewmateForm";
import { Crewmate, CrewmateFormData } from "../types/crewmate";
import { crewmateService } from "../utils/crewmateService";

const EditCrewmatePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [crewmate, setCrewmate] = useState<Crewmate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (formData: CrewmateFormData) => {
    if (!id) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await crewmateService.updateCrewmate(id, formData);
      navigate(`/crewmate/${id}`);
    } catch (err) {
      console.error("Error updating crewmate:", err);
      setError("Failed to update crewmate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/crewmate/${id}`);
    } else {
      navigate("/gallery");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
          <p className="text-gray-300">Loading crewmate...</p>
        </div>
      </div>
    );
  }

  if (error || !crewmate) {
    return (
      <div className="max-w-2xl mx-auto text-center">
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
    <div className="max-w-2xl mx-auto">
      {/* Navigation */}
      <div className="mb-6">
        <Link
          to={`/crewmate/${id}`}
          className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
        >
          ← Back to {crewmate.name}
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 font-space">
          Update Your Crewmate :)
        </h1>

        {/* Current Crewmate Display */}
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <h2 className="text-lg text-gray-300 mb-2">
              Current Crewmate Info:
            </h2>
            <p className="text-white font-semibold">
              {crewmate.name} •{" "}
              <span className="capitalize">{crewmate.color}</span> •{" "}
              {crewmate.speed} mph
            </p>
          </div>
        </div>
      </div>

      <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <CrewmateForm
          initialData={{
            name: crewmate.name,
            speed: crewmate.speed,
            color: crewmate.color,
            category: crewmate.category || "",
            success_metric: crewmate.success_metric || "",
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
          submitText="Update Crewmate"
        />
      </div>
    </div>
  );
};

export default EditCrewmatePage;
