import axios from 'axios'
import router from '@/router'
import { ACCESS_TOKEN, API_KEY, REFRESH_TOKEN, USER_ID } from '@/constants'
import { updateAccessToken } from '@/axios'
import { error } from '@/utils/errorHandler'

const FB_URL = process.env.VUE_APP_FB_URL
const FB_AUTH = process.env.VUE_APP_FB_AUTH

export default {
  namespaced: true,
  state () {
    return {
      token: localStorage.getItem(ACCESS_TOKEN) ?? null,
      isAuth: false,
      userId: localStorage.getItem(USER_ID) ?? null,
      user: null
    }
  },
  getters: {
    isAuth (state) {
      return state.isAuth
    },
    token (state) {
      return state.token
    },
    userId (state) {
      return state.userId
    },
    user (state) {
      return state.user
    }
  },
  mutations: {
    setToken (state, payload) {
      state.token = payload
    },
    setAuth (state) {
      state.isAuth = true
    },
    setUserId (state, payload) {
      state.userId = payload
    },
    setUser (state, payload) {
      state.user = payload
    },
    removeInfo (state) {
      state.user = null
      state.isAuth = false
      state.userId = null
      state.token = null
    }
  },
  actions: {
    async signUp (context, payload) {
      const url = `${FB_AUTH}:signUp?key=${API_KEY}`

      try {
        const { data, status: resStatus } = await axios.post(url, {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true
        })

        if (resStatus === 200) {
          await context.dispatch('setData', data)

          await context.dispatch('createUser', {
            fio: payload.fio,
            phone: payload.phone,
            email: payload.email
          })

          await router.replace('/')
        }
      } catch (e) {
        await context.dispatch('setMessage', {
          msg: error(e.response.data.error.message),
          type: 'error'
        }, { root: true })
      }
    },
    async signIn (context, payload) {
      const url = `${FB_AUTH}:signInWithPassword?key=${API_KEY}`

      try {
        const { data, status: resStatus } = await axios.post(url, {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true
        })

        if (resStatus === 200) {
          await context.dispatch('setData', data)

          await context.dispatch('getUserInfo')

          await router.replace('/')
        }
      } catch (e) {
        await context.dispatch('setMessage', {
          msg: error(e.response.data.error.message),
          type: 'error'
        }, { root: true })
      }
    },
    async createUser (context, payload) {
      const token = context.getters.token

      try {
        const { data, status } = await axios.post(
          `${FB_URL}/users.json?auth=${token}`, payload)

        if (status === 200) {
          context.commit('setUserId', data.name)
          localStorage.setItem(USER_ID, data.name)
        }

        await context.dispatch('updateAuthUserInfo')

        await context.dispatch('getUserInfo')
      } catch (e) {
        console.log(error(e.response.data.error.message))
      }
    },
    async getUserInfo (context) {
      const token = context.getters.token
      const userId = context.getters.userId

      try {
        const { data, status } = await axios.get(
          `${FB_URL}/users/${userId}.json?auth=${token}`)

        if (status === 200) {
          context.commit('setUser', data)
          context.commit('setAuth')
        }
      } catch (e) {
        if (e.response.status === 401) {
          await updateAccessToken()
        }
      }
    },
    async logOut (context) {
      context.commit('removeInfo')
      localStorage.removeItem(ACCESS_TOKEN)
      localStorage.removeItem(REFRESH_TOKEN)
      localStorage.removeItem(USER_ID)

      await router.replace('/')
    },
    async updateAuthUserInfo (context) {
      const token = context.getters.token
      const userId = context.getters.userId

      const payload = {
        idToken: token,
        displayName: userId
      }

      try {
        const { data, status } = await axios.post(
          `${FB_AUTH}:update?key=${API_KEY}`, payload)

        if (status === 200) {
          localStorage.setItem(USER_ID, data.displayName)
        }
      } catch (e) {
        console.log(error(e.response.data.error.message))
      }
    },
    async updateUserInfo (context, payload) {
      const userId = context.getters.userId
      const token = context.getters.token

      try {
        const response = await axios.put(`${FB_URL}/users/${userId}.json?auth=${token}`, payload)
        console.log('updateUserInfo', response)
        if (response.status === 200) {
          await context.dispatch('setMessage', {
            msg: 'Success!',
            type: 'success'
          }, { root: true })
        }
      } catch (e) {
        console.log(e.message)
      }
    },
    async setData (context, data) {
      context.commit('setToken', data.idToken)
      context.commit('setAuth')
      context.commit('setUserId', data.displayName)

      localStorage.setItem(ACCESS_TOKEN, data.idToken)
      localStorage.setItem(REFRESH_TOKEN, data.refreshToken)
      localStorage.setItem(USER_ID, data.displayName)

      await router.back()
    }
  }
}
