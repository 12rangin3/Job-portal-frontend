import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

function EmployerLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await API.get('/employer/notifications');
      setNewApplicationsCount(response.data.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 bg-dark min-vh-100 p-3">
          <h4 className="text-white mb-4">Employer Panel</h4>
          <div className="mb-3 pb-3 border-bottom border-secondary">
            <small className="text-muted">Logged in as:</small>
            <div className="text-white fw-semibold">{user?.name}</div>
            <small className="text-info">{user?.companyName}</small>
          </div>
          
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link 
                to="/employer/dashboard" 
                className={`nav-link text-white ${isActive('/employer/dashboard') ? 'active bg-primary' : ''}`}
              >
                📊 Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/employer/post-job" 
                className={`nav-link text-white ${isActive('/employer/post-job') ? 'active bg-primary' : ''}`}
              >
                ➕ Post New Job
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/employer/my-jobs" 
                className={`nav-link text-white ${isActive('/employer/my-jobs') ? 'active bg-primary' : ''}`}
              >
                💼 My Jobs
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/employer/notifications" 
                className={`nav-link text-white ${isActive('/employer/notifications') ? 'active bg-primary' : ''}`}
              >
                🔔 Notifications
                {newApplicationsCount > 0 && (
                  <span className="badge bg-danger ms-2">{newApplicationsCount}</span>
                )}
              </Link>
            </li>
          </ul>

          <hr className="border-secondary" />
          
          <div className="mt-3">
            <Link to="/jobs" className="nav-link text-white">
              🏠 Browse Jobs
            </Link>
            <button 
              onClick={handleLogout}
              className="btn btn-outline-light w-100 mt-2"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-10 p-4 bg-light min-vh-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default EmployerLayout;
