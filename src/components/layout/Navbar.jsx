import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary bg-gradient shadow-sm sticky-top backdrop-blur">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2" to="/">
          💼 <span>JobPortal</span>
        </Link>

        {/* Right Controls */}
        <div className="d-flex align-items-center gap-2">

          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={handleToggle}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Menu */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3 text-center">

            {/* Common Links */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/") ? "active fw-semibold" : ""}`} to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isActive("/jobs") ? "active fw-semibold" : ""}`} to="/jobs">
                Jobs
              </Link>
            </li>

            {/* Job Seeker */}
            {user && user.role === "jobseeker" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-applications">My Applications</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/saved-jobs">Saved Jobs</Link>
                </li>
              </>
            )}

            {/* Employer */}
            {user && user.role === "employer" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/employer/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/employer/post-job">Post Job</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/employer/my-jobs">My Jobs</Link>
                </li>
              </>
            )}

            {/* Admin */}
            {user && user.role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin Panel</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/job-approvals">Approvals</Link>
                </li>
              </>
            )}

            {/* Auth */}
            {!user ? (
              <div className="d-lg-flex gap-2 mt-3 mt-lg-0">
                <Link className="btn btn-light text-primary fw-semibold px-4 rounded-pill shadow-sm" to="/login">
                  Login
                </Link>
                <Link className="btn btn-warning fw-semibold px-4 rounded-pill shadow-sm" to="/register">
                  Register
                </Link>
              </div>
            ) : (
              <div className="d-lg-flex align-items-center gap-3 mt-3 mt-lg-0">

                {/* User Name */}
                <span className="text-white fw-semibold">
                  👋 {user.name || "User"}
                </span>

                {/* Logout */}
                <button
                  className="btn btn-danger px-4 rounded-pill shadow-sm"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}

          </ul>
        </div>
      </div>

      {/* Extra Styling */}
      <style>
        {`
          .navbar {
            backdrop-filter: blur(8px);
          }

          .nav-link {
            transition: all 0.3s ease;
          }

          .nav-link:hover {
            color: #ffd166 !important;
            transform: translateY(-1px);
          }

          .nav-link.active {
            border-bottom: 2px solid #ffd166;
          }

          .btn {
            transition: all 0.3s ease;
          }

          .btn:hover {
            transform: translateY(-2px);
          }
        `}
      </style>
    </nav>
  );
}

export default Navbar;