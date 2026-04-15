// frontend/src/pages/MyApplications.jsx
import { useState, useEffect } from "react";
import { getProfile } from "../api/userApi";
import { Link } from "react-router-dom";
import { FaBriefcase, FaCalendarAlt, FaBuilding } from "react-icons/fa";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await getProfile();
      setApplications(response.data.appliedJobs || []);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
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
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <h2 className="fw-bold mb-4">
            <FaBriefcase className="me-2 text-primary" />
            My Applications
          </h2>

          {applications.length > 0 ? (
            <div className="list-group">
              {applications.map((application, index) => (
                <div key={index} className="list-group-item mb-3 border-0 shadow-sm">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h5 className="fw-bold mb-2">
                        <Link to={`/jobs/${application.jobId?._id}`} className="text-decoration-none text-primary">
                          {application.jobId?.title || 'Unknown Position'}
                        </Link>
                      </h5>
                      <p className="text-muted mb-2">
                        <FaBuilding className="me-2" />
                        {application.jobId?.company || 'Unknown Company'}
                      </p>
                      <p className="text-muted mb-0 small">
                        <FaCalendarAlt className="me-2" />
                        Applied on: {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                      <span className={`badge fs-6 px-3 py-2 ${
                        application.status === 'accepted' ? 'bg-success' :
                        application.status === 'rejected' ? 'bg-danger' :
                        application.status === 'reviewed' ? 'bg-info' :
                        'bg-warning text-dark'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card border-0 shadow-sm text-center py-5">
              <div className="card-body">
                <FaBriefcase size={60} className="text-muted mb-3" />
                <h4 className="text-muted mb-3">No Applications Yet</h4>
                <p className="text-secondary mb-4">Start applying to jobs to track your applications here.</p>
                <Link to="/jobs" className="btn btn-primary btn-lg">
                  Browse Available Jobs
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyApplications;
