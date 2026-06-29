<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProvidersStore } from '../store'
import BasePageHeader from '@/shared/components/BasePageHeader.vue'
import BaseFormInput from '@/shared/components/BaseFormInput.vue'
import api from '@/shared/services/api'
import { required, maxLength, validEmail, validPhone } from '@/shared/utils/validators'
import type { ProviderFormData } from '../types'
import type { PagedResult } from '@/shared/types/common'

const store = useProvidersStore()
const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const editId = computed(() => Number(route.params.id))

const form = ref<ProviderFormData>({
  specialtyId: 0,
  clinicId: 0,
  firstName: '',
  lastName: '',
  npi: null,
  phone: null,
  email: null
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const submitError = ref<string | null>(null)

interface SelectOption { id: number; name: string }
const specialties = ref<SelectOption[]>([])
const clinics = ref<SelectOption[]>([])

async function loadOptions() {
  try {
    const [specRes, clinRes] = await Promise.all([
      api.get<PagedResult<SelectOption>>('/api/specialties', { params: { page: 1, pageSize: 100 } }),
      api.get<PagedResult<SelectOption>>('/api/clinics', { params: { page: 1, pageSize: 100 } })
    ])
    specialties.value = specRes.data.data
    clinics.value = clinRes.data.data
  } catch { /* ignore */ }
}

function validate(): boolean {
  errors.value = {}
  const r: Record<string, string> = {}

  if (!form.value.specialtyId) r.specialtyId = 'Specialty is required'
  if (!form.value.clinicId) r.clinicId = 'Clinic is required'
  const fn = required(form.value.firstName); if (fn !== true) r.firstName = fn
  const fnl = maxLength(100)(form.value.firstName); if (fnl !== true && !r.firstName) r.firstName = fnl
  const ln = required(form.value.lastName); if (ln !== true) r.lastName = ln
  const lnl = maxLength(100)(form.value.lastName); if (lnl !== true && !r.lastName) r.lastName = lnl
  if (form.value.email) {
    const e = validEmail(form.value.email); if (e !== true) r.email = e
  }
  if (form.value.phone) {
    const p = validPhone(form.value.phone); if (p !== true) r.phone = p
  }

  errors.value = r
  return Object.keys(r).length === 0
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  submitError.value = null
  try {
    if (isEdit.value) {
      await store.updateProvider(editId.value, form.value)
    } else {
      await store.createProvider(form.value)
    }
    router.push({ name: 'providers' })
  } catch (e: unknown) {
    const err = e as { message?: string }
    submitError.value = err.message || 'Failed to save provider'
  } finally {
    submitting.value = false
  }
}

async function loadProvider() {
  if (isEdit.value) {
    await store.fetchProvider(editId.value)
    if (store.currentProvider) {
      form.value = {
        specialtyId: store.currentProvider.specialtyId,
        clinicId: store.currentProvider.clinicId,
        firstName: store.currentProvider.firstName,
        lastName: store.currentProvider.lastName,
        npi: store.currentProvider.npi,
        phone: store.currentProvider.phone,
        email: store.currentProvider.email
      }
    }
  }
}

onMounted(() => {
  loadOptions()
  loadProvider()
})
</script>

<template>
  <div>
    <BasePageHeader :title="isEdit ? 'Edit Provider' : 'New Provider'" subtitle="" @create="() => {}" class="[&>button]:hidden" />

    <div v-if="submitError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
      {{ submitError }}
    </div>

    <form @submit.prevent="submit" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
      <div class="grid grid-cols-2 gap-4">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Specialty <span class="text-red-500">*</span></label>
          <select
            v-model="form.specialtyId"
            class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="errors.specialtyId ? 'border-red-400' : 'border-gray-300'"
          >
            <option :value="0" disabled>Select specialty...</option>
            <option v-for="s in specialties" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
          <p v-if="errors.specialtyId" class="mt-1 text-xs text-red-500">{{ errors.specialtyId }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Clinic <span class="text-red-500">*</span></label>
          <select
            v-model="form.clinicId"
            class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="errors.clinicId ? 'border-red-400' : 'border-gray-300'"
          >
            <option :value="0" disabled>Select clinic...</option>
            <option v-for="c in clinics" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <p v-if="errors.clinicId" class="mt-1 text-xs text-red-500">{{ errors.clinicId }}</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <BaseFormInput label="First Name" v-model="form.firstName" :error="errors.firstName" required />
        <BaseFormInput label="Last Name" v-model="form.lastName" :error="errors.lastName" required />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <BaseFormInput label="Email" v-model="form.email" :error="errors.email" type="email" />
        <BaseFormInput label="Phone" v-model="form.phone" :error="errors.phone" />
      </div>
      <BaseFormInput label="NPI" v-model="form.npi" :error="errors.npi" />

      <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
        <button type="button" @click="router.back()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button type="submit" :disabled="submitting" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center">
          <span v-if="submitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
          {{ isEdit ? 'Update' : 'Create' }}
        </button>
      </div>
    </form>
  </div>
</template>
