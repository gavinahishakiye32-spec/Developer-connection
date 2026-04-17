import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('devcon_user')
  if (stored) {
    const { token } = JSON.parse(stored)
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('devcon_user')
      window.location.href = '/login'
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
  markRead: () => api.put('/notifications/read'),
}

export default api
