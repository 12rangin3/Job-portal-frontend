// frontend/src/components/ui/Filters.jsx (UPDATE THIS)
import { useState } from "react";
import { FaFilter } from "react-icons/fa";

function Filters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experienceLevel: ""
  });
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    setHasActiveFilters(Object.values(newFilters).some(v => v !== ""));
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { location: "", jobType: "", experienceLevel: "" };
    setFilters(resetFilters);
    setHasActiveFilters(false);
    onFilterChange(resetFilters);
    console.log('Filters reset:', resetFilters);
  };

  return (
    <div className="card border-0 shadow-sm p-4">
      <h5 className="fw-bold mb-4">
        <FaFilter className="me-2 text-primary" />
        Filters
      </h5>

      <div className="mb-3">
        <label className="form-label fw-semibold small">Location</label>
        <select 
          className="form-select" 
          name="location"
          value={filters.location}
          onChange={handleChange}
        >
          <option value="">All Locations</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Pune">Pune</option>
          <option value="Chennai">Chennai</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold small">Job Type</label>
        <select 
          className="form-select"
          name="jobType"
          value={filters.jobType}
          onChange={handleChange}
        >
          <option value="">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="contract">Contract</option>
          <option value="remote">Remote</option>
          <option value="internship">Internship</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold small">Experience Level</label>
        <select 
          className="form-select"
          name="experienceLevel"
          value={filters.experienceLevel}
          onChange={handleChange}
        >
          <option value="">All Levels</option>
          <option value="entry">Entry Level (0-2 years)</option>
          <option value="mid">Mid Level (3-5 years)</option>
          <option value="senior">Senior Level (6+ years)</option>
          <option value="lead">Lead/Manager</option>
        </select>
      </div>

      <button 
        className={`btn w-100 mt-2 ${hasActiveFilters ? 'btn-primary' : 'btn-outline-secondary'}`}
        onClick={handleReset}
        disabled={!hasActiveFilters}
        title={hasActiveFilters ? 'Clear all filters' : 'No active filters to clear'}
      >
        {hasActiveFilters ? '✓ Clear All Filters' : 'No Active Filters'}
      </button>
    </div>
  );
}

export default Filters;