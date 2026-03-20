import api from './axios';

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) => api.put('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadCV: (formData) => api.put('/users/cv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  changePassword: (data) => api.put('/users/change-password', data),
  getPublicProfile: (id) => api.get(`/users/${id}/public`),
};

// Job API
export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyPostings: (params) => api.get('/jobs/my-postings', { params }),
  getRecommendedJobs: () => api.get('/jobs/recommended'),
};

// Application API
export const applicationAPI = {
  applyToJob: (data) => api.post('/applications', data),
  getMyApplications: (params) => api.get('/applications/my-applications', { params }),
  getJobApplications: (jobId, params) => api.get(`/applications/job/${jobId}`, { params }),
  updateApplicationStatus: (id, data) => api.put(`/applications/${id}/status`, data),
  withdrawApplication: (id) => api.delete(`/applications/${id}`),
  getApplication: (id) => api.get(`/applications/${id}`),
};

// Mentorship API
export const mentorshipAPI = {
  getMentors: (params) => api.get('/mentorship/mentors', { params }),
  requestMentorship: (data) => api.post('/mentorship/request', data),
  getMySessions: (params) => api.get('/mentorship/my-sessions', { params }),
  updateSession: (id, data) => api.put(`/mentorship/${id}`, data),
  submitFeedback: (id, data) => api.post(`/mentorship/${id}/feedback`, data),
  cancelSession: (id) => api.delete(`/mentorship/${id}`),
};

// Skill API
export const skillAPI = {
  getSkillTests: (params) => api.get('/skills/tests', { params }),
  getSkillTest: (id) => api.get(`/skills/tests/${id}`),
  submitTest: (id, data) => api.post(`/skills/tests/${id}/submit`, data),
  getMyResults: (params) => api.get('/skills/my-results', { params }),
  createSkillTest: (data) => api.post('/skills/tests', data),
  updateSkillTest: (id, data) => api.put(`/skills/tests/${id}`, data),
  deleteSkillTest: (id) => api.delete(`/skills/tests/${id}`),
};

// Review API
export const reviewAPI = {
  submitReview: (data) => api.post('/reviews', data),
  getReviewsForUser: (userId, params) => api.get(`/reviews/target/${userId}`, { params }),
  getMyReviews: (params) => api.get('/reviews/my-reviews', { params }),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

// Payment API
export const paymentAPI = {
  subscribe: (data) => api.post('/payments/subscribe', data),
  payForJobPosting: (data) => api.post('/payments/job-posting', data),
  getMyPayments: (params) => api.get('/payments/my-payments', { params }),
  getPayment: (id) => api.get(`/payments/${id}`),
};

// Admin API
export const adminAPI = {
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }),
  verifyEmployer: (id) => api.put(`/admin/employers/${id}/verify`),
  getAnalytics: () => api.get('/admin/analytics'),
  getReports: (params) => api.get('/admin/reports', { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// Course API
export const courseAPI = {
  getCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  enrollInCourse: (id) => api.post(`/courses/${id}/enroll`),
  getMyCourses: () => api.get('/courses/user/my-courses'),
  getRecommendedCourses: () => api.get('/courses/user/recommended'),
  markLessonComplete: (courseId, lessonId) => api.post(`/courses/${courseId}/lessons/${lessonId}/complete`),
  getCourseProgress: (id) => api.get(`/courses/${id}/progress`),
  rateCourse: (id, data) => api.post(`/courses/${id}/rate`, data),
};
