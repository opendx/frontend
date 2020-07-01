<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-button @click="$router.push({ name: 'AddApp' })">添加app</el-button>
    </div>
    <!-- 列表 -->
    <div>
      <el-table :data="appList" highlight-current-row border>
        <el-table-column label="App名" property="name" align="center" show-overflow-tooltip />
        <el-table-column label="下载地址" align="center" width="100">
          <template scope="{ row }">
            <el-button type="text" slot="append" v-clipboard:copy="row.downloadUrl" v-clipboard:success="onCopySuccess">复制</el-button>
          </template>
        </el-table-column>
        <el-table-column label="Version" property="version" align="center" width="120" show-overflow-tooltip />
        <el-table-column v-if="queryForm.platform === 1" label="PackageName" property="packageName" align="center" show-overflow-tooltip />
        <el-table-column v-if="queryForm.platform === 1" label="LaunchActivity" property="launchActivity" align="center" show-overflow-tooltip />
        <el-table-column label="上传时间" align="center" width="200" show-overflow-tooltip>
          <template scope="{ row }">
            {{ `${row.uploadorNickName} ${row.uploadTime}` }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template scope="{ row }">
            <el-button v-if="row.platform === 1 && (!row.packageName || !row.launchActivity || !row.version)" @click="aaptDumpBadging(row)" title="获取Version PackageName LaunchActivity" :loading="aaptDumpBadgingBtnLoading">aapt dump</el-button>
            <el-button type="primary" class="el-icon-edit" @click="updateApp(row)" />
            <el-button type="danger" class="el-icon-delete" @click="deleteApp(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchAppList" />
    </div>
  </div>
</template>

<script>
import { getAppList, deleteApp, aaptDumpBadging } from '@/api/app'
import Pagination from '@/components/Pagination'
import clipboard from '@/directive/clipboard/index.js'

export default {
  directives: {
    clipboard
  },
  components: {
    Pagination
  },
  data() {
    return {
      aaptDumpBadgingBtnLoading: false,
      appList: [],
      total: 0,
      queryForm: {
        projectId: this.$store.state.project.id,
        pageNum: 1,
        pageSize: 10,
        platform: this.$store.state.project.platform
      }
    }
  },
  created() {
    this.fetchAppList()
  },
  methods: {
    updateApp(app) {
      this.$router.push({ name: 'UpdateApp', params: { appId: app.id }})
    },
    deleteApp(app) {
      this.$confirm(`删除${app.name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteApp(app.id).then(resp => {
          this.$notify.success(resp.msg)
          this.fetchAppList()
        })
      })
    },
    fetchAppList() {
      getAppList(this.queryForm).then(resp => {
        this.appList = resp.data.data
        this.total = resp.data.total
      })
    },
    onCopySuccess(e) {
      this.$notify.success('下载地址已添加到剪切板')
    },
    aaptDumpBadging(row) {
      this.aaptDumpBadgingBtnLoading = true
      aaptDumpBadging(row.id).then(response => {
        this.$notify.success(response.msg)
        this.fetchAppList()
      }).finally(() => {
        this.aaptDumpBadgingBtnLoading = false
      })
    }
  }
}
</script>
