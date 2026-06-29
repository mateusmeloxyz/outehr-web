<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()

defineEmits<{
  create: []
}>()
</script>

<template>
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
    </div>
    <button
      @click="$emit('create')"
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
    >
      + Add New
    </button>
  </div>
</template>
