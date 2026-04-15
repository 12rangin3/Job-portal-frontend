import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Browse Jobs", path: "/jobs" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Saved Jobs", path: "/saved-jobs" },
    { label: "Job Alerts", path: "/alerts" },
    { label: "Career Advice", path: "/blog" },
  ];

  const employerLinks = [
    { label: "Admin Panel", path: "/admin" },
    { label: "Post a Job", path: "/post-job" },
    { label: "Pricing Plans", path: "/pricing" },
    { label: "Employer Dashboard", path: "/employer/dashboard" },
    { label: "Hiring Resources", path: "/resources" },
  ];

  const supportLinks = [
    { label: "Help Center", path: "/help" },
    { label: "Contact Support", path: "/contact" },
    { label: "FAQs", path: "/faqs" },
    { label: "Report Issue", path: "/report" },
  ];

  return (
    <footer className="footer-section pt-5 pb-4 mt-auto">
      <button
        onClick={scrollToTop}
        className={`footer-scroll-top rounded-circle shadow-lg d-flex align-items-center justify-content-center ${
          showScrollTop ? "d-flex" : "d-none"
        }`}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>

      <div className="container">
        <div className="row gy-4 gy-lg-5">
          <div className="col-lg-4 col-md-6 footer-column">
            <div className="pe-lg-4">
              <Link to="/" className="text-decoration-none footer-logo">
                <h3 className="fw-bold mb-3 footer-title">
                  <span>Job</span>Portal
                </h3>
              </Link>
              <p className="footer-description mb-4">
                Empowering careers by connecting talented professionals with leading companies worldwide.
              </p>

              <div className="d-flex gap-3 mb-4 flex-wrap">
                {[
                  { icon: FaGithub, href: "https://github.com", label: "GitHub" },
                  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
                  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link d-flex align-items-center justify-content-center"
                    aria-label={social.label}
                  >
                    <social.icon className="fs-5" />
                  </a>
                ))}
              </div>

              <div className="footer-newsletter">
                <p className="small mb-2 text-muted">Subscribe to job alerts</p>
                <div className="input-group input-group-sm flex-column flex-sm-row gap-2">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your email"
                    aria-label="Email for job alerts"
                  />
                  <button className="btn btn-primary" type="button">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 footer-column">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="list-unstyled footer-link-list">
              {quickLinks.map((link, idx) => (
                <li key={idx} className="mb-2">
                  <Link to={link.path} className="footer-link transition-hover">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 footer-column">
            <h5 className="footer-heading">For Employers</h5>
            <ul className="list-unstyled footer-link-list">
              {employerLinks.map((link, idx) => (
                <li key={idx} className="mb-2">
                  <Link to={link.path} className="footer-link transition-hover">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-4 col-md-6 footer-column">
            <h5 className="footer-heading">Contact & Support</h5>
            <ul className="list-unstyled mb-4 footer-contact-list">
              <li className="mb-3 d-flex align-items-start">
                <FaMapMarkerAlt className="me-3 mt-1 text-primary flex-shrink-0" />
                <span>123 Job Street, Career City, JC 12345</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhone className="me-3 text-primary flex-shrink-0" />
                <a href="tel:+15551234567" className="footer-link transition-hover">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaEnvelope className="me-3 text-primary flex-shrink-0" />
                <a href="mailto:support@jobportal.com" className="footer-link transition-hover">
                  support@jobportal.com
                </a>
              </li>
            </ul>
            <div className="d-flex flex-wrap gap-2 footer-badge-group">
              {supportLinks.map((link, idx) => (
                <Link key={idx} to={link.path} className="badge footer-badge transition-hover">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="footer-bottom row align-items-center gy-3">
          <div className="col-md-6">
            <p className="mb-0 small text-muted">
              &copy; {currentYear} JobPortal. All rights reserved.
            </p>
          </div>
          <div className="col-md-6">
            <ul className="list-inline mb-0 d-flex flex-wrap justify-content-md-end gap-3 footer-policy-list">
              <li className="list-inline-item">
                <Link to="/privacy" className="footer-link small transition-hover">
                  Privacy Policy
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/terms" className="footer-link small transition-hover">
                  Terms of Service
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/cookies" className="footer-link small transition-hover">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="d-flex flex-wrap justify-content-center gap-3 footer-trust">
              <span className="small">🔒 Secure Platform</span>
              <span className="small">✓ Verified Employers</span>
              <span className="small">🌍 Global Reach</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
