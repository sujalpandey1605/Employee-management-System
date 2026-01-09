import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Dummy reset
    console.log("Reset password for:", email);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo" style={{ fontSize: "1.8rem" }}>Reset Password</div>
        
        {!submitted ? (
          <>
            <p className="login-subtitle">Enter your Admin email to receive a reset link</p>
            <form onSubmit={handleReset}>
              <div className="mb-4">
                <label className="form-label text-white-50">Admin Email</label>
                <input
                  type="email"
                  className="form-control bg-dark text-white border-secondary p-3"
                  placeholder="admin@etpms.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="google-btn mb-3" style={{ background: "#818cf8", color: "white" }}>
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mb-4" style={{ color: "#10b981" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h5 className="text-white mb-2">Check your Email</h5>
            <p className="text-muted mb-4">We've sent a password reset link to {email}</p>
            <button className="google-btn" onClick={() => navigate("/auth/admin/login")}>
              Back to Login
            </button>
          </div>
        )}

        <div className="text-center mt-4">
          <Link to="/auth/admin/login" style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            ← Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
