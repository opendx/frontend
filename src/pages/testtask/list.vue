<template>
  <div class="app-container">
    <div style="margin-top: 10px">
      <el-table :data="testTaskList" border>
        <el-table-column label="提交时间" align="center" width="200">
          <template scope="{ row }">
            {{ row.creatorNickName + ' ' + row.commitTime }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" prop="finishTime" align="center"></el-table-column>
        <el-table-column label="测试任务" prop="name" align="center"></el-table-column>
        <el-table-column label="任务描述" prop="description" align="center"></el-table-column>
        <el-table-column label="测试计划" prop="testPlanName" align="center"></el-table-column>
        <el-table-column label="用例分发策略" align="center">
          <template scope="scope">
            {{ scope.row.runMode === 1 ? '兼容模式' : '高效模式' }}
          </template>
        </el-table-column>
        <el-table-column label="通过用例数" align="center">
          <template scope="scope">
            {{ scope.row.status === 0 ? '-' : scope.row.passCaseCount }}
          </template>
        </el-table-column>
        <el-table-column label="失败用例数" align="center">
          <template scope="scope">
            {{ scope.row.status === 0 ? '-' : scope.row.failCaseCount }}
          </template>
        </el-table-column>
        <el-table-column label="跳过用例数" align="center">
          <template scope="scope">
            {{ scope.row.status === 0 ? '-' : scope.row.skipCaseCount }}
          </template>
        </el-table-column>
        <el-table-column label="执行状态" align="center">
          <template scope="scope">
            <el-tag :type="scope.row.status === 0 ? 'danger' : 'success'">{{ scope.row.status === 0 ? '未完成' : '已完成' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="测试报告" align="center">
          <template scope="scope">
            <!--测试完成才显示-->
            <div v-if="scope.row.status === 1"><el-button type="success" size="mini" @click="goToReportPage(scope.row)">查看</el-button></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryTestTaskListForm.pageNum" :limit.sync="queryTestTaskListForm.pageSize" @pagination="fetchTestTaskList" />
    </div>
  </div>
</template>

<script>
import { getTestTaskList } from '@/api/testTask'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      testTaskList: [],
      queryTestTaskListForm: {
        pageNum: 1,
        pageSize: 10,
        projectId: this.$store.state.project.id // 这里不能用computed里的projectId，会拿到undefined
      },
      total: 0
    }
  },
  methods: {
    goToReportPage(row) {
      this.$router.push('/testTask/report/' + row.id)
    },
    fetchTestTaskList() {
      getTestTaskList(this.queryTestTaskListForm).then(response => {
        this.testTaskList = response.data.data
        this.total = response.data.total
      })
    }
  },
  created() {
    this.fetchTestTaskList()
  }
}
</script>
