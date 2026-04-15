import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { FaDownload, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({
    jobTrends: [],
    topCompanies: [],
    categoryDistribution: [],
    applicationStats: []
  });

  useEffect(() => {
    // Generate analytics data
    const generateData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const jobTrends = months.map(month => ({
        month,
        jobs: Math.floor(Math.random() * 80) + 30,
        applications: Math.floor(Math.random() * 800) + 300,
        views: Math.floor(Math.random() * 5000) + 2000
      }));

      const topCompanies = [
        { name: 'Google', jobs: 24, applications: 1245, growth: 15 },
        { name: 'Microsoft', jobs: 18, applications: 987, growth: 12 },
        { name: 'Amazon', jobs: 22, applications: 1123, growth: 18 },
        { name: 'TCS', jobs: 15, applications: 876, growth: 8 },
        { name: 'Infosys', jobs: 12, applications: 654, growth: 10 }
      ];

      const categoryDistribution = [
        { name: 'Technology', value: 45, color: '#667eea' },
        { name: 'Finance', value: 20, color: '#764ba2' },
        { name: 'Healthcare', value: 15, color: '#10b981' },
        { name: 'Marketing', value: 12, color: '#f59e0b' },
        { name: 'Others', value: 8, color: '#ef4444' }
      ];

      const applicationStats = [
        { status: 'Pending', count: 234, color: '#fbbf24' },
        { status: 'Reviewed', count: 456, color: '#3b82f6' },
        { status: 'Interviewed', count: 189, color: '#8b5cf6' },
        { status: 'Hired', count: 78, color: '#10b981' },
        { status: 'Rejected', count: 123, color: '#ef4444' }
      ];

      setAnalyticsData({ jobTrends, topCompanies, categoryDistribution, applicationStats });
    };

    generateData();
  }, [dateRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          background: 'var(--card-bg)',
          padding: '12px',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <p className="fw-bold mb-1">{label}</p>
          {payload.map((p, index) => (
            <p key={index} className="mb-0" style={{ color: p.color }}>
              {p.name}: {p.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h4 className="fw-bold mb-0">Analytics Dashboard</h4>
        <div className="d-flex gap-2">
          <select 
            className="form-select form-select-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last Year</option>
          </select>
          <button className="btn btn-outline-primary btn-sm">
            <FaDownload className="me-1" /> Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="row g-4 mb-4">
        {[
          { label: 'Total Jobs Posted', value: '342', change: '+12%', icon: <FaChartLine /> },
          { label: 'Total Applications', value: '3,245', change: '+23%', icon: <FaChartLine /> },
          { label: 'Active Users', value: '1,234', change: '+8%', icon: <FaChartLine /> },
          { label: 'Hiring Rate', value: '15.2%', change: '+2.1%', icon: <FaChartLine /> }
        ].map((metric, index) => (
          <div key={index} className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="text-muted">{metric.label}</div>
                  <div className="text-success small">{metric.change}</div>
                </div>
                <h3 className="fw-bold mb-0">{metric.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">Jobs & Applications Trend</h5>
            </div>
            <div className="card-body p-4">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analyticsData.jobTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="jobs" stackId="1" stroke="#667eea" fill="#667eea" fillOpacity={0.3} name="Jobs Posted" />
                  <Area type="monotone" dataKey="applications" stackId="2" stroke="#764ba2" fill="#764ba2" fillOpacity={0.3} name="Applications" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">Job Categories</h5>
            </div>
            <div className="card-body p-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3">
                {analyticsData.categoryDistribution.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <div style={{ width: '12px', height: '12px', background: item.color, borderRadius: '2px', marginRight: '8px' }}></div>
                      <span>{item.name}</span>
                    </div>
                    <span className="fw-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">Top Companies</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {analyticsData.topCompanies.map((company, index) => (
                  <div key={index} className="list-group-item d-flex justify-content-between align-items-center" style={{ background: 'transparent' }}>
                    <div>
                      <h6 className="fw-bold mb-1">{company.name}</h6>
                      <small className="text-muted">{company.jobs} jobs posted</small>
                    </div>
                    <div className="text-end">
                      <div className="fw-semibold">{company.applications} apps</div>
                      <small className="text-success">+{company.growth}% growth</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">Application Funnel</h5>
            </div>
            <div className="card-body p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.applicationStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis type="number" stroke="var(--text-secondary)" />
                  <YAxis dataKey="status" type="category" stroke="var(--text-secondary)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#667eea" radius={[0, 4, 4, 0]}>
                    {analyticsData.applicationStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;