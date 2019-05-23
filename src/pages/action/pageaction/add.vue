<template>
  <div>
    <action-param-list :is-add="true" />
    <action-local-var />
    <global-var-list />
    <action-step-list />
  </div>
</template>
<script>
import ActionParamList from '../components/ActionParamList'
import ActionLocalVar from '../components/ActionLocalVarList'
import GlobalVarList from '../components/GlobalVarList'
import ActionStepList from '../components/ActionStepList'
export default {
  components: {
    ActionParamList,
    ActionLocalVar,
    GlobalVarList,
    ActionStepList
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {

  }
}
</script>
