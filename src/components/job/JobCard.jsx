import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaMoneyBillWave, FaBuilding } from "react-icons/fa";

function JobCard({ job }) {
  return (
    <motion.div
      className="card h-100 border-0 shadow-sm job-card"
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="card-title fw-bold mb-0 text-primary">{job.title}</h5>
          <span className="badge bg-success">{job.salary}</span>
        </div>
        
        <div className="mb-3">
          <p className="text-muted mb-2">
            <FaBuilding className="me-2" />
            {job.company}
          </p>
          <p className="text-muted mb-2">
            <FaMapMarkerAlt className="me-2" />
            {job.location}
          </p>
        </div>

        <p className="text-secondary small mb-3">
          {job.description}
        </p>

        <Link to={`/jobs/${job._id}`} className="btn btn-primary w-100 fw-semibold">
          View Details
        </Link>
      </div>
    </motion.div>
  );
}

export default JobCard;