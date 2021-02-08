<template>
  <div style="padding: 3px">
    <div id="top">
      <el-row>
        <el-form size="mini" :inline="true">
          <el-form-item label="分类">
            <el-select
              v-model="saveActionForm.categoryId"
              clearable
              filterable
              placeholder="选择分类"
              @visible-change="actionCategorySelectChange"
            >
              <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id" />
            </el-select>
          </el-form-item>
          <el-form-item :label="isTestCase ? '用例名' : 'Action名'" :rules="[{required: true}]">
            <el-input v-model="saveActionForm.name" clearable />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="saveActionForm.description" clearable />
          </el-form-item>
          <el-form-item>
            <el-select v-model="saveActionForm.state" style="width: 80px">
              <el-option v-for="state in stateList" :key="state.state" :label="state.name" :value="state.state" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" title="ctrl+s" @click="saveAction">保存</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row>
        <el-form size="mini" :inline="true">
          <el-form-item>
            <el-button v-if="isTestCase" v-popover:action-set-up-popover type="text">setUp</el-button>
            <el-button v-if="isTestCase" v-popover:action-tear-down-popover type="text">tearDown</el-button>
            <el-button v-popover:action-return-value-popover type="text">返回值</el-button>
            <el-button v-if="!isTestCase" v-popover:action-param-popover type="text">方法参数</el-button>
            <el-button type="text" @click="showLocalVar = true">局部变量</el-button>
            <el-button v-popover:action-java-import-popover type="text">Java Import</el-button>
            <el-button v-popover:action-import-popover type="text" title="java代码调用非基础Action，需要在此导入">导入Action</el-button>
            <el-button v-if="isTestCase" v-popover:action-depends-popover type="text">依赖用例</el-button>
            <el-button v-if="!isTestCase" v-popover:action-page-popover type="text">绑定Page</el-button>
          </el-form-item>
          <el-form-item label="调试环境">
            <el-select v-model="env" style="width: 150px" @change="selectedEnv" @visible-change="envSelectChange">
              <el-option v-for="environment in environmentList" :key="environment.id" :value="environment.id" :label="environment.name" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" :loading="debugBtnLoading" title="ctrl+d" @click="debugAction">调试</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-show="code" type="primary" @click="showCode = true">查看code</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>

    <action-step ref="actionStep" :steps.sync="saveActionForm.steps" :height="bottomHeight" @actionTreeChange="onActionTreeChange" />

    <action-code-drawer :code="code" :visible.sync="showCode" />
    <action-local-var-list-drawer :visible.sync="showLocalVar" :local-vars.sync="saveActionForm.localVars" :environment-list="environmentList" />
    <el-popover
      ref="action-import-popover"
      placement="bottom"
      width="600"
      trigger="click"
    >
      <el-cascader
        v-model="saveActionForm.actionImports"
        :props="{ value: 'id', label: 'name', children: 'children', emitPath: false, multiple: true, expandTrigger: 'hover' }"
        :options="importActionOptions"
        filterable
        clearable
        style="width: 100%"
      />
    </el-popover>
    <el-popover
      ref="action-depends-popover"
      placement="bottom"
      width="600"
      trigger="click"
    >
      <el-cascader
        v-model="saveActionForm.depends"
        :props="{ value: 'id', label: 'name', children: 'children', emitPath: false, multiple: true, expandTrigger: 'hover' }"
        :options="dependsOptions"
        filterable
        clearable
        style="width: 100%"
      />
    </el-popover>
    <el-popover
      ref="action-page-popover"
      placement="bottom"
      width="600"
      trigger="click"
    >
      <el-select
        v-model="saveActionForm.pageId"
        filterable
        clearable
        style="width: 100%"
        @visible-change="pageSelectChange"
      >
        <el-option v-for="page in pages" :key="page.id" :value="page.id" :label="page.name" />
      </el-select>
    </el-popover>
    <el-popover
      ref="action-set-up-popover"
      placement="bottom"
      width="1200"
      trigger="click"
    >
      <action-step ref="actionSetUp" :steps.sync="saveActionForm.setUp" :height="bottomHeight" />
    </el-popover>
    <el-popover
      ref="action-tear-down-popover"
      placement="bottom"
      width="1200"
      trigger="click"
    >
      <action-step ref="actionTearDown" :steps.sync="saveActionForm.tearDown" :height="bottomHeight" />
    </el-popover>
    <el-popover
      ref="action-return-value-popover"
      placement="bottom"
      width="600"
      trigger="click"
    >
      <el-form size="mini" label-width="50px">
        <el-form-item label="类型" :rules="[{required: true}]">
          <el-input v-model.trim="saveActionForm.returnValueType" clearable />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="saveActionForm.returnValueDesc" clearable />
        </el-form-item>
      </el-form>
    </el-popover>
    <el-popover
      ref="action-param-popover"
      placement="bottom"
      width="1000"
      trigger="click"
    >
      <action-param-list :params.sync="saveActionForm.params" />
    </el-popover>
    <el-popover
      ref="action-java-import-popover"
      placement="bottom"
      width="800"
      trigger="click"
    >
      <action-java-import-list :java-imports.sync="saveActionForm.javaImports" />
    </el-popover>
  </div>
