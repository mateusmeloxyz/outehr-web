<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/clinics', label: 'Clinics', icon: '🏥' },
  { path: '/specialties', label: 'Specialties', icon: '🩺' },
  { path: '/providers', label: 'Providers', icon: '👨‍⚕️' },
  { path: '/clients', label: 'Clients', icon: '👤' }
]
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <aside class="w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <div class="px-6 py-5 border-b border-gray-200">
        <h1 class="text-xl font-bold text-blue-600">OutEHR</h1>
        <p class="text-xs text-gray-500 mt-1">Admin Panel</p>
      </div>
      <nav class="px-3 py-4">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors"
          :class="
            route.path.startsWith(item.path)
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          "
        >
          <span class="mr-3 text-lg">{{ item.icon }}</span>
          {{ item.label }}
        </router-link>
      </nav>
    </aside>
    <main class="flex-1 overflow-auto">
      <div class="p-8">
        <router-view />
      </div>
    </main>
  </div>
</template>
