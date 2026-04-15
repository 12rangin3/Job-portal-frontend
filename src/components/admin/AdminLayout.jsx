import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBriefcase, 
  FaUsers, 
  FaChartLine, 
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserShield
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/admin/jobs', icon: <FaBriefcase />, label: 'Manage Jobs' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Manage Users' },
    { path: '/admin/analytics', icon: <FaChartLine />, label: 'Analytics' },
    { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="d-flex align-items-center justify-content-between">
            {sidebarOpen && (
              <div className="sidebar-logo">
                <FaUserShield className="me-2" />
                <span>Admin Portal</span>
              </div>
            )}
            <button 
              className="sidebar-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        <div className="sidebar-user">
          <img src={user?.avatar} alt={user?.name} className="sidebar-avatar" />
          {sidebarOpen && (
            <div className="sidebar-user-info">
              <h6 className="mb-0">{user?.name}</h6>
              <small className="text-muted">{user?.role}</small>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
          <button onClick={logout} className="sidebar-nav-item logout">
            <FaSignOutAlt />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-header">
          <h4 className="mb-0">Welcome back, {user?.name}!</h4>
          <div className="admin-header-actions">
            <Link to="/" className="btn btn-outline-primary btn-sm">View Site</Link>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      <style jsx="true">{`
        .admin-layout {
          display: flex;
          min-height: calc(100vh - 72px);
          background: var(--bg-primary);
        }

        .admin-sidebar {
          width: 280px;
          background: var(--card-bg);
          border-right: 1px solid var(--border-color);
          transition: all 0.3s ease;
          position: fixed;
          top: 72px;
          bottom: 0;
          left: 0;
          z-index: 100;
          overflow-y: auto;
        }

        .admin-sidebar.closed {
          width: 80px;
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .sidebar-logo {
          font-size: 1.25rem;
          font-weight: bold;
          color: var(--text-primary);
        }

        .sidebar-toggle-btn {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .sidebar-toggle-btn:hover {
          background: var(--hover-bg);
        }

        .sidebar-user {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .sidebar-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .sidebar-user-info h6 {
          color: var(--text-primary);
        }

        .sidebar-nav {
          padding: 1rem 0;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
        }

        .sidebar-nav-item:hover {
          background: var(--hover-bg);
          color: var(--text-primary);
        }

        .sidebar-nav-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .sidebar-nav-item.logout {
          margin-top: 1rem;
          color: #dc2626;
        }

        .admin-main {
          flex: 1;
          margin-left: 280px;
          transition: all 0.3s ease;
        }

        .admin-sidebar.closed + .admin-main {
          margin-left: 80px;
        }

        .admin-header {
          padding: 1rem 2rem;
          background: var(--card-bg);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-content {
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          
          .admin-sidebar.open {
            transform: translateX(0);
          }
          
          .admin-main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;