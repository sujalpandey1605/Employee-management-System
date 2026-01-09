import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupApi } from "../../services/authService";

function ManagerSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    managerId: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await signupApi({
        userId: formData.managerId,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "MANAGER"
      });
      alert("Manager account created successfully! Please login.");
      navigate("/auth/manager/login");
    } catch (err) {
      setError(typeof err === 'string' ? err : "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo text-success">Manager Signup</div>
        <p className="login-subtitle">Create your Management account</p>

        {error && <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label text-white-50">Full Name</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="John Doe"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-white-50">Email</label>
            <input
              type="email"
              className="form-control bg-dark text-white border-secondary"
              placeholder="john@example.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-white-50">Manager ID</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="MID-12345"
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-white-50">Password</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-secondary"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button 
            type="submit" 
            className="google-btn mb-3" 
            style={{ background: "#10b981", color: "white" }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register as Manager"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link to="/auth/manager/login" style={{ color: "#10b981", fontWeight: "600" }}>
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ManagerSignup;
