<template>
  <div>
    <div class="add-block__container">
      <span @click="count--">-</span>
      <span>{{ count }}</span>
      <span @click="count++">+</span>
    </div>
    <button class="btn warning" @click="addToCart">add to cart</button>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  props: ['id'],
  setup (props) {
    const router = useRouter()
    const store = useStore()
    const count = ref(1)
    const userId = localStorage.getItem('user-id')
    const isAuth = store.getters['auth/isAuth']

    watch(count, value => {
      if (value < 1) {
        count.value = 1
      }
    })

    async function addToCart () {
      if (!isAuth) {
        await router.push('/auth')
      } else {
        const payload = {
          id: props.id,
          count: count.value,
          date: Date.now(),
          userId
        }
        await store.dispatch('cart/addToCard', payload)
      }
    }

    return {
      count,
      addToCart
    }
  }

}
</script>

<style scoped lang="scss">
$fontColor: #aca7a7;

.add-block__container {
  margin-bottom: 1rem;

  & span {
    border: 1.2px solid $fontColor;
    display: inline-block;
    width: 3.5rem;
    height: 2rem;
    text-align: center;
    font-size: 1.5rem;
    cursor: pointer;
    color: $fontColor;
  }

  & span:first-child {
    border-bottom-left-radius: .2rem;
    border-top-left-radius: .2rem;
  }

  & span:last-child {
    border-bottom-right-radius: .2rem;
    border-top-right-radius: .2rem;
  }
}

@media(max-width: 426px) {
  .add-block__container {
    & span {
      font-size: 1rem;
      width: 3rem;
      height: 1.5rem;
    }
  }
}

@media(max-width: 376px) {
  .add-block__container {
    margin-bottom: .5rem;
  }
}

</style>
