import React, { useState, useEffect } from "react";
import { Crewmate } from "../types/crewmate";
import { crewmateService } from "../utils/crewmateService";
import CrewmateCard from "../components/CrewmateCard";
import LoadingSpinner from "../components/LoadingSpinner";

interface CrewTemplate {
  id: string;
  name: string;
  description: string;
  crewmates: Omit<Crewmate, "id" | "created_at">[];
  author: string;
  downloads: number;
  rating: number;
  tags: string[];
  created_at: string;
}

const CommunityPage: React.FC = () => {
  const [templates, setTemplates] = useState<CrewTemplate[]>([]);
  const [userCrewmates, setUserCrewmates] = useState<Crewmate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "browse" | "share" | "my-templates"
  >("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  // Predefined templates for demo
  const predefinedTemplates: CrewTemplate[] = [
    {
      id: "1",
      name: "Rainbow Squad",
      description:
        "A colorful crew featuring all the vibrant colors of the rainbow",
      crewmates: [
        { name: "Red Leader", color: "red", speed: 85 },
        { name: "Orange Scout", color: "orange", speed: 90 },
        { name: "Yellow Engineer", color: "yellow", speed: 70 },
        { name: "Green Medic", color: "green", speed: 75 },
        { name: "Blue Navigator", color: "blue", speed: 80 },
        { name: "Purple Mystic", color: "purple", speed: 65 },
      ],
      author: "SpaceExplorer",
      downloads: 1247,
      rating: 4.8,
      tags: ["colorful", "balanced", "popular"],
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Speed Demons",
      description: "Ultra-fast crewmates for rapid mission completion",
      crewmates: [
        { name: "Lightning Bolt", color: "yellow", speed: 95 },
        { name: "Flash Fire", color: "red", speed: 98 },
        { name: "Wind Runner", color: "cyan", speed: 92 },
        { name: "Quick Silver", color: "white", speed: 90 },
      ],
      author: "SpeedRunner123",
      downloads: 892,
      rating: 4.6,
      tags: ["speed", "competitive", "elite"],
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Stealth Squad",
      description: "Masters of infiltration and covert operations",
      crewmates: [
        { name: "Shadow Walker", color: "black", speed: 60 },
        { name: "Night Phantom", color: "purple", speed: 65 },
        { name: "Dark Matter", color: "brown", speed: 55 },
        { name: "Void Stalker", color: "black", speed: 70 },
      ],
      author: "NinjaCommander",
      downloads: 634,
      rating: 4.5,
      tags: ["stealth", "tactical", "dark"],
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Neon Galaxy",
      description: "Bright and energetic crew inspired by cyberpunk aesthetics",
      crewmates: [
        { name: "Cyber Pink", color: "pink", speed: 82 },
        { name: "Electric Blue", color: "cyan", speed: 88 },
        { name: "Neon Green", color: "lime", speed: 85 },
        { name: "Plasma Purple", color: "purple", speed: 80 },
      ],
      author: "CyberCreator",
      downloads: 445,
      rating: 4.7,
      tags: ["neon", "cyberpunk", "modern"],
      created_at: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // In a real app, these would be separate API calls
      setTemplates(predefinedTemplates);
      const crewmates = await crewmateService.getAllCrewmates();
      setUserCrewmates(crewmates);
    } catch (error) {
      console.error("Error loading community data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || template.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(templates.flatMap((t) => t.tags)));

  const downloadTemplate = async (template: CrewTemplate) => {
    try {
      for (const crewmateData of template.crewmates) {
        await crewmateService.createCrewmate(crewmateData);
      }

      // Update download count (in real app, this would be a server call)
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === template.id ? { ...t, downloads: t.downloads + 1 } : t
        )
      );

      // Reload user crewmates
      const updatedCrewmates = await crewmateService.getAllCrewmates();
      setUserCrewmates(updatedCrewmates);

      alert(
        `Successfully downloaded "${template.name}"! ${template.crewmates.length} crewmates added to your collection.`
      );
    } catch (error) {
      console.error("Error downloading template:", error);
      alert("Failed to download template. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-8 font-space">
            Community Hub
          </h1>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 font-space">
          🌌 Community Hub
        </h1>
        <p className="text-gray-300 text-lg">
          Discover amazing crew templates created by the community
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-1 flex gap-1">
          {[
            { key: "browse", label: "🔍 Browse Templates", icon: "🔍" },
            { key: "share", label: "📤 Share Collection", icon: "📤" },
            { key: "my-templates", label: "📁 My Templates", icon: "📁" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Browse Templates Tab */}
      {activeTab === "browse" && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 hover:border-purple-400/40 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {template.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-2">
                      {template.description}
                    </p>
                    <p className="text-gray-400 text-xs">
                      by {template.author}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 text-sm">
                      ★ {template.rating}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {template.downloads} downloads
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Preview Crewmates */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">
                    Includes {template.crewmates.length} crewmates:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {template.crewmates.map((crewmate, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-xs"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: crewmate.color }}
                        />
                        <span className="text-gray-300">{crewmate.name}</span>
                        <span className="text-cyan-400">
                          ⚡{crewmate.speed}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => downloadTemplate(template)}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  Download Template
                </button>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">
                No templates found
              </h3>
              <p className="text-gray-300">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      )}

      {/* Share Collection Tab */}
      {activeTab === "share" && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Share Your Collection
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  placeholder="Enter a name for your template..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe your crew template..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Crewmates ({userCrewmates.length} available)
                </label>
                <div className="max-h-48 overflow-y-auto bg-gray-800 border border-gray-600 rounded-lg p-4">
                  {userCrewmates.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">
                      No crewmates to share. Create some first!
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {userCrewmates.map((crewmate) => (
                        <label
                          key={crewmate.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: crewmate.color }}
                          />
                          <span className="text-white">{crewmate.name}</span>
                          <span className="text-cyan-400 text-sm">
                            ⚡{crewmate.speed}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., colorful, speed, tactical..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <button
                disabled={userCrewmates.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Share Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Templates Tab */}
      {activeTab === "my-templates" && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📁</div>
          <h3 className="text-xl font-bold text-white mb-2">Your Templates</h3>
          <p className="text-gray-300 mb-6">
            Templates you've shared will appear here
          </p>
          <p className="text-gray-400 text-sm">
            This feature will be available soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
