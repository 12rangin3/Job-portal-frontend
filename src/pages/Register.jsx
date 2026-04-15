// frontend/src/pages/Register.jsx (UPDATE THIS)
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../api/authApi";

function Register() {
  const [userType, setUserType] = useState('jobseeker');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyWebsite: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  if (userType === 'employer' && !formData.companyName) {
    setError("Company name is required for employer accounts");
    return;
  }

  setLoading(true);

  try {
    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: userType,
      companyName: userType === 'employer' ? formData.companyName : undefined,
      companyWebsite: userType === 'employer' ? formData.companyWebsite : undefined
    };

    const result = await register(userData);

    if (result.success) {
      // Show success message
      const successMsg = `Registration successful! Welcome as ${result.user.role === 'employer' ? 'an Employer' : 'a Job Seeker'}.`;
      alert(successMsg);
      
      // Redirect based on role
      if (result.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/jobs');
      }
    } else {
      setError(result.error || "Registration failed");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Create Account</h2>
                <p className="text-muted">Join us and find your dream job</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Role Selection Dropdown */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">I want to register as:</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaUser />
                    </span>
                    <select
                      className="form-select"
                      name="userType"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      required
                    >
                      <option value="jobseeker">👨‍💻 Student / Job Seeker</option>
                      <option value="employer">🏢 Employer / Recruiter</option>
                    </select>
                  </div>
                  <small className="text-muted">Note: Admin accounts are created by the system administrator</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your full name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaPhone />
                    </span>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Enter your phone number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Employer-specific fields */}
                {userType === 'employer' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Company Name</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your company name"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          required={userType === 'employer'}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Company Website (Optional)</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaEnvelope />
                        </span>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://yourcompany.com"
                          name="companyWebsite"
                          value={formData.companyWebsite}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Create a password (min 6 characters)"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm your password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 fw-semibold py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : null}
                  Register
                </button>

                <p className="text-center text-muted mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none fw-semibold">
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;