<template>
  <div class="app-container">
    <div>
      <el-button @click="$router.push({ name: 'AddTestSuite' })">添加测试集</el-button>
    </div>
    <!-- 列表 -->
    <div style="margin-top: 10px">
      <el-table :data="testSuiteList" highlight-current-row border>
        <el-table-column label="测试集名" align="center" prop="name" show-overflow-tooltip />
        <el-table-column label="描述" align="center" prop="description" show-overflow-tooltip />
        <el-table-column label="创建时间" align="center" width="200" show-overflow-tooltip>
          <template scope="{ row }">
            {{ row.creatorNickName + ' ' + row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template scope="{ row }">
            <el-button type="success" @click="copyTestSuite(row)">复制</el-button>
            <el-button type="primary" class="el-icon-edit" @click="updateTestSuite(row)" />
            <el-button type="danger" class="el-icon-delete" @click="deleteTestSuite(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchTestSuiteList" />
    </div>
  </div>
</template>

<script>
import { getTestSuiteList, deleteTestSuite } from '@/api/testSuite'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      testSuiteList: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.fetchTestSuiteList()
  },
  methods: {
    updateTestSuite(testSuite) {
      this.$router.push({ name: 'UpdateTestSuite', params: { testSuiteId: testSuite.id }})
    },
    deleteTestSuite(testSuite) {
      this.$confirm('删除' + testSuite.name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTestSuite(testSuite.id).then(resp => {
          this.$notify.success(resp.msg)
          this.fetchTestSuiteList()
        })
      })
    },
    fetchTestSuiteList() {
      getTestSuiteList(this.queryForm).then(resp => {
        this.testSuiteList = resp.data.data
        this.total = resp.data.total
      })
    },
    copyTestSuite(testSuite) {
      const _testSuite = JSON.parse(JSON.stringify(testSuite))
      delete _testSuite.id
      delete _testSuite.createTime
      delete _testSuite.creatorUid
      delete _testSuite.creatorNickName
      this.$router.push({
        name: 'AddTestSuite',
        params: _testSuite
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
