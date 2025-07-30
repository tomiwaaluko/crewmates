import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/create", label: "Create a Crewmate", icon: "➕" },
    { path: "/gallery", label: "Crewmate Gallery", icon: "👥" },
    { path: "/stats", label: "Crew Statistics", icon: "📊" },
    { path: "/analytics", label: "Advanced Analytics", icon: "📈" },
    { path: "/community", label: "Community Hub", icon: "🌌" },
    { path: "/achievements", label: "Achievements", icon: "🏆" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark to-space-purple">
      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 min-h-screen bg-black bg-opacity-30 backdrop-blur-sm border-r border-purple-500/20">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-8 font-space">
              Crewmate Creator
            </h1>
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:bg-purple-500/20 hover:text-white"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
