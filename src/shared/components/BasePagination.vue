<script setup lang="ts">
defineProps<{
  page: number
  totalPages: number
  totalCount: number
}>()

defineEmits<{
  goTo: [page: number]
}>()

function pageRange(current: number, total: number): (number | string)[] {
  const pages: (number | string)[] = []
  const delta = 2
  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)

  pages.push(1)
  if (left > 2) pages.push('...')
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push('...')
  if (total > 1) pages.push(total)

  return pages
}
</script>

<template>
  <div class="flex items-center justify-between mt-4">
    <span class="text-sm text-gray-600">
      Total: {{ totalCount }} records
    </span>
    <div class="flex items-center space-x-1" v-if="totalPages > 1">
      <button
        :disabled="page <= 1"
        @click="$emit('goTo', page - 1)"
        class="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-30 hover:bg-gray-100"
      >
        Prev
      </button>
      <template v-for="p in pageRange(page, totalPages)" :key="p">
        <span v-if="p === '...'" class="px-2 text-sm text-gray-400">...</span>
        <button
          v-else
          @click="$emit('goTo', p as number)"
          :class="[
            'px-3 py-1 text-sm rounded border',
            p === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 hover:bg-gray-100'
          ]"
        >
          {{ p }}
        </button>
      </template>
      <button
        :disabled="page >= totalPages"
        @click="$emit('goTo', page + 1)"
        class="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-30 hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  </div>
</template>
