<template>
  <component :is="layoutName + '-layout'" v-if="layoutName"/>
</template>

<script>
import { computed, getCurrentInstance, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { ACCESS_TOKEN } from '@/constants'
import store from '@/store'

export default {
  setup () {
    const route = useRoute()
    let accessToken = localStorage.getItem(ACCESS_TOKEN)
    const isAuth = store.getters['auth/isAuth']
    const instance = getCurrentInstance()

    watch(() => store.getters['auth/token'], value => {
      instance?.proxy?.$forceUpdate()
      accessToken = value
    })

    onMounted(async () => {
      if (accessToken && !isAuth) {
        await store.dispatch('auth/getUserInfo')
      }
    })

    return {
      layoutName: computed(() => route.meta.layout)
    }
  },
  components: {
    MainLayout,
    AuthLayout
  }
}
</script>

<style lang="scss">

</style>
