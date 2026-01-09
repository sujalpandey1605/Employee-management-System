import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { loginApi } from "../../services/authService";

function AdminLogin() {
  const [loginId, setLoginId] = useState("");
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
      const userData = await loginApi({ userId: loginId, password });
      login(userData);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(typeof err === 'string' ? err : "Invalid Admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">Admin Login</div>
        <p className="login-subtitle">System Administration Portal</p>

        {error && <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-white-50">Admin ID</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Enter Admin ID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
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
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/auth/admin/forgot-password" style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Forgot Password?
          </Link>
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

export default AdminLogin;
