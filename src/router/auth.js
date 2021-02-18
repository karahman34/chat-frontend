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
  {
    path: `${prefix}/forgot-password`,
    name: 'ForgotPassword',
    meta: {
      layout: 'auth',
      title: 'Forgot Password',
      middleware: ['guest'],
    },
    component: () => import('@/views/ForgotPassword.vue'),
  },
  {
    path: `${prefix}/reset-password`,
    name: 'ResetPassword',
    meta: {
      layout: 'auth',
      title: 'Reset Password',
      middleware: ['guest'],
    },
    component: () => import('@/views/ResetPassword.vue'),
  },
]

export default router
