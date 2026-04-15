// frontend/src/pages/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "jobseeker"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log('🔐 Frontend: Attempting login with:', formData.email);
      const result = await login({ email: formData.email, password: formData.password });
      
      console.log('📧 Frontend: Login result:', result);

      if (result.success) {
        console.log('✅ Frontend: Login successful, redirecting...');
        // Redirect based on role
        if (result.user?.role === "admin") {
          console.log('→ Redirecting to /admin');
          navigate("/admin");
        } else if (result.user?.role === "employer") {
          console.log('→ Redirecting to /employer/dashboard');
          navigate("/employer/dashboard");
        } else {
          console.log('→ Redirecting to /jobs');
          navigate("/jobs"); // jobseeker
        }
      } else {
        console.error('❌ Frontend: Login failed:', result.error);
        setError(result.error || "Login failed");
      }
    } catch (err) {
      console.error('❌ Frontend: Exception during login:', err.message);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-5">

              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Welcome Back</h2>
                <p className="text-muted">Login to your account</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                
                {/* Role Selection Dropdown */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Login As</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaUser />
                    </span>
                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="jobseeker">👨‍💻 Student / Job Seeker</option>
                      <option value="employer">🏢 Employer / Recruiter</option>
                      <option value="admin">👨‍💼 Admin</option>
                    </select>
                  </div>
                </div>
                
                {/* Email */}
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

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-semibold py-2 mb-3"
                  disabled={loading}
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  )}
                  {loading ? "Logging in..." : "Login"}
                </button>

                {/* Register Link */}
                <p className="text-center text-muted mb-0">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-decoration-none fw-semibold"
                  >
                    Register here
                  </Link>
                </p>
              </form>

              <hr className="my-4" />

              {/* Demo Info */}
              {/* <div className="text-center">
                <small className="text-muted">
                  <strong>Demo Credentials:</strong><br />
                  👨‍💼 Admin: admin@test.com / admin123<br />
                  🏢 Employer: employer@test.com / password123<br />
                  👨‍💻 Job Seeker: john@test.com / password123
                </small>
              </div> */}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;