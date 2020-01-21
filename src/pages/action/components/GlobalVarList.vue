<template>
  <div>
    <el-table :data="globalVarList" border height="250">
      <el-table-column align="center" width="200">
        <template slot="header">
          <el-button type="text" class="el-icon-refresh" @click="fetchGlobalVarList" />
          全局变量类型
        </template>
        <template scope="{ row }">
          {{ row.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" property="name" label="全局变量名" />
      <el-table-column align="center" label="全局变量值" width="800">
        <template scope="{ row }">
          <el-table :data="row.environmentValues" border fit>
            <el-table-column label="环境" align="center" width="200" show-overflow-tooltip>
              <template scope="{ row }">
                {{ environmentList.filter(env => env.id === row.environmentId)[0].name }}
              </template>
            </el-table-column>
            <el-table-column label="值" align="center" prop="value" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" property="description" label="描述" show-overflow-tooltip />
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
  created() {
    this.fetchGlobalVarList()
  },
  methods: {
    fetchGlobalVarList() {
      getGlobalVarList({
        projectId: this.$store.state.project.id
      }).then(response => {
        this.globalVarList = response.data
      })
    }
  }
}
</script>
