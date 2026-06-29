import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Specialty, SpecialtyFormData } from '../types'
import * as specialtiesApi from '../services/api'

export const useSpecialtiesStore = defineStore('specialties', () => {
  const specialties = ref<Specialty[]>([])
  const currentSpecialty = ref<Specialty | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)

  async function fetchSpecialties(page: number, pageSize: number) {
    loading.value = true
    error.value = null
    try {
      const result = await specialtiesApi.fetchSpecialties(page, pageSize)
      specialties.value = result.data
      totalCount.value = result.totalCount
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch specialties'
    } finally {
      loading.value = false
    }
  }

  async function fetchSpecialty(id: number) {
    loading.value = true
    error.value = null
    try {
      currentSpecialty.value = await specialtiesApi.fetchSpecialty(id)
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch specialty'
    } finally {
      loading.value = false
    }
  }

  async function createSpecialty(form: SpecialtyFormData) {
    loading.value = true
    error.value = null
    try {
      const created = await specialtiesApi.createSpecialty(form)
      return created
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to create specialty'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateSpecialty(id: number, form: SpecialtyFormData) {
    loading.value = true
    error.value = null
    try {
      const updated = await specialtiesApi.updateSpecialty(id, form)
      currentSpecialty.value = updated
      return updated
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to update specialty'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteSpecialty(id: number) {
    loading.value = true
    error.value = null
    try {
      await specialtiesApi.deleteSpecialty(id)
      specialties.value = specialties.value.filter(s => s.id !== id)
      totalCount.value--
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to delete specialty'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    specialties,
    currentSpecialty,
    loading,
    error,
    totalCount,
    fetchSpecialties,
    fetchSpecialty,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty
  }
})
