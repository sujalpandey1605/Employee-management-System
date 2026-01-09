import { useState, useEffect } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import { 
  PlusSquare, 
  Users, 
  Calendar, 
  Type, 
  AlignLeft, 
  Flag,
  Loader2
} from "lucide-react";
import { createTask } from "../../services/taskService";
import { getAllUsers } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function CreateTask() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    priority: "MEDIUM"
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getAllUsers({ role: "EMPLOYEE" });
        setEmployees(data);
      } catch (err) {
        console.error("Failed to load employees", err);
      } finally {
        setFetchingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const managerId = localStorage.getItem("userId");
      
      const payload = {
        ...formData,
        assignedBy: managerId,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      };

      await createTask(payload);
      alert("Task created and assigned successfully!");
      navigate("/manager/dashboard");
    } catch (err) {
      console.error("Task creation failed:", err.response?.data || err.message);
      alert(`Failed to create task: ${err.response?.data || "Please check your connection."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="MANAGER">
      <div className="mb-4">
        <h2 className="mb-1">Create & Assign Tasks</h2>
        <p className="text-muted">Set clear goals and assign them to your team members.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="dashboard-card p-4 shadow-sm">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label d-flex align-items-center gap-2 fw-bold text-dark">
                  <Type size={18} className="text-primary" />
                  Task Title
                </label>
                <input 
                  type="text" 
                  className="form-control bg-light border-0 p-3 rounded-3" 
                  placeholder="Enter task title (e.g., UI Redesign)" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label d-flex align-items-center gap-2 fw-bold text-dark">
                  <AlignLeft size={18} className="text-primary" />
                  Description
                </label>
                <textarea 
                  className="form-control bg-light border-0 p-3 rounded-3" 
                  rows="4" 
                  placeholder="Provide detailed instructions for the employee..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                ></textarea>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center gap-2 fw-bold text-dark">
                    <Users size={18} className="text-primary" />
                    Assign to Employee
                  </label>
                  <select 
                    className="form-select bg-light border-0 p-3 rounded-3"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    required
                    disabled={fetchingEmployees}
                  >
                    <option value="">{fetchingEmployees ? "Loading employees..." : "Select an employee"}</option>
                    {employees.map(emp => (
                      <option key={emp.userId} value={emp.userId}>
                        {emp.name} ({emp.userId})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mt-3 mt-md-0">
                  <label className="form-label d-flex align-items-center gap-2 fw-bold text-dark">
                    <Calendar size={18} className="text-primary" />
                    Deadline
                  </label>
                  <input 
                    type="date" 
                    className="form-control bg-light border-0 p-3 rounded-3"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label d-flex align-items-center gap-2 fw-bold text-dark">
                  <Flag size={18} className="text-primary" />
                  Priority Level
                </label>
                <div className="d-flex gap-3">
                  {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                    <div 
                      key={p} 
                      className={`flex-grow-1 text-center py-2 px-3 rounded-3 cursor-pointer border-2 transition-all ${formData.priority === p ? 'border-primary bg-primary bg-opacity-10 text-primary fw-bold' : 'bg-light border-light text-muted'}`}
                      style={{ cursor: 'pointer', borderStyle: 'solid' }}
                      onClick={() => setFormData({...formData, priority: p})}
                    >
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 p-3 fs-5 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" size={22} /> : <PlusSquare size={22} />}
                  {loading ? "Assigning..." : "Assign Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateTask;
