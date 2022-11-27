<template>
  <div class="app-auth-view__container">
    <app-form></app-form>
  </div>
</template>

<script>
import AppForm from '@/components/ui/AppForm'

export default {
  components: { AppForm }
}
</script>

<style lang="scss">
.app-sign-in-form__container {
  position: relative;
}
</style>
