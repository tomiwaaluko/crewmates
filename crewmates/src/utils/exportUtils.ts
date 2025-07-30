import { Crewmate, CrewmateFormData } from "../types/crewmate";

export const exportUtils = {
  // Export crewmates to JSON file
  exportToJSON: (crewmates: Crewmate[], filename?: string) => {
    const dataStr = JSON.stringify(crewmates, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName =
      filename ||
      `crewmates-export-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  },

  // Export crewmates to CSV file
  exportToCSV: (crewmates: Crewmate[], filename?: string) => {
    const headers = ["Name", "Color", "Speed", "Created At"];
    const csvContent = [
      headers.join(","),
      ...crewmates.map((crew) =>
        [
          `"${crew.name}"`,
          crew.color,
          crew.speed,
          new Date(crew.created_at).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const dataUri =
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const exportFileDefaultName =
      filename ||
      `crewmates-export-${new Date().toISOString().split("T")[0]}.csv`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  },

  // Import crewmates from JSON file
  importFromJSON: (file: File): Promise<CrewmateFormData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);

          // Validate the data structure
          if (!Array.isArray(jsonData)) {
            throw new Error(
              "Invalid file format: Expected an array of crewmates"
            );
          }

          const validatedCrewmates = jsonData.map((item, index) => {
            if (!item.name || typeof item.name !== "string") {
              throw new Error(
                `Invalid crewmate at index ${index}: Missing or invalid name`
              );
            }
            if (!item.color || typeof item.color !== "string") {
              throw new Error(
                `Invalid crewmate at index ${index}: Missing or invalid color`
              );
            }
            if (
              typeof item.speed !== "number" ||
              item.speed < 0 ||
              item.speed > 100
            ) {
              throw new Error(
                `Invalid crewmate at index ${index}: Speed must be a number between 0 and 100`
              );
            }

            return {
              name: item.name,
              color: item.color,
              speed: item.speed,
            };
          });

          resolve(validatedCrewmates);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  },

  // Generate crew summary report
  generateReport: (crewmates: Crewmate[]): string => {
    const totalCrewmates = crewmates.length;
    const averageSpeed =
      totalCrewmates > 0
        ? (
            crewmates.reduce((sum, c) => sum + c.speed, 0) / totalCrewmates
          ).toFixed(1)
        : "0";

    const colorDistribution = crewmates.reduce((acc, c) => {
      acc[c.color] = (acc[c.color] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostPopularColor =
      Object.entries(colorDistribution).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "None";

    const speedCategories = {
      slow: crewmates.filter((c) => c.speed <= 33).length,
      medium: crewmates.filter((c) => c.speed > 33 && c.speed <= 66).length,
      fast: crewmates.filter((c) => c.speed > 66).length,
    };

    return `
# Crew Report - ${new Date().toLocaleDateString()}

## Overview
- **Total Crewmates**: ${totalCrewmates}
- **Average Speed**: ${averageSpeed}
- **Most Popular Color**: ${mostPopularColor}

## Speed Distribution
- **Slow (0-33)**: ${speedCategories.slow} crewmates
- **Medium (34-66)**: ${speedCategories.medium} crewmates  
- **Fast (67-100)**: ${speedCategories.fast} crewmates

## Color Breakdown
${Object.entries(colorDistribution)
  .sort(([, a], [, b]) => b - a)
  .map(
    ([color, count]) =>
      `- **${color}**: ${count} crewmate${count !== 1 ? "s" : ""}`
  )
  .join("\n")}

## Crew List
${crewmates
  .map((c) => `- ${c.name} (${c.color}, Speed: ${c.speed})`)
  .join("\n")}
`;
  },
};
