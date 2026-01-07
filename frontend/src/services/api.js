const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

/**
 * Sends a raw log text to the AI backend for analysis.
 * @param {string} text - "Traffic jam near Moga"
 */
export const analyzeLog = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw_text: text }),
    });

    if (!response.ok) throw new Error("AI Service Failed");
    return await response.json();
  } catch (error) {
    console.error("Error analyzing log:", error);
    return null;
  }
};

/**
 * Fetches all map locations (Hubs, Mandis) to populate the map.
 */
export const fetchLocations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) throw new Error("Failed to load map data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

/**
 * Fetches the history of recent incidents for the dashboard feed.
 */
export const fetchIncidents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/incidents`);
    if (!response.ok) throw new Error("Failed to load history");
    return await response.json();
  } catch (error) {
    console.error("Error fetching incidents:", error);
    return [];
  }
};