<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-button @click="$router.push({ name: 'AddTestSuite' })">添加测试集</el-button>
      <el-button @click="$router.push({ name: 'AddTestcaseAction' })">添加测试用例</el-button>
    </div>
    <!--testSuite-->
    <div>
      <el-tabs type="border-card" v-model="selectedTestSuiteName" @tab-remove="deleteTestSuite" @tab-click="onTabClick">
        <el-tab-pane v-for="testSuite in testSuiteList" :key="testSuite.id" :label="testSuite.name" :name="testSuite.name" :closable="testSuite.name !== '全部'">
          <el-table :data="actionList" highlight-current-row border>
            <el-table-column label="测试集" align="center" width="200">
              <template scope="{ row }">
                <el-select v-model="row.testSuiteId" clearable filterable @change="testSuiteChange(row)" placeholder="选择测试集">
                  <el-option v-for="testSuite in testSuiteListWithoutTotal" :key="testSuite.id" :label="testSuite.name" :value="testSuite.id" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="测试用例" align="center" prop="name" min-width="200" show-overflow-tooltip />
            <el-table-column label="描述" align="center" prop="description" show-overflow-tooltip />
            <el-table-column label="依赖用例" align="center" width="300px">
              <template scope="{ row }">
                <el-cascader
                  v-model="row.depends"
                  :props="{ value: 'id', label: 'name', children: 'children', emitPath: false, multiple: true }"
                  :options="dependsOptions"
                  filterable
                  clearable
                  style="width: 100%"
                  @change="dependsChange(row)"
                  placeholder="选择依赖用例">
                </el-cascader>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" width="200" show-overflow-tooltip>
              <template scope="{ row }">
                {{ row.creatorNickName + ' ' + row.createTime }}
              </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center" width="200" show-overflow-tooltip>
              <template scope="{ row }">
                {{ (row.updatorNickName ? row.updatorNickName : '') + ' ' + (row.updateTime ? row.updateTime : '') }}
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="100">
              <template scope="{ row }">
                <el-select v-model="row.state" @change="stateChange(row)">
                  <el-option v-for="state in stateList" :key="state.state" :label="state.name" :value="state.state" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template scope="{ row }">
                <el-button type="success" @click="copyAction(row)">复制</el-button>
                <el-button type="primary" class="el-icon-edit" @click="updateAction(row.id)" />
                <el-button type="danger" class="el-icon-delete" @click="deleteAction(row)" />
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="queryActionListForm.pageNum" :limit.sync="queryActionListForm.pageSize" @pagination="fetchActionList" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>

import { getActionList, deleteAction, updateAction, getActionCascader } from '@/api/action'
import Pagination from '@/components/Pagination'
import { getTestSuiteList, deleteTestSuite } from '@/api/testSuite'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      selectedTestSuiteName: '全部',
      testSuiteList: [{
        name: '全部',
        id: undefined
      }],
      actionList: [],
      total: 0,
      queryActionListForm: {
        pageNum: 1,
        pageSize: 10,
        type: 3,
        projectId: this.$store.state.project.id,
        testSuiteId: undefined
      },
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
      dependsOptions: []
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.id
    },
    platform() {
      return this.$store.state.project.platform
    },
    testSuiteListWithoutTotal() {
      return this.testSuiteList.filter(suite => suite.name !== '全部')
    }
  },
  created() {
    this.fetchTestSuiteList()
    this.fetchActionList()
    this.fetchActionCascader()
  },
  methods: {
    fetchActionCascader() {
      getActionCascader(this.projectId, this.platform).then(resp => {
        const testcases = resp.data.filter(a => a.name === '测试用例')
        if (testcases.length > 0) {
          this.dependsOptions = testcases[0].children
        }
      })
    },
    copyAction(action) {
      const _action = JSON.parse(JSON.stringify(action))
      delete _action.id
      delete _action.createTime
      delete _action.creatorUid
      delete _action.creatorNickName
      delete _action.updateTime
      delete _action.updatorUid
      delete _action.updatorNickName
      this.$router.push({
        name: 'AddTestcaseAction',
        params: _action
      })
    },
    async fetchActionList() {
      const { data } = await getActionList(this.queryActionListForm)
      this.actionList = data.data
      this.total = data.total
    },
    async fetchTestSuiteList() {
      const { data } = await getTestSuiteList({ projectId: this.projectId })
      this.testSuiteList = this.testSuiteList.concat(data)
    },
    onTabClick(tab) {
      const activedTestSuite = this.testSuiteList.filter(testSuite => testSuite.name === tab.label)[0]
      this.queryActionListForm.testSuiteId = activedTestSuite.id
      this.queryActionListForm.pageNum = 1
      this.fetchActionList()
    },
    deleteTestSuite(name) {
      this.$confirm('删除' + name + '？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const testSuite = this.testSuiteList.filter(testSuite => testSuite.name === name)[0]
        deleteTestSuite(testSuite.id).then(response => {
          this.$notify.success(response.msg)
          // 移除tab，切换到全部，重新请求全部数据
          this.testSuiteList.splice(this.testSuiteList.indexOf(testSuite), 1)
          this.selectedTestSuiteName = '全部'
          this.queryActionListForm.testSuiteId = undefined
          this.fetchActionList()
        })
      })
    },
    deleteAction(action) {
      this.$confirm('删除' + action.name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAction(action.id).then(response => {
          this.$notify.success(response.msg)
          this.fetchActionList()
        })
      })
    },
    updateAction(id) {
      this.$router.push({ name: 'UpdateTestcaseAction', params: { actionId: id }})
    },
    testSuiteChange(row) {
      if (row.testSuiteId === '') { // 清除测试集
        row.testSuiteId = null
      }
      updateAction(row).then(response => {
        this.fetchActionList()
      })
    },
    stateChange(row) {
      updateAction(row).then(response => {
        this.fetchActionList()
      }).catch(() => {
        // 修改失败，重刷，否则当前select选择的值是错误的
        this.fetchActionList()
      })
    },
    dependsChange(row) {
      updateAction(row).then(response => {
        this.fetchActionList()
      }).catch(() => {
        this.fetchActionList()
      })
    }
  }
}
</script>
