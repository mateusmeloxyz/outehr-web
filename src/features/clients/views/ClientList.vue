<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useClientsStore } from '../store'
import { usePagination } from '@/shared/composables/usePagination'
import BasePageHeader from '@/shared/components/BasePageHeader.vue'
import BaseTable from '@/shared/components/BaseTable.vue'
import BasePagination from '@/shared/components/BasePagination.vue'
import BaseConfirmDialog from '@/shared/components/BaseConfirmDialog.vue'
import type { Client } from '../types'

const store = useClientsStore()
const router = useRouter()
const pagination = usePagination()

const deleteTarget = ref<Client | null>(null)
const deleting = ref(false)

const columns = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'dateOfBirth', label: 'Date of Birth' }
]

async function load() {
  await store.fetchClients(pagination.page.value, pagination.pageSize.value)
  pagination.totalCount.value = store.totalCount
}

function goToPage(p: number) {
  pagination.goTo(p)
  load()
}

function createNew() {
  router.push({ name: 'client-create' })
}

function editClient(c: Client) {
  router.push({ name: 'client-edit', params: { id: c.id } })
}

function confirmDelete(c: Client) {
  deleteTarget.value = c
}

async function executeDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await store.deleteClient(deleteTarget.value.id)
    deleteTarget.value = null
    await load()
  } finally {
    deleting.value = false
  }
}

onMounted(() => load())
</script>

<template>
  <BasePageHeader title="Clients" subtitle="Manage patients" @create="createNew" />

  <BaseTable :columns="columns" :rows="store.clients" :loading="store.loading" @edit="editClient" @delete="confirmDelete" />

  <BasePagination
    :page="pagination.page.value"
    :total-pages="pagination.totalPages.value"
    :total-count="pagination.totalCount.value"
    @go-to="goToPage"
  />

  <BaseConfirmDialog
    :visible="deleteTarget !== null"
    title="Delete Client"
    :message="`Are you sure you want to delete '${deleteTarget?.firstName} ${deleteTarget?.lastName}'?`"
    :loading="deleting"
    @confirm="executeDelete"
    @cancel="deleteTarget = null"
  />
</template>
