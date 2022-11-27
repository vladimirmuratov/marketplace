<template>
  <app-modal v-if="message" :message="message"></app-modal>
  <div class="profile-view__container" v-if="profile">
    <app-back-button/>
    <h1>Profile</h1>
    <form @submit.prevent="onSubmit">
      <input type="text" v-model.trim="profile.fio" minlength="3" required/>
      <input type="email" v-model="profile.email" disabled/>
      <input type="text" v-model.trim="profile.phone"/>
      <button type="submit" class="btn danger">change</button>
    </form>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import AppModal from '@/components/ui/AppModal'
import AppBackButton from '@/components/ui/AppBackButton'

export default {
  setup () {
    const store = useStore()
    const profile = ref()
    const message = ref()

    onMounted(() => profile.value = store.getters['auth/user'])

    watch(() => store.getters['auth/user'], (value) => profile.value = value)

    watch(() => store.getters.message, value => message.value = value)

    function onSubmit () {
      store.dispatch('auth/updateUserInfo', profile.value)
    }

    return {
      profile,
      onSubmit,
      message
    }
  },
  components: { AppModal, AppBackButton }
}
</script>

<style scoped lang="scss">
.profile-view__container {
  height: 95vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .app-back-button__container {
    position: absolute;
    top: 30%;
    left: 25%;
  }

  & form {
    border: 1px solid red;
    border-radius: .2rem;
    display: flex;
    flex-direction: column;
    width: 50%;

    & input {
      margin-bottom: 1rem;
      padding: 1rem;
      font-family: 'Open Sans', sans-serif;
      font-size: 1.5rem;
      border: none;
      outline: none;
      background-color: inherit;
    }

    & input:first-child {
      margin-top: 1rem;
    }

    & input[type=email] {
      background-color: #f1e9e9;
    }
  }
}

@media(max-width: 321px) {
  .profile-view__container {
   & form {
     & input {
       font-size: 1.3rem;
     }
   }
  }
}
</style>
