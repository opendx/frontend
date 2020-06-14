<template>
  <div style="padding: 5px">
    <div>
      <el-row>
        <el-col :span="10">
          <el-select v-model="env" @change="selectedEnv" @visible-change="envSelectChange" style="width: 180px" size="mini">
            <el-option v-for="environment in environmentList" :key="environment.id" :value="environment.id" :label="environment.name" />
          </el-select>
          <el-button type="warning" :loading="debugBtnLoading" @click="debugAction" size="mini">调试(ctrl+d)</el-button>
          <el-button style="margin-left: -1px" v-show="code" @click="showCode = true" size="mini">code</el-button>
          <debug-action-code :code="code" :visible.sync="showCode" />
        </el-col>
        <el-col :span="14">
          <div style="float:right">
            <span class="required" /><el-input v-model="saveActionForm.name" placeholder="名称" style="width: 280px" clearable size="mini" />
            <el-select v-model="saveActionForm.state" size="mini" style="width: 80px">
              <el-option v-for="state in stateList" :key="state.state" :label="state.name" :value="state.state" />
            </el-select>
            <el-button type="success" @click="saveAction" size="mini">保存(ctrl+s)</el-button>
            <el-popover
              placement="left"
              width="1200"
              trigger="click">
              <el-form label-width="100px" label-position="right">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="所属分类">
                      <el-select v-model="saveActionForm.categoryId" @visible-change="actionCategorySelectChange" clearable filterable style="width: 100%" placeholder="选择分类">
                        <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="所属Page" v-if="!isTestCase">
                      <el-select v-model="saveActionForm.pageId" @visible-change="pageSelectChange" clearable filterable style="width: 100%" placeholder="选择page">
                        <el-option v-for="page in pageList" :key="page.id" :value="page.id" :label="page.name" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="依赖用例" v-if="isTestCase">
                      <el-cascader
                        v-model="saveActionForm.depends"
                        :props="{ value: 'id', label: 'name', children: 'children', emitPath: false, multiple: true, expandTrigger: 'hover' }"
                        :options="dependsOptions"
                        filterable
                        clearable
                        style="width: 100%"
                        placeholder="选择用例">
                      </el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="描述">
                      <el-input v-model="saveActionForm.description" type="textarea" :autosize="{ minRows: 4 }" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-tabs tab-position="top" type="border-card">
                <el-tab-pane label="方法参数">
                  <action-param-list ref="paramList" :is-add="isAdd" />
                </el-tab-pane>
                <el-tab-pane label="局部变量">
                  <action-local-var-list ref="localVarList" :environment-list="environmentList" />
                </el-tab-pane>
                <el-tab-pane label="返回值类型">
                  <el-input v-model.trim="saveActionForm.returnValue" clearable>
                    <el-button slot="prepend">类型</el-button>
                  </el-input>
                  <el-input v-model="saveActionForm.returnValueDesc" clearable style="margin-top: 5px">
                    <el-button slot="prepend">描述</el-button>
                  </el-input>
                </el-tab-pane>
                <el-tab-pane label="import java">
                  <action-import-list ref="importList" />
                </el-tab-pane>
                <el-tab-pane label="import action">
                  <el-cascader
                    v-model="saveActionForm.actionImports"
                    :props="{ value: 'id', label: 'name', children: 'children', emitPath: false, multiple: true, expandTrigger: 'hover' }"
                    :options="importActionOptions"
                    filterable
                    clearable
                    style="width: 100%"
                    placeholder="选择要导入的action">
                  </el-cascader>
                </el-tab-pane>
              </el-tabs>
              <el-button style="margin-left: -1px" type="primary" slot="reference" size="mini">更多</el-button>
            </el-popover>
          </div>
        </el-col>
      </el-row>
    </div>

    <div style="margin-top: 5px">
      <action-step-list ref="stepList" :cur-action-id="saveActionForm.id" @selectableActionsChange="onSelectableActionsChange" />
    </div>
  </div>
