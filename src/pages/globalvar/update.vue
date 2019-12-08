<template>
  <div class="app-container">
    <save-global-var :is-add="false" />
  </div>
</template>

<script>
import SaveGlobalVar from './components/SaveGlobalVar'
export default {
  name: 'UpdateGlobalVar',
  components: {
    SaveGlobalVar
  }
}
</script>

<style scoped>

</style>
