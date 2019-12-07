<template>
  <div class="app-container">
    <save-device-page :is-add="false" />
  </div>
</template>

<script>
import SaveDevicePage from './components/SaveDevicePage'
export default {
  components: {
    SaveDevicePage
  }
}
</script>
