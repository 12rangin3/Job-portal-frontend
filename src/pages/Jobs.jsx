// frontend/src/pages/Jobs.jsx (UPDATE THIS)
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Filters from "../components/ui/Filters";
import JobCard from "../components/job/JobCard";
import { getJobs } from "../api/jobApi";

function Jobs() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experienceLevel: "",
    search: searchParams.get("search") || ""
  });

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.page]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: 9
      };
      const response = await getJobs(params);
      setJobs(response.data.jobs);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      setError('Failed to load jobs. Please try again.');
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    console.log('Filter change received:', newFilters);
    // Replace filters completely instead of merging to handle reset properly
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when filters change
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-3 col-md-4">
          <div className="sticky-md-top" style={{ top: "90px", zIndex: 1 }}>
            <Filters onFilterChange={handleFilterChange} />
          </div>
        </div>

        <div className="col-lg-9 col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Available Jobs</h2>
            <span className="badge bg-primary fs-6">{pagination.total} Jobs Found</span>
          </div>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <div className="row g-4">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job._id} className="col-xl-4 col-lg-6 col-md-12">
                  <JobCard job={job} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h4 className="text-muted">No jobs found</h4>
                <p className="text-secondary">Try adjusting your filters</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <li key={i + 1} className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;