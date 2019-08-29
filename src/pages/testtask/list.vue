<template>
  <div class="app-container">
    <div>
      <el-button @click="fetchTestTaskList" style="margin-bottom: 10px">刷新</el-button>
      <el-table :data="testTaskList" border>
        <el-table-column label="提交时间" align="center" width="200">
          <template scope="{ row }">
            {{ row.creatorNickName + ' ' + row.commitTime }}
          </template>
        </el-table-column>
        <el-table-column label="完成时间" prop="finishTime" align="center"></el-table-column>
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
            {{ scope.row.status === 0 ? '未完成' : '已完成' }}
            <el-button v-if="scope.row.status === 0" type="text" @click="lookProgress(scope.row)">查看执行进度</el-button>
          </template>
        </el-table-column>
        <el-table-column label="测试报告" align="center">
          <template scope="scope">
            <!--测试完成才显示-->
            <div v-if="scope.row.status === 1"><el-button type="text" @click="goToReportPage(scope.row)">查看</el-button></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryTestTaskListForm.pageNum" :limit.sync="queryTestTaskListForm.pageSize" @pagination="fetchTestTaskList" />
    </div>
    <!--进度弹窗-->
    <el-dialog
      :title="testTaskName"
      :visible.sync="showProgressDialog"
      width="50%">
      <div v-for="progress in progressData" :key="progress.deviceId">
        {{ progress.deviceId }}
        <el-progress :percentage="progress.finishedTestcasePercent" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTestTaskList, getTestTaskProgress } from '@/api/testTask'
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
      total: 0,
      showProgressDialog: false,
      progressData: [],
      testTaskName: ''
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
    },
    lookProgress(row) {
      this.showProgressDialog = true
      this.testTaskName = row.name
      getTestTaskProgress(row.id).then(response => {
        this.progressData = response.data
      })
    }
  },
  created() {
    this.fetchTestTaskList()
  }
}
</script>
