<template>
  <div class="app-container">
    <el-button @click="fetchOnlineAgentList" style="margin-bottom: 10px">刷新</el-button>
    <el-table :data="agentList" highlight-current-row border v-loading="loading">
      <el-table-column label="状态" align="center" width="50">
        <template>
          <div class="circle"/>
        </template>
      </el-table-column>
      <el-table-column label="操作系统" property="osName" align="center" width="150" show-overflow-tooltip />
      <el-table-column label="appium版本" property="appiumVersion" align="center" width="100" show-overflow-tooltip />
      <el-table-column label="java版本" property="javaVersion" align="center" width="100" show-overflow-tooltip />
      <el-table-column label="地址" align="center" width="180" show-overflow-tooltip>
        <template scope="{ row }">
          {{ row.ip + ':' + row.port }}
        </template>
      </el-table-column>
      <el-table-column label="设备" align="center">
        <template scope="{ row }">
          <el-table :data="row.devices" border>
            <el-table-column label="设备id" prop="id" align="center" show-overflow-tooltip />
            <el-table-column label="设备名" prop="name" align="center" show-overflow-tooltip />
            <el-table-column label="系统" prop="systemVersion" align="center" show-overflow-tooltip />
            <el-table-column label="设备状态" align="center" show-overflow-tooltip>
              <template scope="{ row }">
                {{ row.status === 2 ? '在线闲置': '[' + row.username + ']使用中' }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getOnlineAgentList } from '@/api/serverAgent'

export default {
  data() {
    return {
      loading: false,
      agentList: []
    }
  },
  methods: {
    fetchOnlineAgentList() {
      this.loading = true
      getOnlineAgentList().then(response => {
        this.agentList = response.data
      }).finally(() => {
        this.loading = false
      })
    }
  },
  created() {
    this.fetchOnlineAgentList()
  }
}
</script>

<style scoped>
  .circle {
    margin: 0 auto;
    width: 10px;
    height: 10px;
    background-color:#42b983;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
  }
</style>
