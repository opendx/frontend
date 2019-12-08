<template>
  <div class="app-container">
    <save-app :is-add="true" />
  </div>
</template>

<script>
import SaveApp from './components/SaveApp'
export default {
  name: 'AddApp',
  components: {
    SaveApp
  }
}
</script>
