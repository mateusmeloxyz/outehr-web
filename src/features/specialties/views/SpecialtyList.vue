<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSpecialtiesStore } from '../store'
import { usePagination } from '@/shared/composables/usePagination'
import BasePageHeader from '@/shared/components/BasePageHeader.vue'
import BaseTable from '@/shared/components/BaseTable.vue'
import BasePagination from '@/shared/components/BasePagination.vue'
import BaseConfirmDialog from '@/shared/components/BaseConfirmDialog.vue'
import type { Specialty } from '../types'

const store = useSpecialtiesStore()
const router = useRouter()
const pagination = usePagination()

const deleteTarget = ref<Specialty | null>(null)
const deleting = ref(false)

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'defaultSlotDurationMinutes', label: 'Slot Duration (min)' }
]

async function load() {
  await store.fetchSpecialties(pagination.page.value, pagination.pageSize.value)
  pagination.totalCount.value = store.totalCount
}

function goToPage(p: number) {
  pagination.goTo(p)
  load()
}

function createNew() {
  router.push({ name: 'specialty-create' })
}

function editSpecialty(s: Specialty) {
  router.push({ name: 'specialty-edit', params: { id: s.id } })
}

function confirmDelete(s: Specialty) {
  deleteTarget.value = s
}

async function executeDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await store.deleteSpecialty(deleteTarget.value.id)
    deleteTarget.value = null
    await load()
  } finally {
    deleting.value = false
  }
}

onMounted(() => load())
</script>

<template>
  <BasePageHeader title="Specialties" subtitle="Manage medical specialties" @create="createNew" />

  <BaseTable :columns="columns" :rows="store.specialties" :loading="store.loading" @edit="editSpecialty" @delete="confirmDelete" />

  <BasePagination
    :page="pagination.page.value"
    :total-pages="pagination.totalPages.value"
    :total-count="pagination.totalCount.value"
    @go-to="goToPage"
  />

  <BaseConfirmDialog
    :visible="deleteTarget !== null"
    title="Delete Specialty"
    :message="`Are you sure you want to delete '${deleteTarget?.name}'?`"
    :loading="deleting"
    @confirm="executeDelete"
    @cancel="deleteTarget = null"
  />
</template>
