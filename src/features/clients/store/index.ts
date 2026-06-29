import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Client, ClientFormData } from '../types'
import * as clientsApi from '../services/api'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref<Client[]>([])
  const currentClient = ref<Client | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)

  async function fetchClients(page: number, pageSize: number) {
    loading.value = true
    error.value = null
    try {
      const result = await clientsApi.fetchClients(page, pageSize)
      clients.value = result.data
      totalCount.value = result.totalCount
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch clients'
    } finally {
      loading.value = false
    }
  }

  async function fetchClient(id: number) {
    loading.value = true
    error.value = null
    try {
      currentClient.value = await clientsApi.fetchClient(id)
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to fetch client'
    } finally {
      loading.value = false
    }
  }

  async function createClient(form: ClientFormData) {
    loading.value = true
    error.value = null
    try {
      const created = await clientsApi.createClient(form)
      return created
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to create client'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateClient(id: number, form: ClientFormData) {
    loading.value = true
    error.value = null
    try {
      const updated = await clientsApi.updateClient(id, form)
      currentClient.value = updated
      return updated
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to update client'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteClient(id: number) {
    loading.value = true
    error.value = null
    try {
      await clientsApi.deleteClient(id)
      clients.value = clients.value.filter(c => c.id !== id)
      totalCount.value--
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message || 'Failed to delete client'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    clients,
    currentClient,
    loading,
    error,
    totalCount,
    fetchClients,
    fetchClient,
    createClient,
    updateClient,
    deleteClient
  }
})
