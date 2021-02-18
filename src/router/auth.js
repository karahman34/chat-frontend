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
  {
    path: `${prefix}/register`,
    name: 'Register',
    meta: {
      layout: 'auth',
      title: 'Register',
      middleware: ['guest'],
    },
    component: () => import('@/views/Register.vue'),
  },
]

export default router
