import axios from 'axios'

// withCredentials: true — tells the browser to send the httpOnly cookie on every request.
// This is required for cross-origin requests (Vercel frontend → Render backend).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

// No request interceptor needed — the browser sends the cookie automatically.

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Don't redirect if we're already on an auth page or calling /auth/me
      const url = err.config?.url || ''
      const isAuthRoute = url.includes('/auth/me') || url.includes('/auth/login') || url.includes('/auth/register')
      if (!isAuthRoute) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

// Users
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (data) => api.put('/users/update', data),
  toggleSaveJob: (jobId) => api.post(`/users/save-job/${jobId}`),
  getSavedJobs: () => api.get('/users/saved-jobs'),
}

// Posts
export const postsAPI = {
  create: (data) => api.post('/posts', data),
  getAll: () => api.get('/posts'),
  like: (id) => api.post(`/posts/${id}/like`),
  comment: (id, data) => api.post(`/posts/${id}/comment`, data),
  getComments: (id) => api.get(`/posts/${id}/comments`),
}

// Jobs
export const jobsAPI = {
  create: (data) => api.post('/jobs', data),
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
}

// Applications
export const applicationsAPI = {
  apply: (jobId, data) => api.post(`/applications/jobs/${jobId}/apply`, data),
  getMy: () => api.get('/applications/my'),
  getForJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
}

// Invitations
export const invitationsAPI = {
  send: (data) => api.post('/invitations/send', data),
  getAll: () => api.get('/invitations'),
  respond: (id, data) => api.put(`/invitations/${id}/respond`, data),
}

// Notifications
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: () => api.put('/notifications/read'),
}

export default api
