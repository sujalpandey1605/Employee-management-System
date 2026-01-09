import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupApi } from "../../services/authService";

function EmployeeSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
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
        userId: formData.employeeId,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "EMPLOYEE"
      });
      alert("Employee account created successfully! Please login.");
      navigate("/auth/employee/login");
    } catch (err) {
      setError(typeof err === 'string' ? err : "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo" style={{ color: "#f59e0b" }}>Employee Signup</div>
        <p className="login-subtitle">Join the organization</p>

        {error && <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label text-white-50">Full Name</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Jane Doe"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-white-50">Email</label>
            <input
              type="email"
              className="form-control bg-dark text-white border-secondary"
              placeholder="jane@example.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-white-50">Employee ID</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="EID-67890"
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
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
            style={{ background: "#f59e0b", color: "white" }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register as Employee"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link to="/auth/employee/login" style={{ color: "#f59e0b", fontWeight: "600" }}>
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmployeeSignup;
