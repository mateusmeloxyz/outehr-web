import api from '@/shared/services/api'
import type { PagedResult } from '@/shared/types/common'
import type { Client, ClientFormData } from '../types'

export async function fetchClients(page: number, pageSize: number): Promise<PagedResult<Client>> {
  const { data } = await api.get('/api/clients', { params: { page, pageSize } })
  return data
}

export async function fetchClient(id: number): Promise<Client> {
  const { data } = await api.get(`/api/clients/${id}`)
  return data
}

export async function createClient(form: ClientFormData): Promise<Client> {
  const { data } = await api.post('/api/clients', form)
  return data
}

export async function updateClient(id: number, form: ClientFormData): Promise<Client> {
  const { data } = await api.put(`/api/clients/${id}`, form)
  return data
}

export async function deleteClient(id: number): Promise<void> {
  await api.delete(`/api/clients/${id}`)
}
