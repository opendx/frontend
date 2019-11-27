<template>
  <div>
    <el-table :data="globalVarList" border height="250">
      <el-table-column align="center" property="type" label="全局变量类型" />
      <el-table-column align="center" property="name" label="全局变量名" />
      <el-table-column align="center" label="全局变量值" width="900">
        <template scope="{ row }">
          <el-table :data="row.environmentValues" border fit>
            <el-table-column label="环境" align="center" width="200">
              <template scope="{ row }">
                {{ environmentList.filter(env => env.id === row.environmentId)[0].name }}
              </template>
            </el-table-column>
            <el-table-column label="值" align="center" prop="value" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" property="description" label="描述" />
    </el-table>
  </div>
</template>

<script>
import { getGlobalVarList } from '@/api/globalvar'
export default {
  props: {
    environmentList: Array
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
  }
}
</script>
