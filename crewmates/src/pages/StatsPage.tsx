import React, { useState, useEffect } from "react";
import { crewmateService } from "../utils/crewmateService";
import { CREWMATE_COLORS } from "../types/crewmate";

interface CrewmateStats {
  total: number;
  colorDistribution: Record<string, number>;
  averageSpeed: number;
  speedDistribution: {
    slow: number; // 0-33
    medium: number; // 34-66
    fast: number; // 67-100
  };
  categoryDistribution?: Record<string, number>;
}

const StatsPage = () => {
  const [stats, setStats] = useState<CrewmateStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get basic stats from service
      const basicStats = await crewmateService.getCrewmateStats();

      // Get all crewmates to calculate additional stats
      const allCrewmates = await crewmateService.getAllCrewmates();

      // Calculate average speed
      const averageSpeed =
        allCrewmates.length > 0
          ? Math.round(
              allCrewmates.reduce((sum, c) => sum + c.speed, 0) /
                allCrewmates.length
            )
          : 0;

      // Calculate speed distribution
      const speedDistribution = allCrewmates.reduce(
        (acc, crewmate) => {
          if (crewmate.speed <= 33) acc.slow++;
          else if (crewmate.speed <= 66) acc.medium++;
          else acc.fast++;
          return acc;
        },
        { slow: 0, medium: 0, fast: 0 }
      );

      setStats({
        total: basicStats.total,
        colorDistribution: basicStats.colorDistribution,
        averageSpeed,
        speedDistribution,
        categoryDistribution: basicStats.categoryDistribution,
      });
    } catch (err) {
      console.error("Error loading stats:", err);
      setError(
        "Failed to load statistics. Please check your Supabase connection."
      );
    } finally {
      setIsLoading(false);
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

  const getColorPercentage = (count: number, total: number): number => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-8 font-space">
          Crew Statistics
        </h1>
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
          <p className="text-gray-300">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-8 font-space">
          Crew Statistics
        </h1>
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={loadStats}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-8 font-space">
          Crew Statistics
        </h1>
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
          <p className="text-gray-300 text-xl mb-4">
            No crewmates to analyze yet!
          </p>
          <p className="text-gray-400 mb-6">
            Create some crewmates to see interesting statistics about your crew.
          </p>
          <a
            href="/create"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 font-space"
          >
            Create Your First Crewmate
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8 text-center font-space">
        Crew Statistics
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overview Stats */}
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6 font-space">
            Overview
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">Total Crewmates:</span>
              <span className="text-white font-bold text-xl">
                {stats.total}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">Average Speed:</span>
              <span className="text-white font-bold text-xl">
                {stats.averageSpeed} mph
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">Most Popular Color:</span>
              <span className="text-white font-bold text-xl capitalize">
                {Object.entries(stats.colorDistribution).length > 0
                  ? Object.entries(stats.colorDistribution).reduce((a, b) =>
                      stats.colorDistribution[a[0]] >
                      stats.colorDistribution[b[0]]
                        ? a
                        : b
                    )[0]
                  : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Speed Distribution */}
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6 font-space">
            Speed Distribution
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-300">Slow (0-33):</span>
              </div>
              <span className="text-white font-bold">
                {stats.speedDistribution.slow}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-gray-300">Medium (34-66):</span>
              </div>
              <span className="text-white font-bold">
                {stats.speedDistribution.medium}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-300">Fast (67-100):</span>
              </div>
              <span className="text-white font-bold">
                {stats.speedDistribution.fast}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Color Distribution */}
      <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6 font-space">
          Color Distribution
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CREWMATE_COLORS.map((color) => {
            const count = stats.colorDistribution[color] || 0;
            const percentage = getColorPercentage(count, stats.total);
            return (
              <div
                key={color}
                className="bg-gray-800/50 rounded-lg p-4 text-center"
              >
                <div
                  className="w-12 h-14 mx-auto mb-3 rounded-full relative"
                  style={{
                    backgroundColor: getCrewmateColorStyle(color),
                    clipPath: "ellipse(50% 60% at 50% 40%)",
                  }}
                >
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-7 h-4 bg-cyan-200 rounded-full opacity-80"></div>
                </div>
                <p className="text-white font-bold capitalize">{color}</p>
                <p className="text-gray-400 text-sm">
                  {count} ({percentage}%)
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Crew Insights */}
      <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6 font-space">
          Crew Insights
        </h2>
        <div className="space-y-4 text-gray-300">
          {stats.speedDistribution.fast > stats.speedDistribution.slow && (
            <p className="p-4 bg-green-900/30 border border-green-500/20 rounded-lg">
              🚀 Your crew is built for speed! You have more fast crewmates than
              slow ones.
            </p>
          )}
          {stats.speedDistribution.slow > stats.speedDistribution.fast && (
            <p className="p-4 bg-blue-900/30 border border-blue-500/20 rounded-lg">
              🛡️ Your crew prioritizes caution over speed. Strategic thinkers!
            </p>
          )}
          {Object.keys(stats.colorDistribution).length >= 8 && (
            <p className="p-4 bg-purple-900/30 border border-purple-500/20 rounded-lg">
              🌈 Diverse crew! You have a good variety of colors represented.
            </p>
          )}
          {stats.total >= 10 && (
            <p className="p-4 bg-yellow-900/30 border border-yellow-500/20 rounded-lg">
              👑 Crew Commander! You've built an impressive crew of{" "}
              {stats.total} crewmates.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
