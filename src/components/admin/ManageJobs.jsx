import { useState, useEffect } from "react";
import { getAllJobs, approveJob, rejectJob, deleteJob } from "../../api/adminApi";
import { FaCheck, FaTimes, FaTrash, FaEye, FaFilter } from "react-icons/fa";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingJob, setRejectingJob] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await getAllJobs();
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      alert("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId) => {
    if (!window.confirm('Are you sure you want to approve this job?')) return;
    
    try {
      await approveJob(jobId);
      alert('✅ Job approved successfully!');
      fetchJobs();
    } catch (error) {
      console.error("Failed to approve job:", error);
      alert(error.response?.data?.message || "Failed to approve job");
    }
  };

  const handleReject = (job) => {
    setRejectingJob(job);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      await rejectJob(rejectingJob._id, rejectReason);
      alert('❌ Job rejected');
      setShowRejectModal(false);
      setRejectingJob(null);
      setRejectReason('');
      fetchJobs();
    } catch (error) {
      console.error("Failed to reject job:", error);
      alert(error.response?.data?.message || "Failed to reject job");
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await deleteJob(jobId);
      alert('🗑️ Job deleted successfully');
      fetchJobs();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert(error.response?.data?.message || "Failed to delete job");
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="badge bg-success">✅ Approved</span>;
      case 'pending': return <span className="badge bg-warning text-dark">⏳ Pending</span>;
      case 'rejected': return <span className="badge bg-danger">❌ Rejected</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">📋 Manage Jobs</h2>
          <p className="text-muted mb-0">Review, approve, or reject job postings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-primary text-white">
            <div className="card-body text-center">
              <h3 className="mb-1">{jobs.length}</h3>
              <small>Total Jobs</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-warning text-dark">
            <div className="card-body text-center">
              <h3 className="mb-1">{jobs.filter(j => j.status === 'pending').length}</h3>
              <small>Pending Approval</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-success text-white">
            <div className="card-body text-center">
              <h3 className="mb-1">{jobs.filter(j => j.status === 'approved').length}</h3>
              <small>Approved</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-danger text-white">
            <div className="card-body text-center">
              <h3 className="mb-1">{jobs.filter(j => j.status === 'rejected').length}</h3>
              <small>Rejected</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center gap-2">
            <FaFilter className="text-primary" />
            <strong>Filter:</strong>
            <div className="btn-group" role="group">
              <button 
                className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('all')}
              >
                All ({jobs.length})
              </button>
              <button 
                className={`btn btn-sm ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({jobs.filter(j => j.status === 'pending').length})
              </button>
              <button 
                className={`btn btn-sm ${filter === 'approved' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilter('approved')}
              >
                Approved ({jobs.filter(j => j.status === 'approved').length})
              </button>
              <button 
                className={`btn btn-sm ${filter === 'rejected' ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => setFilter('rejected')}
              >
                Rejected ({jobs.filter(j => j.status === 'rejected').length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-0">No jobs found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4">Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Posted By</th>
                    <th>Applications</th>
                    <th>Status</th>
                    <th>Posted Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className={job.status === 'pending' ? 'table-warning' : ''}>
                      <td className="ps-4">
                        <div className="fw-semibold">{job.title}</div>
                        <small className="text-muted">{job.jobType}</small>
                      </td>
                      <td>{job.company}</td>
                      <td>{job.location}</td>
                      <td>
                        <small>
                          {job.postedBy?.name || 'Unknown'}<br />
                          <span className="text-muted">{job.postedBy?.companyName || ''}</span>
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-info">{job.applicants?.length || 0}</span>
                      </td>
                      <td>{getStatusBadge(job.status)}</td>
                      <td>
                        <small>{new Date(job.createdAt).toLocaleDateString()}</small>
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          {job.status === 'pending' && (
                            <>
                              <button 
                                className="btn btn-success"
                                onClick={() => handleApprove(job._id)}
                                title="Approve Job"
                              >
                                <FaCheck />
                              </button>
                              <button 
                                className="btn btn-warning"
                                onClick={() => handleReject(job)}
                                title="Reject Job"
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => setDeleteConfirm(job._id)}
                            title="Delete Job"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">❌ Reject Job</h5>
                <button type="button" className="btn-close" onClick={() => setShowRejectModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Job:</strong> {rejectingJob?.title}</p>
                <p><strong>Company:</strong> {rejectingJob?.company}</p>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Rejection Reason *</label>
                  <textarea 
                    className="form-control" 
                    rows="4"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button>
                <button className="btn btn-warning" onClick={submitReject} disabled={!rejectReason.trim()}>
                  Reject Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">🗑️ Confirm Delete</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setDeleteConfirm(null)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">Are you sure you want to delete this job? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageJobs;