<template>
  <div class="container">
    <the-sidebar :categories="categories" @change="onChangeParam"></the-sidebar>

    <app-loader v-if="loading"></app-loader>

    <div class="home-view__container" v-if="!products.length">
      <h1 :class="message.type" v-if="message?.msg">{{ message?.msg }}</h1>
      <h1 v-else>welcome</h1>
      <img src="../assets/images/bgImage.jpg" alt="photo">
    </div>

    <div class="home-view__container" v-if="products.length">
      <app-products-list :key="item.id" v-for="item in products" :product="item"></app-products-list>
    </div>

  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import TheSidebar from '@/components/TheSidebar.vue'
import AppProductsList from '@/components/ui/AppProductsList'
import AppLoader from '@/components/ui/AppLoader'
import { useRoute } from 'vue-router'

export default {
  name: 'HomeView',
  setup () {
    const store = useStore()
    const route = useRoute()
    const categories = ref([])
    const category = ref('')
    const products = ref([])
    const loading = ref(false)
    const message = ref({})

    watch(() => store.getters['request/products'], (value) => {
      products.value = value
    })

    watch(() => store.getters.message, value => {
      message.value = value
    })

    onMounted(async () => {
      category.value = route.params.category
      await store.dispatch('request/getCategories')
      categories.value = store.getters['request/categories']

      if (category.value) {
        await onRequest()
      }
    })

    async function onChangeParam (param) {
      category.value = param

      if (category.value) {
        await onRequest()
      }
    }

    async function onRequest () {
      loading.value = true
      await store.dispatch('request/getProductsByCategory', category.value)
      products.value = store.getters['request/products']
      loading.value = false
    }

    return {
      categories,
      category,
      onChangeParam,
      products,
      loading,
      message
    }
  },
  components: {
    TheSidebar,
    AppProductsList,
    AppLoader
  }
}
</script>

<style scoped lang="scss">

.home-view__container {
  width: 80vw;
  height: 85vh;

  & h1 {
    font-family: 'Quicksand', sans-serif;
    font-size: 4.5rem;
    letter-spacing: 0.3rem;
    text-transform: uppercase;
    color: #fafafa;
    position: absolute;
    top: 45%;
    left: 60%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .error {
    color: red;
  }
}

.home-view__container img {
  object-fit: cover;
  width: 80vw;
  height: 85vh;
  opacity: .8;
}

@media(max-width: 376px) {
  .home-view__container {

    & h1 {
      font-size: 4rem;
      top: 45%;
      left: 70%;
    }
  }
}

@media(max-width: 376px) {
  .home-view__container {
    & h1 {
      font-size: 4rem;
    }
  }
}

</style>
