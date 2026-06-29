import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Clinic, ClinicFormData } from '../types'
import * as clinicsApi from '../services/api'

export const useClinicsStore = defineStore('clinics', () => {
  const clinics = ref<Clinic[]>([])
  const currentClinic = ref<Clinic | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)

  async function fetchClinics(page: number, pageSize: number) {
    loading.value = true
    error.value = null
    try {
      const result = await clinicsApi.fetchClinics(page, pageSize)
      clinics.value = result.data
      totalCount.value = result.totalCount
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch clinics'
    } finally {
      loading.value = false
    }
  }

  async function fetchClinic(id: number) {
    loading.value = true
    error.value = null
    try {
      currentClinic.value = await clinicsApi.fetchClinic(id)
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch clinic'
    } finally {
      loading.value = false
    }
  }

  async function createClinic(form: ClinicFormData) {
    loading.value = true
    error.value = null
    try {
      const created = await clinicsApi.createClinic(form)
      return created
    } catch (e: unknown) {
      const err = e as { message?: string; status?: number }
      error.value = err.message || 'Failed to create clinic'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateClinic(id: number, form: ClinicFormData) {
    loading.value = true
    error.value = null
    try {
      const updated = await clinicsApi.updateClinic(id, form)
      currentClinic.value = updated
      return updated
    } catch (e: unknown) {
      const err = e as { message?: string; status?: number }
      error.value = err.message || 'Failed to update clinic'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteClinic(id: number) {
    loading.value = true
    error.value = null
    try {
      await clinicsApi.deleteClinic(id)
      clinics.value = clinics.value.filter(c => c.id !== id)
      totalCount.value--
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to delete clinic'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    clinics,
    currentClinic,
    loading,
    error,
    totalCount,
    fetchClinics,
    fetchClinic,
    createClinic,
    updateClinic,
    deleteClinic
  }
})
