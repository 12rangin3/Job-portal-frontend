// frontend/src/api/adminApi.js
import API from './axios';

// Get all jobs (admin view)
export const getAllJobs = () => API.get('/admin/jobs/all');

// Get pending jobs for approval
export const getPendingJobs = () => API.get('/admin/jobs/pending');

// Approve a job
export const approveJob = (jobId) => API.put(`/admin/jobs/${jobId}/approve`);

// Reject a job
export const rejectJob = (jobId, reason) => API.put(`/admin/jobs/${jobId}/reject`, { reason });

// Delete a job
export const deleteJob = (jobId) => API.delete(`/jobs/${jobId}`);

// Get dashboard stats
export const getDashboardStats = () => API.get('/admin/stats');

// Get all users
export const getAllUsers = () => API.get('/admin/users');

// Update user role
export const updateUserRole = (userId, role) => API.put(`/admin/users/${userId}/role`, { role });

// Delete user
export const deleteUser = (userId) => API.delete(`/admin/users/${userId}`);
