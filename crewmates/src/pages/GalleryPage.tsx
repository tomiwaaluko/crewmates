import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import CrewmateCard from "../components/CrewmateCard";
import BulkActions from "../components/BulkActions";
import KeyboardShortcuts from "../components/KeyboardShortcuts";
import { Crewmate, CREWMATE_COLORS, CrewmateFormData } from "../types/crewmate";
import { crewmateService } from "../utils/crewmateService";
import { exportUtils } from "../utils/exportUtils";

type SortOption = "newest" | "oldest" | "name" | "speed";
type FilterOption = "all" | "favorites" | string;

const GalleryPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [crewmates, setCrewmates] = useState<Crewmate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterColor, setFilterColor] = useState<FilterOption>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrewmates, setSelectedCrewmates] = useState<Crewmate[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  useEffect(() => {
    loadCrewmates();
  }, []);

  // Filtered and sorted crewmates
  const filteredAndSortedCrewmates = useMemo(() => {
    let filtered = crewmates;

    // Filter by favorites
    if (filterColor === "favorites") {
      filtered = filtered.filter((crewmate) => crewmate.is_favorite);
    }
    // Filter by color
    else if (filterColor !== "all") {
      filtered = filtered.filter((crewmate) => crewmate.color === filterColor);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((crewmate) =>
        crewmate.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        case "speed":
          return b.speed - a.speed;
        default:
          return 0;
      }
    });

    return sorted;
  }, [crewmates, sortBy, filterColor, searchTerm]);

  useEffect(() => {
    loadCrewmates();
  }, []);

  const loadCrewmates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await crewmateService.getAllCrewmates();
      setCrewmates(data);
    } catch (err) {
      console.error("Error loading crewmates:", err);
      setError(
        "Failed to load crewmates. Please check your Supabase connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCrewmate = async (id: string) => {
    try {
      await crewmateService.deleteCrewmate(id);
      // Remove the deleted crewmate from the local state
      setCrewmates((prev) => prev.filter((crewmate) => crewmate.id !== id));
      // Remove from selection if selected
      setSelectedCrewmates((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting crewmate:", err);
      alert("Failed to delete crewmate. Please try again.");
    }
  };

  // Phase 4: New functionality
  const handleToggleFavorite = async (id: string) => {
    try {
      const updated = await crewmateService.toggleFavorite(id);
      setCrewmates((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert("Failed to update favorite status.");
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await crewmateService.bulkDelete(ids);
      setCrewmates((prev) => prev.filter((c) => !ids.includes(c.id)));
      setSelectedCrewmates([]);
    } catch (err) {
      console.error("Error bulk deleting:", err);
      alert("Failed to delete crewmates. Please try again.");
    }
  };

  const handleBulkExport = (crewmates: Crewmate[]) => {
    exportUtils.exportToJSON(
      crewmates,
      `selected-crewmates-${Date.now()}.json`
    );
  };

  const handleExportAll = () => {
    if (filteredAndSortedCrewmates.length === 0) {
      alert("No crewmates to export!");
      return;
    }

    const filename = `crewmates-${Date.now()}`;
    exportUtils.exportToJSON(filteredAndSortedCrewmates, `${filename}.json`);
    exportUtils.exportToCSV(filteredAndSortedCrewmates, `${filename}.csv`);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const importedData = await exportUtils.importFromJSON(file);

      // Create all imported crewmates
      for (const crewmateData of importedData) {
        await crewmateService.createCrewmate(crewmateData);
      }

      // Reload the gallery
      await loadCrewmates();
      alert(`Successfully imported ${importedData.length} crewmates!`);
    } catch (err) {
      console.error("Import failed:", err);
      alert(
        `Import failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSelectCrewmate = (crewmate: Crewmate, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCrewmates((prev) => [...prev, crewmate]);
    } else {
      setSelectedCrewmates((prev) => prev.filter((c) => c.id !== crewmate.id));
    }
  };

  const handleSelectAll = () => {
    if (selectedCrewmates.length === filteredAndSortedCrewmates.length) {
      setSelectedCrewmates([]);
    } else {
      setSelectedCrewmates(filteredAndSortedCrewmates);
    }
  };

  const isCrewmateSelected = (crewmate: Crewmate) =>
    selectedCrewmates.some((c) => c.id === crewmate.id);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-8 font-space">
          Your Crewmate Gallery!
        </h1>
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
          <p className="text-gray-300">Loading your crewmates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-8 font-space">
          Your Crewmate Gallery!
        </h1>
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={loadCrewmates}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (crewmates.length === 0) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-8 font-space">
          Your Crewmate Gallery!
        </h1>
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
          <p className="text-gray-300 text-xl mb-4">
            You haven't made a crewmate yet!
          </p>
          <Link
            to="/create"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 font-space"
          >
            Create Your First Crewmate
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-white font-space">
          Your Crewmate Gallery!
        </h1>
        <Link
          to="/create"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 font-space text-center"
        >
          Add New Crewmate
        </Link>
      </div>

      {/* Enhanced Filter and Sort Controls */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🔍 Search by name:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              placeholder="Enter crewmate name..."
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              📊 Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="speed">Speed (High-Low)</option>
            </select>
          </div>

          {/* Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🎨 Filter by:
            </label>
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value as FilterOption)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            >
              <option value="all">All Crewmates</option>
              <option value="favorites">⭐ Favorites Only</option>
              {CREWMATE_COLORS.map((color) => (
                <option key={color} value={color} className="capitalize">
                  {color}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ⚡ Quick Actions:
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
              >
                {selectedCrewmates.length ===
                  filteredAndSortedCrewmates.length &&
                filteredAndSortedCrewmates.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </button>
              <button
                onClick={handleExportAll}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
              >
                📤 Export
              </button>
            </div>
          </div>
        </div>

        {/* Import/Export Section */}
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className={`px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200 cursor-pointer text-sm ${
                  isImporting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isImporting ? "⏳ Importing..." : "📥 Import JSON"}
              </label>
            </div>

            <button
              onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm"
            >
              ⌨️ Shortcuts
            </button>

            {showKeyboardHelp && (
              <div className="absolute z-10 mt-2 p-4 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
                <div className="text-sm text-gray-300 space-y-1">
                  <div>
                    <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">
                      Ctrl+K
                    </kbd>{" "}
                    Toggle search
                  </div>
                  <div>
                    <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">
                      Ctrl+E
                    </kbd>{" "}
                    Export all
                  </div>
                  <div>
                    <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">
                      Ctrl+N
                    </kbd>{" "}
                    New crewmate
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
          <span>
            Showing {filteredAndSortedCrewmates.length} of {crewmates.length}{" "}
            crewmates
            {selectedCrewmates.length > 0 && (
              <span className="ml-2 text-purple-400">
                ({selectedCrewmates.length} selected)
              </span>
            )}
          </span>
          {(searchTerm || filterColor !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterColor("all");
                setSortBy("newest");
              }}
              className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Crewmates Grid */}
      {filteredAndSortedCrewmates.length === 0 ? (
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8 text-center">
          <p className="text-gray-300 text-xl mb-4">
            {searchTerm || filterColor !== "all"
              ? "No crewmates match your filters"
              : "You haven't made a crewmate yet!"}
          </p>
          {searchTerm || filterColor !== "all" ? (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterColor("all");
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 font-space"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              to="/create"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 font-space"
            >
              Create Your First Crewmate
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedCrewmates.map((crewmate) => (
            <CrewmateCard
              key={crewmate.id}
              crewmate={crewmate}
              onDelete={handleDeleteCrewmate}
              onToggleFavorite={handleToggleFavorite}
              onSelect={handleSelectCrewmate}
              isSelected={isCrewmateSelected(crewmate)}
            />
          ))}
        </div>
      )}

      {/* Enhanced Statistics */}
      <div className="mt-8 text-center text-gray-400">
        <p>Total Crewmates: {crewmates.length}</p>
        {filteredAndSortedCrewmates.length !== crewmates.length && (
          <p className="text-sm">
            Filtered: {filteredAndSortedCrewmates.length}
          </p>
        )}
        {crewmates.filter((c) => c.is_favorite).length > 0 && (
          <p className="text-sm text-yellow-400">
            ⭐ Favorites: {crewmates.filter((c) => c.is_favorite).length}
          </p>
        )}
      </div>

      {/* Phase 4 Components */}
      <BulkActions
        selectedCrewmates={selectedCrewmates}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        onClearSelection={() => setSelectedCrewmates([])}
      />

      <KeyboardShortcuts
        onCreateNew={() => navigate("/create")}
        onToggleSearch={() => {
          const searchInput = document.querySelector(
            'input[placeholder*="name"]'
          ) as HTMLInputElement;
          searchInput?.focus();
        }}
        onExport={handleExportAll}
      />
    </div>
  );
};

export default GalleryPage;
