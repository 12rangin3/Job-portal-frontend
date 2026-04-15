import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await API.get('/employer/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = async (jobId, applicantId) => {
    try {
      await API.put(`/employer/applications/${jobId}/${applicantId}/viewed`);
      fetchNotifications(); // Refresh list
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
      <h2 className="mb-4">🔔 New Applications</h2>
      
      {notifications.length === 0 ? (
        <div className="alert alert-success">
          ✅ No new applications. You're all caught up!
        </div>
      ) : (
        <div className="list-group">
          {notifications.map((notification) => (
            <div key={notification.id} className="list-group-item list-group-item-action border-start border-4 border-primary">
              <div className="row align-items-center">
                <div className="col-md-7">
                  <div className="d-flex align-items-center mb-2">
                    <span className="badge bg-danger me-2">NEW</span>
                    <h5 className="mb-0">{notification.applicant?.name || 'Unknown'}</h5>
                  </div>
                  <p className="mb-1 text-muted">
                    Applied for: <strong>{notification.jobTitle}</strong>
                  </p>
                  <p className="mb-1 small">
                    📧 {notification.applicant?.email || 'N/A'} | 📱 {notification.applicant?.phone || 'N/A'}
                  </p>
                  <small className="text-muted">
                    Applied: {new Date(notification.appliedAt).toLocaleString()}
                  </small>
                </div>
                <div className="col-md-5 text-end">
                  <div className="btn-group">
                    <Link 
                      to={`/employer/jobs/${notification.jobId}/applicants`}
                      className="btn btn-primary btn-sm"
                      onClick={() => markAsViewed(notification.jobId, notification.applicant?._id)}
                    >
                      👁️ View Details
                    </Link>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => markAsViewed(notification.jobId, notification.applicant?._id)}
                    >
                      ✓ Mark as Viewed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link to="/employer/my-jobs" className="btn btn-secondary">
          ← Back to My Jobs
        </Link>
      </div>
    </div>
  );
}

export default Notifications;
