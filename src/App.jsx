import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageJobs from "./components/admin/ManageJobs";
import ManageUsers from "./components/admin/ManageUsers";
import Analytics from "./components/admin/Analytics";
import JobApprovals from "./components/admin/JobApprovals";
import EmployerLayout from "./components/employer/EmployerLayout";
import EmployerDashboard from "./components/employer/EmployerDashboard";
import PostJob from "./components/employer/PostJob";
import MyJobs from "./components/employer/MyJobs";
import ViewApplicants from "./components/employer/ViewApplicants";
import Notifications from "./components/employer/Notifications";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyApplications from "./pages/MyApplications";
import SavedJobs from "./pages/SavedJobs";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="app-container d-flex flex-column min-vh-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['jobseeker', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/my-applications" element={
              <ProtectedRoute allowedRoles={['jobseeker', 'admin']}>
                <MyApplications />
              </ProtectedRoute>
            } />
            <Route path="/saved-jobs" element={
              <ProtectedRoute allowedRoles={['jobseeker', 'admin']}>
                <SavedJobs />
              </ProtectedRoute>
            } />
            
            {/* Employer Routes */}
            <Route path="/employer" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerLayout />
              </ProtectedRoute>
            }>
              <Route index element={<EmployerDashboard />} />
              <Route path="dashboard" element={<EmployerDashboard />} />
              <Route path="post-job" element={<PostJob />} />
              <Route path="my-jobs" element={<MyJobs />} />
              <Route path="jobs/:jobId/applicants" element={<ViewApplicants />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="jobs" element={<ManageJobs />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="job-approvals" element={<JobApprovals />} />
            </Route>
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;