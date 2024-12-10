import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
})

export const uploadLeads = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/leads/upload', formData)
  return response.data
}

export const createUser = async (userData: any) => {
  const response = await api.post('/users', userData)
  return response.data
}

export const getUser = async (id: string) => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

export const updateUser = async (id: string, userData: any) => {
  const response = await api.put(`/users/${id}`, userData)
  return response.data
}

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`)
  return response.data
}

export default api
