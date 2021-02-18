import authMiddleware from '@/middlewares/authMiddleware'
import guestMiddleware from '@/middlewares/guestMiddleware'

export default function(router, store) {
  router.beforeEach((to, from, next) => {
    const middleware = to.meta?.middleware
    if (Array.isArray(middleware) && middleware.length) {
      for (const name of middleware) {
        switch (name) {
          case 'auth':
            authMiddleware(store, next)
            break

          case 'guest':
            guestMiddleware(store, next)
            break
        }
      }
    }

    next()
  })
}
