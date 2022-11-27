<template>
  <router-link :to="url" class="link__container">
    {{ title }}
  </router-link>
</template>

<script>
export default {
  props: ['title', 'url']
}
</script>

<style scoped lang="scss">
$grayColor: #989595;
$whiteColor: #fafafa;

.link__container {
  background-color: $grayColor;
  color: $whiteColor;
  font-size: 1rem;
  border-radius: .5rem;
  padding: .5rem 1rem;
  margin-bottom: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all .3s;
}

.link__container:hover {
  color: $grayColor;
  background-color: $whiteColor;
  border: 1px solid $grayColor;
}

@media(max-width: 426px) {
  .link__container {
    margin-bottom: .3rem;
    padding: .3rem .8rem;
  }
}
</style>
