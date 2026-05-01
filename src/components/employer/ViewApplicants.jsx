import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';

function ViewApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  const viewProfile = (applicant) => {
    setSelectedApplicant(applicant.userId);
    setShowProfileModal(true);
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
                  <div className="btn-group btn-group-sm d-flex flex-wrap gap-1">
                    <button 
                      className="btn btn-info"
                      onClick={() => viewProfile(app)}
                    >
                      View Profile
                    </button>
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

      {/* Profile Modal */}
      {showProfileModal && selectedApplicant && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Applicant Profile</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowProfileModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                      <span className="text-white fw-bold fs-4">
                        {selectedApplicant.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <h4>{selectedApplicant.name}</h4>
                    <p className="text-muted">{selectedApplicant.email}</p>
                    <p className="text-muted">📱 {selectedApplicant.phone}</p>
                  </div>
                  <div className="col-md-8">
                    {selectedApplicant.bio && (
                      <div className="mb-3">
                        <h6>Bio</h6>
                        <p>{selectedApplicant.bio}</p>
                      </div>
                    )}

                    {selectedApplicant.skills && selectedApplicant.skills.length > 0 && (
                      <div className="mb-3">
                        <h6>Skills</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedApplicant.skills.map((skill, index) => (
                            <span key={index} className="badge bg-secondary">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedApplicant.experience && selectedApplicant.experience.length > 0 && (
                      <div className="mb-3">
                        <h6>Experience</h6>
                        {selectedApplicant.experience.map((exp, index) => (
                          <div key={index} className="mb-2">
                            <strong>{exp.title}</strong> at {exp.company}
                            {exp.duration && <span className="text-muted"> ({exp.duration})</span>}
                            {exp.description && <p className="mb-0 small">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedApplicant.education && selectedApplicant.education.length > 0 && (
                      <div className="mb-3">
                        <h6>Education</h6>
                        {selectedApplicant.education.map((edu, index) => (
                          <div key={index} className="mb-2">
                            <strong>{edu.degree}</strong> from {edu.institution}
                            {edu.year && <span className="text-muted"> ({edu.year})</span>}
                            {edu.grade && <p className="mb-0 small">Grade: {edu.grade}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mb-3">
                      <h6>Links</h6>
                      <div className="d-flex flex-column gap-1">
                        {selectedApplicant.portfolio && (
                          <a href={selectedApplicant.portfolio} target="_blank" rel="noopener noreferrer">
                            Portfolio
                          </a>
                        )}
                        {selectedApplicant.linkedin && (
                          <a href={selectedApplicant.linkedin} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                          </a>
                        )}
                        {selectedApplicant.github && (
                          <a href={selectedApplicant.github} target="_blank" rel="noopener noreferrer">
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>

                    {selectedApplicant.resume && (
                      <div className="mb-3">
                        <h6>Resume</h6>
                        <a 
                          href={`http://localhost:5000/${selectedApplicant.resume}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Download Resume
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowProfileModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewApplicants;
