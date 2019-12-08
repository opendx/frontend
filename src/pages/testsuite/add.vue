<template>
  <div class="app-container">
    <save-test-suite :is-add="true" />
  </div>
</template>

<script>
import SaveTestSuite from './components/SaveTestSuite'
export default {
  name: 'AddTestSuite',
  components: {
    SaveTestSuite
  }
}
</script>
