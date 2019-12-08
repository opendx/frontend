<template>
  <div class="app-container">
    <save-category :is-add="true" :type="2" />
  </div>
</template>

<script>
import SaveCategory from './components/SaveCategory'
export default {
  name: 'AddActionCategory',
  components: {
    SaveCategory
  }
}
</script>

<style scoped>

</style>