</template>
<script>
import ActionJavaImportList from './ActionJavaImportList'
import ActionParamList from './ActionParamList'
import ActionLocalVarListDrawer from './ActionLocalVarListDrawer'
import ActionStep from './ActionStep'
import ActionCodeDrawer from './ActionCodeDrawer'
import { getPageList } from '@/api/page'
import { getCategoryList } from '@/api/category'
import { addAction, updateAction, getActionList, debugAction } from '@/api/action'
import { getEnvironmentList } from '@/api/environment'
import { stateList, copyMatchingKeyValues } from '@/utils/common'
export default {
  components: {
    ActionJavaImportList,
    ActionParamList,
    ActionLocalVarListDrawer,
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
      bottomHeight: 60,
      environmentList: [],
      stateList: stateList,
      saveActionForm: {
        id: undefined,
        name: '',
        description: '',
        type: this.isTestCase ? 3 : 2,
        returnValueType: 'void',
        returnValueDesc: null,
        params: [],
        localVars: [],
        setUp: [],
        steps: [],
        tearDown: [],
        javaImports: [],
        actionImports: [],
        platforms: [],
        pageId: null,
        projectId: this.$store.state.project.id,
        categoryId: null,
        state: 2,
        depends: null
      },
      categories: [],
      pages: [],
      debugBtnLoading: false,
      startSaveActionFormString: '', // 开始时的表单数据，用于校验表单数据是否有变化
      dependsOptions: [],
      importActionOptions: [],
      showCode: false,
      code: '',
      showLocalVar: false
    }
  },
  destroyed() {
    window.onbeforeunload = null
    window.onresize = null
    document.onkeydown = null
  },
  mounted() {
    const top = document.getElementById('top')
    const topHeight = parseInt(window.getComputedStyle(top)['height'].replace('px', ''))

    this.$nextTick(() => {
      this.bottomHeight = window.innerHeight - (topHeight + 100)

      window.onresize = () => {
        this.bottomHeight = window.innerHeight - (topHeight + 100)
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
      copyMatchingKeyValues(this.saveActionForm, this.$route.params)
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
        const actionsWithoutBasicAction = actionTree.filter(a => a.name !== '基础Action')
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

      this.debugBtnLoading = true
      this.code = ''

      const action = JSON.parse(JSON.stringify(this.saveActionForm))
      action.setUp = this.$refs.actionSetUp.selectedSteps
      action.steps = this.$refs.actionStep.selectedSteps
      action.tearDown = this.$refs.actionTearDown.selectedSteps

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
