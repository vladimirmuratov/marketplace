<template>
  <nav class="sideBar__container">

    <router-link
      :to="`/products/category/${category}`"
      :key="category"
      v-for="category in categories"
      @click="$emit('change', category)"
    >
      {{ category }}
    </router-link>

    <div class="sideBar__viewed" v-if="viewedProducts.length">
      <h4>You watched:</h4>
      <div class="sideBar__viewed_body">
        <app-viewed-button :key="item.title" v-for="item in viewedProducts" :title="item.title" :url="item.url"/>
      </div>
      <button class="btn danger" @click="onClearViewedProducts">clear</button>
    </div>

  </nav>
</template>

<script>

import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import AppViewedButton from '@/components/ui/AppViewedButton'

export default {
  emits: ['change'],
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const viewedProducts = ref([])

    onMounted(() => {
      viewedProducts.value = store.getters['request/viewedProducts']
    })

    watch(() => store.getters['request/viewedProducts'], value => viewedProducts.value = value)

    function onClearViewedProducts () {
      store.dispatch('request/clearViewedProducts')
    }

    return {
      viewedProducts,
      onClearViewedProducts
    }
  },
  components: { AppViewedButton }
}
</script>

<style scoped lang="scss">
.sideBar__container {
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: start;
  width: 20%;
  padding: 2rem;

  & .sideBar__viewed {
    margin-top: 19rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    & h4 {
      margin: 0;
      font-size: 1.5rem;
    }

    & .sideBar__viewed_body {
      display: flex;
      flex-direction: column;
    }
  }
}

@media(max-width: 769px){
  .sideBar__container {

    & .sideBar__viewed {
      margin-top: 3rem;
    }
  }
}

@media(max-width: 426px) {
  .sideBar__container {
    padding: 1rem;
    gap: 1rem;
    height: 50%;

    & a {
      font-size: .8rem;
    }

    & .sideBar__viewed {

      & h4 {
        margin: 0;
        font-size: 1rem;
      }
    }
  }
}

@media(max-width: 376px) {
  .sideBar__container {
    width: 30%;
  }
}
</style>
