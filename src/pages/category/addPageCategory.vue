<template>
  <div class="app-container">
    <save-category :is-add="true" :type="1" />
  </div>
</template>

<script>
import SaveCategory from './components/SaveCategory'
export default {
  name: 'AddPageCategory',
  components: {
    SaveCategory
  }
}
</script>

<style scoped>

</style>
