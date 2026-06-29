<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSpecialtiesStore } from '../store'
import BasePageHeader from '@/shared/components/BasePageHeader.vue'
import BaseFormInput from '@/shared/components/BaseFormInput.vue'
import { required, maxLength, minValue } from '@/shared/utils/validators'
import type { SpecialtyFormData } from '../types'

const store = useSpecialtiesStore()
const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const editId = computed(() => Number(route.params.id))

const form = ref<SpecialtyFormData>({
  name: '',
  description: null,
  defaultSlotDurationMinutes: 30
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const submitError = ref<string | null>(null)

function validate(): boolean {
  errors.value = {}
  const r: Record<string, string> = {}

  const v = required(form.value.name); if (v !== true) r.name = v
  const ml = maxLength(100)(form.value.name); if (ml !== true && !r.name) r.name = ml
  if (form.value.description) {
    const dl = maxLength(500)(form.value.description); if (dl !== true) r.description = dl
  }
  const d = required(form.value.defaultSlotDurationMinutes); if (d !== true) r.defaultSlotDurationMinutes = d
  const mv = minValue(1)(form.value.defaultSlotDurationMinutes); if (mv !== true) r.defaultSlotDurationMinutes = mv

  errors.value = r
  return Object.keys(r).length === 0
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  submitError.value = null
  try {
    if (isEdit.value) {
      await store.updateSpecialty(editId.value, form.value)
    } else {
      await store.createSpecialty(form.value)
    }
    router.push({ name: 'specialties' })
  } catch (e: unknown) {
    const err = e as { message?: string }
    submitError.value = err.message || 'Failed to save specialty'
  } finally {
    submitting.value = false
  }
}

async function loadSpecialty() {
  if (isEdit.value) {
    await store.fetchSpecialty(editId.value)
    if (store.currentSpecialty) {
      form.value = {
        name: store.currentSpecialty.name,
        description: store.currentSpecialty.description,
        defaultSlotDurationMinutes: store.currentSpecialty.defaultSlotDurationMinutes
      }
    }
  }
}

onMounted(loadSpecialty)
</script>

<template>
  <div>
    <BasePageHeader :title="isEdit ? 'Edit Specialty' : 'New Specialty'" subtitle="" @create="() => {}" class="[&>button]:hidden" />

    <div v-if="submitError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
      {{ submitError }}
    </div>

    <form @submit.prevent="submit" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
      <BaseFormInput label="Name" v-model="form.name" :error="errors.name" required :maxlength="100" />
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          v-model="form.description"
          :maxlength="500"
          rows="3"
          class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :class="errors.description ? 'border-red-400' : 'border-gray-300'"
        ></textarea>
        <p v-if="errors.description" class="mt-1 text-xs text-red-500">{{ errors.description }}</p>
      </div>
      <BaseFormInput label="Default Slot Duration (minutes)" v-model="form.defaultSlotDurationMinutes" :error="errors.defaultSlotDurationMinutes" type="number" required />

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
