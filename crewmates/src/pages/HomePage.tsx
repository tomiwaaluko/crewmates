import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-5xl font-bold text-white mb-6 font-space">
        Welcome to the Crewmate Creator!
      </h1>
      <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
        Here is where you can create your very own set of crewmates before
        sending them off into space!
      </p>

      {/* Crewmate Characters Display */}
      <div className="grid grid-cols-6 gap-4 mb-12 max-w-2xl mx-auto">
        {[
          "red",
          "blue",
          "green",
          "pink",
          "orange",
          "yellow",
          "black",
          "white",
          "purple",
          "brown",
          "cyan",
          "lime",
        ].map((color, index) => (
          <div
            key={color}
            className="w-16 h-20 rounded-full relative mx-auto animate-bounce-in hover:animate-float transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{
              background: getCrewmateColor(color),
              clipPath: "ellipse(50% 60% at 50% 40%)",
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {/* Simple crewmate shape */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-cyan-200 rounded-full opacity-80"></div>
          </div>
        ))}
      </div>

      {/* UFO Image */}
      <div className="mb-12">
        <div className="w-32 h-20 mx-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-full relative animate-float">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gray-300 rounded-full"></div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link
          to="/create"
          className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-6 px-8 rounded-lg text-lg transition-all duration-200 font-space hover:scale-105 transform shadow-lg hover:shadow-purple-500/25"
        >
          <div className="text-3xl mb-2">🚀</div>
          <div>Create a New Crewmate</div>
          <div className="text-sm opacity-75 mt-1">
            Build your perfect crew member
          </div>
        </Link>

        <Link
          to="/gallery"
          className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-6 px-8 rounded-lg text-lg transition-all duration-200 font-space hover:scale-105 transform shadow-lg hover:shadow-blue-500/25"
        >
          <div className="text-3xl mb-2">👥</div>
          <div>Crewmate Gallery</div>
          <div className="text-sm opacity-75 mt-1">Browse your collection</div>
        </Link>

        <Link
          to="/stats"
          className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-6 px-8 rounded-lg text-lg transition-all duration-200 font-space hover:scale-105 transform shadow-lg hover:shadow-green-500/25"
        >
          <div className="text-3xl mb-2">📊</div>
          <div>Crew Statistics</div>
          <div className="text-sm opacity-75 mt-1">View basic analytics</div>
        </Link>

        <Link
          to="/analytics"
          className="group bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-bold py-6 px-8 rounded-lg text-lg transition-all duration-200 font-space hover:scale-105 transform shadow-lg hover:shadow-cyan-500/25"
        >
          <div className="text-3xl mb-2">📈</div>
          <div>Advanced Analytics</div>
          <div className="text-sm opacity-75 mt-1">
            Interactive charts & insights
          </div>
        </Link>

        <Link
          to="/community"
          className="group bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-6 px-8 rounded-lg text-lg transition-all duration-200 font-space hover:scale-105 transform shadow-lg hover:shadow-pink-500/25"
        >
          <div className="text-3xl mb-2">🌌</div>
          <div>Community Hub</div>
          <div className="text-sm opacity-75 mt-1">
            Share & discover templates
          </div>
        </Link>

        <Link
          to="/achievements"
          className="group bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-bold py-6 px-8 rounded-lg text-lg transition-all duration-200 font-space hover:scale-105 transform shadow-lg hover:shadow-yellow-500/25"
        >
          <div className="text-3xl mb-2">🏆</div>
          <div>Achievements</div>
          <div className="text-sm opacity-75 mt-1">
            Track progress & compete
          </div>
        </Link>
      </div>

      {/* Phase 5 Features Highlight */}
      <div className="mt-16 bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-6 font-space">
          ✨ New Enterprise Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-4 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="text-lg font-bold text-white mb-2">
              Advanced Analytics
            </h3>
            <p className="text-gray-300 text-sm">
              Interactive charts, trend analysis, and detailed insights into
              your crew creation patterns.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-lg">
            <div className="text-2xl mb-2">🌌</div>
            <h3 className="text-lg font-bold text-white mb-2">
              Community Features
            </h3>
            <p className="text-gray-300 text-sm">
              Share your crew templates, discover amazing collections, and
              connect with other creators.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-lg">
            <div className="text-2xl mb-2">🎮</div>
            <h3 className="text-lg font-bold text-white mb-2">Gamification</h3>
            <p className="text-gray-300 text-sm">
              Unlock achievements, compete on leaderboards, and track your
              progress with challenges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get crewmate colors
const getCrewmateColor = (color: string): string => {
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

export default HomePage;
