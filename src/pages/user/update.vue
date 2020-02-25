<template>
  <div class="app-container">
    <save-user :is-add="false" />
  </div>
</template>

<script>
import SaveUser from './components/SaveUser'
export default {
  name: 'UpdateUser',
  components: {
    SaveUser
  }
}
</script>

<style scoped>

</style>
