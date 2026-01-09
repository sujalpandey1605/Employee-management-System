import { useState, useEffect } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import StatsCard from "../../components/common/StatsCard";
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { getTasksByManager } from "../../services/taskService";
import { useNavigate } from "react-router-dom";

function ManagerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  });

  const managerId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const taskData = await getTasksByManager(managerId);
        setTasks(taskData);

        const total = taskData.length;
        const completed = taskData.filter(t => t.status === 'COMPLETED').length;
        const inProgress = taskData.filter(t => t.status === 'IN_PROGRESS').length;
        const pending = taskData.filter(t => t.status === 'PENDING').length;

        setStats({ total, completed, inProgress, pending });
      } catch (err) {
        console.error("Failed to fetch dashboard summary", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [managerId]);

  // Aggregate completion by priority for the chart (just an example)
  const chartData = [
    { name: 'Pending', count: stats.pending },
    { name: 'In Progress', count: stats.inProgress },
    { name: 'Completed', count: stats.completed },
  ];

  return (
    <DashboardLayout role="MANAGER">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Manager Dashboard</h2>
          <p className="text-muted">Welcome back. Here's an overview of your team's task progress.</p>
        </div>
        <button 
          className="btn btn-primary px-4 rounded-pill shadow-sm" 
          style={{ background: 'var(--primary-blue)', border: 'none' }}
          onClick={() => navigate("/manager/create-task")}
        >
          Assign New Task
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><Loader2 className="animate-spin d-inline me-2" /> Loading dashboard...</div>
      ) : (
        <>
          <div className="dashboard-grid">
            <StatsCard 
              title="Total Assigned" 
              value={stats.total} 
              color="primary" 
              icon={ClipboardList} 
            />
            <StatsCard 
              title="Completed" 
              value={stats.completed} 
              color="success" 
              icon={CheckCircle} 
            />
            <StatsCard 
              title="In Progress" 
              value={stats.inProgress} 
              color="warning" 
              icon={Clock} 
            />
            <StatsCard 
              title="Pending" 
              value={stats.pending} 
              color="info" 
              icon={AlertCircle} 
            />
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-12">
              <div className="dashboard-card h-100">
                <h5 className="mb-4">Live Task Status Distribution</h5>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="count" fill="var(--primary-blue)" radius={[8, 8, 0, 0]} barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default ManagerDashboard;
