<template>
  <div class="app-container">
    <save-page :is-add="false" />
  </div>
</template>

<script>
import SavePage from './components/SavePage'
export default {
  name: 'UpdatePage',
  components: {
    SavePage
  }
}
</script>
