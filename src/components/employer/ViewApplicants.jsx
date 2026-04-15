import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';

function ViewApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const response = await API.get(`/employer/jobs/${jobId}/applicants`);
      setApplicants(response.data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicantId, status) => {
    try {
      await API.put(`/employer/applications/${jobId}/${applicantId}`, {
        status,
        notes: `Application ${status} by employer`
      });
      // Mark as viewed when status is updated
      await API.put(`/employer/applications/${jobId}/${applicantId}/viewed`);
      alert(`Applicant ${status} successfully`);
      fetchApplicants();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const markAsViewed = async (applicantId) => {
    try {
      await API.put(`/employer/applications/${jobId}/${applicantId}/viewed`);
      fetchApplicants();
    } catch (error) {
      console.error('Error marking as viewed:', error);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Applicants</h2>
        <Link to="/employer/my-jobs" className="btn btn-secondary">
          Back to My Jobs
        </Link>
      </div>
      
      {applicants.length === 0 ? (
        <div className="alert alert-info">
          No applicants for this job yet.
        </div>
      ) : (
        <div className="list-group">
          {applicants.map(app => (
            <div key={app.userId?._id || app._id} className={`list-group-item list-group-item-action ${app.isNew ? 'border-start border-4 border-danger' : ''}`}>
              <div className="row align-items-center">
                <div className="col-md-5">
                  <div className="d-flex align-items-center mb-2">
                    {app.isNew && <span className="badge bg-danger me-2">NEW</span>}
                    <h5 className="mb-0">{app.userId?.name || 'Unknown'}</h5>
                  </div>
                  <p className="mb-1 text-muted">
                    <small>
                      📧 {app.userId?.email || 'N/A'}<br />
                      📱 {app.userId?.phone || 'N/A'}
                    </small>
                  </p>
                  <small className="text-muted">
                    Applied: {new Date(app.appliedAt).toLocaleString()}
                  </small>
                </div>
                <div className="col-md-3">
                  <span className={`badge ${
                    app.status === 'accepted' ? 'bg-success' :
                    app.status === 'rejected' ? 'bg-danger' :
                    app.status === 'shortlisted' ? 'bg-info' :
                    'bg-warning text-dark'
                  }`}>
                    {app.status || 'pending'}
                  </span>
                </div>
                <div className="col-md-4">
                  <div className="btn-group btn-group-sm">
                    <button 
                      className="btn btn-success"
                      onClick={() => updateStatus(app.userId?._id || app._id, 'shortlisted')}
                      disabled={app.status === 'shortlisted' || app.status === 'accepted'}
                    >
                      Shortlist
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => updateStatus(app.userId?._id || app._id, 'rejected')}
                      disabled={app.status === 'rejected'}
                    >
                      Reject
                    </button>
                    {app.isNew && (
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => markAsViewed(app.userId?._id || app._id)}
                      >
                        ✓ Viewed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewApplicants;
