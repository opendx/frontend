<template>
  <div class="app-container">
    <save-driver :is-add="false" />
  </div>
</template>

<script>
import SaveDriver from './components/SaveDriver'
export default {
  name: 'UpdateDriver',
  components: {
    SaveDriver
  }
}
</script>

<style scoped>

</style>
