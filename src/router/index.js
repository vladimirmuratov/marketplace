import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import CartView from '@/views/CartView'
import AppProductDetail from '@/views/ProductDetailView'
import ProfileView from '@/views/ProfileView'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      layout: 'main'
    },
    component: HomeView
  },
  {
    path: '/auth',
    name: 'auth',
    meta: {
      layout: 'auth'
    },
    component: AuthView
  },
  {
    path: '/products/category/:category',
    name: 'category',
    meta: {
      layout: 'main'
    },
    component: HomeView
  },
  {
    path: '/products/category/:category/:id',
    name: 'product-detail',
    meta: {
      layout: 'main'
    },
    component: AppProductDetail
  },
  {
    path: '/cart',
    name: 'cart',
    meta: {
      layout: 'main',
      auth: true
    },
    component: CartView
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {
      layout: 'main',
      auth: true
    },
    component: ProfileView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
  const requireAuth = to.meta.auth

  if (requireAuth && store.getters['auth/isAuth']) {
    next()
  } else if (requireAuth && !store.getters['auth/isAuth']) {
    next('/auth')
  } else {
    next()
  }
})

export default router
