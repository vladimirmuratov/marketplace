import { createStore, createLogger } from 'vuex'
import request from '@/store/modules/request.module'
import auth from '@/store/modules/auth.module'
import cart from '@/store/modules/cart.module'

const plugins = []

if (process.env.NODE_ENV === 'development') {
  plugins.push(createLogger())
}

export default createStore({
  plugins,
  state () {
    return {
      message: {}
    }
  },
  getters: {
    message (state) {
      return state.message
    }
  },
  mutations: {
    setMessage (state, payload) {
      state.message = payload
    },
    clearMessage (state) {
      state.message = null
    }
  },
  actions: {
    async setMessage (context, payload) {
      let timer

      context.commit('setMessage', payload)

      timer = setTimeout(() => context.commit('clearMessage', null, { root: true }), 3000)

      return () => {
        clearTimeout(timer)
      }
    }
  },
  modules: {
    request,
    auth,
    cart
  }
})
