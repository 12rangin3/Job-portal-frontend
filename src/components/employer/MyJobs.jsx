import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await API.get('/employer/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning text-dark',
      approved: 'bg-success',
      rejected: 'bg-danger',
      expired: 'bg-secondary'
    };
    return badges[status] || 'bg-secondary';
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await API.delete(`/jobs/${jobId}`);
      alert('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete job');
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
        <h2>My Job Postings</h2>
        <Link to="/employer/post-job" className="btn btn-primary">
          Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="alert alert-info">
          You haven't posted any jobs yet. <Link to="/employer/post-job">Post your first job</Link>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Status</th>
                    <th>Applicants</th>
                    <th>Posted Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job._id}>
                      <td className="fw-semibold">{job.title}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(job.status)}`}>
                          {job.status}
                        </span>
                        {job.status === 'rejected' && job.rejectionReason && (
                          <div className="text-danger small mt-1">
                            <strong>Reason:</strong> {job.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {job.applicants?.length || 0} applicants
                        </span>
                      </td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link 
                            to={`/employer/jobs/${job._id}/applicants`}
                            className="btn btn-info"
                          >
                            View Applicants
                          </Link>
                          <button 
                            className="btn btn-danger"
                            onClick={() => handleDelete(job._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyJobs;
