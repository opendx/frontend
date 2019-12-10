<template>
  <div style="padding: 20px;font-size: 30px">
    <el-card>
      <span slot="header" style="font-weight: 900">
        概况
      </span>
      <el-table :data="testTaskSummary" border>
        <el-table-column label="类型" align="center" width="50">
          <template scope="{ row }">
            <svg-icon v-if="row.platform === 1" icon-class="android" />
            <svg-icon v-else-if="row.platform === 2" icon-class="ios" />
            <svg-icon v-else icon-class="web"/>
          </template>
        </el-table-column>
        <el-table-column label="项目" prop="projectName" align="center" min-width="100" show-overflow-tooltip />
        <el-table-column label="环境" prop="environmentName" align="center" min-width="100" show-overflow-tooltip />
        <el-table-column label="测试计划" align="center" min-width="100" show-overflow-tooltip>
          <template scope="{ row }">
            {{ row.testPlan.name }}
          </template>
        </el-table-column>
        <el-table-column label="录制视频" align="center" width="80">
          <template scope="{ row }">
            {{ row.testPlan.enableRecordVideo === 1 ? '开启' : '关闭' }}
          </template>
        </el-table-column>
        <el-table-column label="失败重试次数" align="center" width="100">
          <template scope="{ row }">
            {{ row.testPlan.failRetryCount }}
          </template>
        </el-table-column>
        <el-table-column label="提交人" prop="commitorNickName" align="center" min-width="100" show-overflow-tooltip />
        <el-table-column label="提交时间" prop="commitTime" align="center" width="150" show-overflow-tooltip />
        <el-table-column label="完成时间" prop="finishTime" align="center" width="150" show-overflow-tooltip />
        <el-table-column label="通过" prop="passCaseCount" align="center" width="100" show-overflow-tooltip />
        <el-table-column label="失败" prop="failCaseCount" align="center" width="100" show-overflow-tooltip />
        <el-table-column label="跳过" prop="skipCaseCount" align="center" width="100" show-overflow-tooltip />
        <el-table-column label="通过率" prop="passPercent" align="center" width="100" show-overflow-tooltip/>
      </el-table>
    </el-card>

    <el-card style="margin-top: 10px">
      <span slot="header" style="font-weight: 900">详细信息</span>
      <el-tabs>
        <el-tab-pane v-for="deviceTestTask in deviceTestTaskList" :key="deviceTestTask.id">
          <span slot="label">
            <i class="el-icon-mobile-phone" /> {{ deviceTestTask.deviceId }}
          </span>
          <test-case :data="deviceTestTask.testcases" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getDeviceTestTaskList } from '@/api/deviceTestTask'
import { getTestTaskSummary } from '@/api/testTask'
import TestCase from './components/TestCase'

export default {
  name: 'ReportTestTask',
  components: {
    TestCase
  },
  data() {
    return {
      testTaskId: this.$route.params.testTaskId,
      deviceTestTaskList: [],
      testTaskSummary: []
    }
  },
  created() {
    getDeviceTestTaskList({ testTaskId: this.testTaskId }).then(response => {
      this.deviceTestTaskList = response.data
    })
    getTestTaskSummary(this.testTaskId).then(response => {
      this.testTaskSummary.push(response.data)
    })
  }
}
</script>
