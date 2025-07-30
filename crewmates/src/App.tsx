import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import GalleryPage from "./pages/GalleryPage";
import CrewmateDetailPage from "./pages/CrewmateDetailPage";
import EditCrewmatePage from "./pages/EditCrewmatePage";
import StatsPage from "./pages/StatsPage";
import AdvancedAnalyticsPage from "./pages/AdvancedAnalyticsPage";
import CommunityPage from "./pages/CommunityPage";
import GamificationPage from "./pages/GamificationPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/analytics" element={<AdvancedAnalyticsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/achievements" element={<GamificationPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/crewmate/:id" element={<CrewmateDetailPage />} />
            <Route path="/edit/:id" element={<EditCrewmatePage />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
