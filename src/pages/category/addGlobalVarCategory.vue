<template>
  <div class="app-container">
    <save-category :is-add="true" :type="3" />
  </div>
</template>

<script>
import SaveCategory from './components/SaveCategory'
export default {
  name: 'AddGlobalVarCategory',
  components: {
    SaveCategory
  }
}
</script>

<style scoped>

</style>
