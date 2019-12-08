<template>
  <div class="app-container">
    <save-environment :is-add="true" />
  </div>
</template>

<script>
import SaveEnvironment from './components/SaveEnvironment'
export default {
  name: 'AddEnvironment',
  components: {
    SaveEnvironment
  }
}
</script>

<style scoped>

</style>
