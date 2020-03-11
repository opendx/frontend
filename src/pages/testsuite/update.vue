<template>
  <div class="app-container">
    <save-test-suite :is-add="false" />
  </div>
</template>

<script>
import SaveTestSuite from './components/SaveTestSuite'
export default {
  name: 'UpdateTestSuite',
  components: {
    SaveTestSuite
  }
}
</script>
