<template>
  <div class="modal__container">
    <div class="modal__body">
      <h3 :class="message?.type">{{ message?.msg }}</h3>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message']
}
</script>

<style scoped lang="scss">
.modal__container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .8);
  z-index: 1;

  & .modal__body {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2rem;

    & h3 {
      letter-spacing: .3rem;
    }

    & .success {
      color: #00c853;
      font-size: 4.5rem;
    }
  }
}
</style>
