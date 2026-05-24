import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

const unwrap = (response) => response.data

export const apiClient = {
  register: (payload) => http.post('/api/auth/register', payload).then(unwrap),
  login: (payload) => http.post('/api/auth/login', payload).then(unwrap),
  getPosts: () => http.get('/api/posts').then(unwrap),
  presignPut: (payload) => http.post('/api/uploads/presign', payload).then(unwrap),
  presignGet: (payload) =>
    http.post('/api/uploads/presign-get', payload).then(unwrap),
  createPost: (payload) => http.post('/api/posts', payload).then(unwrap),
}

export { API_BASE_URL }
