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
      pageList: [],
      actionList: [],
      total: 0,
      queryActionListForm: {
        pageNum: 1,
        pageSize: 10,
        pageId: undefined
      }
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.id
    }
  },
  async created() {
    await this.fetchPageList()
    if (this.pageList.length > 0) {
      // 默认用第一个pageId请求action
      this.queryActionListForm.pageId = this.pageList[0].id
      await this.fetchActionList()
    }
  },
  methods: {

  }
}
</script>
