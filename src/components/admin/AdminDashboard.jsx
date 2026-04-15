// frontend/src/components/admin/AdminDashboard.jsx (CREATE/UPDATE THIS)
import { useState, useEffect } from "react";
import { getJobs } from "../../api/jobApi";
import { getAllUsers } from "../../api/userApi";
import { FaBriefcase, FaUsers, FaChartLine, FaBuilding } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalUsers: 0,
    totalApplications: 0,
    activeJobs: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [jobsResponse, usersResponse] = await Promise.all([
        getJobs({ limit: 100 }),
        getAllUsers()
      ]);

      const jobsData = jobsResponse.data;
      const usersData = usersResponse.data;

      setStats({
        totalJobs: jobsData.total,
        totalUsers: usersData.length,
        totalApplications: jobsData.jobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0),
        activeJobs: jobsData.jobs.filter(job => job.isActive).length
      });

      setRecentJobs(jobsData.jobs.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Total Jobs", value: stats.totalJobs, icon: <FaBriefcase />, color: "primary", bg: "bg-primary bg-opacity-10" },
    { title: "Total Users", value: stats.totalUsers, icon: <FaUsers />, color: "success", bg: "bg-success bg-opacity-10" },
    { title: "Applications", value: stats.totalApplications, icon: <FaChartLine />, color: "warning", bg: "bg-warning bg-opacity-10" },
    { title: "Active Jobs", value: stats.activeJobs, icon: <FaBuilding />, color: "info", bg: "bg-info bg-opacity-10" }
  ];

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
        <h2 className="fw-bold">Dashboard</h2>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4 mb-5">
        {statCards.map((stat, index) => (
          <div key={index} className="col-md-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className={`${stat.bg} p-3 rounded-circle`} style={{ fontSize: "1.5rem" }}>
                    {stat.icon}
                  </div>
                  <h3 className={`text-${stat.color} fw-bold mb-0`}>{stat.value}</h3>
                </div>
                <h6 className="text-muted mb-0">{stat.title}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Jobs */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0 pt-4 pb-0">
          <h5 className="fw-bold mb-0">Recent Jobs</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Posted Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job._id}>
                    <td className="fw-semibold">{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>{job.salary}</td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge bg-${job.isActive ? 'success' : 'danger'}`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;