import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Search, Bell, LogOut, Settings } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const { logout, auth } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar-modern">
      <div className="search-bar">
        <Search size={18} className="text-muted" />
        <input type="text" placeholder="Search for reports, data..." />
      </div>

      <div className="nav-actions">
        <button className="btn btn-icon text-muted">
          <Bell size={20} />
        </button>
        <button className="btn btn-icon text-muted">
          <Settings size={20} />
        </button>
        
        <div className="profile-section" onClick={handleLogout} title="Click to Logout">
          <div className="text-end d-none d-md-block">
            <div className="fw-bold small">{auth.role} User</div>
            <div className="text-muted smaller" style={{ fontSize: '0.7rem' }}>
              {localStorage.getItem("userId")}
            </div>
          </div>
          <div className="avatar">
            {auth.role?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
