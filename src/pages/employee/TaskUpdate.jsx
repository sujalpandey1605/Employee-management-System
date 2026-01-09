import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/common/DashboardLayout";
import Toast from "../../components/common/Toast";
import { 
  CheckCircle, 
  FileText, 
  MessageSquare, 
  ChevronLeft,
  TrendingUp,
  Loader2
} from "lucide-react";
import { updateTaskStatus } from "../../services/taskService";

function TaskUpdate() {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task;

  const [status, setStatus] = useState(task?.status || "IN_PROGRESS");
  const [remarks, setRemarks] = useState(task?.lastRemark || "");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  if (!task) {
    return (
      <DashboardLayout role="EMPLOYEE">
        <div className="text-center py-5">
          <h5>Task not found. Please select a task from the list.</h5>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/employee/tasks")}>Back to Tasks</button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateTaskStatus(task.id, status, encodeURIComponent(remarks));
      setToast({ type: "success", message: "Task progress submitted successfully!" });
      setTimeout(() => navigate("/employee/tasks"), 1500);
    } catch (err) {
      console.error("Failed to update task", err);
      setToast({ type: "danger", message: "Failed to update task. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="EMPLOYEE">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button onClick={() => navigate("/employee/tasks")} className="btn btn-light rounded-circle p-2 shadow-sm border">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="mb-0">Update Progress</h2>
            <p className="text-muted mb-0">Share your latest work status with your manager.</p>
          </div>
        </div>
      </div>

      {toast && (
        <div className="mb-4">
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="dashboard-card shadow-sm p-4">
            <form onSubmit={handleSubmit}>
              <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-4" style={{ background: 'var(--bg-main)' }}>
                <div className="avatar bg-primary text-white" style={{ borderRadius: '12px', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <FileText size={24} />
                </div>
                <div>
                  <div className="text-muted smaller fw-bold mb-1">TASK TITLE</div>
                  <div className="fw-bold fs-5 text-dark">{task.title}</div>
                  <div className="text-muted small">{task.description}</div>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold h6 mb-3 d-flex align-items-center gap-2 border-bottom pb-2">
                   <TrendingUp size={18} className="text-primary" /> Update Status
                </label>
                <div className="row g-3">
                  {["PENDING", "IN_PROGRESS", "COMPLETED"].map((s) => (
                    <div className="col-md-4" key={s}>
                      <div 
                        className={`p-3 rounded-3 border-2 transition-all text-center cursor-pointer ${status === s ? 'border-primary bg-primary bg-opacity-10 text-primary' : 'bg-light border-light text-muted opacity-75'}`}
                        style={{ cursor: 'pointer', borderStyle: 'solid' }}
                        onClick={() => setStatus(s)}
                      >
                         <div className="small fw-bold">{s}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold h6 mb-3 d-flex align-items-center gap-2 border-bottom pb-2">
                   <MessageSquare size={18} className="text-primary" /> Work Remarks
                </label>
                <textarea 
                  className="form-control bg-light border-0 p-3 rounded-3" 
                  rows="4" 
                  placeholder="What have you completed since the last update?"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                ></textarea>
              </div>

              <div className="d-flex gap-3 mt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary flex-grow-1 p-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                  Submit Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TaskUpdate;
