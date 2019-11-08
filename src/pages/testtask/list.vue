<template>
  <div class="app-container">
    <div>
      <el-button @click="fetchTestTaskList" style="margin-bottom: 10px">刷新</el-button>
      <el-table :data="testTaskList" border fit>
        <el-table-column label="提交时间" align="center" width="200">
          <template scope="{ row }">
            {{ row.creatorNickName + ' ' + row.commitTime }}
          </template>
        </el-table-column>
        <el-table-column label="完成时间" prop="finishTime" align="center"></el-table-column>
        <el-table-column label="测试计划" prop="testPlanName" align="center"></el-table-column>
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
        <el-table-column label="状态" align="center">
          <template scope="scope">
            {{ scope.row.status === 0 ? '未完成' : '已完成' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350" align="center">
          <template scope="{ row }">
            <el-button type="primary" @click="onDeviceTestTaskBtnClick(row)">查看进度</el-button>
            <!--未完成disable-->
            <el-button type="success" @click="goToReportPage(row)" :disabled="row.status !== 1">查看报告</el-button>
            <!--已完成的不让删-->
            <el-button type="danger" class="el-icon-delete" :disabled="row.status === 1" @click="deleteTestTask(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryTestTaskListForm.pageNum" :limit.sync="queryTestTaskListForm.pageSize" @pagination="fetchTestTaskList" />
    </div>
    <!--设备测试任务-->
    <el-drawer
      :title="drawerTitle"
      :visible.sync="showDrawer"
      direction="rtl"
      size="95%">
      <div style="padding: 5px">
        <el-button @click="fetchDeviceTestTask(testTaskIdInDrawer)" size="mini" style="margin-bottom: 5px">刷新</el-button>
        <el-table :data="deviceTestTaskList" border max-height="800px">
          <el-table-column label="操作" width="80" align="center">
            <template scope="{ row }">
              <!-- status:0 未运行，只有未运行的设备测试任务才能删 -->
              <el-button type="danger" size="mini" class="el-icon-delete" :disabled="row.status !== 0" @click="deleteDeviceTestTask(row)" />
            </template>
          </el-table-column>
          <el-table-column label="执行进度" align="center" width="150">
            <template scope="{ row }">
              <el-progress type="circle" :percentage="deviceExecutePercent(row)"></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="设备id" align="center" prop="deviceId" width="100" show-overflow-tooltip />
          <el-table-column label="开始时间" align="center" prop="startTime" width="100" />
          <el-table-column label="结束时间" align="center" prop="endTime" width="100" />
          <el-table-column label="测试用例" align="center">
            <template scope="{ row }">
              <el-table :data="row.testcases" border max-height="400px">
                <el-table-column label="用例名" align="center" prop="name" width="150" show-overflow-tooltip />
                <el-table-column label="执行状态" align="center" width="100">
                  <template scope="{ row }">
                    <div v-if="row.status === 0">
                      <el-tag type="danger">失败</el-tag>
                    </div>
                    <div v-else-if="row.status === 1">
                      <el-tag type="success">成功</el-tag>
                    </div>
                    <div v-else-if="row.status === 2">
                      <el-tag type="warning">跳过</el-tag>
                    </div>
                    <div v-else>
                      -
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="步骤" align="center">
                  <template scope="{ row }">
                    <el-table :data="row.steps" border>
                      <el-table-column label="#" prop="number" align="center" width="50" />
                      <el-table-column label="步骤名" prop="name" align="center" show-overflow-tooltip />
                      <el-table-column label="开始时间" prop="startTime" align="center" />
                      <el-table-column label="结束时间" prop="endTime" align="center" />
                      <el-table-column label="耗时" align="center" width="100">
                        <template scope="{ row }">
                          {{ row.endTime ? parseInt(new Date(row.endTime) - new Date(row.startTime)) / 1000 + '秒' : '-' }}
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getTestTaskList, deleteTestTask } from '@/api/testTask'
import { getDeviceTestTaskList, deleteDeviceTestTask } from '@/api/deviceTestTask'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      showDrawer: false,
      testTaskList: [],
      queryTestTaskListForm: {
        pageNum: 1,
        pageSize: 10,
        projectId: this.$store.state.project.id // 这里不能用computed里的projectId，会拿到undefined
      },
      total: 0,
      drawerTitle: '',
      testTaskIdInDrawer: undefined,
      deviceTestTaskList: []
    }
  },
  computed: {
    deviceExecutePercent() {
      return function(row) {
        const testcaseCount = row.testcases.length
        const finishedTestcaseCount = row.testcases.filter(testcase => testcase.status).length // 有status == 执行完成
        return parseInt(finishedTestcaseCount / testcaseCount * 100)
      }
    }
  },
  methods: {
    goToReportPage(row) {
      this.$router.push('/testTask/report/' + row.id)
    },
    fetchDeviceTestTask(testTaskId) {
      getDeviceTestTaskList({ testTaskId: testTaskId }).then(response => {
        this.deviceTestTaskList = response.data
      })
    },
    fetchTestTaskList() {
      getTestTaskList(this.queryTestTaskListForm).then(response => {
        this.testTaskList = response.data.data
        this.total = response.data.total
      })
    },
    deleteTestTask(testTask) {
      this.$confirm('删除该测试任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTestTask(testTask.id).then(resp => {
          this.$notify.success(resp.msg)
          this.fetchTestTaskList()
        })
      })
    },
    deleteDeviceTestTask(deviceTestTask) {
      this.$confirm('删除该测试任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDeviceTestTask(deviceTestTask.id).then(resp => {
          this.$notify.success(resp.msg)
          this.fetchDeviceTestTask(deviceTestTask.testTaskId)
        })
      })
    },
    onDeviceTestTaskBtnClick(testTask) {
      this.showDrawer = true
      this.drawerTitle = testTask.name
      this.testTaskIdInDrawer = testTask.id
      this.fetchDeviceTestTask(this.testTaskIdInDrawer)
    }
  },
  created() {
    this.fetchTestTaskList()
  }
}
</script>
