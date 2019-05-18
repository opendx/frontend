<template>
  <div class="app-container">
    <save-device-page-form :is-add="false" @saveSuccess="onSaveSuccess" @cancel="onCancel" />
  </div>
</template>

<script>
import SaveDevicePageForm from './components/SaveDevicePageForm'
export default {
  components: {
    SaveDevicePageForm
  },
  methods: {
    onSaveSuccess() {
      this.$router.push({
        path: '/page/list'
      })
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>

</style>
