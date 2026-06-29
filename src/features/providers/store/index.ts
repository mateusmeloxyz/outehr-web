import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Provider, ProviderFormData } from '../types'
import * as providersApi from '../services/api'

export const useProvidersStore = defineStore('providers', () => {
  const providers = ref<Provider[]>([])
  const currentProvider = ref<Provider | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)

  async function fetchProviders(page: number, pageSize: number) {
    loading.value = true
    error.value = null
    try {
      const result = await providersApi.fetchProviders(page, pageSize)
      providers.value = result.data
      totalCount.value = result.totalCount
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch providers'
    } finally {
      loading.value = false
    }
  }

  async function fetchProvider(id: number) {
    loading.value = true
    error.value = null
    try {
      currentProvider.value = await providersApi.fetchProvider(id)
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch provider'
    } finally {
      loading.value = false
    }
  }

  async function createProvider(form: ProviderFormData) {
    loading.value = true
    error.value = null
    try {
      const created = await providersApi.createProvider(form)
      return created
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to create provider'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateProvider(id: number, form: ProviderFormData) {
    loading.value = true
    error.value = null
    try {
      const updated = await providersApi.updateProvider(id, form)
      currentProvider.value = updated
      return updated
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to update provider'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteProvider(id: number) {
    loading.value = true
    error.value = null
    try {
      await providersApi.deleteProvider(id)
      providers.value = providers.value.filter(p => p.id !== id)
      totalCount.value--
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to delete provider'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    providers,
    currentProvider,
    loading,
    error,
    totalCount,
    fetchProviders,
    fetchProvider,
    createProvider,
    updateProvider,
    deleteProvider
  }
})
