import { useState, useEffect } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  Trash2,
  Edit,
  UserPlus
} from "lucide-react";
import { getAllUsers, deleteUser, createUser } from "../../services/authService";

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    userId: "",
    name: "",
    email: "",
    role: "EMPLOYEE",
    password: "Password@123" // Default password
  });

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm, roleFilter]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers({ query: searchTerm, role: roleFilter });
      setEmployees(data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm(`Are you sure you want to delete user ${userId}?`)) {
      try {
        await deleteUser(userId);
        fetchEmployees();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createUser(newEmployee);
      setShowAddModal(false);
      setNewEmployee({
        userId: "",
        name: "",
        email: "",
        role: "EMPLOYEE",
        password: "Password@123"
      });
      fetchEmployees();
    } catch (err) {
      alert("Creation failed");
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Employee Management</h2>
          <p className="text-muted">Manage your workforce, roles, and department assignments.</p>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2 px-4 rounded-pill shadow-sm" 
          style={{ background: 'var(--primary-blue)', border: 'none' }}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          <span>Add New Employee</span>
        </button>
      </div>

      <div className="dashboard-card mb-4" style={{ padding: '0.75rem' }}>
        <div className="row g-2 align-items-center px-3 py-2">
          <div className="col-md-5">
            <div className="search-bar border shadow-none w-100" style={{ maxWidth: 'none' }}>
              <Search size={18} className="text-muted" />
              <input 
                type="text" 
                placeholder="Search by name or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-auto ms-auto d-flex gap-2">
            <select 
              className="form-select border shadow-none" 
              style={{ width: '150px' }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-card overflow-hidden" style={{ padding: 0 }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                <th className="ps-4 py-3">USER ID</th>
                <th className="py-3">EMPLOYEE NAME</th>
                <th className="py-3">ROLE</th>
                <th className="py-3">EMAIL</th>
                <th className="pe-4 py-3 text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-5">Loading...</td></tr>
              ) : employees.map(emp => (
                <tr key={emp.userId} style={{ verticalAlign: 'middle' }}>
                  <td className="ps-4 py-3 fw-bold text-primary">{emp.userId}</td>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar" style={{ width: 40, height: 40, background: '#f1f5f9' }}>
                        {emp.name?.[0]}
                      </div>
                      <div className="fw-bold" style={{ color: '#1e293b' }}>{emp.name}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge rounded-pill ${emp.role === 'ADMIN' ? 'bg-danger' : emp.role === 'MANAGER' ? 'bg-indigo' : 'bg-secondary'} bg-opacity-10 ${emp.role === 'ADMIN' ? 'text-danger' : emp.role === 'MANAGER' ? 'text-indigo' : 'text-secondary'}`} style={{ fontWeight: 600, fontSize: '0.75rem' }}>
                      {emp.role}
                    </span>
                  </td>
                  <td style={{ color: '#475569' }}>{emp.email}</td>
                  <td className="pe-4 text-end">
                    <button className="btn btn-icon text-danger" onClick={() => handleDelete(emp.userId)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Add New Employee</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label">User ID (Unique)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={newEmployee.userId}
                      onChange={e => setNewEmployee({...newEmployee, userId: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={newEmployee.name}
                      onChange={e => setNewEmployee({...newEmployee, name: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      required 
                      value={newEmployee.email}
                      onChange={e => setNewEmployee({...newEmployee, email: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select 
                      className="form-select"
                      value={newEmployee.role}
                      onChange={e => setNewEmployee({...newEmployee, role: e.target.value})}
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <p className="text-muted small">* Default password will be 'Password@123'</p>
                </div>
                <div className="modal-footer border-top-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Create Employee</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default EmployeeManagement;
