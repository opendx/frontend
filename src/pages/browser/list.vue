<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-input v-model.trim="queryForm.agentIp" clearable style="width: 150px" placeholder="agentIp" />
      <el-button @click="onQueryBtnClick" type="primary" class="el-icon-search" />
    </div>
    <!--列表-->
    <div>
      <el-table :data="browserList" highlight-current-row border>
        <el-table-column label="平台" width="100" align="center">
          <template scope="{ row }">
            {{ row.platform === 1 ? 'windows' : row.platform === 2 ? 'linux' : 'macos' }}
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="type" show-overflow-tooltip />
        <el-table-column label="浏览器id" align="center" prop="id" show-overflow-tooltip />
        <el-table-column label="版本号" align="center" prop="version" show-overflow-tooltip />
        <el-table-column label="agent ip" align="center" prop="agentIp" width="150" show-overflow-tooltip />
        <el-table-column label="操作" align="center" show-overflow-tooltip>
          <template scope="{ row }">
            <el-button :type="row.status | btnType" :disabled="row.status | btnDisabled" @click="useBrowser(row)">{{ row | btnText }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchBrowserList" />
    </div>
  </div>
</template>

<script>

import { getBrowserList, browserStart } from '@/api/browser'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  filters: {
    // browserStatus: 0 -> 离线 ， 1 -> 使用中 ， 2 -> 在线闲置
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
      browserList: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        agentIp: ''
      }
    }
  },
  created() {
    this.fetchBrowserList()
  },
  methods: {
    onQueryBtnClick() {
      this.queryForm.pageNum = 1
      this.fetchBrowserList()
    },
    useBrowser(browser) {
      if (this.$store.state.browser.show) {
        this.$notify.error('只能使用一个浏览器')
        return
      }
      browserStart(browser.id).then(response => {
        // 不排除agent ip端口变了，拿服务端最新的重新赋值
        browser.agentIp = response.data.agentIp
        browser.agentPort = response.data.agentPort
        // 浏览器改为使用中
        browser.username = this.$store.state.user.name
        browser.status = 1

        this.$store.dispatch('browser/setAgentIp', browser.agentIp)
        this.$store.dispatch('browser/setAgentPort', browser.agentPort)
        this.$store.dispatch('browser/setId', browser.id)
        this.$store.dispatch('browser/setShow', true)
      }).catch(() => {
        // 请求失败，重刷列表获取最新状态
        this.fetchBrowserList()
      })
    },
    fetchBrowserList() {
      getBrowserList(this.queryForm).then(response => {
        this.browserList = response.data.data
        this.total = response.data.total
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
