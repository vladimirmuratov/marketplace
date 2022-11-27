import axios from 'axios'
import { ACCESS_TOKEN, API_KEY, REFRESH_TOKEN } from '@/constants'
import { error } from '@/utils/errorHandler'
import store from '@/store'

export async function updateAccessToken () {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN)
  try {
    const { data } = await axios.post(`https://securetoken.googleapis.com/v1/token?key=${API_KEY}`, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
    console.log('updateAccessToken')

    store.commit('auth/setToken', data.id_token)

    localStorage.setItem(ACCESS_TOKEN, data.id_token)
    localStorage.setItem(REFRESH_TOKEN, data.refresh_token)
  } catch (e) {
    console.log(error(e.response.data.error.message))
  }
}
