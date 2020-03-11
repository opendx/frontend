<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form label-width="120px">
        <el-form-item label="测试计划名" :rules="[{required: true}]">
          <el-input v-model.trim="saveTestPlanForm.name" clearable />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model.trim="saveTestPlanForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="BeforeClass">
          <el-cascader
            v-model="saveTestPlanForm.beforeClass"
            :props="{ value: 'id', label: 'name', children: 'children', emitPath: false }"
            :options="actions"
            filterable
            clearable
            @visible-change="actionSelectChange">
            <template slot-scope="{ node, data }">
              <span v-if="data.returnValue">{{ returnValue(data) }}</span>
              <el-divider v-if="data.returnValue" direction="vertical" />
              <span>{{ data.name }}</span>
            </template>
          </el-cascader>
          <span style="margin-left: 10px;font-size: 10px;color: #8c939d">所有测试用例执行前执行的操作</span>
        </el-form-item>
        <el-form-item label="BeforeMethod">
          <el-cascader
            v-model="saveTestPlanForm.beforeMethod"
            :props="{ value: 'id', label: 'name', children: 'children', emitPath: false }"
            :options="actions"
            filterable
            clearable
            @visible-change="actionSelectChange">
            <template slot-scope="{ node, data }">
              <span v-if="data.returnValue">{{ returnValue(data) }}</span>
              <el-divider v-if="data.returnValue" direction="vertical" />
              <span>{{ data.name }}</span>
            </template>
          </el-cascader>
          <span style="margin-left: 10px;font-size: 10px;color: #8c939d">每条测试用例执行前执行的操作</span>
        </el-form-item>
        <el-form-item label="AfterMethod">
          <el-cascader
            v-model="saveTestPlanForm.afterMethod"
            :props="{ value: 'id', label: 'name', children: 'children', emitPath: false }"
            :options="actions"
            filterable
            clearable
            @visible-change="actionSelectChange">
            <template slot-scope="{ node, data }">
              <span v-if="data.returnValue">{{ returnValue(data) }}</span>
              <el-divider v-if="data.returnValue" direction="vertical" />
              <span>{{ data.name }}</span>
            </template>
          </el-cascader>
          <span style="margin-left: 10px;font-size: 10px;color: #8c939d">每条测试用例执行后执行的操作</span>
        </el-form-item>
        <el-form-item label="AfterClass">
          <el-cascader
            v-model="saveTestPlanForm.afterClass"
            :props="{ value: 'id', label: 'name', children: 'children', emitPath: false }"
            :options="actions"
            filterable
            clearable
            @visible-change="actionSelectChange">
            <template slot-scope="{ node, data }">
              <span v-if="data.returnValue">{{ returnValue(data) }}</span>
              <el-divider v-if="data.returnValue" direction="vertical" />
              <span>{{ data.name }}</span>
            </template>
          </el-cascader>
          <span style="margin-left: 10px;font-size: 10px;color: #8c939d">所有测试用例执行后执行的操作</span>
        </el-form-item>
        <el-form-item label="测试集" :rules="[{required: true}]">
          <el-select v-model="saveTestPlanForm.testSuites" @visible-change="testSuiteSelectChange" multiple filterable clearable :rules="[{required: true}]" style="width: 100%">
            <el-option
              v-for="testSuite in testSuites"
              :label="testSuite.name"
              :value="testSuite.id"
              :key="testSuite.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="12">
      <el-form label-width="120px">
        <el-form-item label="环境" :rules="[{required: true}]">
          <el-select v-model="saveTestPlanForm.environmentId" @visible-change="envSelectChange">
            <el-option v-for="environment in environmentList" :key="environment.id" :value="environment.id" :label="environment.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备" :rules="[{required: true}]">
          <el-select v-model="saveTestPlanForm.deviceIds" @visible-change="deviceSelectChange" clearable filterable multiple style="width: 100%">
            <el-option v-for="device in onlineDevices" :label="device.id" :value="device.id" :key="device.id">
              <span>{{ device.id }}</span>
              <el-divider direction="vertical" />
              <span>{{ device.name }}</span>
              <el-divider direction="vertical" />
              <span>{{ device.systemVersion }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="定时任务" :rules="[{required: true}]">
          <el-switch v-model="saveTestPlanForm.enableSchedule" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="cron表达式">
          <el-input v-model="saveTestPlanForm.cronExpression" clearable />
        </el-form-item>
        <el-form-item label="是否录制视频" :rules="[{required: true}]">
          <el-switch v-model="saveTestPlanForm.enableRecordVideo" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="失败重试次数" :rules="[{required: true}]">
          <el-input v-model="saveTestPlanForm.failRetryCount" clearable />
        </el-form-item>
        <el-form-item label="用例分发策略" :rules="[{required: true}]">
          <el-radio v-model="saveTestPlanForm.runMode" :label="1">
            兼容模式
            <el-popover placement="top" trigger="hover" content="所有设备并行执行同一份用例">
              <i class="el-icon-question" slot="reference" />
            </el-popover>
          </el-radio>
          <el-radio v-model="saveTestPlanForm.runMode" :label="2">
            高效模式
            <el-popover placement="top" trigger="hover" content="用例平均分配给所有设备并行执行">
              <i class="el-icon-question" slot="reference" />
            </el-popover>
          </el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveTestPlan">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
import { getActionCascader } from '@/api/action'
import { getTestSuiteList } from '@/api/testSuite'
import { addTestPlan, updateTestPlan, getTestPlanList } from '@/api/testPlan'
import { getOnlineDevices } from '@/api/device'
import { getEnvironmentList } from '@/api/environment'

export default {
  props: {
    isAdd: Boolean
  },
  data() {
    return {
      saveTestPlanForm: {
        id: undefined,
        name: '',
        description: '',
        projectId: this.$store.state.project.id,
        environmentId: -1,
        beforeClass: null,
        beforeMethod: null,
        afterClass: null,
        afterMethod: null,
        testSuites: [],
        deviceIds: [],
        runMode: 1,
        cronExpression: undefined,
        enableSchedule: 0,
        enableRecordVideo: 1,
        failRetryCount: 0
      },
      actions: [],
      testSuites: [],
      onlineDevices: [],
      environmentList: [
        {
          id: -1,
          name: '默认'
        }
      ]
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.id
    },
    platform() {
      return this.$store.state.project.platform
    },
    returnValue() {
      return function(action) {
        if (action.returnValueDesc) {
          return action.returnValue + '(' + action.returnValueDesc + ')'
        } else {
          return action.returnValue
        }
      }
    }
  },
  methods: {
    saveTestPlanSuccess(msg) {
      this.$notify.success(msg)
      // 关闭当前tagview
      this.$store.dispatch('tagsView/delView', this.$store.state.tagsView.visitedViews.filter(item => item.path === this.$route.path)[0])
      this.$router.back()
    },
    saveTestPlan() {
      if (this.isAdd) {
        addTestPlan(this.saveTestPlanForm).then(response => {
          this.saveTestPlanSuccess(response.msg)
        })
      } else {
        updateTestPlan(this.saveTestPlanForm).then(response => {
          this.saveTestPlanSuccess(response.msg)
        })
      }
    },
    actionSelectChange(type) {
      if (type) {
        this.fetchActionCascader()
      }
    },
    fetchActionCascader() {
      getActionCascader(this.projectId, this.platform).then(response => {
        this.actions = response.data
      })
    },
    testSuiteSelectChange(type) {
      if (type) {
        this.fetchTestSuiteList()
      }
    },
    fetchTestSuiteList() {
      getTestSuiteList({ projectId: this.projectId }).then(response => {
        this.testSuites = response.data
      })
    },
    envSelectChange(type) {
      if (type) {
        this.fetchEnvironmentList()
      }
    },
    fetchEnvironmentList() {
      getEnvironmentList({ projectId: this.projectId }).then(response => {
        this.environmentList = [
          {
            id: -1,
            name: '默认'
          }
        ].concat(response.data)
      })
    },
    deviceSelectChange(type) {
      if (type) {
        this.fetchOnlineDevices()
      }
    },
    fetchOnlineDevices() {
      getOnlineDevices(this.platform).then(response => {
        this.onlineDevices = response.data
      })
    }
  },
  created() {
    this.fetchOnlineDevices()
    this.fetchActionCascader()
    this.fetchTestSuiteList()
    this.fetchEnvironmentList()
    if (!this.isAdd) {
      getTestPlanList({ id: this.$route.params.testPlanId }).then(response => {
        this.saveTestPlanForm = response.data[0]
      })
    }
  }
}
</script>
