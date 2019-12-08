<template>
  <div class="app-container">
    <save-driver :is-add="true" />
  </div>
</template>

<script>
import SaveDriver from './components/SaveDriver'
export default {
  name: 'AddDriver',
  components: {
    SaveDriver
  }
}
</script>

<style scoped>

</style>
