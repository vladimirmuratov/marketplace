<template>
  <div class="app-product-list__container">
    <router-link :to="`/products/category/${product.category}/${product.id}`">{{ product.title }}</router-link>
    <div class="app-product-list__body">
      <div class="app-product-list__info">
        <p><strong>id: </strong>{{ product.id }}</p>
        <p><strong>category: </strong>{{ product.category }}</p>
        <p><strong>price: </strong>{{ currencyFormatter(product['price'], null) }}</p>
        <p><strong>rate: </strong>{{ product.rating.rate }}</p>
        <p><strong>count: </strong>{{ product.rating.count }}</p>

      </div>
      <div class="app-product-list__image">
        <img :src="product.image" alt="img"/>
      </div>
    </div>

    <app-add-to-cart-block :id="product.id"></app-add-to-cart-block>

  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { currencyFormatter } from '@/utils/currencyFormatter'
import AppAddToCartBlock from '@/components/ui/AppAddToCartBlock'

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup () {
    const router = useRouter()
    const { path } = useRoute()
    const store = useStore()

    const isAuth = computed(() => store.getters['auth/isAuth'])

    function addToCart () {
      if (!isAuth.value) {
        router.push('/auth')
      } else {
        console.log('SUCCESS!!!')
      }
    }

    return {
      currencyFormatter,
      path,
      addToCart
    }
  },
  components: { AppAddToCartBlock }

}
</script>

<style scoped lang="scss">
$blackColor: #424242;

.app-product-list__container {
  border: 1px solid $blackColor;
  border-radius: .2rem;
  margin: 0 auto 1rem;
  padding: 1rem;
  width: 80%;
  min-height: 20rem;

  & a {
    font-size: 1.8rem;
    font-weight: bold;
  }

  & a:hover {
    border-bottom: 2px solid $blackColor;
  }

  & p {
    font-size: 1.5rem;
  }

  .app-product-list__body {
    display: flex;

    & .app-product-list__info {
      width: 50%;
    }

    & .app-product-list__image {
      margin-top: 1rem;
      display: flex;
      justify-content: center;
      align-items: start;
      height: 30%;

      & img {
        width: 50%;
        height: 50%;
      }
    }
  }
}

@media(max-width: 426px) {
  .app-product-list__container {
    & a {
      font-size: 1rem;
    }

    & p {
      font-size: 1rem;
    }
  }
}

@media(max-width: 376px){
  .app-product-list__info p {
    margin: .5rem 0;
  }
}
</style>
