<script setup lang="ts" generic="T extends { id: number }">
defineProps<{
  columns: { key: string; label: string }[]
  rows: T[]
  loading?: boolean
}>()

defineEmits<{
  edit: [row: T]
  delete: [row: T]
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
    <table v-else class="w-full">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ col.label }}
          </th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length + 1" class="px-6 py-12 text-center text-sm text-gray-500">
            No records found.
          </td>
        </tr>
        <tr v-for="row in rows" :key="row.id" class="hover:bg-gray-50 transition-colors">
          <td v-for="col in columns" :key="col.key" class="px-6 py-4 text-sm text-gray-700">
            <slot :name="'cell-' + col.key" :row="row" :value="(row as Record<string, unknown>)[col.key]">
              {{ (row as Record<string, unknown>)[col.key] }}
            </slot>
          </td>
          <td class="px-6 py-4 text-right text-sm space-x-2">
            <button
              @click="$emit('edit', row)"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit
            </button>
            <button
              @click="$emit('delete', row)"
              class="text-red-600 hover:text-red-800 font-medium"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
