// client/src/utils/auth.js

export const getCurrentUser = () => {
    try {
      const data = localStorage.getItem("user");
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      return null;
    }
  };
  
  export const getToken = () => {
    return localStorage.getItem("token") || null;
  };
  
  export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  