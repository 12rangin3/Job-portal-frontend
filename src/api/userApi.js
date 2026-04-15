// frontend/src/api/userApi.js
import API from './axios';

export const getProfile = () => API.get('/users/profile');
export const updateProfile = (data) => API.put('/users/profile', data);
export const saveJob = (jobId) => API.post('/users/save-job', { jobId });
export const getSavedJobs = () => API.get('/users/saved-jobs');
export const removeSavedJob = (jobId) => API.delete(`/users/saved-jobs/${jobId}`);
export const getAllUsers = () => API.get('/users/all');
export const updateUserRole = (userId, role) => API.put('/users/role', { userId, role });
export const deleteUser = (userId) => API.delete(`/users/${userId}`);
