import React, { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subMonths,
} from "date-fns";
import { Crewmate } from "../types/crewmate";
import { crewmateService } from "../utils/crewmateService";
import LoadingSpinner from "../components/LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AdvancedAnalyticsProps {
  crewmates: Crewmate[];
}

const AdvancedAnalyticsPage: React.FC = () => {
  const [crewmates, setCrewmates] = useState<Crewmate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">(
    "30d"
  );
  const [selectedMetric, setSelectedMetric] = useState<
    "creation" | "speed" | "color"
  >("creation");

  useEffect(() => {
    loadCrewmates();
  }, []);

  const loadCrewmates = async () => {
    try {
      setIsLoading(true);
      const data = await crewmateService.getAllCrewmates();
      setCrewmates(data);
    } catch (error) {
      console.error("Error loading crewmates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter crewmates by time range
  const filteredCrewmates = useMemo(() => {
    if (timeRange === "all") return crewmates;

    const now = new Date();
    const daysBack = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    return crewmates.filter(
      (crewmate) => new Date(crewmate.created_at) >= cutoffDate
    );
  }, [crewmates, timeRange]);

  // Creation trend data
  const creationTrendData = useMemo(() => {
    if (filteredCrewmates.length === 0) return null;

    const now = new Date();
    const daysBack =
      timeRange === "7d"
        ? 7
        : timeRange === "30d"
        ? 30
        : timeRange === "90d"
        ? 90
        : 365;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    const dailyCounts: Record<string, number> = {};

    // Initialize all days with 0
    for (let i = 0; i < daysBack; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = format(date, "yyyy-MM-dd");
      dailyCounts[dateStr] = 0;
    }

    // Count crewmates by day
    filteredCrewmates.forEach((crewmate) => {
      const dateStr = format(parseISO(crewmate.created_at), "yyyy-MM-dd");
      if (dailyCounts.hasOwnProperty(dateStr)) {
        dailyCounts[dateStr]++;
      }
    });

    const labels = Object.keys(dailyCounts).map((date) =>
      format(parseISO(date), timeRange === "7d" ? "MMM dd" : "MMM dd")
    );
    const data = Object.values(dailyCounts);

    return {
      labels,
      datasets: [
        {
          label: "Crewmates Created",
          data,
          borderColor: "rgb(139, 92, 246)",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [filteredCrewmates, timeRange]);

  // Speed distribution data
  const speedDistributionData = useMemo(() => {
    const speedRanges = {
      "Very Slow (0-20)": 0,
      "Slow (21-40)": 0,
      "Medium (41-60)": 0,
      "Fast (61-80)": 0,
      "Very Fast (81-100)": 0,
    };

    filteredCrewmates.forEach((crewmate) => {
      if (crewmate.speed <= 20) speedRanges["Very Slow (0-20)"]++;
      else if (crewmate.speed <= 40) speedRanges["Slow (21-40)"]++;
      else if (crewmate.speed <= 60) speedRanges["Medium (41-60)"]++;
      else if (crewmate.speed <= 80) speedRanges["Fast (61-80)"]++;
      else speedRanges["Very Fast (81-100)"]++;
    });

    return {
      labels: Object.keys(speedRanges),
      datasets: [
        {
          label: "Speed Distribution",
          data: Object.values(speedRanges),
          backgroundColor: [
            "rgba(239, 68, 68, 0.8)", // Red
            "rgba(245, 158, 11, 0.8)", // Orange
            "rgba(34, 197, 94, 0.8)", // Green
            "rgba(59, 130, 246, 0.8)", // Blue
            "rgba(139, 92, 246, 0.8)", // Purple
          ],
          borderWidth: 2,
          borderColor: "rgba(255, 255, 255, 0.8)",
        },
      ],
    };
  }, [filteredCrewmates]);

  // Color popularity data
  const colorPopularityData = useMemo(() => {
    const colorCounts: Record<string, number> = {};

    filteredCrewmates.forEach((crewmate) => {
      colorCounts[crewmate.color] = (colorCounts[crewmate.color] || 0) + 1;
    });

    const sortedColors = Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8); // Top 8 colors

    const colorMap: Record<string, string> = {
      red: "#dc2626",
      blue: "#2563eb",
      green: "#16a34a",
      pink: "#ec4899",
      orange: "#ea580c",
      yellow: "#eab308",
      black: "#374151",
      white: "#e5e7eb",
      purple: "#9333ea",
      brown: "#a16207",
      cyan: "#0891b2",
      lime: "#65a30d",
    };

    return {
      labels: sortedColors.map(
        ([color]) => color.charAt(0).toUpperCase() + color.slice(1)
      ),
      datasets: [
        {
          label: "Color Popularity",
          data: sortedColors.map(([, count]) => count),
          backgroundColor: sortedColors.map(
            ([color]) => colorMap[color] || "#6b7280"
          ),
          borderWidth: 2,
          borderColor: "rgba(255, 255, 255, 0.8)",
        },
      ],
    };
  }, [filteredCrewmates]);

  // Advanced metrics
  const advancedMetrics = useMemo(() => {
    if (filteredCrewmates.length === 0) return null;

    const totalCrewmates = filteredCrewmates.length;
    const averageSpeed =
      filteredCrewmates.reduce((sum, c) => sum + c.speed, 0) / totalCrewmates;
    const favoriteCount = filteredCrewmates.filter((c) => c.is_favorite).length;
    const uniqueColors = new Set(filteredCrewmates.map((c) => c.color)).size;

    // Calculate creation rate
    const now = new Date();
    const oldestCrewmate = filteredCrewmates.reduce((oldest, current) =>
      new Date(current.created_at) < new Date(oldest.created_at)
        ? current
        : oldest
    );
    const daysSinceFirst = Math.max(
      1,
      Math.floor(
        (now.getTime() - new Date(oldestCrewmate.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    const creationRate = totalCrewmates / daysSinceFirst;

    return {
      totalCrewmates,
      averageSpeed: Math.round(averageSpeed * 10) / 10,
      favoritePercentage: Math.round((favoriteCount / totalCrewmates) * 100),
      uniqueColors,
      creationRate: Math.round(creationRate * 10) / 10,
      mostPopularColor:
        Object.entries(
          filteredCrewmates.reduce(
            (acc, c) => ({ ...acc, [c.color]: (acc[c.color] || 0) + 1 }),
            {} as Record<string, number>
          )
        ).sort(([, a], [, b]) => b - a)[0]?.[0] || "None",
    };
  }, [filteredCrewmates]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-8 font-space">
            Advanced Analytics
          </h1>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      title: {
        color: "white",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-white font-space">
          📊 Advanced Analytics
        </h1>

        <div className="flex gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Advanced Metrics Cards */}
      {advancedMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-purple-400">
              {advancedMetrics.totalCrewmates}
            </div>
            <div className="text-gray-300">Total Crewmates</div>
          </div>

          <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-cyan-400">
              {advancedMetrics.averageSpeed}
            </div>
            <div className="text-gray-300">Average Speed</div>
          </div>

          <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-yellow-400">
              {advancedMetrics.favoritePercentage}%
            </div>
            <div className="text-gray-300">Favorites</div>
          </div>

          <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-green-400">
              {advancedMetrics.uniqueColors}
            </div>
            <div className="text-gray-300">Unique Colors</div>
          </div>

          <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-pink-400">
              {advancedMetrics.creationRate}
            </div>
            <div className="text-gray-300">Per Day</div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Creation Trend Chart */}
        {creationTrendData && (
          <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              📈 Creation Trend
            </h3>
            <div className="h-64">
              <Line data={creationTrendData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Speed Distribution Chart */}
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            ⚡ Speed Distribution
          </h3>
          <div className="h-64">
            <Doughnut
              data={speedDistributionData}
              options={{
                ...chartOptions,
                scales: undefined, // Doughnut charts don't use scales
              }}
            />
          </div>
        </div>

        {/* Color Popularity Chart */}
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            🎨 Color Popularity
          </h3>
          <div className="h-64">
            <Bar data={colorPopularityData} options={chartOptions} />
          </div>
        </div>

        {/* Additional Insights */}
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">💡 Insights</h3>
          <div className="space-y-4">
            {advancedMetrics && (
              <>
                <div className="p-3 bg-purple-900/30 rounded-lg">
                  <div className="text-sm text-gray-300">
                    Most Popular Color
                  </div>
                  <div className="text-lg font-bold text-white capitalize">
                    {advancedMetrics.mostPopularColor}
                  </div>
                </div>

                <div className="p-3 bg-cyan-900/30 rounded-lg">
                  <div className="text-sm text-gray-300">Creation Rate</div>
                  <div className="text-lg font-bold text-white">
                    {advancedMetrics.creationRate} crewmates/day
                  </div>
                </div>

                <div className="p-3 bg-green-900/30 rounded-lg">
                  <div className="text-sm text-gray-300">Diversity Score</div>
                  <div className="text-lg font-bold text-white">
                    {Math.round((advancedMetrics.uniqueColors / 12) * 100)}%
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsPage;
