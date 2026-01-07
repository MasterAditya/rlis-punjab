const API_BASE_URL = "http://localhost:8000/api/v1";

export const fetchLocations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return [];
  }
};

export const fetchIncidents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/incidents`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch incidents:", error);
    return [];
  }
};

export const analyzeLog = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // CRITICAL FIX: Backend expects 'raw_text', NOT 'text'
      body: JSON.stringify({ raw_text: text }), 
    });

    if (!response.ok) throw new Error("Analysis request failed");
    return await response.json();
  } catch (error) {
    console.error("Error analyzing log:", error);
    return null;
  }
};