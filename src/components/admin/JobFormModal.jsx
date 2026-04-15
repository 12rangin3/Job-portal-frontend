// frontend/src/components/admin/JobFormModal.jsx (CREATE/UPDATE THIS)
import { useState, useEffect } from "react";
import { createJob, updateJob } from "../../api/jobApi";

function JobFormModal({ show, onClose, onSave, job }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    jobType: "full-time",
    experienceLevel: "mid",
    requirements: [],
    deadline: ""
  });
  const [requirementsInput, setRequirementsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        salary: job.salary || "",
        description: job.description || "",
        jobType: job.jobType || "full-time",
        experienceLevel: job.experienceLevel || "mid",
        requirements: job.requirements || [],
        deadline: job.deadline ? job.deadline.split('T')[0] : ""
      });
    } else {
      resetForm();
    }
  }, [job]);

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      salary: "",
      description: "",
      jobType: "full-time",
      experienceLevel: "mid",
      requirements: [],
      deadline: ""
    });
    setRequirementsInput("");
    setError("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addRequirement = () => {
    if (requirementsInput.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, requirementsInput.trim()]
      });
      setRequirementsInput("");
    }
  };

  const removeRequirement = (index) => {
    const newRequirements = [...formData.requirements];
    newRequirements.splice(index, 1);
    setFormData({
      ...formData,
      requirements: newRequirements
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (job) {
        await updateJob(job._id, formData);
      } else {
        await createJob(formData);
      }
      onSave();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">{job ? "Edit Job" : "Add New Job"}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Job Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Company *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Location *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Salary *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g., ₹12 LPA"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Job Type</label>
                  <select
                    className="form-select"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Experience Level</label>
                  <select
                    className="form-select"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                  >
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (3-5 years)</option>
                    <option value="senior">Senior Level (6+ years)</option>
                    <option value="lead">Lead/Manager</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Description *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Requirements</label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={requirementsInput}
                      onChange={(e) => setRequirementsInput(e.target.value)}
                      placeholder="Add a requirement"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                    />
                    <button type="button" className="btn btn-primary" onClick={addRequirement}>
                      Add
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.requirements.map((req, index) => (
                      <span key={index} className="badge bg-light text-dark p-2">
                        {req}
                        <button
                          type="button"
                          className="btn-close btn-close-sm ms-2"
                          onClick={() => removeRequirement(index)}
                          style={{ fontSize: "0.5rem" }}
                        ></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Application Deadline</label>
                  <input
                    type="date"
                    className="form-control"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : (job ? "Update Job" : "Create Job")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JobFormModal;