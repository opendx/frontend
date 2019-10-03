<template>
  <el-dialog :title="title" :visible="true" :show-close="false" width="1400px">
    <el-row>
      <el-col :span="12">
        <el-form label-width="120px">
          <el-form-item label="测试计划">
            {{ testPlan.name }}
          </el-form-item>
          <el-form-item label="描述">
            {{ testPlan.description }}
          </el-form-item>
          <el-form-item label="BeforeClass">
            <el-select v-model="testPlan.beforeClass" clearable :disabled="true" placeholder="">
              <el-option v-for="action in selectableActions" :label="action.name" :value="action.id" :key="action.id" />
            </el-select>
            <span style="margin-left: 10px;font-size: 10px;color: #8c939d">所有测试用例执行前执行的操作</span>
          </el-form-item>
          <el-form-item label="BeforeMethod">
            <el-select v-model="testPlan.beforeMethod" clearable :disabled="true" placeholder="">
              <el-option v-for="action in selectableActions" :label="action.name" :value="action.id" :key="action.id" />
            </el-select>
            <span style="margin-left: 10px;font-size: 10px;color: #8c939d">每条测试用例执行前执行的操作</span>
          </el-form-item>
          <el-form-item label="AfterMethod">
            <el-select v-model="testPlan.afterMethod" clearable :disabled="true" placeholder="">
              <el-option v-for="action in selectableActions" :label="action.name" :value="action.id" :key="action.id" />
            </el-select>
            <span style="margin-left: 10px;font-size: 10px;color: #8c939d">每条测试用例执行后执行的操作</span>
          </el-form-item>
          <el-form-item label="AfterClass">
            <el-select v-model="testPlan.afterClass" clearable :disabled="true" placeholder="">
              <el-option v-for="action in selectableActions" :label="action.name" :value="action.id" :key="action.id" />
            </el-select>
            <span style="margin-left: 10px;font-size: 10px;color: #8c939d">所有测试用例执行后执行的操作</span>
          </el-form-item>
          <el-form-item label="测试集">
            <el-tree :data="testSuitesTreeData" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form label-width="120px">
          <el-form-item label="测试任务名" :rules="[{required: true}]">
            <el-input v-model="commitTestTaskForm.name" style="width: 80%" clearable></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="commitTestTaskForm.description" style="width: 80%" clearable></el-input>
          </el-form-item>
          <el-form-item label="设备" :rules="[{required: true}]">
            <el-select v-model="commitTestTaskForm.deviceIds" clearable filterable multiple>
              <el-option v-for="device in onlineDevices" :label="device.id" :value="device.id" :key="device.id">
                <span style="float: left;margin-right: 10px">{{ device.id }}</span>
                <span style="float: left;margin-right: 10px">{{ device.name }}</span>
                <span style="float: left">{{ device.systemVersion }}</span>
              </el-option>
            </el-select>
            <span style="margin-left: 10px;font-size: 10px;color: #8c939d">使用中的设备不会立即执行测试任务</span>
          </el-form-item>
          <el-form-item label="用例分发策略" :rules="[{required: true}]">
            <el-radio v-model="commitTestTaskForm.runMode" label="1">
              兼容模式
              <el-popover placement="top-start" trigger="hover" content="所有设备并行执行同一份用例">
                <i class="el-icon-question" slot="reference" />
              </el-popover>
            </el-radio>
            <el-radio v-model="commitTestTaskForm.runMode" label="2">
              高效模式
              <el-popover placement="top-start" trigger="hover" content="用例平均分配给所有设备并行执行">
                <i class="el-icon-question" slot="reference" />
              </el-popover>
            </el-radio>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="commitTestTask">提 交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getOnlineDevices } from '@/api/device'
import { getTestPlanList } from '@/api/testPlan'
import { getSelectableActions, getActionList } from '@/api/action'
import { getTestSuiteList } from '@/api/testSuite'
import { commitTestTask } from '@/api/testTask'

export default {
  data() {
    return {
      title: '提交测试',
      commitTestTaskForm: {
        projectId: this.$store.state.project.id,
        testPlanId: this.$route.params.testPlanId,
        name: '',
        description: '',
        runMode: '1',
        deviceIds: []
      },
      onlineDevices: [],
      testPlan: {},
      selectableActions: [],
      testSuitesTreeData: []
    }
  },
  methods: {
    cancel() {
      this.$router.back()
    },
    commitTestTask() {
      this.commitTestTaskForm.testPlanName = this.testPlan.name
      commitTestTask(this.commitTestTaskForm).then(response => {
        this.$notify.success(response.msg)
        this.$router.push('/testTask/list')
      })
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.id
    },
    platform() {
      return this.$store.state.project.platform
    }
  },
  created() {
    getOnlineDevices(this.platform).then(response => {
      this.onlineDevices = response.data
    })
    getSelectableActions(this.projectId, this.platform).then(response => {
      this.selectableActions = response.data
    })
    getTestPlanList({
      id: this.$route.params.testPlanId
    }).then(response => {
      this.testPlan = response.data[0]
      const testSuiteIds = this.testPlan.testSuites
      testSuiteIds.forEach(suiteId => {
        getTestSuiteList({ id: suiteId }).then(response => {
          const suiteName = response.data[0].name
          getActionList({ testSuiteId: suiteId }).then(response => {
            const actions = response.data
            if (actions) {
              actions.forEach(action => {
                action.label = action.name + ' | ' + action.createTime + '(' + action.creatorNickName + ')'
              })
            }
            this.testSuitesTreeData.push({ label: suiteName, children: actions })
          })
        })
      })
    })
  }
}
</script>
