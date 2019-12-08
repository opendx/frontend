<template>
  <div class="app-container">
    <save-project :is-add="false" />
  </div>
</template>

<script>
import SaveProject from './components/SaveProject'
export default {
  name: 'UpdateProject',
  components: {
    SaveProject
  }
}
</script>

<style scoped>

</style>
