import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout({ role, children }) {
  return (
    <div className="d-flex" style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <Sidebar role={role} />

      <div className="flex-grow-1">
        <Navbar />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
