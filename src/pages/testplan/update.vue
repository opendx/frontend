<template>
  <div class="app-container">
    <save-test-plan :is-add="false" />
  </div>
</template>

<script>
import SaveTestPlan from './components/SaveTestPlan'
export default {
  name: 'UpdateTestPlan',
  components: {
    SaveTestPlan
  }
}
</script>
