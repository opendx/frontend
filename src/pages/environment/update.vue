<template>
  <div class="app-container">
    <save-environment :is-add="false" />
  </div>
</template>

<script>
import SaveEnvironment from './components/SaveEnvironment'
export default {
  name: 'UpdateEnvironment',
  components: {
    SaveEnvironment
  }
}
</script>

<style scoped>

</style>
