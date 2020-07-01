<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-select v-model="queryForm.testPlanId" filterable clearable placeholder="测试计划">
        <el-option v-for="testPlan in testPlanList" :key="testPlan.id" :label="testPlan.name" :value="testPlan.id" />
      </el-select>
      <el-select v-model="queryForm.status" clearable placeholder="状态">
        <el-option label="未完成" :value="0" />
        <el-option label="已完成" :value="1" />
      </el-select>
      <el-button @click="onQueryBtnClick" type="primary" class="el-icon-search" />
    </div>
    <div>
      <el-table :data="testTaskList" border fit>
        <el-table-column label="提交时间" align="center" width="200" show-overflow-tooltip>
          <template scope="{ row }">
            {{ `${row.creatorNickName} ${row.commitTime}` }}
          </template>
        </el-table-column>
        <el-table-column label="完成时间" prop="finishTime" align="center" width="150" show-overflow-tooltip />
        <el-table-column label="测试计划" align="center" min-width="150" show-overflow-tooltip>
          <template scope="{ row }">
            {{ row.testPlan.name }}
          </template>
        </el-table-column>
        <el-table-column label="通过" align="center" width="100">
          <template scope="scope">
            {{ scope.row.status === 0 ? '-' : scope.row.passCaseCount }}
          </template>
        </el-table-column>
        <el-table-column label="失败" align="center" width="100">
          <template scope="scope">
            {{ scope.row.status === 0 ? '-' : scope.row.failCaseCount }}
          </template>
        </el-table-column>
        <el-table-column label="跳过" align="center" width="100">
          <template scope="scope">
            {{ scope.row.status === 0 ? '-' : scope.row.skipCaseCount }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template scope="scope">
            {{ scope.row.status === 0 ? '未完成' : '已完成' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template scope="{ row }">
            <el-button type="primary" @click="onDeviceTestTaskBtnClick(row)">查看进度</el-button>
            <!--未完成disable-->
            <el-button type="success" @click="goToReportPage(row)" :disabled="row.status !== 1">查看报告</el-button>
            <el-button type="danger" class="el-icon-delete" @click="deleteTestTask(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchTestTaskList" />
    </div>
    <!--执行进度-->
    <el-drawer
      :with-header="false"
      :visible.sync="showDrawer"
      direction="rtl"
      size="95%">
      <el-drawer
        size="60%"
        :with-header="false"
        :append-to-body="true"
        :visible.sync="innerDrawer">
        <codemirror v-model="codemirrorContent" :options="cmOptions" />
      </el-drawer>
      <div style="padding: 5px">
        <el-button @click="fetchDeviceTestTask(testTaskIdInDrawer)" size="mini" style="margin-bottom: 5px">刷新</el-button>
        <el-table :data="deviceTestTaskList" border>
          <el-table-column label="操作" width="80" align="center">
            <template scope="{ row }">
              <!-- status:1 执行中 -->
              <el-button type="danger" size="mini" class="el-icon-delete" :disabled="row.status === 1" @click="deleteDeviceTestTask(row)" />
            </template>
          </el-table-column>
          <el-table-column label="执行进度" align="center" width="150">
            <template scope="{ row }">
              <el-progress v-if="row.status != -1" type="circle" :percentage="deviceExecutePercent(row)"></el-progress>
              <el-button v-else @click="showCodemirror(row.errMsg)" type="text">error</el-button>
            </template>
          </el-table-column>
          <el-table-column label="deviceId" align="center" prop="deviceId" width="100" show-overflow-tooltip />
          <el-table-column label="code" align="center" width="60">
            <template scope="{ row }">
              <el-button type="text" @click="showCodemirror(row.code)" v-if="row.code">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" align="center" prop="startTime" width="150" show-overflow-tooltip sortable />
          <el-table-column label="结束时间" align="center" prop="endTime" width="150" show-overflow-tooltip sortable />
          <el-table-column label="测试用例" align="center">
            <template scope="{ row }">
              <el-table :data="row.testcases" border max-height="400px">
                <el-table-column label="用例名" align="center" prop="name" width="150" show-overflow-tooltip />
                <el-table-column label="执行状态" align="center" width="120" prop="status" sortable>
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
                    <el-table :data="row.steps" border max-height="150px">
                      <el-table-column label="#" prop="number" align="center" width="50" />
                      <el-table-column label="步骤名" prop="name" align="center" show-overflow-tooltip />
                      <el-table-column label="开始时间" prop="startTime" align="center" width="150" show-overflow-tooltip />
                      <el-table-column label="结束时间" prop="endTime" align="center" width="150" show-overflow-tooltip />
                      <el-table-column label="耗时" align="center" width="100" show-overflow-tooltip>
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
import { getTestPlanList } from '@/api/testPlan'
import Pagination from '@/components/Pagination'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      showDrawer: false,
      innerDrawer: false,
      testTaskList: [],
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        projectId: this.$store.state.project.id, // 这里不能用computed里的projectId，会拿到undefined
        status: undefined,
        testPlanId: undefined
      },
      total: 0,
      testTaskIdInDrawer: undefined,
      testPlanList: [],
      deviceTestTaskList: [],
      codemirrorContent: '',
      cmOptions: {
        mode: 'text/x-java',
        theme: 'base16-dark',
        lineNumbers: true,
        readOnly: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers']
      }
    }
  },
  computed: {
    deviceExecutePercent() {
      return function(row) {
        const testcaseCount = row.testcases.length
        const finishedTestcaseCount = row.testcases.filter(testcase => testcase.status !== undefined && testcase.status !== null).length // 有status == 执行完成
        return parseInt(finishedTestcaseCount / testcaseCount * 100)
      }
    }
  },
  methods: {
    onQueryBtnClick() {
      this.queryForm.pageNum = 1
      this.fetchTestTaskList()
    },
    showCodemirror(content) {
      this.codemirrorContent = content
      this.innerDrawer = true
    },
    goToReportPage(testTask) {
      this.$router.push({ name: 'TestTaskReport', params: { testTaskId: testTask.id }})
    },
    fetchTestPlanList() {
      getTestPlanList({ projectId: this.queryForm.projectId }).then(response => {
        this.testPlanList = response.data
      })
    },
    fetchDeviceTestTask(testTaskId) {
      getDeviceTestTaskList({ testTaskId: testTaskId }).then(response => {
        this.deviceTestTaskList = response.data
      })
    },
    fetchTestTaskList() {
      getTestTaskList(this.queryForm).then(response => {
        this.testTaskList = response.data.data
        this.total = response.data.total
      })
    },
    deleteTestTask(testTask) {
      this.$confirm(`删除测试任务id: ${testTask.id}`, '提示', {
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
      this.$confirm(`删除${deviceTestTask.deviceId}测试任务`, '提示', {
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
      this.testTaskIdInDrawer = testTask.id
      this.fetchDeviceTestTask(this.testTaskIdInDrawer)
    }
  },
  created() {
    this.fetchTestPlanList()
    this.fetchTestTaskList()
  }
}
</script>

<style>
  .CodeMirror {
    height: auto;
  }
  .el-drawer__body {
    height: 100%;
    overflow: auto;
  }
</style>
