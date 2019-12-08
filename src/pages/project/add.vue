<template>
  <div class="app-container">
    <save-project :is-add="true" />
  </div>
</template>

<script>
import SaveProject from './components/SaveProject'
export default {
  name: 'AddProject',
  components: {
    SaveProject
  }
}
</script>

<style scoped>

</style>
