<template>
  <div class="app-container">
    <save-page :is-add="true" />
  </div>
</template>

<script>
import SavePage from './components/SavePage'
export default {
  name: 'AddPage',
  components: {
    SavePage
  }
}
</script>
