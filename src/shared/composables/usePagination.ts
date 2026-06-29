import { ref, computed } from 'vue'

export function usePagination(initialPageSize = 10) {
  const page = ref(1)
  const pageSize = ref(initialPageSize)
  const totalCount = ref(0)

  const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)))

  function goTo(p: number) {
    page.value = Math.max(1, Math.min(p, totalPages.value))
  }

  function next() {
    goTo(page.value + 1)
  }

  function prev() {
    goTo(page.value - 1)
  }

  function reset() {
    page.value = 1
  }

  return {
    page,
    pageSize,
    totalCount,
    totalPages,
    goTo,
    next,
    prev,
    reset
  }
}
