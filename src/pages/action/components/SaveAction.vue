<template>
  <div>
    <sticky :z-index="10" class-name="sub-navbar">
      <div style="float: left;margin-left: 5px">
        <el-select v-model="env" @change="selectedEnv" @visible-change="envSelectChange" style="width: 100px" size="mini">
          <el-option v-for="environment in environmentList" :key="environment.id" :value="environment.id" :label="environment.name" />
        </el-select>
        <el-button type="warning" :loading="debugBtnLoading" @click="debugAction" size="mini" title="ctrl + d">调试</el-button>
      </div>
      <span class="required" /><el-input v-model="saveActionForm.name" placeholder="action名" style="width: 200px" clearable size="mini" />
      <el-input v-model="saveActionForm.description" placeholder="描述" style="width: 150px" clearable size="mini" />
      <span v-if="!isTestCase"><!-- 不是测试用例，可以绑定分类和page -->
        <el-select v-model="saveActionForm.categoryId" @visible-change="actionCategorySelectChange" clearable filterable style="width: 120px" placeholder="选择分类" size="mini">
          <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id" />
        </el-select>
        <el-cascader
          v-model="saveActionForm.pageId"
          :props="{ value: 'id', label: 'name', children: 'children', emitPath: false }"
          :options="pages"
          filterable
          clearable
          style="width: 150px"
          size="mini"
          :show-all-levels="false"
          @visible-change="pageSelectChange"
          placeholder="选择page">
        </el-cascader>
      </span>
      <span v-if="isTestCase"><!-- 测试用例，可以绑定测试集 -->
        <el-select v-model="saveActionForm.testSuiteId" @visible-change="testsuiteSelectChange" clearable filterable style="width: 200px" placeholder="选择测试集" size="mini">
          <el-option v-for="testSuite in testSuites" :key="testSuite.id" :label="testSuite.name" :value="testSuite.id" />
        </el-select>
      </span>
      <el-select v-model="saveActionForm.state" size="mini" style="width: 80px">
        <el-option v-for="state in stateList" :key="state.state" :label="state.name" :value="state.state" />
      </el-select>
      <el-button type="success" @click="saveAction" title="ctrl + s" size="mini">保存</el-button>
    </sticky>
    <div class="app-container">
      <el-tabs tab-position="left">
        <el-tab-pane label="方法参数">
          <action-param-list ref="paramList" :is-add="isAdd" />
        </el-tab-pane>
        <el-tab-pane label="局部变量">
          <action-local-var-list ref="localVarList" :environment-list="environmentList" />
        </el-tab-pane>
        <el-tab-pane label="全局变量">
          <global-var-list :environment-list="environmentList" />
        </el-tab-pane>
        <el-tab-pane label="返回值类型">
          <el-input v-model.trim="saveActionForm.returnValue" :disabled="!isAdd" clearable placeholder="返回值类型" />
          <el-input v-model="saveActionForm.returnValueDesc" clearable placeholder="描述" style="margin-top: 5px" />
        </el-tab-pane>
        <el-tab-pane label="import">
          <action-import-list ref="importList" />
        </el-tab-pane>
      </el-tabs>
      <action-step-list ref="stepList" style="margin-top: 5px" :cur-action-id="saveActionForm.id" />
    </div>
  </div>
