<template>
  <div style="padding: 20px;font-size: 30px">
    <el-card>
      <span slot="header" style="font-weight: 900">
        概况
      </span>
      <el-table :data="testTaskSummary" border>
        <el-table-column label="项目类型" align="center">
          <template scope="{ row }">
            <svg-icon v-if="row.platform === 1" icon-class="android" />
            <svg-icon v-else-if="row.platform === 2" icon-class="ios" />
            <svg-icon v-else icon-class="web"/>
          </template>
        </el-table-column>
        <el-table-column label="项目" prop="projectName" align="center" />
        <el-table-column label="测试任务" prop="name" align="center" />
        <el-table-column label="任务提交人" prop="commitorNickName" align="center" />
        <el-table-column label="提交时间" prop="commitTime" align="center" />
        <el-table-column label="完成时间" prop="finishTime" align="center" />
        <el-table-column label="通过用例数" prop="passCaseCount" align="center" />
        <el-table-column label="失败用例数" prop="failCaseCount" align="center" />
        <el-table-column label="跳过用例数" prop="skipCaseCount" align="center" />
        <el-table-column label="通过率" prop="passPercent" align="center" />
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
