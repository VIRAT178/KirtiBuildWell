import axios from 'axios'

import { getAuthToken } from './auth'

const DEFAULT_API_BASE_URL = 'http://localhost:4000'

export function getApiBaseUrl() {
  const rawValue = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL
  return rawValue.replace(/\/+$/, '')
}

export type ProjectApiItem = {
  _id: string
  title: string
  location: string
  price: number
  priceLabel?: string
  excerpt?: string
  description: string
  images: string[]
  amenities: string[]
  createdAt?: string
  updatedAt?: string
}

export type ProjectPayload = {
  title: string
  location: string
  price: number
  priceLabel?: string
  excerpt?: string
  description: string
  images: string[]
  amenities: string[]
}

type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
  error?: string
}

function getAuthHeaders() {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchProjects() {
  const response = await axios.get<ApiResponse<ProjectApiItem[]>>(`${getApiBaseUrl()}/api/properties`)
  return response.data.data || []
}

export async function createProject(payload: ProjectPayload) {
  const response = await axios.post<ApiResponse<ProjectApiItem>>(`${getApiBaseUrl()}/api/properties`, payload, {
    headers: getAuthHeaders()
  })
  return response.data.data
}

export async function updateProject(id: string, payload: ProjectPayload) {
  const response = await axios.put<ApiResponse<ProjectApiItem>>(`${getApiBaseUrl()}/api/properties/${id}`, payload, {
    headers: getAuthHeaders()
  })
  return response.data.data
}

export async function deleteProject(id: string) {
  await axios.delete(`${getApiBaseUrl()}/api/properties/${id}`, {
    headers: getAuthHeaders()
  })
}
