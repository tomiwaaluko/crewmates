import { useState } from "react";
import { Crewmate } from "../types/crewmate";

interface BulkActionsProps {
  selectedCrewmates: Crewmate[];
  onBulkDelete: (ids: string[]) => Promise<void>;
  onBulkExport: (crewmates: Crewmate[]) => void;
  onClearSelection: () => void;
}

export default function BulkActions({
  selectedCrewmates,
  onBulkDelete,
  onBulkExport,
  onClearSelection,
}: BulkActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleBulkDelete = async () => {
    if (selectedCrewmates.length === 0) return;

    setIsDeleting(true);
    try {
      const ids = selectedCrewmates.map((c) => c.id);
      await onBulkDelete(ids);
      onClearSelection();
      setShowConfirm(false);
    } catch (error) {
      console.error("Bulk delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    onBulkExport(selectedCrewmates);
  };

  if (selectedCrewmates.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-purple-900/90 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 shadow-xl">
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">
              {selectedCrewmates.length} crewmate
              {selectedCrewmates.length !== 1 ? "s" : ""} selected
            </span>

            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="px-3 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors duration-200 text-sm font-medium"
              >
                📤 Export
              </button>

              <button
                onClick={() => setShowConfirm(true)}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
              >
                🗑️ Delete
              </button>

              <button
                onClick={onClearSelection}
                className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
              >
                ✕ Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-purple-500/30 rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold text-white mb-2">
              Confirm Bulk Delete
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete {selectedCrewmates.length}{" "}
              crewmate{selectedCrewmates.length !== 1 ? "s" : ""}? This action
              cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
