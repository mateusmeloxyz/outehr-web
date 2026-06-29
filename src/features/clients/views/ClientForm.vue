<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useClientsStore } from '../store'
import BasePageHeader from '@/shared/components/BasePageHeader.vue'
import BaseFormInput from '@/shared/components/BaseFormInput.vue'
import { required, maxLength, validEmail, validPhone } from '@/shared/utils/validators'
import type { ClientFormData } from '../types'

const store = useClientsStore()
const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const editId = computed(() => Number(route.params.id))

const form = ref<ClientFormData>({
  firstName: '',
  lastName: '',
  email: '',
  phone: null,
  dateOfBirth: null
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const submitError = ref<string | null>(null)

function validate(): boolean {
  errors.value = {}
  const r: Record<string, string> = {}

  const fn = required(form.value.firstName); if (fn !== true) r.firstName = fn
  const fnl = maxLength(100)(form.value.firstName); if (fnl !== true && !r.firstName) r.firstName = fnl
  const ln = required(form.value.lastName); if (ln !== true) r.lastName = ln
  const lnl = maxLength(100)(form.value.lastName); if (lnl !== true && !r.lastName) r.lastName = lnl
  const e = required(form.value.email); if (e !== true) r.email = e
  const ev = validEmail(form.value.email); if (ev !== true && !r.email) r.email = ev
  if (form.value.phone) {
    const p = validPhone(form.value.phone); if (p !== true) r.phone = p
  }
  if (form.value.dateOfBirth) {
    const dob = new Date(form.value.dateOfBirth)
    if (dob > new Date()) r.dateOfBirth = 'Date of birth cannot be in the future'
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
      await store.updateClient(editId.value, form.value)
    } else {
      await store.createClient(form.value)
    }
    router.push({ name: 'clients' })
  } catch (e: unknown) {
    const err = e as { message?: string }
    submitError.value = err.message || 'Failed to save client'
  } finally {
    submitting.value = false
  }
}

async function loadClient() {
  if (isEdit.value) {
    await store.fetchClient(editId.value)
    if (store.currentClient) {
      form.value = {
        firstName: store.currentClient.firstName,
        lastName: store.currentClient.lastName,
        email: store.currentClient.email,
        phone: store.currentClient.phone,
        dateOfBirth: store.currentClient.dateOfBirth
      }
    }
  }
}

onMounted(loadClient)
</script>

<template>
  <div>
    <BasePageHeader :title="isEdit ? 'Edit Client' : 'New Client'" subtitle="" @create="() => {}" class="[&>button]:hidden" />

    <div v-if="submitError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
      {{ submitError }}
    </div>

    <form @submit.prevent="submit" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
      <div class="grid grid-cols-2 gap-4">
        <BaseFormInput label="First Name" v-model="form.firstName" :error="errors.firstName" required />
        <BaseFormInput label="Last Name" v-model="form.lastName" :error="errors.lastName" required />
      </div>
      <BaseFormInput label="Email" v-model="form.email" :error="errors.email" type="email" required />
      <div class="grid grid-cols-2 gap-4">
        <BaseFormInput label="Phone" v-model="form.phone" :error="errors.phone" />
        <BaseFormInput label="Date of Birth" v-model="form.dateOfBirth" :error="errors.dateOfBirth" type="date" />
      </div>

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
