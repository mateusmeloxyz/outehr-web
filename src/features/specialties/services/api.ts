import api from '@/shared/services/api'
import type { PagedResult } from '@/shared/types/common'
import type { Specialty, SpecialtyFormData } from '../types'

export async function fetchSpecialties(page: number, pageSize: number): Promise<PagedResult<Specialty>> {
  const { data } = await api.get('/api/specialties', { params: { page, pageSize } })
  return data
}

export async function fetchSpecialty(id: number): Promise<Specialty> {
  const { data } = await api.get(`/api/specialties/${id}`)
  return data
}

export async function createSpecialty(form: SpecialtyFormData): Promise<Specialty> {
  const { data } = await api.post('/api/specialties', form)
  return data
}

export async function updateSpecialty(id: number, form: SpecialtyFormData): Promise<Specialty> {
  const { data } = await api.put(`/api/specialties/${id}`, form)
  return data
}

export async function deleteSpecialty(id: number): Promise<void> {
  await api.delete(`/api/specialties/${id}`)
}
