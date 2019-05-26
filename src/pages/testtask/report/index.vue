<template>
  <div style="padding: 20px;font-size: 30px">
    <el-card>
      <span slot="header" style="font-weight: 900">
        概况
      </span>
      <el-table :data="tableData" border>
        <el-table-column label="项目类型" align="center">
          <template scope="scope">
            <svg-icon v-if="scope.row.projectType === 1" icon-class="android"/>
            <svg-icon v-else-if="scope.row.projectType === 2" icon-class="ios"/>
            <svg-icon v-else icon-class="web"/>
          </template>
        </el-table-column>
        <el-table-column label="项目" prop="projectName" align="center"/>
        <el-table-column label="测试任务" prop="testTaskName" align="center"/>
        <el-table-column label="任务提交人" prop="creatorName" align="center"/>
        <el-table-column label="开始时间" prop="startTime" align="center"/>
        <el-table-column label="结束时间" prop="endTime" align="center"/>
        <el-table-column label="通过用例数" prop="passCount" align="center"/>
        <el-table-column label="失败用例数" prop="failCount" align="center"/>
        <el-table-column label="跳过用例数" prop="skipCount" align="center"/>
        <el-table-column label="通过率" prop="passPercent" align="center"/>
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
import TestCase from './TestCase'

export default {
  components: {
    TestCase
  },
  data() {
    return {
      testTaskId: this.$route.params.testTaskId,
      deviceTestTaskList: [],
      tableData: []
    }
  },
  created() {
//      getReportData(this.testTaskId).then(resp=>{
//        this.reportData = resp.data
//        this.tableData.push({
//          projectName: this.reportData.projectName,
//          projectType: this.reportData.projectType,
//          testTaskName: this.reportData.testTaskName,
//          creatorName: this.reportData.creatorName,
//          startTime: this.reportData.startTime,
//          endTime: this.reportData.endTime,
//          passCount: this.reportData.passCount,
//          failCount:this.reportData.failCount,
//          skipCount: this.reportData.skipCount,
//          passPercent: (Math.round(this.reportData.passCount / (this.reportData.passCount+this.reportData.failCount+this.reportData.skipCount) * 10000) / 100.00 + "%")
//        })
//      })
    getDeviceTestTaskList({ testTaskId: this.testTaskId }).then(response => {
      this.deviceTestTaskList = response.data
    })
  }
}
</script>
