<template>
  <div class="app-container">
    <save-test-plan-dialog :is-add="false" />
  </div>
</template>

<script>
import SaveTestPlanDialog from './components/SaveTestPlanDialog'
export default {
  components: {
    SaveTestPlanDialog
  }
}
</script>
