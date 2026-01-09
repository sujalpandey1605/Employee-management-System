import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    
    if (token) {
      // Decode JWT to get role (basic decoding for UI role, 
      // full validation happens on backend requests)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role || "EMPLOYEE"; // Default to EMPLOYEE if not present
        const userId = payload.sub;

        login({ token, role, userId });

        // Redirect based on role
        if (role === "ADMIN") navigate("/admin/dashboard");
        else if (role === "MANAGER") navigate("/manager/dashboard");
        else navigate("/employee/dashboard");
        
      } catch (e) {
        console.error("Failed to parse token", e);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [location, login, navigate]);

  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-white">Authenticating with Google...</p>
      </div>
    </div>
  );
}

export default OAuthSuccess;
