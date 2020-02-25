<template>
  <div class="app-container">
    <save-user :is-add="true" />
  </div>
</template>

<script>
import SaveUser from './components/SaveUser'
export default {
  name: 'AddUser',
  components: {
    SaveUser
  }
}
</script>

<style scoped>

</style>
