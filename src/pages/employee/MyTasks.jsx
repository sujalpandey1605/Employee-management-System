import { useState, useEffect } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import { 
  Search, 
  Filter, 
  Calendar, 
  ArrowRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTasksByAssignee } from "../../services/taskService";
import { getAllUsers } from "../../services/authService";

function MyTasks() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [managers, setManagers] = useState({});

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [taskData, userData] = await Promise.all([
          getTasksByAssignee(userId),
          getAllUsers()
        ]);
        
        setTasks(taskData);
        
        // Map manager IDs to names
        const managerMap = {};
        userData.forEach(u => {
          managerMap[u.userId] = u.name;
        });
        setManagers(managerMap);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'primary';
      case 'PENDING': return 'secondary';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT':
      case 'HIGH': return 'danger';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <DashboardLayout role="EMPLOYEE">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Assigned Tasks</h2>
          <p className="text-muted">Manage your workload and keep track of your task deadlines.</p>
        </div>
        <div className="d-flex gap-2">
          <div className="search-bar border bg-white shadow-none">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><Loader2 className="animate-spin d-inline me-2" /> Loading tasks...</div>
      ) : (
        <div className="dashboard-card p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light text-muted fw-bold" style={{ fontSize: '0.8rem' }}>
                <tr>
                  <th className="ps-4 py-3">TASK DESCRIPTION</th>
                  <th className="py-3">ASSIGNED BY</th>
                  <th className="py-3">DUE DATE</th>
                  <th className="py-3">PRIORITY</th>
                  <th className="py-3">STATUS</th>
                  <th className="pe-4 py-3 text-end">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? filteredTasks.map(task => (
                  <tr key={task.id} style={{ verticalAlign: 'middle' }}>
                    <td className="ps-4 py-3">
                      <div className="fw-bold text-dark mb-1">{task.title}</div>
                      <div className="text-muted small text-truncate" style={{ maxWidth: '250px' }}>{task.description}</div>
                    </td>
                    <td className="text-muted small">
                      {managers[task.assignedBy] || task.assignedBy}
                    </td>
                    <td className="text-muted small">
                      <div className="d-flex align-items-center gap-1">
                        <Calendar size={14} /> {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className={`badge bg-opacity-10 bg-${getPriorityColor(task.priority)} text-${getPriorityColor(task.priority)}`} style={{ fontSize: '0.7rem' }}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-1 bg-${getStatusColor(task.status)} bg-opacity-10 text-${getStatusColor(task.status)}`} style={{ fontWeight: 600 }}>
                        {task.status}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button 
                        onClick={() => navigate(`/employee/task-update`, { state: { task } })}
                        className="btn btn-sm btn-light border px-3 rounded-pill d-inline-flex align-items-center gap-2 text-primary fw-bold"
                      >
                        Update <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <AlertCircle className="d-block mx-auto mb-2" size={32} />
                      No tasks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default MyTasks;
