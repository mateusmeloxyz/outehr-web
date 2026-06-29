<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useClinicsStore } from '../store'
import { usePagination } from '@/shared/composables/usePagination'
import BasePageHeader from '@/shared/components/BasePageHeader.vue'
import BaseTable from '@/shared/components/BaseTable.vue'
import BasePagination from '@/shared/components/BasePagination.vue'
import BaseConfirmDialog from '@/shared/components/BaseConfirmDialog.vue'
import type { Clinic } from '../types'

const store = useClinicsStore()
const router = useRouter()
const pagination = usePagination()

const deleteTarget = ref<Clinic | null>(null)
const deleting = ref(false)

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'zipCode', label: 'Zip' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' }
]

async function load() {
  await store.fetchClinics(pagination.page.value, pagination.pageSize.value)
  pagination.totalCount.value = store.totalCount
}

function goToPage(p: number) {
  pagination.goTo(p)
  load()
}

function createNew() {
  router.push({ name: 'clinic-create' })
}

function editClinic(clinic: Clinic) {
  router.push({ name: 'clinic-edit', params: { id: clinic.id } })
}

function confirmDelete(clinic: Clinic) {
  deleteTarget.value = clinic
}

async function executeDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await store.deleteClinic(deleteTarget.value.id)
    deleteTarget.value = null
    await load()
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  load()
})
</script>

<template>
  <BasePageHeader
    title="Clinics"
    subtitle="Manage healthcare facility locations"
    @create="createNew"
  />

  <BaseTable
    :columns="columns"
    :rows="store.clinics"
    :loading="store.loading"
    @edit="editClinic"
    @delete="confirmDelete"
  />

  <BasePagination
    :page="pagination.page.value"
    :total-pages="pagination.totalPages.value"
    :total-count="pagination.totalCount.value"
    @go-to="goToPage"
  />

  <BaseConfirmDialog
    :visible="deleteTarget !== null"
    title="Delete Clinic"
    :message="`Are you sure you want to delete '${deleteTarget?.name}'? This will soft-delete the record.`"
    :loading="deleting"
    @confirm="executeDelete"
    @cancel="deleteTarget = null"
  />
</template>
