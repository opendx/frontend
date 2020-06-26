<template>
  <div style="padding: 5px">
    <el-row :style="'height: ' + topHeight + 'px; overflow: auto'" :gutter="5">
      <el-col :span="10" style="height: 100%; overflow: auto">
        <el-row style="margin-bottom: 5px">
          <span>
            <el-select v-model="env" @change="selectedEnv" @visible-change="envSelectChange" style="width: 150px" size="mini">
              <el-option v-for="environment in environmentList" :key="environment.id" :value="environment.id" :label="environment.name" />
            </el-select>
            <el-button type="warning" :loading="debugBtnLoading" @click="debugAction" title="ctrl+d" size="mini">调试</el-button>
            <el-button type="primary" style="margin-left: -1px" v-show="code" @click="showCode = true" size="mini">查看code</el-button>
            <action-code-drawer :code="code" :visible.sync="showCode" />
          </span>

          <span style="float: right">
            <el-select v-model="saveActionForm.state" style="width: 80px" size="mini">
              <el-option v-for="state in stateList" :key="state.state" :label="state.name" :value="state.state" />
            </el-select>
            <el-button type="success" @click="saveAction" title="ctrl+s" size="mini">保存</el-button>
          </span>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form size="mini" label-position="rigth" label-width="85px">
              <el-form-item label="返回值类型" :rules="[{required: true}]">
                <el-input v-model.trim="saveActionForm.returnValue" clearable />
              </el-form-item>
              <el-form-item label="所属分类">
                <el-select
                  v-model="saveActionForm.categoryId"
                  @visible-change="actionCategorySelectChange"
                  clearable
                  filterable
                  style="width: 100%"
                  placeholder="选择分类"
                >
                  <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id" />
                </el-select>
              </el-form-item>
              <el-form-item :label="isTestCase ? '用例名' : 'Action名'" :rules="[{required: true}]">
                <el-input v-model="saveActionForm.name" clearable />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form size="mini" label-position="rigth" label-width="85px">
              <el-form-item label="返回值描述">
                <el-input v-model="saveActionForm.returnValueDesc" clearable type="textarea" :autosize="{ minRows: 1 }" />
              </el-form-item>
              <el-form-item v-if="!isTestCase" label="所属Page">
                <el-select
                  v-model="saveActionForm.pageId"
                  @visible-change="pageSelectChange"
                  filterable
                  clearable
                  style="width: 100%"
                  placeholder="选择Page"
                >
                  <el-option v-for="page in pages" :key="page.id" :value="page.id" :label="page.name" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="isTestCase" label="依赖用例">
                <el-cascader
                  v-model="saveActionForm.depends"
                  :props="{ value: 'id', label: 'name', children: 'children', emitPath: false, multiple: true, expandTrigger: 'hover' }"
                  :options="dependsOptions"
                  filterable
                  clearable
                  style="width: 100%"
                  placeholder="选择依赖用例"
                >
                </el-cascader>
              </el-form-item>
              <el-form-item :label="isTestCase ? '用例描述' : 'Action描述'">
                <el-input v-model="saveActionForm.description" type="textarea" :autosize="{ minRows: 1 }" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <el-row>
          <action-param-list :params.sync="saveActionForm.params" />
        </el-row>

        <el-row style="margin-top: 5px" :gutter="10">
          <el-col :span="12">
            <action-java-import-list :java-imports.sync="saveActionForm.javaImports" />
          </el-col>
          <el-col :span="12">
            <el-form size="mini" label-position="rigth" label-width="85px">
              <el-form-item label="导入Action">
                <el-cascader
                  v-model="saveActionForm.actionImports"
                  :props="{ value: 'id', label: 'name', children: 'children', emitPath: false, multiple: true, expandTrigger: 'hover' }"
                  :options="importActionOptions"
                  filterable
                  clearable
                  style="width: 100%"
                  placeholder="选择Action"
                >
                </el-cascader>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="14" style="height: 100%; overflow: auto">
        <action-local-var-list :local-vars.sync="saveActionForm.localVars" :environment-list="environmentList" :table-height="topHeight" />
      </el-col>
    </el-row>

    <div style="margin-top: 5px">
      <action-step ref="actionStep" :steps.sync="saveActionForm.steps" :table-height="bottomHeight" @actionTreeChange="onActionTreeChange" />
    </div>
  </div>
