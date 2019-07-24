<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-button @click="$router.push('/app/add')">添加app</el-button>
    </div>
    <div style="margin-bottom: 10px">
      <el-select v-model="queryForm.platform">
        <el-option v-for="platform in platforms" :key="platform.type" :label="platform.name" :value="platform.type" />
      </el-select>
      <el-button type="primary" class="el-icon-search" @click="onQueryBtnClick" />
    </div>
    <!-- 列表 -->
    <div>
      <el-table :data="appList" highlight-current-row border>
        <el-table-column label="平台" align="center" width="100">
          <template scope="{ row }">
            {{ row.platform === 1 ? 'Android' : 'iOS' }}
          </template>
        </el-table-column>
        <el-table-column label="App名" property="name" align="center" />
        <el-table-column label="下载地址" align="center" width="100">
          <template scope="{ row }">
            <el-button type="text" slot="append" v-clipboard:copy="row.downloadUrl" v-clipboard:success="onCopy">复制</el-button>
          </template>
        </el-table-column>
        <el-table-column label="Version" property="version" align="center" width="100" />
        <el-table-column v-if="queryForm.platform === 1" label="PackageName" property="packageName" align="center" />
        <el-table-column v-if="queryForm.platform === 1" label="LaunchActivity" property="launchActivity" align="center" />
        <el-table-column label="上传时间" align="center" width="200">
          <template scope="{ row }">
            {{ row.uploadorNickName + ' ' + row.uploadTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template scope="{ row }">
            <el-button v-if="queryForm.platform === 1 && (!row.packageName || !row.launchActivity || !row.version)" @click="aaptDumpBadging(row)" title="获取Version PackageName LaunchActivity" :loading="aaptDumpBadgingBtnLoading">aapt dump</el-button>
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
      platforms: [
        {
          type: 1,
          name: 'Android'
        },
        {
          type: 2,
          name: 'iOS'
        }
      ],
      appList: [],
      total: 0,
      queryForm: {
        projectId: this.$store.state.project.id,
        pageNum: 1,
        pageSize: 10,
        platform: 1
      }
    }
  },
  created() {
    this.fetchAppList()
  },
  methods: {
    updateApp(app) {
      this.$router.push({
        name: 'UpdateApp',
        params: app
      })
    },
    deleteApp(app) {
      this.$confirm('删除该app？', '提示', {
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
    onCopy(e) {
      this.$notify.success(e.text + '复制成功')
    },
    onQueryBtnClick() {
      this.queryForm.pageNum = 1
      this.fetchAppList()
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
