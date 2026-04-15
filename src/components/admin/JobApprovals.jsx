import { useState, useEffect } from 'react';
import API from '../../api/axios';

function JobApprovals() {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [rejectionModal, setRejectionModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      const response = await API.get('/admin/jobs/pending');
      setPendingJobs(response.data);
    } catch (error) {
      console.error('Error fetching pending jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to approve this job?')) return;
    
    try {
      await API.put(`/admin/jobs/${jobId}/approve`);
      alert('Job approved successfully!');
      fetchPendingJobs();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve job');
    }
  };

  const rejectJob = async (jobId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    try {
      await API.put(`/admin/jobs/${jobId}/reject`, {
        reason: rejectionReason
      });
      alert('Job rejected');
      setRejectionModal(null);
      setRejectionReason('');
      fetchPendingJobs();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject job');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Job Approval Queue</h2>
      
      {pendingJobs.length === 0 ? (
        <div className="alert alert-success">
          ✅ No pending jobs for approval! All caught up.
        </div>
      ) : (
        <>
          <div className="alert alert-info">
            <strong>{pendingJobs.length}</strong> job{pendingJobs.length > 1 ? 's' : ''} waiting for approval
          </div>
          
          <div className="row g-4">
            {pendingJobs.map(job => (
              <div key={job._id} className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{job.title}</h5>
                    <p className="text-muted mb-2">{job.company}</p>
                    
                    <div className="mb-3">
                      <small className="text-muted">
                        <strong>Posted by:</strong> {job.postedBy?.name || 'Unknown'}<br />
                        <strong>Email:</strong> {job.postedBy?.email || 'N/A'}<br />
                        {job.postedBy?.companyName && (
                          <>
                            <strong>Company:</strong> {job.postedBy.companyName}<br />
                          </>
                        )}
                      </small>
                    </div>

                    <div className="mb-3">
                      <small>
                        <strong>Location:</strong> {job.location}<br />
                        <strong>Salary:</strong> {job.salary}<br />
                        <strong>Type:</strong> {job.jobType}<br />
                        <strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}
                      </small>
                    </div>

                    <div className="mb-3">
                      <strong>Description:</strong>
                      <p className="text-muted small mt-1">
                        {job.description.substring(0, 150)}...
                      </p>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-success flex-fill"
                        onClick={() => approveJob(job._id)}
                      >
                        ✅ Approve
                      </button>
                      <button 
                        className="btn btn-danger flex-fill"
                        onClick={() => setRejectionModal(job)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Rejection Modal */}
      {rejectionModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Job: {rejectionModal.title}</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setRejectionModal(null);
                    setRejectionReason('');
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Please provide a reason for rejecting this job posting:</p>
                <textarea
                  className="form-control"
                  placeholder="e.g., Incomplete information, inappropriate content, duplicate posting..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="4"
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setRejectionModal(null);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => rejectJob(rejectionModal._id)}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobApprovals;
