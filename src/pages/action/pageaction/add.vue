<template>
  <div>
    <sticky :z-index="10" class-name="sub-navbar">
      <el-input v-model="saveActionForm.name" style="width: 200px" />
      <el-input v-model="saveActionForm.description" style="width: 400px" />
      <el-input v-model="saveActionForm.returnValue" style="width: 200px" />
      <el-button-group>
        <el-button>调试</el-button>
        <el-button>保存</el-button>
      </el-button-group>
    </sticky>
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
import Sticky from '@/components/Sticky'
import { getPageList } from '@/api/page'
export default {
  components: {
    ActionParamList,
    ActionLocalVar,
    GlobalVarList,
    ActionStepList,
    Sticky
  },
  data() {
    return {
      page: null,
      saveActionForm: {
        projectId: this.$store.state.project.id,
        pageId: this.$route.params.pageId,
        type: 2,
        returnValue: null
      }
    }
  },
  computed: {
  },
  async created() {
    const { data } = await getPageList({ id: this.saveActionForm.pageId })
    this.page = data[0]
  },
  methods: {

  }
}
</script>
