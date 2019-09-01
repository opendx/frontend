<template>
  <save-project-dialog :is-add="true" :show-cancel="showCancel" />
</template>

<script>
import SaveProjectDialog from './components/SaveProjectDialog'
export default {
  data() {
    return {
      showCancel: true
    }
  },
  components: {
    SaveProjectDialog
  },
  created() {
    if (this.$route.params.showCancel !== undefined) {
      this.showCancel = this.$route.params.showCancel
    }
  }
}
</script>

<style scoped>

</style>
