import React, { useState, useEffect, useMemo } from "react";
import { Crewmate } from "../types/crewmate";
import { crewmateService } from "../utils/crewmateService";
import LoadingSpinner from "../components/LoadingSpinner";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (crewmates: Crewmate[]) => boolean;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  points: number;
}

interface UserStats {
  totalCrewmates: number;
  totalFavorites: number;
  uniqueColors: number;
  averageSpeed: number;
  creationStreak: number;
  achievements: Achievement[];
  totalPoints: number;
  rank: string;
  level: number;
}

const GamificationPage: React.FC = () => {
  const [crewmates, setCrewmates] = useState<Crewmate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "achievements" | "leaderboard" | "challenges"
  >("achievements");

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

  // Define all achievements
  const allAchievements: Omit<Achievement, "unlocked" | "unlockedAt">[] = [
    {
      id: "first_crewmate",
      name: "First Steps",
      description: "Create your first crewmate",
      icon: "🚀",
      condition: (crewmates) => crewmates.length >= 1,
      rarity: "common",
      points: 10,
    },
    {
      id: "crew_of_five",
      name: "Crew Assembly",
      description: "Create 5 crewmates",
      icon: "👥",
      condition: (crewmates) => crewmates.length >= 5,
      rarity: "common",
      points: 25,
    },
    {
      id: "dozen_crew",
      name: "Squadron Leader",
      description: "Create 12 crewmates",
      icon: "⭐",
      condition: (crewmates) => crewmates.length >= 12,
      rarity: "uncommon",
      points: 50,
    },
    {
      id: "speed_demon",
      name: "Speed Demon",
      description: "Create a crewmate with 95+ speed",
      icon: "⚡",
      condition: (crewmates) => crewmates.some((c) => c.speed >= 95),
      rarity: "uncommon",
      points: 30,
    },
    {
      id: "rainbow_collector",
      name: "Rainbow Collector",
      description: "Create crewmates in 8 different colors",
      icon: "🌈",
      condition: (crewmates) =>
        new Set(crewmates.map((c) => c.color)).size >= 8,
      rarity: "rare",
      points: 75,
    },
    {
      id: "favorite_five",
      name: "Favorites Club",
      description: "Mark 5 crewmates as favorites",
      icon: "💖",
      condition: (crewmates) =>
        crewmates.filter((c) => c.is_favorite).length >= 5,
      rarity: "uncommon",
      points: 40,
    },
    {
      id: "perfectionist",
      name: "Perfectionist",
      description: "Create a crewmate with exactly 100 speed",
      icon: "💯",
      condition: (crewmates) => crewmates.some((c) => c.speed === 100),
      rarity: "rare",
      points: 100,
    },
    {
      id: "fleet_commander",
      name: "Fleet Commander",
      description: "Create 25 crewmates",
      icon: "🛸",
      condition: (crewmates) => crewmates.length >= 25,
      rarity: "rare",
      points: 150,
    },
    {
      id: "color_master",
      name: "Color Master",
      description: "Create crewmates in all 12 colors",
      icon: "🎨",
      condition: (crewmates) =>
        new Set(crewmates.map((c) => c.color)).size >= 12,
      rarity: "epic",
      points: 200,
    },
    {
      id: "centurion",
      name: "Centurion",
      description: "Create 100 crewmates",
      icon: "🏆",
      condition: (crewmates) => crewmates.length >= 100,
      rarity: "legendary",
      points: 500,
    },
    {
      id: "speed_balance",
      name: "Balanced Force",
      description: "Have an average speed between 45-55",
      icon: "⚖️",
      condition: (crewmates) => {
        if (crewmates.length === 0) return false;
        const avg =
          crewmates.reduce((sum, c) => sum + c.speed, 0) / crewmates.length;
        return avg >= 45 && avg <= 55;
      },
      rarity: "uncommon",
      points: 35,
    },
    {
      id: "name_creative",
      name: "Creative Naming",
      description: "Create crewmates with unique names (no duplicates)",
      icon: "📝",
      condition: (crewmates) => {
        const names = crewmates.map((c) => c.name.toLowerCase());
        return names.length === new Set(names).size && names.length >= 10;
      },
      rarity: "rare",
      points: 80,
    },
  ];

  // Calculate user stats and achievements
  const userStats: UserStats = useMemo(() => {
    const totalCrewmates = crewmates.length;
    const totalFavorites = crewmates.filter((c) => c.is_favorite).length;
    const uniqueColors = new Set(crewmates.map((c) => c.color)).size;
    const averageSpeed =
      totalCrewmates > 0
        ? Math.round(
            (crewmates.reduce((sum, c) => sum + c.speed, 0) / totalCrewmates) *
              10
          ) / 10
        : 0;

    // Check achievements
    const achievements: Achievement[] = allAchievements.map((achievement) => ({
      ...achievement,
      unlocked: achievement.condition(crewmates),
      unlockedAt: achievement.condition(crewmates)
        ? new Date().toISOString()
        : undefined,
    }));

    const totalPoints = achievements
      .filter((a) => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0);

    // Calculate level (every 100 points = 1 level)
    const level = Math.floor(totalPoints / 100) + 1;

    // Calculate rank based on total points
    let rank = "Rookie";
    if (totalPoints >= 1000) rank = "Legendary Captain";
    else if (totalPoints >= 500) rank = "Elite Commander";
    else if (totalPoints >= 250) rank = "Space Admiral";
    else if (totalPoints >= 100) rank = "Fleet Captain";
    else if (totalPoints >= 50) rank = "Squadron Leader";

    return {
      totalCrewmates,
      totalFavorites,
      uniqueColors,
      averageSpeed,
      creationStreak: 0, // Would need timestamps to calculate
      achievements,
      totalPoints,
      rank,
      level,
    };
  }, [crewmates]);

  // Mock leaderboard data
  const leaderboard = [
    {
      rank: 1,
      username: "SpaceCommander",
      points: 1250,
      level: 13,
      achievements: 15,
    },
    {
      rank: 2,
      username: "CrewMaster",
      points: 980,
      level: 10,
      achievements: 12,
    },
    {
      rank: 3,
      username: "GalaxyExplorer",
      points: 875,
      level: 9,
      achievements: 11,
    },
    {
      rank: 4,
      username: "StarCaptain",
      points: 650,
      level: 7,
      achievements: 9,
    },
    {
      rank: 5,
      username: "You",
      points: userStats.totalPoints,
      level: userStats.level,
      achievements: userStats.achievements.filter((a) => a.unlocked).length,
    },
    {
      rank: 6,
      username: "CosmicPilot",
      points: 420,
      level: 5,
      achievements: 7,
    },
    {
      rank: 7,
      username: "NebulaNinja",
      points: 380,
      level: 4,
      achievements: 6,
    },
    {
      rank: 8,
      username: "VoidWanderer",
      points: 295,
      level: 3,
      achievements: 5,
    },
  ]
    .sort((a, b) => b.points - a.points)
    .map((player, index) => ({ ...player, rank: index + 1 }));

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "text-gray-400 border-gray-500";
      case "uncommon":
        return "text-green-400 border-green-500";
      case "rare":
        return "text-blue-400 border-blue-500";
      case "epic":
        return "text-purple-400 border-purple-500";
      case "legendary":
        return "text-yellow-400 border-yellow-500";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-8 font-space">
            Gamification Hub
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
          🎮 Gamification Hub
        </h1>
        <p className="text-gray-300 text-lg">
          Track your progress, unlock achievements, and compete with others
        </p>
      </div>

      {/* User Stats Overview */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">
              {userStats.rank}
            </h2>
            <p className="text-gray-300">Level {userStats.level}</p>
            <div className="mt-2">
              <div className="bg-gray-700 rounded-full h-3 w-48">
                <div
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${((userStats.totalPoints % 100) / 100) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {userStats.totalPoints % 100}/100 XP to next level
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {userStats.totalPoints}
              </div>
              <div className="text-gray-300 text-sm">Total Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">
                {userStats.achievements.filter((a) => a.unlocked).length}
              </div>
              <div className="text-gray-300 text-sm">Achievements</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {userStats.totalCrewmates}
              </div>
              <div className="text-gray-300 text-sm">Crewmates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {userStats.uniqueColors}
              </div>
              <div className="text-gray-300 text-sm">Colors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-1 flex gap-1">
          {[
            { key: "achievements", label: "🏆 Achievements" },
            { key: "leaderboard", label: "📊 Leaderboard" },
            { key: "challenges", label: "🎯 Challenges" },
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

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userStats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-black bg-opacity-30 backdrop-blur-sm border rounded-lg p-6 transition-all ${
                  achievement.unlocked
                    ? `${getRarityColor(achievement.rarity)} shadow-lg`
                    : "border-gray-600 opacity-60"
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3
                    className={`text-lg font-bold mb-2 ${
                      achievement.unlocked ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {achievement.name}
                  </h3>
                  <p
                    className={`text-sm mb-3 ${
                      achievement.unlocked ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {achievement.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs px-2 py-1 rounded capitalize ${
                        achievement.unlocked
                          ? getRarityColor(achievement.rarity)
                          : "text-gray-500"
                      }`}
                    >
                      {achievement.rarity}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        achievement.unlocked
                          ? "text-yellow-400"
                          : "text-gray-500"
                      }`}
                    >
                      +{achievement.points} XP
                    </span>
                  </div>
                  {achievement.unlocked && (
                    <div className="mt-2 text-xs text-green-400">
                      ✓ Unlocked
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && (
        <div className="space-y-6">
          <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-600">
              <h3 className="text-xl font-bold text-white">
                🏆 Global Leaderboard
              </h3>
              <p className="text-gray-300 text-sm">
                Top players by achievement points
              </p>
            </div>
            <div className="divide-y divide-gray-600">
              {leaderboard.map((player) => (
                <div
                  key={player.rank}
                  className={`p-4 flex items-center justify-between hover:bg-gray-800/50 transition-all ${
                    player.username === "You"
                      ? "bg-purple-900/20 border-l-4 border-purple-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`text-lg font-bold w-8 text-center ${
                        player.rank === 1
                          ? "text-yellow-400"
                          : player.rank === 2
                          ? "text-gray-300"
                          : player.rank === 3
                          ? "text-orange-400"
                          : "text-gray-400"
                      }`}
                    >
                      {player.rank <= 3
                        ? ["🥇", "🥈", "🥉"][player.rank - 1]
                        : `#${player.rank}`}
                    </div>
                    <div>
                      <div
                        className={`font-bold ${
                          player.username === "You"
                            ? "text-purple-400"
                            : "text-white"
                        }`}
                      >
                        {player.username}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Level {player.level}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold">
                      {player.points} pts
                    </div>
                    <div className="text-gray-400 text-sm">
                      {player.achievements} achievements
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === "challenges" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Challenge */}
            <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">
                🌅 Daily Challenge
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-cyan-900/20 rounded-lg">
                  <h4 className="font-bold text-white">Speed Specialist</h4>
                  <p className="text-gray-300 text-sm">
                    Create a crewmate with speed between 80-90
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-cyan-400 text-sm">+50 XP</span>
                    <span className="text-gray-400 text-xs">
                      Expires in 14h 32m
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Challenge */}
            <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4">
                📅 Weekly Challenge
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-purple-900/20 rounded-lg">
                  <h4 className="font-bold text-white">Rainbow Week</h4>
                  <p className="text-gray-300 text-sm">
                    Create crewmates in 5 different colors this week
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-purple-400 text-sm">+150 XP</span>
                    <span className="text-gray-400 text-xs">3/5 completed</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: "60%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Challenge */}
            <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-6 lg:col-span-2">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">
                🗓️ Monthly Challenge
              </h3>
              <div className="p-4 bg-yellow-900/20 rounded-lg">
                <h4 className="font-bold text-white text-lg">Crew Commander</h4>
                <p className="text-gray-300 mb-3">
                  Create 20 crewmates this month to earn the exclusive
                  "Commander" badge
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-yellow-400 font-bold">
                    +300 XP + Exclusive Badge
                  </span>
                  <span className="text-gray-400 text-sm">
                    {userStats.totalCrewmates}/20 completed
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        (userStats.totalCrewmates / 20) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationPage;
