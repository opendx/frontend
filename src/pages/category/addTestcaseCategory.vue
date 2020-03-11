<template>
  <div class="app-container">
    <save-category :is-add="true" :type="4" />
  </div>
</template>

<script>
import SaveCategory from './components/SaveCategory'
export default {
  name: 'AddTestcaseCategory',
  components: {
    SaveCategory
  }
}
</script>

<style scoped>

</style>