</template>
<script>
import ActionImportList from '../components/ActionImportList'
import ActionParamList from '../components/ActionParamList'
import ActionLocalVarList from '../components/ActionLocalVarList'
import ActionStepList from '../components/ActionStepList'
import DebugActionCode from '../components/DebugActionCode'
import { getPageList } from '@/api/page'
import { getCategoryList } from '@/api/category'
import { addAction, updateAction, getActionList, debugAction } from '@/api/action'
import { getEnvironmentList } from '@/api/environment'
export default {
  components: {
    ActionImportList,
    ActionParamList,
    ActionLocalVarList,
    ActionStepList,
    DebugActionCode
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
        actionImports: [],
        platforms: [this.$store.state.project.platform],
        pageId: undefined,
        projectId: this.$store.state.project.id,
        categoryId: undefined,
        state: 2,
        depends: undefined
      },
      categories: [],
      pageList: [],
      debugBtnLoading: false,
      // 开始时的表单数据，用于校验表单数据是否有变化
      startSaveActionFormString: '',
      dependsOptions: [],
      importActionOptions: [],
      showCode: false,
      code: ''
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
    this.fetchActionCategoryList()
    if (!this.isTestCase) {
      this.fetchPageList()
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
      } else {
        // 记录开始时的表单数据
        this.startSaveActionFormString = JSON.stringify(this.saveActionForm)
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
    onSelectableActionsChange(selectableActions) {
      if (this.dependsOptions.length > 0) { // cascader组件有问题，只用一次step传过来的值，否则会出现
        return
      }
      console.log('selectableActions', selectableActions)
      const actionsWithoutBasicAction = selectableActions.filter(a => a.name !== '基础组件')
      if (actionsWithoutBasicAction.length > 0) {
        this.importActionOptions = actionsWithoutBasicAction
      }
      const testcases = selectableActions.filter(a => a.name === '测试用例')
      if (testcases.length > 0) {
        this.dependsOptions = testcases[0].children
      }
    },
    pageSelectChange(type) {
      if (type) {
        this.fetchPageList()
      }
    },
    fetchPageList() {
      getPageList({ projectId: this.saveActionForm.projectId }).then(response => {
        this.pageList = response.data
      })
    },
    actionCategorySelectChange(type) {
      if (type) {
        this.fetchActionCategoryList()
      }
    },
    fetchActionCategoryList() {
      let type = 2
      if (this.isTestCase) {
        type = 4
      }
      getCategoryList({ projectId: this.saveActionForm.projectId, type: type }).then(response => {
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

      const platform = this.$store.state.project.platform
      if (platform === 1 || platform === 2) { // 移动端
        if (!this.$store.state.mobile.show) {
          this.$notify.error('先选择一个Mobile使用后才能调试')
          return
        }
        if (!this.$store.state.mobile.driverSessionId) {
          this.$notify.error('appium正在初始化，请稍后')
          return
        }
      } else if (platform === 3) { // pc web
        if (!this.$store.state.browser.show) {
          this.$notify.error('先选择一个浏览器使用后才能调试')
          return
        }
        if (!this.$store.state.browser.driverSessionId) {
          this.$notify.error('webdriver正在初始化，请稍后')
          return
        }
      }

      if (this.$refs.stepList.selectedSteps.length === 0) {
        this.$notify.error('至少勾选一个步骤')
        return
      }

      this.debugBtnLoading = true
      this.code = ''
      const action = {}
      action.name = this.saveActionForm.name
      action.projectId = this.saveActionForm.projectId
      action.platforms = this.saveActionForm.platforms
      action.returnValue = this.saveActionForm.returnValue
      action.type = this.saveActionForm.type
      action.javaImports = this.$refs.importList.javaImports
      action.actionImports = this.saveActionForm.actionImports
      action.params = this.$refs.paramList.params
      action.localVars = this.$refs.localVarList.localVars
      action.steps = this.$refs.stepList.selectedSteps

      const debugInfo = platform === 3 ? {
        agentIp: this.$store.state.browser.agentIp,
        agentPort: this.$store.state.browser.agentPort,
        deviceId: this.$store.state.browser.id
      } : {
        agentIp: this.$store.state.mobile.agentIp,
        agentPort: this.$store.state.mobile.agentPort,
        deviceId: this.$store.state.mobile.id
      }

      debugInfo.env = this.$store.state.project.env
      debugInfo.platform = this.$store.state.project.platform

      debugAction({
        action: action,
        debugInfo: debugInfo
      }).then(response => {
        this.$message.success(response.msg)
        this.code = response.data.code
      }).catch(response => {
        this.code = response.data.code
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
