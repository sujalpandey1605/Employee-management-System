import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  PlusSquare, 
  ClipboardCheck, 
  CheckCircle2,
  ListTodo
} from "lucide-react";

function Sidebar({ role }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, label }) => (
    <Link 
      to={to} 
      className={`sidebar-link ${isActive(to) ? 'active' : ''}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-dot"></div>
        <span>Management</span>
      </div>

      <div className="sidebar-menu">
        {role === "ADMIN" && (
          <>
            <div className="menu-group">Main</div>
            <NavLink to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavLink to="/admin/employees" icon={Users} label="Employees" />
            <NavLink to="/admin/reports" icon={BarChart3} label="Reports" />
          </>
        )}

        {role === "MANAGER" && (
          <>
            <div className="menu-group">Management</div>
            <NavLink to="/manager/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavLink to="/manager/create-task" icon={PlusSquare} label="Create Task" />
            <NavLink to="/manager/tasks" icon={ClipboardCheck} label="Track Tasks" />
            <NavLink to="/manager/performance" icon={BarChart3} label="Performance" />
          </>
        )}

        {role === "EMPLOYEE" && (
          <>
            <div className="menu-group">Tasks</div>
            <NavLink to="/employee/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavLink to="/employee/my-tasks" icon={ListTodo} label="My Tasks" />
            <NavLink to="/employee/task-update" icon={CheckCircle2} label="Update Task" />
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
