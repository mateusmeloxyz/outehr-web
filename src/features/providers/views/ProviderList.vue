<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProvidersStore } from '../store'
import { usePagination } from '@/shared/composables/usePagination'
import BasePageHeader from '@/shared/components/BasePageHeader.vue'
import BaseTable from '@/shared/components/BaseTable.vue'
import BasePagination from '@/shared/components/BasePagination.vue'
import BaseConfirmDialog from '@/shared/components/BaseConfirmDialog.vue'
import type { Provider } from '../types'

const store = useProvidersStore()
const router = useRouter()
const pagination = usePagination()

const deleteTarget = ref<Provider | null>(null)
const deleting = ref(false)

const columns = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'specialtyId', label: 'Specialty ID' },
  { key: 'clinicId', label: 'Clinic ID' },
  { key: 'rating', label: 'Rating' }
]

async function load() {
  await store.fetchProviders(pagination.page.value, pagination.pageSize.value)
  pagination.totalCount.value = store.totalCount
}

function goToPage(p: number) {
  pagination.goTo(p)
  load()
}

function createNew() {
  router.push({ name: 'provider-create' })
}

function editProvider(p: Provider) {
  router.push({ name: 'provider-edit', params: { id: p.id } })
}

function confirmDelete(p: Provider) {
  deleteTarget.value = p
}

async function executeDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await store.deleteProvider(deleteTarget.value.id)
    deleteTarget.value = null
    await load()
  } finally {
    deleting.value = false
  }
}

onMounted(() => load())
</script>

<template>
  <BasePageHeader title="Providers" subtitle="Manage healthcare providers" @create="createNew" />

  <BaseTable :columns="columns" :rows="store.providers" :loading="store.loading" @edit="editProvider" @delete="confirmDelete" />

  <BasePagination
    :page="pagination.page.value"
    :total-pages="pagination.totalPages.value"
    :total-count="pagination.totalCount.value"
    @go-to="goToPage"
  />

  <BaseConfirmDialog
    :visible="deleteTarget !== null"
    title="Delete Provider"
    :message="`Are you sure you want to delete '${deleteTarget?.firstName} ${deleteTarget?.lastName}'?`"
    :loading="deleting"
    @confirm="executeDelete"
    @cancel="deleteTarget = null"
  />
</template>
