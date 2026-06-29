import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/clinics'
    },
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: 'clinics',
          name: 'clinics',
          component: () => import('@/features/clinics/views/ClinicList.vue')
        },
        {
          path: 'clinics/new',
          name: 'clinic-create',
          component: () => import('@/features/clinics/views/ClinicForm.vue')
        },
        {
          path: 'clinics/:id/edit',
          name: 'clinic-edit',
          component: () => import('@/features/clinics/views/ClinicForm.vue')
        },
        {
          path: 'specialties',
          name: 'specialties',
          component: () => import('@/features/specialties/views/SpecialtyList.vue')
        },
        {
          path: 'specialties/new',
          name: 'specialty-create',
          component: () => import('@/features/specialties/views/SpecialtyForm.vue')
        },
        {
          path: 'specialties/:id/edit',
          name: 'specialty-edit',
          component: () => import('@/features/specialties/views/SpecialtyForm.vue')
        },
        {
          path: 'providers',
          name: 'providers',
          component: () => import('@/features/providers/views/ProviderList.vue')
        },
        {
          path: 'providers/new',
          name: 'provider-create',
          component: () => import('@/features/providers/views/ProviderForm.vue')
        },
        {
          path: 'providers/:id/edit',
          name: 'provider-edit',
          component: () => import('@/features/providers/views/ProviderForm.vue')
        },
        {
          path: 'clients',
          name: 'clients',
          component: () => import('@/features/clients/views/ClientList.vue')
        },
        {
          path: 'clients/new',
          name: 'client-create',
          component: () => import('@/features/clients/views/ClientForm.vue')
        },
        {
          path: 'clients/:id/edit',
          name: 'client-edit',
          component: () => import('@/features/clients/views/ClientForm.vue')
        }
      ]
    }
  ]
})

export default router
