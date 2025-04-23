const API_URL = "https://localhost:7145/api/Auth/";

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error("Registration failed:", error.message);
    throw error;
  }
};
