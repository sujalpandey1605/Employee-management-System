import { authState } from "../store/state/authState";

// Initialize state from localStorage
const savedToken = localStorage.getItem("token");
const savedRole = localStorage.getItem("role");
if (savedToken && savedRole) {
  authState.isAuthenticated = true;
  authState.role = savedRole;
}

export const useAuth = () => {
  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("userId", userData.userId);
    
    authState.isAuthenticated = true;
    authState.role = userData.role;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    
    authState.isAuthenticated = false;
    authState.role = null;
    window.location.href = "/";
  };

  return {
    auth: authState,
    login,
    logout,
  };
};
