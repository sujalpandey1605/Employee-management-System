import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Unauthorized from "../pages/auth/Unauthorized";
import OAuthSuccess from "../pages/auth/OAuthSuccess";
import ForgotPassword from "../pages/auth/ForgotPassword";
import AdminLogin from "../pages/auth/AdminLogin";
import ManagerLogin from "../pages/auth/ManagerLogin";
import ManagerSignup from "../pages/auth/ManagerSignup";
import EmployeeLogin from "../pages/auth/EmployeeLogin";
import EmployeeSignup from "../pages/auth/EmployeeSignup";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import EmployeeManagement from "../pages/admin/EmployeeManagement";
import Reports from "../pages/admin/Reports";

// Manager
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import CreateTask from "../pages/manager/CreateTask";
import TaskTracking from "../pages/manager/TaskTracking";
import ManagerPerformance from "../pages/manager/Performance";

// Employee
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import MyTasks from "../pages/employee/MyTasks";
import TaskUpdate from "../pages/employee/TaskUpdate";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/oauth2/success" element={<OAuthSuccess />} />
        
        {/* AUTH ROUTES */}
        <Route path="/auth/admin/login" element={<AdminLogin />} />
        <Route path="/auth/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/manager/login" element={<ManagerLogin />} />
        <Route path="/auth/manager/signup" element={<ManagerSignup />} />
        <Route path="/auth/employee/login" element={<EmployeeLogin />} />
        <Route path="/auth/employee/signup" element={<EmployeeSignup />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <EmployeeManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* MANAGER ROUTES */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/create-task"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <CreateTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/tasks"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <TaskTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/performance"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerPerformance />
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEE ROUTES */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/my-tasks"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/task-update"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <TaskUpdate />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
