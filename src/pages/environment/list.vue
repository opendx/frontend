<template>
  <div class="app-container">
    <el-button @click="$router.push({ name: 'AddEnvironment' })">添加环境</el-button>
    <!-- 列表 -->
    <div style="margin-top: 10px">
      <el-table :data="environmentList" highlight-current-row border>
        <el-table-column label="环境名" align="center" prop="name" show-overflow-tooltip />
        <el-table-column label="描述" align="center" prop="description" show-overflow-tooltip />
        <el-table-column label="创建时间" align="center" width="200" show-overflow-tooltip>
          <template scope="{ row }">
            {{ row.creatorNickName + ' ' + row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template scope="{ row }">
            <el-button type="primary" class="el-icon-edit" @click="updateEnvironment(row)" />
            <el-button type="danger" class="el-icon-delete" @click="deleteEnvironment(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchEnvironmentList" />
    </div>
  </div>
</template>

<script>

import { getEnvironmentList, deleteEnvironment } from '@/api/environment'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      environmentList: [],
      total: 0,
      queryForm: {
        projectId: this.$store.state.project.id,
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.fetchEnvironmentList()
  },
  methods: {
    updateEnvironment(environment) {
      this.$router.push({ name: 'UpdateEnvironment', params: { environmentId: environment.id }})
    },
    deleteEnvironment(environment) {
      this.$confirm('删除' + environment.name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteEnvironment(environment.id).then(resp => {
          this.$notify.success(resp.msg)
          this.fetchEnvironmentList()
        })
      })
    },
    fetchEnvironmentList() {
      getEnvironmentList(this.queryForm).then(resp => {
        this.environmentList = resp.data.data
        this.total = resp.data.total
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
