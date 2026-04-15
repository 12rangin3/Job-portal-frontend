import { motion } from "framer-motion";
import SearchBar from "../components/ui/SearchBar";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="hero-section position-relative overflow-hidden d-flex align-items-center justify-content-center">

      {/* Background Gradient */}
      <div className="position-absolute w-100 h-100 bg-gradient"></div>

      {/* Floating Shapes */}
      <motion.div
        className="floating-shape shape1"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="floating-shape shape2"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Main Content */}
      <motion.div
        className="text-center text-white px-3 position-relative z-1"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {/* Heading */}
        <motion.h1
          className="display-2 fw-bold mb-3"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Find Your <span className="text-warning">Dream Job</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="lead fs-4 mb-4 text-light opacity-75"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Discover thousands of opportunities tailored just for you
        </motion.p>

        {/* Search */}
        <motion.div
          className="mb-4"
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
        >
          <SearchBar />
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="mt-4 d-flex justify-content-center gap-3 flex-wrap"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/jobs"
              className="btn btn-warning btn-lg px-5 py-3 fw-semibold shadow"
            >
              Browse Jobs
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="btn btn-outline-light btn-lg px-5 py-3 fw-semibold"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;