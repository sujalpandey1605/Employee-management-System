import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { loginApi } from "../../services/authService";

function ManagerLogin() {
  const [managerId, setManagerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userData = await loginApi({ userId: managerId, password });
      login(userData);
      navigate("/manager/dashboard");
    } catch (err) {
      setError(typeof err === 'string' ? err : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">Manager Login</div>
        <p className="login-subtitle">Team Management Portal</p>

        {error && <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-white-50">Manager ID</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Enter Manager ID"
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-white-50">Password</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-secondary"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="google-btn mb-3" 
            style={{ background: "#10b981", color: "white" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <Link to="/auth/manager/signup" style={{ color: "#10b981", fontWeight: "600" }}>
              Sign Up
            </Link>
          </p>
        </div>
        
        <div className="text-center mt-4">
          <Link to="/" style={{ color: "#818cf8", fontWeight: "600" }}>
            ← Back to Selection
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ManagerLogin;
