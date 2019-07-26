<template>
  <div>
    <el-table :data="globalVarList" border height="250">
      <el-table-column align="center" label="全局变量名">
        <template scope="{ row }">
          <el-button v-clipboard:copy="'${' + row.name + '}'" v-clipboard:success="onCopy" type="text">{{ row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" property="value" label="全局变量值" />
      <el-table-column align="center" property="description" label="描述" />
    </el-table>
  </div>
</template>

<script>
import { getGlobalVarList } from '@/api/globalvar'
import clipboard from '@/directive/clipboard/index.js'
export default {
  directives: {
    clipboard
  },
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
    onCopy(e) {
      this.$notify.success(e.text + '复制成功')
    }
  }
}
</script>
