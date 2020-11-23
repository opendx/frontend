<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-input v-model.trim="queryForm.agentIp" clearable style="width: 150px" placeholder="agentIp" />
      <el-input v-model="queryForm.name" clearable style="width: 150px" placeholder="name" />
      <el-input v-model.trim="queryForm.systemVersion" clearable style="width: 100px" placeholder="系统版本" />
      <el-button @click="onQueryBtnClick" type="primary" class="el-icon-search" />
    </div>
    <!--列表-->
    <div>
      <el-table :data="mobileList" highlight-current-row border>
        <el-table-column label="mobile" align="center" width="120">
          <template scope="{ row }">
            <el-image :src="row.imgUrl" :preview-src-list="[row.imgUrl]" width="100px" />
          </template>
        </el-table-column>
        <el-table-column label="id" align="center" prop="id" show-overflow-tooltip />
        <el-table-column label="name" align="center" prop="name" show-overflow-tooltip />
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
            <el-button :type="row.status | btnType" :disabled="row.status | btnDisabled" @click="useMobile(row)">
              {{ row | btnText }}
            </el-button>
            <el-button v-permission="['admin']" type="danger" class="el-icon-delete" @click="deleteMobile(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchMobileList" />
    </div>
  </div>
</template>

<script>

import { getMobileList, mobileStart, deleteMobile } from '@/api/mobile'
import Pagination from '@/components/Pagination/index'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  components: {
    Pagination
  },
  directives: { permission },
  filters: {
    // mobileStatus: 0 -> 离线 ， 1 -> 使用中 ， 2 -> 在线闲置
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
      mobileList: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        platform: this.$store.state.project.platform,
        systemVersion: '',
        agentIp: '',
        name: ''
      }
    }
  },
  computed: {
    showMobile() {
      return this.$store.state.mobile.show
    }
  },
  watch: {
    showMobile(newValue, oldValue) {
      if (oldValue === true && newValue === false) {
        setTimeout(this.fetchMobileList, 2000)
      }
    }
  },
  created() {
    this.fetchMobileList()
  },
  methods: {
    onQueryBtnClick() {
      this.queryForm.pageNum = 1
      this.fetchMobileList()
    },
    deleteMobile(mobile) {
      this.$confirm(`删除${mobile.id}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMobile(mobile.id).then(resp => {
          this.$notify.success(resp.msg)
          this.fetchMobileList()
        })
      })
    },
    useMobile(mobile) {
      if (this.$store.state.mobile.show) {
        this.$notify.error('只能使用一个mobile')
        return
      }
      mobileStart(mobile.id).then(response => {
        // 不排除agent ip端口变了，拿服务端最新的重新赋值
        mobile.agentIp = response.data.agentIp
        mobile.agentPort = response.data.agentPort
        // mobile改为使用中
        mobile.username = this.$store.state.user.name
        mobile.status = 1

        this.$store.dispatch('mobile/setAgentIp', mobile.agentIp)
        this.$store.dispatch('mobile/setAgentPort', mobile.agentPort)
        this.$store.dispatch('mobile/setId', mobile.id)
        this.$store.dispatch('mobile/setPlatform', mobile.platform)
        this.$store.dispatch('mobile/setSystemVersion', mobile.systemVersion)
        this.$store.dispatch('mobile/setShow', true)
      }).catch(() => {
        // 请求失败，重刷列表获取最新状态
        this.fetchMobileList()
      })
    },
    fetchMobileList() {
      getMobileList(this.queryForm).then(response => {
        this.mobileList = response.data.data
        this.total = response.data.total
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
