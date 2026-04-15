// frontend/src/pages/SavedJobs.jsx
import { useState, useEffect } from "react";
import { getSavedJobs, removeSavedJob } from "../api/userApi";
import { Link } from "react-router-dom";
import { FaBookmark, FaTrash, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const response = await getSavedJobs();
      setSavedJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch saved jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (jobId) => {
    try {
      await removeSavedJob(jobId);
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error("Failed to remove saved job:", error);
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
            <FaBookmark className="me-2 text-warning" />
            Saved Jobs
          </h2>

          {savedJobs.length > 0 ? (
            <div className="row g-4">
              {savedJobs.map((job) => (
                <div key={job._id} className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100 hover-shadow">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="fw-bold text-primary mb-0">{job.title}</h5>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveSaved(job._id)}
                          title="Remove from saved"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      
                      <p className="text-muted mb-3">{job.company}</p>
                      
                      <div className="mb-3">
                        <p className="text-muted mb-2 small">
                          <FaMapMarkerAlt className="me-2" />
                          {job.location}
                        </p>
                        <p className="text-muted mb-0 small">
                          <FaMoneyBillWave className="me-2" />
                          {job.salary}
                        </p>
                      </div>

                      <div className="d-flex gap-2 mb-3">
                        <span className="badge bg-info">{job.jobType}</span>
                        <span className="badge bg-secondary">{job.experienceLevel}</span>
                      </div>

                      <Link to={`/jobs/${job._id}`} className="btn btn-primary w-100">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card border-0 shadow-sm text-center py-5">
              <div className="card-body">
                <FaBookmark size={60} className="text-muted mb-3" />
                <h4 className="text-muted mb-3">No Saved Jobs</h4>
                <p className="text-secondary mb-4">Save jobs you're interested in to apply later.</p>
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

export default SavedJobs;
