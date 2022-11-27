import axios from 'axios'
import { BASE_URL } from '@/constants'
import router from '@/router'
import { toRaw } from 'vue'

export default {
  namespaced: true,
  state () {
    return {
      cart: []
    }
  },
  getters: {
    cart (state) {
      return state.cart
    }
  },
  mutations: {
    setCart (state, payload) {
      if (Array.isArray(payload)) {
        state.cart.push(...payload)
      } else {
        state.cart.push(payload)
      }
    },
    clearCart (state) {
      state.cart = []
    }
  },
  actions: {
    addToCard (context, payload) {
      const cart = context.getters.cart
      let result
      let isNewItem = true

      if (!cart.length) {
        context.commit('setCart', payload)
      } else {
        result = toRaw(cart).map(item => {
          if (item.id === payload.id) {
            return {
              ...item,
              count: item.count + payload.count
            }
          } else {
            return item
          }
        })

        result.forEach(item => {
          if (item.id === payload.id) {
            isNewItem = false
          }
        })

        if (isNewItem) {
          result.push(payload)
        }

        context.commit('clearCart')
        context.commit('setCart', result)
      }
    },
    async sendOrder (context, payload) {
      let timer

      try {
        const result = await axios.post(`${BASE_URL}/carts`, payload)
        if (result.status === 200) {
          await context.dispatch('setMessage', {
            msg: 'Success!',
            type: 'success'
          }, { root: true })

          await context.commit('clearCart')

          timer = setTimeout(() => router.replace('/'), 3000)
        }
      } catch (e) {
        console.log(e.message)
      }

      return () => {
        clearTimeout(timer)
      }
    },
    removeItemFromCart (context, id) {
      let cart = context.getters.cart
      let result = []

      toRaw(cart).forEach(item => {
        if (item.id !== id) {
          result.push(item)
        }
      })

      context.commit('clearCart')
      context.commit('setCart', result)
    }
  }
}
