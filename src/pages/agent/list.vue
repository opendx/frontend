<template>
  <div class="app-container">
    <el-table :data="agentList" highlight-current-row border>
      <el-table-column label="状态" align="center" width="50">
        <template>
          <div class="circle"/>
        </template>
      </el-table-column>
      <el-table-column label="agent" align="center">
        <template scope="{ row }">
          {{ row.agentIp + ':' + row.agentPort }}
        </template>
      </el-table-column>
      <el-table-column label="设备" align="center">
        <template scope="{ row }">
          <el-table :data="row.devices" size="mini">
            <el-table-column label="设备名" prop="name" align="center" />
            <el-table-column label="设备id" prop="id" align="center" />
            <el-table-column label="设备状态" align="center">
              <template scope="device_scope">
                {{ device_scope.row.status === 2 ? '在线闲置': '[' + device_scope.row.username + ']使用中' }}
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
      agentList: []
    }
  },
  methods: {
    fetchOnlineAgentList() {
      getOnlineAgentList().then(response => {
        this.agentList = response.data
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
