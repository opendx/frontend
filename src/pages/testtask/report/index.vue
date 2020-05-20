<template>
  <div style="padding: 20px;font-size: 30px">
    <el-card>
      <span slot="header" style="font-weight: 900">
        概况
      </span>
      <el-table :data="testTaskSummary" border>
        <el-table-column label="平台" align="center">
          <template scope="{ row }">
            {{ platforms.filter(p => p.type === row.platform)[0].name }}
          </template>
        </el-table-column>
        <el-table-column label="项目" prop="projectName" align="center" min-width="100" show-overflow-tooltip />
        <el-table-column label="环境" prop="environmentName" align="center" min-width="100" show-overflow-tooltip />
        <el-table-column label="测试计划" align="center" min-width="100" show-overflow-tooltip>
          <template scope="{ row }">
            {{ row.testPlan.name }}
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
      <el-divider />
      <el-table :data="deviceTestTaskSummary" border>
        <el-table-column v-if="isWeb" prop="platform" label="操作系统" align="center" show-overflow-tooltip sortable>
          <template scope="{ row }">
            {{ row.platform === 1 ? 'windows' : row.platform === 2 ? 'linux' : 'macos'}}
          </template>
        </el-table-column>
        <el-table-column label="deviceId" prop="deviceId" align="center" show-overflow-tooltip />
        <el-table-column v-if="isWeb" label="类型" prop="type" align="center" show-overflow-tooltip sortable />
        <el-table-column v-if="isWeb" label="版本号" prop="version" align="center" show-overflow-tooltip sortable />
        <el-table-column v-if="!isWeb" label="name" prop="name" align="center" show-overflow-tooltip sortable />
        <el-table-column v-if="!isWeb" label="系统版本" prop="systemVersion" align="center" show-overflow-tooltip sortable />
        <el-table-column label="开始时间" prop="startTime" align="center" show-overflow-tooltip sortable />
        <el-table-column label="结束时间" prop="endTime" align="center" show-overflow-tooltip sortable />
        <el-table-column label="执行用例数" prop="testcaseTotal" align="center" show-overflow-tooltip sortable />
        <el-table-column label="通过" prop="passTestcaseCount" align="center" show-overflow-tooltip sortable />
        <el-table-column label="失败" prop="failTestcaseCount" align="center" show-overflow-tooltip sortable />
        <el-table-column label="跳过" prop="skipTestcaseCount" align="center" show-overflow-tooltip sortable />
      </el-table>
    </el-card>

    <el-card style="margin-top: 10px">
      <span slot="header" style="font-weight: 900">详细信息</span>
      <el-tabs>
        <el-tab-pane v-for="deviceTestTask in deviceTestTaskList" :key="deviceTestTask.id">
          <span slot="label">
            {{ deviceTestTask.deviceId }}
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
import { platforms } from '@/utils/project'
import _ from 'lodash'

export default {
  name: 'TestTaskReport',
  components: {
    TestCase
  },
  computed: {
    isWeb() {
      return this.$store.state.project.platform === 3
    }
  },
  data() {
    return {
      platforms: platforms,
      testTaskId: this.$route.params.testTaskId,
      deviceTestTaskList: [],
      testTaskSummary: [],
      deviceTestTaskSummary: []
    }
  },
  created() {
    getDeviceTestTaskList({ testTaskId: this.testTaskId }).then(response => {
      const deviceTestTasks = response.data
      deviceTestTasks.forEach(deviceTestTask => {
        deviceTestTask.testcases.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      })
      this.deviceTestTaskList = deviceTestTasks
      this.deviceTestTaskSummary = deviceTestTasks.map(deviceTestTask => {
        const statusMap = _.groupBy(deviceTestTask.testcases, 'status')
        const summaryItem = {
          deviceId: deviceTestTask.deviceId,
          startTime: deviceTestTask.startTime,
          endTime: deviceTestTask.endTime,
          testcaseTotal: deviceTestTask.testcases.length,
          passTestcaseCount: statusMap[1] ? statusMap[1].length : 0,
          failTestcaseCount: statusMap[0] ? statusMap[0].length : 0,
          skipTestcaseCount: statusMap[2] ? statusMap[2].length : 0
        }
        if (this.isWeb) {
          summaryItem.type = deviceTestTask.device.type
          summaryItem.version = deviceTestTask.device.version
          summaryItem.platform = deviceTestTask.device.platform
        } else {
          summaryItem.name = deviceTestTask.device.name
          summaryItem.systemVersion = deviceTestTask.device.systemVersion
        }
        return summaryItem
      })
    })
    getTestTaskSummary(this.testTaskId).then(response => {
      this.testTaskSummary.push(response.data)
    })
  }
}
</script>
