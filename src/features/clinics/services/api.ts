import api from '@/shared/services/api'
import type { PagedResult } from '@/shared/types/common'
import type { Clinic, ClinicFormData } from '../types'

export async function fetchClinics(page: number, pageSize: number): Promise<PagedResult<Clinic>> {
  const { data } = await api.get('/api/clinics', { params: { page, pageSize } })
  return data
}

export async function fetchClinic(id: number): Promise<Clinic> {
  const { data } = await api.get(`/api/clinics/${id}`)
  return data
}

export async function createClinic(form: ClinicFormData): Promise<Clinic> {
  const { data } = await api.post('/api/clinics', form)
  return data
}

export async function updateClinic(id: number, form: ClinicFormData): Promise<Clinic> {
  const { data } = await api.put(`/api/clinics/${id}`, form)
  return data
}

export async function deleteClinic(id: number): Promise<void> {
  await api.delete(`/api/clinics/${id}`)
}
