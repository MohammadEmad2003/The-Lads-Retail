import { BASE_URL } from "../config";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (email, username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Signup failed");

      localStorage.setItem("token", data.access_token);
      // Optionally fetch user info in another call if needed
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
