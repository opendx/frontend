<template>
  <div>
    <save-action :is-add="false" :is-test-case="true" />
  </div>
</template>

<script>
import SaveAction from '../components/SaveAction'

export default {
  name: 'TestcaseActionUpdate',
  components: {
    SaveAction
  }
}
</script>
