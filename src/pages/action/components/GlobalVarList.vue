<template>
  <div>
    <el-table :data="globalVarList" border height="250">
      <el-table-column align="center" property="type" label="全局变量类型" />
      <el-table-column align="center" property="name" label="全局变量名" />
      <el-table-column align="center" property="value" label="全局变量值" />
      <el-table-column align="center" property="description" label="描述" />
    </el-table>
  </div>
</template>

<script>
import { getGlobalVarList } from '@/api/globalvar'
export default {
  data() {
    return {
      globalVarList: []
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.id
    }
  },
  created() {
    getGlobalVarList({
      projectId: this.projectId
    }).then(response => {
      this.globalVarList = response.data
    })
  },
  methods: {
  }
}
</script>
