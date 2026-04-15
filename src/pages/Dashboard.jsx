// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile, getSavedJobs } from "../api/userApi";
import { Link } from "react-router-dom";
import { FaBookmark, FaBriefcase, FaUser, FaEdit } from "react-icons/fa";

function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const profileRes = await getProfile();
      setProfile(profileRes.data);
      
      const savedJobsRes = await getSavedJobs();
      setSavedJobs(savedJobsRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <FaUser size={40} color="white" />
              </div>
              <h4 className="fw-bold mb-1">{profile?.name}</h4>
              <p className="text-muted mb-3">{profile?.email}</p>
              <p className="text-muted mb-3">
                <FaBriefcase className="me-2" />
                Phone: {profile?.phone}
              </p>
              <button className="btn btn-outline-primary btn-sm">
                <FaEdit className="me-2" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-body p-4">
              <h6 className="text-muted mb-3">Your Stats</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Applied Jobs</span>
                <span className="badge bg-primary">{profile?.appliedJobs?.length || 0}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Saved Jobs</span>
                <span className="badge bg-success">{savedJobs.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-8">
          {/* Recent Applications */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Recent Applications</h5>
                <Link to="/my-applications" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>

              {profile?.appliedJobs?.length > 0 ? (
                <div className="list-group list-group-flush">
                  {profile.appliedJobs.slice(0, 3).map((application, index) => (
                    <div key={index} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{application.jobId?.title || 'Unknown Job'}</h6>
                          <small className="text-muted">
                            {application.jobId?.company || 'Unknown Company'} • 
                            Applied: {new Date(application.appliedAt).toLocaleDateString()}
                          </small>
                        </div>
                        <span className={`badge ${
                          application.status === 'accepted' ? 'bg-success' :
                          application.status === 'rejected' ? 'bg-danger' :
                          'bg-warning text-dark'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">You haven't applied to any jobs yet</p>
                  <Link to="/jobs" className="btn btn-primary">
                    Browse Jobs
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Saved Jobs */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">
                  <FaBookmark className="me-2 text-warning" />
                  Saved Jobs
                </h5>
                <Link to="/saved-jobs" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>

              {savedJobs.length > 0 ? (
                <div className="row g-3">
                  {savedJobs.slice(0, 3).map((job) => (
                    <div key={job._id} className="col-md-6">
                      <Link to={`/jobs/${job._id}`} className="text-decoration-none">
                        <div className="card border h-100 hover-shadow">
                          <div className="card-body p-3">
                            <h6 className="fw-bold text-primary mb-1">{job.title}</h6>
                            <p className="text-muted mb-2 small">{job.company}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">{job.location}</small>
                              <span className="badge bg-success small">{job.salary}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">No saved jobs yet</p>
                  <Link to="/jobs" className="btn btn-outline-primary">
                    Find Jobs to Save
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