</template>
<script>
import ActionImportList from '../components/ActionImportList'
import ActionParamList from '../components/ActionParamList'
import ActionLocalVarList from '../components/ActionLocalVarList'
import GlobalVarList from '../components/GlobalVarList'
import ActionStepList from '../components/ActionStepList'
import Sticky from '@/components/Sticky'
import { getPageCascader } from '@/api/page'
import { getCategoryList } from '@/api/category'
import { getTestSuiteList } from '@/api/testSuite'
import { addAction, updateAction, getActionList, debugAction } from '@/api/action'
import { getEnvironmentList } from '@/api/environment'
export default {
  components: {
    ActionImportList,
    ActionParamList,
    ActionLocalVarList,
    GlobalVarList,
    ActionStepList,
    Sticky
  },
  props: {
    isAdd: Boolean,
    isTestCase: Boolean
  },
  data() {
    return {
      env: this.$store.state.project.env,
      environmentList: [
        {
          id: -1,
          name: '默认'
        }
      ],
      stateList: [
        {
          state: 0,
          name: '禁用'
        }, {
          state: 1,
          name: '草稿'
        }, {
          state: 2,
          name: '发布'
        }
      ],
      saveActionForm: {
        id: undefined,
        name: '',
        description: '',
        type: this.isTestCase ? 3 : 2,
        returnValue: 'void',
        returnValueDesc: null,
        params: [],
        localVars: [],
        steps: [],
        javaImports: [],
        platform: this.$store.state.project.platform,
        pageId: undefined,
        projectId: this.$store.state.project.id,
        testSuiteId: undefined,
        categoryId: undefined,
        state: 2
      },
      categories: [],
      pages: [],
      testSuites: [],
      debugBtnLoading: false,
      // 开始时的表单数据，用于校验表单数据是否有变化
      startSaveActionFormString: ''
    }
  },
  destroyed() {
    window.onbeforeunload = null
    document.onkeydown = null
  },
  mounted() {
    window.onbeforeunload = () => {
      if (this.saveActionFormChanged()) {
        // 刷新或关闭窗口 且 数据发生变化，提示用户
        return '提示'
      }
    }
    document.onkeydown = () => {
      const event = window.event
      if (event.keyCode === 83 && event.ctrlKey) {
        // ctrl + s
        this.saveAction()
        event.preventDefault()
      } else if (event.keyCode === 68 && event.ctrlKey) {
        // ctrl + d
        this.debugAction()
        event.preventDefault()
      }
    }
  },
  created() {
    this.fetchEnvironmentList()
    if (this.isTestCase) {
      this.fetTestSuiteList()
    } else {
      this.fetActionCategoryList()
      this.fetchPageCascader()
    }
    if (this.isAdd) {
      // 复制，传递过来的数据
      if (this.$route.params.name) {
        setTimeout(() => {
          // 这里不用异步会出问题
          this.saveActionForm = this.$route.params
          this.$refs.paramList.params = this.saveActionForm.params
          this.$refs.localVarList.localVars = this.saveActionForm.localVars
          this.$refs.stepList.steps = this.saveActionForm.steps
          this.$refs.importList.javaImports = this.saveActionForm.javaImports
          // 记录开始时的表单数据
          this.startSaveActionFormString = JSON.stringify(this.saveActionForm)
        }, 100)
      }
    } else {
      // 编辑action
      getActionList({ id: this.$route.params.actionId }).then(response => {
        this.saveActionForm = response.data[0]
        this.$refs.paramList.params = this.saveActionForm.params
        this.$refs.localVarList.localVars = this.saveActionForm.localVars
        this.$refs.stepList.steps = this.saveActionForm.steps
        this.$refs.importList.javaImports = this.saveActionForm.javaImports
        // 记录开始时的表单数据
        this.startSaveActionFormString = JSON.stringify(this.saveActionForm)
      })
    }
  },
  methods: {
    testsuiteSelectChange(type) {
      if (type) {
        this.fetTestSuiteList()
      }
    },
    fetTestSuiteList() {
      getTestSuiteList({ projectId: this.saveActionForm.projectId }).then(response => {
        this.testSuites = response.data
      })
    },
    pageSelectChange(type) {
      if (type) {
        this.fetchPageCascader()
      }
    },
    fetchPageCascader() {
      getPageCascader(this.saveActionForm.projectId).then(response => {
        this.pages = response.data
      })
    },
    actionCategorySelectChange(type) {
      if (type) {
        this.fetActionCategoryList()
      }
    },
    fetActionCategoryList() {
      getCategoryList({ projectId: this.saveActionForm.projectId, type: 2 }).then(response => {
        this.categories = response.data
      })
    },
    saveAction() {
      this.saveActionForm.params = this.$refs.paramList.params
      this.saveActionForm.localVars = this.$refs.localVarList.localVars
      this.saveActionForm.steps = this.$refs.stepList.steps
      this.saveActionForm.javaImports = this.$refs.importList.javaImports

      if (this.isAdd) {
        addAction(this.saveActionForm).then(response => {
          this.saveActionSuccess(response.msg)
        })
      } else {
        updateAction(this.saveActionForm).then(response => {
          this.saveActionSuccess(response.msg)
        })
      }
    },
    saveActionSuccess(msg) {
      this.$notify.success(msg)
      // 关闭当前tagview
      this.$store.dispatch('tagsView/delView', this.$store.state.tagsView.visitedViews.filter(item => item.path === this.$route.path)[0])
      this.$router.back()
    },
    debugAction() {
      if (this.debugBtnLoading) {
        // 防止快捷键重复调试
        return
      }
      if (!this.$store.state.device.show) {
        this.$notify.error('先选择一台设备使用后才能调试')
        return
      }
      if (this.$refs.stepList.selectedSteps.length === 0) {
        this.$notify.error('至少勾选一个步骤')
        return
      }
      if (!this.$store.state.device.appiumSessionId) {
        this.$notify.error('appium正在初始化，请稍后')
        return
      }
      this.debugBtnLoading = true
      const action = {}
      action.name = this.saveActionForm.name
      action.javaImports = this.$refs.importList.javaImports
      action.params = this.$refs.paramList.params
      action.localVars = this.$refs.localVarList.localVars
      action.steps = this.$refs.stepList.selectedSteps
      action.projectId = this.$store.state.project.id
      action.platform = this.$store.state.project.platform
      action.returnValue = this.saveActionForm.returnValue
      action.type = this.isTestCase ? 3 : 2
      debugAction({
        action: action,
        debugInfo: {
          agentIp: this.$store.state.device.agentIp,
          agentPort: this.$store.state.device.agentPort,
          env: this.$store.state.project.env,
          deviceId: this.$store.state.device.id
        }
      }).then(response => {
        const printMsgList = response.data
        const _this = this
        for (let i = 0; i < printMsgList.length; i++) {
          // 不延时，message会重叠
          (function() {
            setTimeout(() => _this.$message.success(printMsgList[i]), 200 * i)
          })()
        }
      }).finally(() => {
        this.debugBtnLoading = false
      })
    },
    saveActionFormChanged() {
      this.saveActionForm.params = this.$refs.paramList.params
      this.saveActionForm.localVars = this.$refs.localVarList.localVars
      this.saveActionForm.steps = this.$refs.stepList.steps
      this.saveActionForm.javaImports = this.$refs.importList.javaImports
      return JSON.stringify(this.saveActionForm) !== this.startSaveActionFormString
    },
    envSelectChange(type) {
      if (type) {
        this.fetchEnvironmentList()
      }
    },
    fetchEnvironmentList() {
      getEnvironmentList({ projectId: this.$store.state.project.id }).then(response => {
        this.environmentList = [
          {
            id: -1,
            name: '默认'
          }
        ].concat(response.data)
        // 当前选择的环境不存在，重置回默认。如：之前选择了test环境，后来test环境被删除了
        if (this.environmentList.filter(env => env.id === this.env).length === 0) {
          console.log('重置env为-1')
          this.$store.dispatch('project/setEnv', -1)
          this.env = -1
        }
      })
    },
    selectedEnv(envId) {
      const selectedEnv = this.environmentList.filter(env => env.id === envId)[0]
      this.$store.dispatch('project/setEnv', selectedEnv.id)
    }
  }
}
</script>
<style scoped>
  .required:before {
    content: '*';
    color: #ff4949;
    margin-right: 4px;
  }
</style>
