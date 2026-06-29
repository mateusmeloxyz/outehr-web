<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useClinicsStore } from '../store'
import BasePageHeader from '@/shared/components/BasePageHeader.vue'
import BaseFormInput from '@/shared/components/BaseFormInput.vue'
import { required, maxLength, validEmail, validPhone, range } from '@/shared/utils/validators'
import type { ClinicFormData } from '../types'

const store = useClinicsStore()
const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const editId = computed(() => Number(route.params.id))

const form = ref<ClinicFormData>({
  name: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  phone: null,
  email: null,
  latitude: null,
  longitude: null
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const submitError = ref<string | null>(null)

function validate(): boolean {
  errors.value = {}
  const r: Record<string, string> = {}

  const v = required(form.value.name); if (v !== true) r.name = v
  const ml = maxLength(100)(form.value.name); if (ml !== true && !r.name) r.name = ml
  const a = required(form.value.address); if (a !== true) r.address = a
  const al = maxLength(200)(form.value.address); if (al !== true && !r.address) r.address = al
  const c = required(form.value.city); if (c !== true) r.city = c
  const cl = maxLength(100)(form.value.city); if (cl !== true && !r.city) r.city = cl
  const s = required(form.value.state); if (s !== true) r.state = s
  const sl = maxLength(50)(form.value.state); if (sl !== true && !r.state) r.state = sl
  const z = required(form.value.zipCode); if (z !== true) r.zipCode = z
  const zl = maxLength(20)(form.value.zipCode); if (zl !== true && !r.zipCode) r.zipCode = zl

  if (form.value.email) {
    const e = validEmail(form.value.email); if (e !== true) r.email = e
  }
  if (form.value.phone) {
    const p = validPhone(form.value.phone); if (p !== true) r.phone = p
  }
  if (form.value.latitude != null) {
    const lat = range(-90, 90)(form.value.latitude); if (lat !== true) r.latitude = lat
  }
  if (form.value.longitude != null) {
    const lng = range(-180, 180)(form.value.longitude); if (lng !== true) r.longitude = lng
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
      await store.updateClinic(editId.value, form.value)
    } else {
      await store.createClinic(form.value)
    }
    router.push({ name: 'clinics' })
  } catch (e: unknown) {
    const err = e as { message?: string }
    submitError.value = err.message || 'Failed to save clinic'
  } finally {
    submitting.value = false
  }
}

async function loadClinic() {
  if (isEdit.value) {
    await store.fetchClinic(editId.value)
    if (store.currentClinic) {
      form.value = {
        name: store.currentClinic.name,
        address: store.currentClinic.address,
        city: store.currentClinic.city,
        state: store.currentClinic.state,
        zipCode: store.currentClinic.zipCode,
        phone: store.currentClinic.phone,
        email: store.currentClinic.email,
        latitude: store.currentClinic.latitude,
        longitude: store.currentClinic.longitude
      }
    }
  }
}

onMounted(loadClinic)
</script>

<template>
  <div>
    <BasePageHeader
      :title="isEdit ? 'Edit Clinic' : 'New Clinic'"
      subtitle=""
      @create="() => {}"
      class="[&>button]:hidden"
    />

    <div v-if="submitError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
      {{ submitError }}
    </div>

    <form @submit.prevent="submit" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
      <BaseFormInput label="Name" v-model="form.name" :error="errors.name" required :maxlength="100" />
      <BaseFormInput label="Address" v-model="form.address" :error="errors.address" required />
      <div class="grid grid-cols-2 gap-4">
        <BaseFormInput label="City" v-model="form.city" :error="errors.city" required />
        <BaseFormInput label="State" v-model="form.state" :error="errors.state" required />
      </div>
      <BaseFormInput label="Zip Code" v-model="form.zipCode" :error="errors.zipCode" required />
      <div class="grid grid-cols-2 gap-4">
        <BaseFormInput label="Phone" v-model="form.phone" :error="errors.phone" />
        <BaseFormInput label="Email" v-model="form.email" :error="errors.email" type="email" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <BaseFormInput label="Latitude" v-model="form.latitude" :error="errors.latitude" type="number" />
        <BaseFormInput label="Longitude" v-model="form.longitude" :error="errors.longitude" type="number" />
      </div>

      <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          @click="router.back()"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          <span v-if="submitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
          {{ isEdit ? 'Update' : 'Create' }}
        </button>
      </div>
    </form>
  </div>
</template>
