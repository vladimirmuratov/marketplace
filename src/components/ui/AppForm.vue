<template>
  <form class="app-sign-in-form__container" @submit.prevent="onSubmit">
    <h1 v-if="status === 'signIn'">Sign In</h1>
    <h1 v-else>Sign Up</h1>

    <p v-if="message?.msg" :class="message.type">{{ message?.msg }}</p>

    <div class="form-control" v-if="status === 'signUp'">
      <label for="name">Name</label>
      <input type="text" id="name" placeholder="input name" v-model="fio" :class="{'error-border': fioError}" required/>
      <small v-if="fioError">{{ fioError }}</small>
    </div>

    <div class="form-control" v-if="status === 'signUp'">
      <label for="phone">Phone</label>
      <input type="text" id="phone" placeholder="input phone" v-model="phone" :class="{'error-border': phoneError}"/>
      <small v-if="phoneError">{{ phoneError }}</small>
    </div>

    <div class="form-control">
      <label for="email">Email</label>
      <input type="text" id="email" placeholder="input email" v-model="email" :class="{'error-border': eError}"
             required/>
      <small v-if="eError">{{ eError }}</small>
    </div>

    <div class="form-control">
      <label for="password">Password</label>
      <input type="text" id="password" placeholder="input password" v-model="password" :class="{'error-border': pError}"
             required/>
      <small v-if="pError">{{ pError }}</small>
    </div>

    <button type="submit" class="btn primary" :disabled="isSubmitting">submit</button>
    <small v-if="isTooManyAttempts">Many attempts. Try again later</small>

    <p v-if="status === 'signIn'">You are not registered yet? <span @click="changeStatus">Sign Up</span></p>
    <p v-else>You are already registered? <span @click="changeStatus">Sign In</span></p>
  </form>
</template>

<script>
import { ref, watch } from 'vue'
import { useRequestForm } from '@/hooks/login-form'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
    const status = ref('signIn')
    const message = ref('')

    watch(() => store.getters.message, msg => {
      message.value = msg
    })

    async function submit (values, { resetForm }) {
      if (status.value === 'signUp') {
        try {
          await store.dispatch('auth/signUp', values)
          resetForm()
        } catch (e) {}
      } else if (status.value === 'signIn') {
        try {
          await store.dispatch('auth/signIn', values)
          resetForm()
        } catch (e) {}
      }
    }

    return {
      ...useRequestForm(submit),
      status,
      changeStatus () {
        status.value === 'signIn'
          ? status.value = 'signUp'
          : status.value = 'signIn'
      },
      message
    }
  }
}
</script>

<style scoped lang="scss">
$linkBorderColor: #1e88e5;
$dangerColor: #f44336;

.app-sign-in-form__container {
  border: 1px solid black;
  border-radius: .2rem;
  width: 50vw;
  min-height: 30vh;
  margin: 0 auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2rem;

  & h1 {
    font-size: 3rem;
    text-align: center;
  }

  & p {
    font-size: 1.5rem;

    & span {
      color: $linkBorderColor;
      cursor: pointer;
      transition: all .3s;
    }

    & span:hover {
      border-bottom: 1px solid $linkBorderColor;
    }
  }

  & small {
    color: $dangerColor;
    font-size: 1.3rem;
    margin: .5rem;
  }

  & .error {
    text-align: center;
    color: $dangerColor;
  }

  & .error-border {
    border-bottom: 2px solid $dangerColor;
  }
}

@media(max-width: 769px){
  .app-sign-in-form__container {
    & h1 {
      font-size: 2.5rem;
    }
  }
}

@media(max-width: 426px){
  .app-sign-in-form__container {
    & h1 {
      font-size: 2rem;
    }

    & p {
      font-size: 1rem;
    }
  }
}

</style>