</template>
<script>
import ActionJavaImportList from './ActionJavaImportList'
import ActionParamList from './ActionParamList'
import ActionLocalVarList from './ActionLocalVarList'
import ActionStep from './ActionStep'
import ActionCodeDrawer from './ActionCodeDrawer'
import { getPageList } from '@/api/page'
import { getCategoryList } from '@/api/category'
import { addAction, updateAction, getActionList, debugAction } from '@/api/action'
import { getEnvironmentList } from '@/api/environment'
import { stateList } from '@/utils/common'
export default {
  components: {
    ActionJavaImportList,
    ActionParamList,
    ActionLocalVarList,
    ActionStep,
    ActionCodeDrawer
  },
  props: {
    isAdd: Boolean,
    isTestCase: Boolean
  },
  data() {
    return {
      env: this.$store.state.project.env,
      topHeight: 300,
      bottomHeight: 0,
      environmentList: [],
      stateList: stateList,
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
      pages: [],
      debugBtnLoading: false,
      startSaveActionFormString: '', // 开始时的表单数据，用于校验表单数据是否有变化
      dependsOptions: [],
      importActionOptions: [],
      showCode: false,
      code: ''
    }
  },
  destroyed() {
    window.onbeforeunload = null
    window.onresize = null
    document.onkeydown = null
  },
  mounted() {
    this.$nextTick(() => {
      this.bottomHeight = window.innerHeight - (this.topHeight + 100)

      window.onresize = () => {
        this.bottomHeight = window.innerHeight - (this.topHeight + 100)
      }
    })
    window.onbeforeunload = () => {
      if (this.isSaveActionFormChanged()) {
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
      if (this.$route.params.name) { // 复制，传递过来的数据
        this.saveActionForm = this.$route.params
      }
      // 记录开始时的表单数据
      this.startSaveActionFormString = JSON.stringify(this.saveActionForm)
    } else {
      // 编辑action
      getActionList({ id: this.$route.params.actionId }).then(response => {
        this.saveActionForm = response.data[0]
        // 记录开始时的表单数据
        this.startSaveActionFormString = JSON.stringify(this.saveActionForm)
      })
    }
  },
  methods: {
    onActionTreeChange(actionTree) {
      if (actionTree && actionTree.length > 0) {
        const actionsWithoutBasicAction = actionTree.filter(a => a.name !== '基础组件')
        if (actionsWithoutBasicAction.length > 0) {
          this.importActionOptions = actionsWithoutBasicAction
        }

        const testcases = actionTree.filter(a => a.name === '测试用例')
        if (testcases.length > 0) {
          this.dependsOptions = testcases[0].children
        }
      }
    },
    pageSelectChange(type) {
      if (type) {
        this.fetchPageList()
      }
    },
    fetchPageList() {
      getPageList({ projectId: this.saveActionForm.projectId }).then(response => {
        this.pages = response.data
      })
    },
    actionCategorySelectChange(type) {
      if (type) {
        this.fetchActionCategoryList()
      }
    },
    fetchActionCategoryList() {
      const type = this.isTestCase ? 4 : 2
      getCategoryList({ projectId: this.saveActionForm.projectId, type: type }).then(response => {
        this.categories = response.data
      })
    },
    saveAction() {
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
      } else {
        this.$notify.error('不支持的平台')
        return
      }

      if (this.$refs.actionStep.selectedSteps.length === 0) {
        this.$notify.error('至少勾选一个步骤')
        return
      }

      this.debugBtnLoading = true
      this.code = ''

      const action = JSON.parse(JSON.stringify(this.saveActionForm))
      action.steps = this.$refs.actionStep.selectedSteps

      const debugInfo = platform === 3 ? {
        agentIp: this.$store.state.browser.agentIp,
        agentPort: this.$store.state.browser.agentPort,
        deviceId: this.$store.state.browser.id
      } : {
        agentIp: this.$store.state.mobile.agentIp,
        agentPort: this.$store.state.mobile.agentPort,
        deviceId: this.$store.state.mobile.id
      }

      debugInfo.env = this.env
      debugInfo.platform = platform

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
    isSaveActionFormChanged() {
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
