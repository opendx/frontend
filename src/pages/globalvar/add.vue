<template>
  <div class="app-container">
    <save-global-var :is-add="true" />
  </div>
</template>

<script>
import SaveGlobalVar from './components/SaveGlobalVar'
export default {
  name: 'AddGlobalVar',
  components: {
    SaveGlobalVar
  }
}
</script>

<style scoped>

</style>
