<template>
  <div class="app-container">
    <!--testSuite-->
    <div>
      <el-tabs type="card" @tab-click="onTabClick" addable @tab-add="addTestSuite">
        <el-tab-pane v-for="testSuite in testSuiteList" :key="testSuite.id" :label="testSuite.name" />
      </el-tabs>
    </div>
    <!--action列表-->
    <div>
      <el-table :data="actionList" highlight-current-row border>
        <el-table-column label="测试用例" align="center" prop="name" />
        <el-table-column label="描述" align="center" prop="description" />
        <el-table-column label="创建时间" align="center">
          <template scope="{ row }">
            {{ row.creatorNickName + ' ' + row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template scope="{ row }">
            {{ (row.updatorNickName ? row.updatorNickName : '') + ' ' + (row.updateTime ? row.updateTime : '') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template scope="{ row }">
            <el-button type="primary" class="el-icon-edit" @click="updateAction(row.id)" />
            <el-button type="danger" class="el-icon-delete" @click="deleteAction(row.id)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryActionListForm.pageNum" :limit.sync="queryActionListForm.pageSize" @pagination="fetchActionList" />
    </div>
  </div>
</template>

<script>

import { getActionList, deleteAction } from '@/api/action'
import Pagination from '@/components/Pagination'
import { getTestSuiteList } from '@/api/testSuite';

export default {
  components: {
    Pagination
  },
  data() {
    return {
      testSuiteList: [{
        name: '全部',
        id: undefined
      }],
      actionList: [],
      total: 0,
      queryActionListForm: {
        pageNum: 1,
        pageSize: 10,
        type: 3,
        projectId: this.$store.state.project.id,
        testSuiteId: undefined
      }
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.id
    }
  },
  created() {
    this.fetchTestSuiteList()
    this.fetchActionList()
  },
  methods: {
    addTestSuite() {
      this.$router.push({ path: '/testSuite/add' })
    },
    async fetchActionList() {
      const { data } = await getActionList(this.queryActionListForm)
      this.actionList = data.data
      this.total = data.total
    },
    async fetchTestSuiteList() {
      const { data } = await getTestSuiteList({ projectId: this.projectId })
      this.testSuiteList = this.testSuiteList.concat(data)
    },
    onTabClick(tab) {
      const activedTestSuite = this.testSuiteList.filter(testSuite => testSuite.name === tab.label)[0]
      this.queryActionListForm.testSuiteId = activedTestSuite.id
      this.fetchActionList()
    },
    deleteAction(id) {
      this.$confirm('删除该Action？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAction(id).then(response => {
          this.$notify.success(response.msg)
          this.fetchActionList()
        })
      })
    },
    updateAction(id) {
      this.$router.push('/action/testcase/update/' + id)
    }
  }
}
</script>
