import { useState, useEffect } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import StatsCard from "../../components/common/StatsCard";
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  Star,
  TrendingUp,
  Loader2
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { getTasksByAssignee } from "../../services/taskService";

function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        const taskData = await getTasksByAssignee(userId);
        setTasks(taskData);

        const total = taskData.length;
        const completed = taskData.filter(t => t.status === 'COMPLETED').length;
        const inProgress = taskData.filter(t => t.status === 'IN_PROGRESS').length;
        const pending = taskData.filter(t => t.status === 'PENDING').length;

        setStats({ total, completed, inProgress, pending });
      } catch (err) {
        console.error("Failed to fetch employee dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, [userId]);

  // Aggregate for chart: Tasks completed in last 7 days (simplified for now)
  const taskHistory = [
    { day: 'Mon', completed: 0 },
    { day: 'Tue', completed: 0 },
    { day: 'Wed', completed: 0 },
    { day: 'Thu', completed: 0 },
    { day: 'Fri', completed: 0 },
    { day: 'Sat', completed: 0 },
    { day: 'Sun', completed: stats.completed },
  ];

  const upcomingTasks = tasks
    .filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  const performanceScore = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <DashboardLayout role="EMPLOYEE">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Employee Dashboard</h2>
          <p className="text-muted">Keep track of your assigned tasks and personal performance.</p>
        </div>
        <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-pill shadow-sm border">
          <Star size={18} className="text-warning fill-warning" />
          <span className="fw-bold text-dark">Performance Score: {performanceScore}%</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Loader2 className="animate-spin d-inline me-2" /> Loading your dashboard...
        </div>
      ) : (
        <>
          <div className="dashboard-grid">
            <StatsCard 
              title="Total Tasks" 
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
              icon={TrendingUp} 
            />
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="dashboard-card h-100">
                <h5 className="mb-4">Weekly Completion Trend</h5>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={taskHistory}>
                      <defs>
                        <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorComp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="dashboard-card h-100">
                <h5 className="mb-4">Upcoming Deadlines</h5>
                <div className="list-group list-group-flush">
                  {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
                    <div key={task.id} className="list-group-item px-0 py-3 border-0 border-bottom d-flex align-items-center justify-content-between">
                      <div>
                        <div className="fw-bold text-dark">{task.title}</div>
                        <div className="text-muted smaller">Due {new Date(task.deadline).toLocaleDateString()}</div>
                      </div>
                      <span className={`badge rounded-pill ${task.priority === 'HIGH' || task.priority === 'URGENT' ? 'bg-danger' : task.priority === 'MEDIUM' ? 'bg-warning' : 'bg-info'} bg-opacity-10 ${task.priority === 'HIGH' || task.priority === 'URGENT' ? 'text-danger' : task.priority === 'MEDIUM' ? 'text-warning' : 'text-info'}`} style={{ fontWeight: 600 }}>
                        {task.priority}
                      </span>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-muted">No upcoming tasks!</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default EmployeeDashboard;
