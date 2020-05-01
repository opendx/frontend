<template>
  <div class="app-container">
    <!--列表-->
    <div>
      <el-table :data="deviceList" highlight-current-row border>
        <el-table-column label="设备" align="center" width="120">
          <template scope="{ row }">
            <el-image :src="row.imgUrl" :preview-src-list="[row.imgUrl]" width="100px" />
          </template>
        </el-table-column>
        <el-table-column label="设备id" align="center" prop="id" show-overflow-tooltip />
        <el-table-column label="设备名" align="center" prop="name" show-overflow-tooltip />
        <el-table-column label="系统版本" align="center" prop="systemVersion" width="80" show-overflow-tooltip />
        <el-table-column label="分辨率" align="center" width="100" show-overflow-tooltip>
          <template scope="{ row }">
            {{ row.screenHeight + 'x' + row.screenWidth }}
          </template>
        </el-table-column>
        <el-table-column label="cpu" align="center" prop="cpuInfo" show-overflow-tooltip />
        <el-table-column label="内存" align="center" prop="memSize" width="80" show-overflow-tooltip />
        <el-table-column label="agent ip" align="center" prop="agentIp" width="150" show-overflow-tooltip />
        <el-table-column label="操作" align="center" show-overflow-tooltip>
          <template scope="{ row }">
            <el-button :type="row.status | btnType" :disabled="row.status | btnDisabled" @click="useDevice(row)">{{ row | btnText }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchDeviceList" />
    </div>
  </div>
</template>

<script>

import { getDeviceList, deviceStart } from '@/api/device'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  filters: {
    // deviceStatus: 0 -> 离线 ， 1 -> 使用中 ， 2 -> 在线闲置
    btnDisabled(status) {
      return status !== 2
    },
    btnType(status) {
      return status === 0 ? 'info' : status === 1 ? 'danger' : 'success'
    },
    btnText(row) {
      const status = row.status
      return status === 0 ? '离线' : status === 1 ? '[' + row.username + ']使用中' : '立即使用'
    }
  },
  data() {
    return {
      deviceList: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        platform: this.$store.state.project.platform
      }
    }
  },
  created() {
    this.fetchDeviceList()
  },
  methods: {
    onQueryBtnClick() {
      this.queryForm.pageNum = 1
      this.fetchDeviceList()
    },
    useDevice(device) {
      if (this.$store.state.device.show) {
        this.$notify.error('只能使用一台手机')
        return
      }
      deviceStart(device.id).then(response => {
        // 不排除agent ip端口变了，拿服务端最新的重新赋值
        device.agentIp = response.data.agentIp
        device.agentPort = response.data.agentPort
        // 设备改为使用中
        device.username = this.$store.state.user.name
        device.status = 1

        this.$store.dispatch('device/setAgentIp', device.agentIp)
        this.$store.dispatch('device/setAgentPort', device.agentPort)
        this.$store.dispatch('device/setId', device.id)
        this.$store.dispatch('device/setPlatform', device.platform)
        this.$store.dispatch('device/setSystemVersion', device.systemVersion)
        this.$store.dispatch('device/setShow', true)
      }).catch(() => {
        // 请求失败，重刷列表获取最新设备状态
        this.fetchDeviceList()
      })
    },
    fetchDeviceList() {
      getDeviceList(this.queryForm).then(response => {
        this.deviceList = response.data.data
        this.total = response.data.total
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
