<template>
  <div class="app-back-button__container" @click="onBack">
    <p>&laquo; Go Back</p>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  setup () {
    const router = useRouter()

    return {
      onBack: () => router.back()
    }
  }
}
</script>

<style scoped lang="scss">
.app-back-button__container {
  display: inline;
  color: #00c853;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
