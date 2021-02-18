const prefix = '/auth'
const router = [
  {
    path: `${prefix}/login`,
    name: 'Login',
    meta: {
      layout: 'auth',
      title: 'Login',
      middleware: ['guest'],
    },
    component: () => import('@/views/Login.vue'),
  },
]

export default router
