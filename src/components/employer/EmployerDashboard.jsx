import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

function EmployerDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pendingApproval: 0,
    totalApplicants: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await API.get('/employer/stats');
      setStats(statsRes.data);

      const jobsRes = await API.get('/employer/jobs');
      setRecentJobs(jobsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      <h2 className="mb-4">Employer Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white border-0 shadow-sm">
            <div className="card-body">
              <h3 className="fw-bold">{stats.totalJobs}</h3>
              <p className="mb-0">Total Jobs Posted</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white border-0 shadow-sm">
            <div className="card-body">
              <h3 className="fw-bold">{stats.activeJobs}</h3>
              <p className="mb-0">Active Jobs</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark border-0 shadow-sm">
            <div className="card-body">
              <h3 className="fw-bold">{stats.pendingApproval}</h3>
              <p className="mb-0">Pending Approval</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white border-0 shadow-sm">
            <div className="card-body">
              <h3 className="fw-bold">{stats.totalApplicants}</h3>
              <p className="mb-0">Total Applicants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Recent Job Postings</h5>
            <Link to="/employer/post-job" className="btn btn-primary btn-sm">
              Post New Job
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="alert alert-info">
              You haven't posted any jobs yet. <Link to="/employer/post-job">Post your first job</Link>
            </div>
          ) : (
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
                  {recentJobs.map(job => (
                    <tr key={job._id}>
                      <td className="fw-semibold">{job.title}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td>{job.applicants?.length || 0}</td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link 
                          to={`/employer/jobs/${job._id}/applicants`}
                          className="btn btn-sm btn-info"
                        >
                          View Applicants
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;
