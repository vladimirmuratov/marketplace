import axios from 'axios'
import { BASE_URL, USER_ID } from '@/constants'
import { toRaw } from 'vue'

const userId = localStorage.getItem(USER_ID)

export default {
  namespaced: true,
  state () {
    return {
      categories: [],
      products: [],
      product: null,
      inputVal: null,
      viewedProducts: JSON.parse(localStorage.getItem(`viewed-products-${userId}`)) ?? []
    }
  },
  getters: {
    categories (state) {
      return state.categories
    },
    products (state) {
      return state.products
    },
    product (state) {
      return state.product
    },
    inputVal (state) {
      return state.inputVal
    },
    viewedProducts (state) {
      return state.viewedProducts
    }
  },
  mutations: {
    setCategories (state, values) {
      state.categories = values
    },
    setProducts (state, values) {
      state.products = values
    },
    clearProducts (state) {
      state.products = []
    },
    setProduct (state, payload) {
      state.product = payload
    },
    setInputVal (state, value) {
      state.inputVal = value
    },
    setViewedProducts (state, payload) {
      state.viewedProducts = payload
    },
    clearViewedProducts (state) {
      state.viewedProducts = []
    }
  },
  actions: {
    async getCategories (context) {
      try {
        const { data } = await axios.get(`${BASE_URL}/products/categories`)
        context.commit('setCategories', data)
      } catch (e) {
        console.log(e.message)
      }
    },
    async getProductsByCategory (context, urlParam) {
      try {
        const { data } = await axios.get(`${BASE_URL}/products/category/${urlParam}`)
        context.commit('setProducts', data)
      } catch (e) {
        console.log(e.message)
      }
    },
    async getSingleProductById (context, id) {
      try {
        const { data } = await axios.get(`${BASE_URL}/products/${id}`)
        context.commit('setProduct', data)
        return data
      } catch (e) {
        console.log(e.message)
      }
    },
    async getAllProducts (context) {
      const inputVal = context.getters.inputVal

      try {
        let { data, status } = await axios.get(`${BASE_URL}/products`)

        if (status === 200) {
          data = data.filter(item => (item.title).toLowerCase().includes(inputVal.toLowerCase()))
          if (data.length) {
            context.commit('setProducts', data)
          }

          if (inputVal.length && !data.length) {
            await context.dispatch('setMessage', {
              msg: `Nothing was found on the request "${inputVal}"`,
              type: 'error'
            }, { root: true })
          }
        }
      } catch (e) {
        console.log(e.message)
      }
    },
    setViewedProducts (context, payload) {
      const viewedProducts = toRaw(context.getters.viewedProducts)
      let isNewProduct = true

      viewedProducts.forEach(item => {
        if (item.title === payload.title) {
          isNewProduct = false
        }
      })

      if (isNewProduct) {
        viewedProducts.push(payload)
        context.commit('setViewedProducts', viewedProducts)
        localStorage.setItem(`viewed-products-${userId}`, JSON.stringify(viewedProducts))
      }
    },
    clearViewedProducts (context) {
      localStorage.removeItem(`viewed-products-${userId}`)
      context.commit('clearViewedProducts')
    }
  }
}
