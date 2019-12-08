<template>
  <div class="app-container">
    <save-app :is-add="false" />
  </div>
</template>

<script>
import SaveApp from './components/SaveApp'
export default {
  name: 'UpdateApp',
  components: {
    SaveApp
  }
}
</script>
