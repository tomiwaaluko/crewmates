import React, { useState, useEffect } from "react";

interface Settings {
  theme: "dark" | "light" | "auto";
  notifications: boolean;
  autoSave: boolean;
  analytics: boolean;
  sharing: boolean;
  exportFormat: "json" | "csv" | "both";
  displayDensity: "compact" | "comfortable" | "spacious";
  animationsEnabled: boolean;
  soundEnabled: boolean;
  language: string;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    theme: "dark",
    notifications: true,
    autoSave: true,
    analytics: true,
    sharing: true,
    exportFormat: "json",
    displayDensity: "comfortable",
    animationsEnabled: true,
    soundEnabled: false,
    language: "en",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("crewmate-settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("crewmate-settings", JSON.stringify(settings));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      const defaultSettings: Settings = {
        theme: "dark",
        notifications: true,
        autoSave: true,
        analytics: true,
        sharing: true,
        exportFormat: "json",
        displayDensity: "comfortable",
        animationsEnabled: true,
        soundEnabled: false,
        language: "en",
      };
      setSettings(defaultSettings);
      localStorage.setItem(
        "crewmate-settings",
        JSON.stringify(defaultSettings)
      );
    }
  };

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "crewmate-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          localStorage.setItem(
            "crewmate-settings",
            JSON.stringify(importedSettings)
          );
        } catch (error) {
          alert("Invalid settings file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 font-space">
          ⚙️ Settings
        </h1>
        <p className="text-gray-300 text-lg">
          Customize your Crewmate Creator experience
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-900/30 border border-green-500/20 text-green-300 px-4 py-3 rounded-lg mb-6">
          ✅ Settings saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appearance Settings */}
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            🎨 Appearance
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => updateSetting("theme", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Density
              </label>
              <select
                value={settings.displayDensity}
                onChange={(e) =>
                  updateSetting("displayDensity", e.target.value)
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              >
                <option value="compact">Compact</option>
                <option value="comfortable">Comfortable</option>
                <option value="spacious">Spacious</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Enable Animations</span>
              <button
                onClick={() =>
                  updateSetting(
                    "animationsEnabled",
                    !settings.animationsEnabled
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.animationsEnabled ? "bg-purple-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.animationsEnabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Enable Sound Effects</span>
              <button
                onClick={() =>
                  updateSetting("soundEnabled", !settings.soundEnabled)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.soundEnabled ? "bg-purple-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Functionality Settings */}
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            🔧 Functionality
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Auto-save Changes</span>
              <button
                onClick={() => updateSetting("autoSave", !settings.autoSave)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoSave ? "bg-purple-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoSave ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Enable Notifications</span>
              <button
                onClick={() =>
                  updateSetting("notifications", !settings.notifications)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications ? "bg-purple-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Default Export Format
              </label>
              <select
                value={settings.exportFormat}
                onChange={(e) => updateSetting("exportFormat", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => updateSetting("language", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy & Analytics */}
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            🔒 Privacy & Analytics
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-300">Enable Analytics</span>
                <p className="text-xs text-gray-400">
                  Help improve the app with usage data
                </p>
              </div>
              <button
                onClick={() => updateSetting("analytics", !settings.analytics)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.analytics ? "bg-purple-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.analytics ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-300">Enable Sharing Features</span>
                <p className="text-xs text-gray-400">
                  Allow sharing templates and collections
                </p>
              </div>
              <button
                onClick={() => updateSetting("sharing", !settings.sharing)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.sharing ? "bg-purple-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.sharing ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Management */}
        <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            📁 Settings Management
          </h2>

          <div className="space-y-4">
            <button
              onClick={exportSettings}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Export Settings
            </button>

            <div>
              <label className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer text-center">
                Import Settings
                <input
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={resetSettings}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-8">
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Current Settings Summary */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Current Configuration
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Theme:</span>
            <span className="text-white ml-2 capitalize">{settings.theme}</span>
          </div>
          <div>
            <span className="text-gray-400">Density:</span>
            <span className="text-white ml-2 capitalize">
              {settings.displayDensity}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Auto-save:</span>
            <span className="text-white ml-2">
              {settings.autoSave ? "On" : "Off"}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Language:</span>
            <span className="text-white ml-2 uppercase">
              {settings.language}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
