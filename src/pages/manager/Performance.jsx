import { useState, useEffect } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import StatsCard from "../../components/common/StatsCard";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Award, 
  CheckCircle,
  Loader2
} from "lucide-react";
import { getTasksByManager } from "../../services/taskService";
import { getAllUsers } from "../../services/authService";

function ManagerPerformance() {
  const [loading, setLoading] = useState(true);
  const [teamMetrics, setTeamMetrics] = useState([]);
  const [stats, setStats] = useState({
    efficiency: "0%",
    totalEmployees: 0,
    topPerformer: "N/A",
    completedRatio: "0/0"
  });

  const managerId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [users, tasks] = await Promise.all([
          getAllUsers(),
          getTasksByManager(managerId)
        ]);

        const userMap = {};
        users.forEach(u => userMap[u.userId] = u.name);

        // Calculate Metrics
        const metricsByEmployee = {};
        tasks.forEach(t => {
          if (!metricsByEmployee[t.assignedTo]) {
            metricsByEmployee[t.assignedTo] = { name: userMap[t.assignedTo] || t.assignedTo, total: 0, completed: 0 };
          }
          metricsByEmployee[t.assignedTo].total++;
          if (t.status === 'COMPLETED') metricsByEmployee[t.assignedTo].completed++;
        });

        const chartData = Object.values(metricsByEmployee).map(m => ({
          name: m.name,
          productivity: m.total > 0 ? Math.round((m.completed / m.total) * 100) : 0,
          tasks: m.total,
          completed: m.completed
        }));

        setTeamMetrics(chartData);

        // General Stats
        const totalCompleted = tasks.filter(t => t.status === 'COMPLETED').length;
        const totalTasks = tasks.length;
        const efficiency = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
        
        const top = chartData.sort((a, b) => b.productivity - a.productivity)[0];

        setStats({
          efficiency: `${efficiency}%`,
          totalEmployees: chartData.length,
          topPerformer: top ? top.name : "N/A",
          completedRatio: `${totalCompleted}/${totalTasks}`
        });

      } catch (err) {
        console.error("Failed to load performance metrics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [managerId]);

  return (
    <DashboardLayout role="MANAGER">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Team Performance Analytics</h2>
          <p className="text-muted">Review efficiency, productivity trends, and individual employee metrics.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><Loader2 className="animate-spin d-inline me-2" /> Calculating team metrics...</div>
      ) : (
        <>
          <div className="dashboard-grid">
            <StatsCard 
              title="Team Efficiency" 
              value={stats.efficiency} 
              color="primary" 
              icon={TrendingUp} 
            />
            <StatsCard 
              title="Employees Managed" 
              value={stats.totalEmployees} 
              color="success" 
              icon={Users} 
            />
            <StatsCard 
              title="Top Performer" 
              value={stats.topPerformer} 
              color="info" 
              icon={Award} 
            />
            <StatsCard 
              title="Goal Completion" 
              value={stats.completedRatio} 
              color="warning" 
              icon={CheckCircle} 
            />
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-12">
              <div className="dashboard-card" style={{ height: 400 }}>
                <h5 className="mb-4">Individual Productivity Score (%)</h5>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={teamMetrics}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="productivity" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={50}>
                        {teamMetrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.productivity > 80 ? '#10b981' : entry.productivity > 50 ? '#3b82f6' : '#f59e0b'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h5 className="mb-4">Detailed Team Metrics</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr className="text-muted smaller fw-bold">
                    <th>EMPLOYEE</th>
                    <th>COMPLETED / TOTAL</th>
                    <th>PRODUCTIVITY</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMetrics.map((emp, i) => (
                    <tr key={i} style={{ verticalAlign: 'middle' }}>
                      <td className="fw-bold">{emp.name}</td>
                      <td>{emp.completed} / {emp.tasks} tasks</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                           <span className="small fw-bold">{emp.productivity}%</span>
                           <div className="progress flex-grow-1" style={{height:5, width:100}}>
                              <div className={`progress-bar ${emp.productivity > 80 ? 'bg-success' : 'bg-primary'}`} style={{width: `${emp.productivity}%`}}></div>
                           </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge rounded-pill bg-opacity-10 ${emp.productivity > 80 ? 'bg-success text-success' : 'bg-warning text-warning'}`}>
                          {emp.productivity > 80 ? 'High' : 'Improving'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default ManagerPerformance;
