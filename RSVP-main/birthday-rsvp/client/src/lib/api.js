import axios from 'axios'
import { getAuthHeader } from './auth.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8080/api'
})

api.interceptors.request.use((config) => {
  const auth = getAuthHeader()
  if (auth) config.headers.Authorization = auth
  return config
})

export default api
