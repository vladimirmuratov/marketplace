<template>
  <app-modal :message="message" v-if="message"></app-modal>
  <div class="cart-view__container">
    <h1>Cart</h1>

    <div class="cart-view__body" v-if="products.length" :key="item.id" v-for="item in products">

      <div class="cart-view__product-item">
        <h3>{{ item.title }}</h3>
        <img :src="item.image" alt="img"/>
        <p><strong>count: </strong>{{ item.count }}</p>
        <p><strong>amount: </strong>{{ currencyFormatter(item.count * item.price, null) }}</p>
        <span class="cart-view__remove" @click="() => removeItem(item.id)">&times;</span>
      </div>

    </div>

    <h1 v-else>The cart is empty</h1>

    <button v-if="products.length" class="btn primary send" @click="sendOrder">send</button>
    <app-back-button/>

  </div>
</template>

<script>
import { useStore } from 'vuex'
import { onMounted, ref, watch } from 'vue'
import { currencyFormatter } from '@/utils/currencyFormatter'
import AppModal from '@/components/ui/AppModal'
import AppBackButton from '@/components/ui/AppBackButton'

export default {
  setup () {
    const store = useStore()
    const cart = ref(store.getters['cart/cart'])
    const products = ref([])
    let message = ref()

    watch(() => store.getters.message, value => message.value = value)

    onMounted(() => getProducts(cart.value))

    function getProducts (array) {
      if (array.length) {
        array.forEach(async (obj) => {
          const prod = await store.dispatch('request/getSingleProductById', obj.id)
          products.value.push({ ...prod, count: obj.count })
        })
      }
    }

    function removeItem (id) {
      products.value = products.value.filter(item => item.id !== id)
      store.dispatch('cart/removeItemFromCart', id)
    }

    async function sendOrder () {
      await store.dispatch('cart/sendOrder', cart.value)
    }

    return {
      products,
      currencyFormatter,
      removeItem,
      sendOrder,
      message
    }
  },
  components: { AppModal, AppBackButton }
}
</script>

<style scoped lang="scss">
$borderColor: #817c7c;
$warningColor: #ff5722;

.cart-view__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 80vw;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  & h1 {
    text-align: center;
    font-size: 3rem;
    letter-spacing: .2rem;
  }

  & .cart-view__body {
    border-bottom: 1px solid $borderColor;
    padding: .5rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & .cart-view__product-item {
      display: flex;
      justify-content: start;
      align-items: center;
      gap: 1rem;
    }

    & h3 {
      margin: 0;
      font-size: 1.8rem;
    }

    & p {
      margin: 0;
      font-size: 1.5rem;
    }

    & img {
      width: 3rem;
      height: 3rem;
    }

    & .cart-view__remove {
      font-size: 2.5rem;
      font-weight: lighter;
      margin-bottom: .7rem;
      transition: all .3s;
      cursor: pointer;
    }

    & .cart-view__remove:hover {
      color: $warningColor;
    }
  }

  & .send {
    margin-top: 2rem;
  }
}

@media(max-width: 769px) {
  .cart-view__container {
    & .cart-view__body {
      .cart-view__product-item {
        & p {
          font-size: 1rem;
        }
      }

      & h3 {
        font-size: 1.3rem;
      }
    }
  }
}

@media(max-width: 426px) {
  .cart-view__container {
    & .cart-view__body {
      .cart-view__product-item {
        & p {
          font-size: .8rem;
        }
      }

      & h3 {
        font-size: 1rem;
      }
    }
  }
}
</style>
