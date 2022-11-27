<template>
  <header>
    <h1 @click="onBack">Market Place</h1>
    <nav>
      <div v-if="user" class="block">
        <div class="search-block">
          <input type="text" v-model="inputVal"/>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fafafa" class="bi bi-search"
               viewBox="0 0 16 16">
            <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </div>
        <router-link to="/cart" class="cart">
          <span v-if="cart?.length">{{ cart?.length }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-cart4"
               viewBox="0 0 16 16">
            <path
              d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
          </svg>
        </router-link>

        <span class="laptop-menu">
          <router-link to="/profile">{{ user['fio'] }}</router-link>
          <a href="#" @click="logOut">Log Out</a>
        </span>

        <span class="mobile-menu">
          <router-link to="/profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fafafa"
                 class="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                  <path fill-rule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
          </router-link>
          <a href="#" @click="logOut">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fafafa" class="bi bi-box-arrow-right"
                 viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                      d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                <path fill-rule="evenodd"
                      d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
          </a>
        </span>

      </div>

      <router-link to="/auth" v-else>Sign In</router-link>

    </nav>
  </header>
</template>

<script>

import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'

export default {
  setup () {
    const store = useStore()
    const router = useRouter()
    const user = ref()
    const cart = ref()
    const inputVal = ref('')

    onMounted(() => {
      user.value = store.getters['auth/user']
      cart.value = store.getters['cart/cart']
    })

    watch(() => store.getters['auth/user'], value => user.value = value)

    watch(() => store.getters['cart/cart'], value => cart.value = value)

    watch(inputVal, value => {
      inputVal.value = value

      store.commit('request/setInputVal', inputVal.value)

      if (!inputVal.value.length) {
        store.commit('request/clearProducts')
      }

      if (inputVal.value.length >= 3) {
        store.dispatch('request/getAllProducts')
      }
    })

    function onBack () {
      store.commit('request/clearProducts')
      router.push('/')
    }

    function logOut () {
      store.commit('request/clearProducts')
      store.dispatch('auth/logOut')
    }

    return {
      onBack,
      user,
      logOut,
      cart,
      inputVal
    }
  }
}
</script>

<style scoped lang="scss">
$fontColor: #fafafa;
$orangeColor: #ff5722;

header {
  background: $orangeColor;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10vh;
  box-shadow: 0 2px 2px #616161;
  padding: 0 1rem;

  & .block {
    display: flex;
    flex-wrap: nowrap;

    & .search-block {
      display: inline-block;
      position: relative;
      margin-right: 2rem;
    }

    & .search-block svg {
      position: absolute;
      right: 2.5rem;
      margin-top: .3rem;
    }

    & .search-block input {
      margin-right: 2rem;
      padding: .3rem;
      border: .1rem solid $fontColor;
      border-radius: .5rem;
      background-color: inherit;
      outline: none;
      color: $fontColor;
      letter-spacing: .1rem;
    }

  }

  & h1 {
    margin: 0 0 0 1rem;
    font-size: 2.4rem;
    font-weight: 900;
    cursor: pointer;
    color: $fontColor;
  }

  & .laptop-menu {
    display: inline;
  }

  & nav a {
    margin-right: 2rem;
    color: $fontColor;
  }

  & nav a:last-child {
    margin-right: 0;
  }

  & .cart {
    position: relative;

    & span {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: -12px;
      left: 20px;
      min-width: 1.5rem;
      min-height: 1.5rem;
      border-radius: 50%;
      background-color: $fontColor;
      color: $orangeColor;
      font-size: 1rem;
      font-weight: bold;
      padding: .2rem;
    }
  }

  & .mobile-menu {
    display: none;
  }
}

@media(max-width: 426px) {
  header {
    padding: 0 1rem;

    & h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    & .search-block {
      margin-right: 0;
    }

    & .search-block input {
      margin-right: 1rem;
    }

    & .laptop-menu {
      display: none;
    }

    & .mobile-menu {
      display: flex;
    }
  }
}

@media(max-width: 376px) {
  header {
    & .search-block input {
      width: 15rem;
    }
  }
}

@media(max-width: 321px) {
  header {
    & .search-block input {
      width: 10rem;
    }
  }
}

</style>
