import DashboardLayout from "../../components/common/DashboardLayout";
import StatsCard from "../../components/common/StatsCard";
import { 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  MoreHorizontal,
  Mail,
  ArrowUpRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const data = [
  { name: 'Mon', tasks: 40 },
  { name: 'Tue', tasks: 30 },
  { name: 'Wed', tasks: 45 },
  { name: 'Thu', tasks: 35 },
  { name: 'Fri', tasks: 55 },
  { name: 'Sat', tasks: 20 },
  { name: 'Sun', tasks: 15 },
];

const performanceData = [
  { name: 'Design', score: 90, color: '#3b82f6' },
  { name: 'Dev', score: 85, color: '#10b981' },
  { name: 'QA', score: 75, color: '#f59e0b' },
  { name: 'Marketing', score: 65, color: '#ef4444' },
];

const recentEmployees = [
  { id: 1, name: "Jordi Anna", email: "jordi@example.com", designation: "Designer", status: "Excellent", score: "90%" },
  { id: 2, name: "Elkan Murphy", email: "elkan@example.com", designation: "Programmer", status: "Excellent", score: "88%" },
  { id: 3, name: "Harry Martin", email: "harry@example.com", designation: "Marketing", status: "Good", score: "75%" },
];

function AdminDashboard() {
  return (
    <DashboardLayout role="ADMIN">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Hello, Administrator!</h2>
          <p className="text-muted">Welcome back to your dashboard overview.</p>
        </div>
        <button className="btn btn-primary px-4 rounded-pill" style={{ background: 'var(--primary-blue)', border: 'none' }}>
          Download Report
        </button>
      </div>

      <div className="dashboard-grid">
        <StatsCard 
          title="Total Employees" 
          value="1,242" 
          color="primary" 
          icon={Users} 
          trend="up" 
          trendValue="12%" 
        />
        <StatsCard 
          title="Active Managers" 
          value="48" 
          color="success" 
          icon={UserCheck} 
          trend="up" 
          trendValue="5%" 
        />
        <StatsCard 
          title="Tasks in Progress" 
          value="156" 
          color="warning" 
          icon={Clock} 
          trend="down" 
          trendValue="2%" 
        />
        <StatsCard 
          title="Completed Today" 
          value="84" 
          color="info" 
          icon={CheckCircle} 
          trend="up" 
          trendValue="18%" 
        />
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="dashboard-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Task Completion Trend</h5>
              <select className="form-select form-select-sm w-auto border-0 bg-light">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="var(--primary-blue)" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: 'var(--primary-blue)', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="dashboard-card h-100">
            <h5 className="mb-4">Department Performance</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={performanceData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="score" radius={[10, 10, 0, 0]}>
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Recent Employees</h5>
          <button className="btn btn-link text-primary text-decoration-none fw-bold p-0">View All</button>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr className="text-muted" style={{ fontSize: '0.85rem' }}>
                <th>NAME</th>
                <th>DESIGNATION</th>
                <th>PERFORMANCE</th>
                <th>SCORE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {recentEmployees.map(emp => (
                <tr key={emp.id} style={{ verticalAlign: 'middle' }}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar avatar-sm" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                        {emp.name[0]}
                      </div>
                      <div>
                        <div className="fw-bold">{emp.name}</div>
                        <div className="text-muted smaller" style={{ fontSize: '0.75rem' }}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{emp.designation}</td>
                  <td>
                    <span className={`badge rounded-pill ${emp.status === 'Excellent' ? 'bg-success' : 'bg-primary'} bg-opacity-10 ${emp.status === 'Excellent' ? 'text-success' : 'text-primary'}`} style={{ fontWeight: 600 }}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="fw-bold">{emp.score}</td>
                  <td>
                    <button className="btn btn-icon btn-sm text-muted">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
