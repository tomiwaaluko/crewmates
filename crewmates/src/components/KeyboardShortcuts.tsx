import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface KeyboardShortcutsProps {
  onCreateNew?: () => void;
  onToggleSearch?: () => void;
  onExport?: () => void;
}

export default function KeyboardShortcuts({
  onCreateNew,
  onToggleSearch,
  onExport,
}: KeyboardShortcutsProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const { key, ctrlKey, metaKey, altKey } = event;
      const cmdOrCtrl = ctrlKey || metaKey;

      // Cmd/Ctrl + N: New crewmate
      if (cmdOrCtrl && key === "n" && onCreateNew) {
        event.preventDefault();
        onCreateNew();
        return;
      }

      // Cmd/Ctrl + K: Toggle search
      if (cmdOrCtrl && key === "k" && onToggleSearch) {
        event.preventDefault();
        onToggleSearch();
        return;
      }

      // Cmd/Ctrl + E: Export
      if (cmdOrCtrl && key === "e" && onExport) {
        event.preventDefault();
        onExport();
        return;
      }

      // Navigation shortcuts (without modifiers)
      if (!cmdOrCtrl && !altKey) {
        switch (key) {
          case "1":
            event.preventDefault();
            navigate("/");
            break;
          case "2":
            event.preventDefault();
            navigate("/create");
            break;
          case "3":
            event.preventDefault();
            navigate("/gallery");
            break;
          case "4":
            event.preventDefault();
            navigate("/stats");
            break;
          case "g":
            event.preventDefault();
            navigate("/gallery");
            break;
          case "c":
            event.preventDefault();
            navigate("/create");
            break;
          case "h":
            event.preventDefault();
            navigate("/");
            break;
          case "s":
            event.preventDefault();
            navigate("/stats");
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate, onCreateNew, onToggleSearch, onExport]);

  return null; // This component doesn't render anything
}

export function KeyboardShortcutsHelp() {
  return (
    <div className="text-sm text-gray-400 space-y-2">
      <h4 className="font-medium text-white mb-3">⌨️ Keyboard Shortcuts</h4>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Navigation:</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Home</span>
          <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">H</kbd>
        </div>
        <div className="flex justify-between text-xs">
          <span>Create</span>
          <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">C</kbd>
        </div>
        <div className="flex justify-between text-xs">
          <span>Gallery</span>
          <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">G</kbd>
        </div>
        <div className="flex justify-between text-xs">
          <span>Statistics</span>
          <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">S</kbd>
        </div>
      </div>

      <div className="space-y-1 pt-2">
        <div className="flex justify-between">
          <span>Actions:</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>New Crewmate</span>
          <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Ctrl+N</kbd>
        </div>
        <div className="flex justify-between text-xs">
          <span>Search</span>
          <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Ctrl+K</kbd>
        </div>
        <div className="flex justify-between text-xs">
          <span>Export</span>
          <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Ctrl+E</kbd>
        </div>
      </div>
    </div>
  );
}
