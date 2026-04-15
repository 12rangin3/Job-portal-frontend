import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

function PostJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    requirements: '',
    jobType: 'full-time',
    experienceLevel: 'mid',
    category: 'Technology',
    deadline: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await API.post('/jobs', {
        ...formData,
        requirements: formData.requirements.split('\n').filter(r => r.trim())
      });
      
      alert('Job submitted for admin approval!');
      navigate('/employer/my-jobs');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Post New Job</h2>
      
      <div className="alert alert-info">
        <strong>Note:</strong> Your job will be reviewed by admin before going live. This usually takes 24-48 hours.
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label fw-semibold">Job Title *</label>
              <input 
                type="text" 
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer"
                required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Company Name *</label>
              <input 
                type="text" 
                className="form-control"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g., Google, Microsoft, or Your Company Name"
                required 
              />
              <small className="text-muted">
                <i className="bi bi-info-circle"></i> Enter the company name for this job posting
              </small>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Location *</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., New York, NY or Remote"
                  required 
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Salary Range *</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g., $80,000 - $100,000"
                  required 
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Job Description *</label>
              <textarea 
                className="form-control" 
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Requirements (one per line) *</label>
              <textarea 
                className="form-control" 
                rows="4"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="3+ years experience in React&#10;Bachelor's degree in Computer Science&#10;Strong problem-solving skills&#10;Excellent communication"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Job Type</label>
                <select 
                  className="form-select"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Experience Level</label>
                <select 
                  className="form-select"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead/Manager</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select 
                  className="form-select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Technology">Technology</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">Human Resources</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Application Deadline</label>
              <input 
                type="date" 
                className="form-control"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>

            <div className="d-flex gap-2">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/employer/my-jobs')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PostJob;
