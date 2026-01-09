import { useState } from "react";
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
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  Activity, 
  Target, 
  ShieldCheck 
} from "lucide-react";
import { exportUsers } from "../../services/authService";

const areaData = [
  { name: 'Week 1', completed: 400, pending: 240 },
  { name: 'Week 2', completed: 300, pending: 139 },
  { name: 'Week 3', completed: 500, pending: 380 },
  { name: 'Week 4', completed: 480, pending: 300 },
];

const pieData = [
  { name: 'Development', value: 400, color: '#3b82f6' },
  { name: 'Design', value: 300, color: '#10b981' },
  { name: 'Marketing', value: 200, color: '#f59e0b' },
  { name: 'Management', value: 100, color: '#ef4444' },
];

function Reports() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await exportUsers();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employees_report_${new Date().toLocaleDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert("Export failed. Please check your connection.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Systems & Performance Reports</h2>
          <p className="text-muted">Analyze organization-wide productivity and system health metrics.</p>
        </div>
        <div className="d-flex gap-3">
          <button className="btn btn-light d-flex align-items-center gap-2 border shadow-sm px-3 rounded-3">
            <Calendar size={18} />
            <span>Select Range</span>
          </button>
          <button 
            className="btn btn-primary d-flex align-items-center gap-2 px-4 rounded-3 shadow-sm" 
            style={{ background: 'var(--primary-blue)', border: 'none' }}
            onClick={handleExport}
            disabled={exporting}
          >
            <Download size={18} />
            <span>{exporting ? "Exporting..." : "Export Report"}</span>
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <StatsCard 
          title="Overall Productivity" 
          value="94.2%" 
          color="primary" 
          icon={TrendingUp} 
          trend="up" 
          trendValue="2.4%" 
        />
        <StatsCard 
          title="System Uptime" 
          value="99.99%" 
          color="success" 
          icon={ShieldCheck} 
          trend="up" 
          trendValue="0.01%" 
        />
        <StatsCard 
          title="Active Sessions" 
          value="156" 
          color="info" 
          icon={Activity} 
          trend="up" 
          trendValue="15%" 
        />
        <StatsCard 
          title="Goal Completion" 
          value="82%" 
          color="warning" 
          icon={Target} 
          trend="down" 
          trendValue="4%" 
        />
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="dashboard-card" style={{ height: 450 }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Task Progress Analysis</h5>
              <div className="d-flex gap-3 small">
                <span className="d-flex align-items-center gap-1"><div style={{width:10,height:10,borderRadius:2,background:'#3b82f6'}}></div> Completed</span>
                <span className="d-flex align-items-center gap-1"><div style={{width:10,height:10,borderRadius:2,background:'#e2e8f0'}}></div> Pending</span>
              </div>
            </div>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCompleted)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pending" 
                    stroke="#e2e8f0" 
                    strokeWidth={3}
                    fill="transparent" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="dashboard-card" style={{ height: 450 }}>
            <h5 className="mb-4">Resource Allocation</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2">
              {pieData.map(item => (
                <div key={item.name} className="d-flex align-items-center justify-content-between mb-2 small">
                  <div className="d-flex align-items-center gap-2">
                    <div style={{width:8,height:8,borderRadius:'50%',background:item.color}}></div>
                    <span className="text-muted">{item.name}</span>
                  </div>
                  <span className="fw-bold">{item.value}+</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="dashboard-card">
            <h5 className="mb-4">System Efficiency Metrics</h5>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={areaData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="completed" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reports;
