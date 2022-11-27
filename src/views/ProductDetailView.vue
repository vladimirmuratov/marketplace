<template>
  <div class="app-product-detail__container">
    <app-back-button/>
    <h1>{{ product.title }}</h1>

    <div class="app-product-detail__body">
      <div class="app-product-detail__left-block">
        <p><strong>id: </strong>{{ product.id }}</p>
        <p><strong>category: </strong>{{ product.category }}</p>
        <p><strong>price: </strong>{{ currencyFormatter(product['price'], null) }}</p>
        <p><strong>rating: </strong>{{ product.rating?.rate }}</p>
        <p><strong>count: </strong>{{ product.rating?.count }}</p>

        <app-add-to-cart-block :id="product.id"></app-add-to-cart-block>
      </div>

      <div class="app-product-detail__right-block">
        <div class="app-product-detail__image">
          <img :src="product.image" alt="img"/>
        </div>

        <div class="app-product-detail__description">{{ product.description }}</div>
      </div>

    </div>
  </div>

</template>

<script>

import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { currencyFormatter } from '@/utils/currencyFormatter'
import AppBackButton from '@/components/ui/AppBackButton'
import AppAddToCartBlock from '@/components/ui/AppAddToCartBlock'

export default {
  setup () {
    const store = useStore()
    const { params, fullPath } = useRoute()
    const product = ref({})

    watch(() => store.getters['request/product'], (value) => {
      product.value = value
      store.dispatch('request/setViewedProducts', {
        title: product.value.title,
        url: fullPath
      })
    })

    onMounted(() => store.dispatch('request/getSingleProductById', params.id))

    return {
      product,
      currencyFormatter
    }
  },
  components: { AppBackButton, AppAddToCartBlock }
}
</script>

<style scoped lang="scss">
.app-product-detail__container {
  padding: 0 2rem 2rem;
  border: .1rem solid;
  border-radius: .2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80vw;
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);

  & .app-product-detail__body {
    display: flex;
    width: 100%;

    & .app-product-detail__left-block {
      position: relative;
      width: 20%;
      font-size: 1.5rem;
    }

    & .app-product-detail__right-block {
      width: 80%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      & .app-product-detail__image {
        width: 30%;
      }
    }

    & .app-product-detail__description {
      width: 70%;
      font-size: 1.3rem;
      line-height: 2rem;
    }

    & img {
      width: 95%;
      height: 100%;
      object-fit: cover;
    }
  }

  & .app-back-button__container {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
