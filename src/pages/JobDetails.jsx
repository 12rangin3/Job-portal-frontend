// frontend/src/pages/JobDetails.jsx (UPDATE THIS)
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaMoneyBillWave, FaBuilding, FaArrowLeft, FaSave, FaCheckCircle } from "react-icons/fa";
import { getJob, applyForJob } from "../api/jobApi";
import { saveJob } from "../api/userApi";
import { useAuth } from "../context/AuthContext";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await getJob(id);
      setJob(response.data);
    } catch (error) {
      console.error("Failed to fetch job:", error);
      setMessage({ type: "error", text: "Failed to load job details" });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Prevent employers from applying
    if (user.role === 'employer') {
      setMessage({ type: "error", text: "Employers cannot apply for jobs. Only job seekers can apply." });
      return;
    }

    setApplying(true);
    try {
      await applyForJob(id);
      setMessage({ type: "success", text: "Application submitted successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to apply" });
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Optionally restrict saving jobs for employers (uncomment if needed)
    // if (user.role === 'employer') {
    //   setMessage({ type: "error", text: "Employers cannot save jobs." });
    //   return;
    // }

    setSaving(true);
    try {
      await saveJob(id);
      setMessage({ type: "success", text: "Job saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save job" });
    } finally {
      setSaving(false);
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

  if (!job) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-muted">Job not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/jobs')}>
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <button 
            className="btn btn-outline-secondary mb-4" 
            onClick={() => navigate('/jobs')}
          >
            <FaArrowLeft className="me-2" />
            Back to Jobs
          </button>

          {message && (
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
            </div>
          )}

          <div className="card border-0 shadow-lg">
            <div className="card-body p-5">
              <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="fw-bold text-primary mb-2">{job.title}</h2>
                  <h4 className="text-muted mb-3">
                    <FaBuilding className="me-2" />
                    {job.company}
                  </h4>
                </div>
                <div className="d-flex gap-2">
                  <span className="badge bg-success fs-6 px-3 py-2">{job.salary}</span>
                  <span className="badge bg-info fs-6 px-3 py-2">{job.jobType}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-muted mb-2 fs-5">
                  <FaMapMarkerAlt className="me-2 text-primary" />
                  {job.location}
                </p>
              </div>

              <hr className="my-4" />

              <div className="mb-4">
                <h5 className="fw-bold mb-3">Job Description</h5>
                <p className="text-secondary lh-lg">{job.description}</p>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Requirements</h5>
                  <ul className="text-secondary">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="d-flex gap-3 justify-content-end mt-5">
                <button 
                  className="btn btn-outline-primary px-4"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <FaSave className="me-2" />
                  {saving ? "Saving..." : "Save for Later"}
                </button>
                {user && user.role === 'employer' ? (
                  <span className="text-muted align-self-center">
                    <FaCheckCircle className="me-2" />
                    Employers cannot apply for jobs
                  </span>
                ) : (
                  <button 
                    className="btn btn-primary px-5 fw-semibold"
                    onClick={handleApply}
                    disabled={applying}
                  >
                    {applying ? "Applying..." : "Apply Now"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;