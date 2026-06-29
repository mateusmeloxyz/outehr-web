import api from '@/shared/services/api'
import type { PagedResult } from '@/shared/types/common'
import type { Provider, ProviderFormData } from '../types'

export async function fetchProviders(page: number, pageSize: number): Promise<PagedResult<Provider>> {
  const { data } = await api.get('/api/providers', { params: { page, pageSize } })
  return data
}

export async function fetchProvider(id: number): Promise<Provider> {
  const { data } = await api.get(`/api/providers/${id}`)
  return data
}

export async function createProvider(form: ProviderFormData): Promise<Provider> {
  const { data } = await api.post('/api/providers', form)
  return data
}

export async function updateProvider(id: number, form: ProviderFormData): Promise<Provider> {
  const { data } = await api.put(`/api/providers/${id}`, form)
  return data
}

export async function deleteProvider(id: number): Promise<void> {
  await api.delete(`/api/providers/${id}`)
}
