import { useState, useEffect } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2,
  Edit,
  MoreVertical,
  Loader2
} from "lucide-react";
import { getTasksByManager, updateTaskStatus, deleteTask } from "../../services/taskService";
import { getAllUsers } from "../../services/authService";

function TaskTracking() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const managerId = localStorage.getItem("userId");

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        // 1. Fetch employees to map IDs to Names
        const users = await getAllUsers();
        const userMap = {};
        users.forEach(u => userMap[u.userId] = u.name);
        setEmployees(userMap);

        // 2. Fetch tasks
        const taskData = await getTasksByManager(managerId);
        setTasks(taskData);
      } catch (err) {
        console.error("Failed to load tracking data", err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [managerId]);

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      alert("Status update failed");
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employees[task.assignedTo] || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch(status) {
      case 'COMPLETED': return { bg: '#dcfce7', text: '#166534', icon: CheckCircle2 };
      case 'IN_PROGRESS': return { bg: '#eff6ff', text: '#1d4ed8', icon: Clock };
      case 'PENDING': return { bg: '#fff7ed', text: '#9a3412', icon: Clock };
      case 'CANCELLED': return { bg: '#fee2e2', text: '#991b1b', icon: AlertTriangle };
      default: return { bg: '#f1f5f9', text: '#64748b', icon: Clock };
    }
  };

  return (
    <DashboardLayout role="MANAGER">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Task Tracking</h2>
          <p className="text-muted">Monitor the real-time progress of all assigned team tasks.</p>
        </div>
        <div className="d-flex gap-2">
          <div className="search-bar border shadow-none bg-white">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search tasks or employees..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-card p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                <th className="ps-4 py-3">TASK TITLE</th>
                <th className="py-3">ASSIGNED TO</th>
                <th className="py-3">PRIORITY</th>
                <th className="py-3">DEADLINE</th>
                <th className="py-3">STATUS</th>
                <th className="pe-4 py-3 text-end">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-5"><Loader2 className="animate-spin d-inline me-2" /> Loading tasks...</td></tr>
              ) : filteredTasks.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-5 text-muted">No tasks found.</td></tr>
              ) : filteredTasks.map(task => {
                const style = getStatusStyle(task.status);
                const Icon = style.icon;
                return (
                  <tr key={task.id} style={{ verticalAlign: 'middle' }}>
                    <td className="ps-4 py-3">
                      <div className="fw-bold" style={{ color: '#1e293b' }}>{task.title}</div>
                      <div className="text-muted smaller overflow-hidden text-nowrap" style={{ maxWidth: '250px', textOverflow: 'ellipsis' }}>
                        {task.description}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar avatar-sm">{employees[task.assignedTo]?.[0] || "?"}</div>
                        <span className="small fw-semibold">{employees[task.assignedTo] || task.assignedTo}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${task.priority === 'URGENT' ? 'bg-danger' : task.priority === 'HIGH' ? 'bg-warning text-dark' : 'bg-info'} bg-opacity-10 ${task.priority === 'URGENT' ? 'text-danger' : task.priority === 'HIGH' ? 'text-warning' : 'text-info'}`} style={{ fontSize: '0.7rem' }}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="small text-muted fw-medium">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                    </td>
                    <td>
                      <select 
                        className="form-select form-select-sm border-0 fw-bold rounded-pill px-3"
                        style={{ background: style.bg, color: style.text, width: 'auto' }}
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-icon text-danger" onClick={() => handleDelete(task.id)}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TaskTracking;
