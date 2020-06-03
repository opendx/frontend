<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-button @click="$router.push({ name: 'AddTestcaseCategory' })">添加分类</el-button>
      <el-button @click="$router.push({ name: 'AddTestcaseAction' })">添加测试用例</el-button>
    </div>

    <div>
      <el-input v-model="queryForm.name" style="width: 200px" placeholder="测试用例名" clearable />
      <el-select v-model="queryForm.state" clearable placeholder="状态">
        <el-option v-for="state in stateList" :key="state.state" :label="state.name" :value="state.state" />
      </el-select>
      <el-button type="primary" class="el-icon-search" @click="onQueryBtnClick" />
    </div>

    <el-tabs v-model="selectedCategoryName" @tab-remove="deleteCategory" @tab-click="onTabClick">
      <el-tab-pane v-for="category in categoryList" :key="category.id" :label="category.name" :name="category.name" :closable="category.name !== '全部'" />
    </el-tabs>

    <el-table :data="actionList" highlight-current-row border>
      <el-table-column label="分类" align="center" width="200">
        <template scope="{ row }">
          <el-select v-model="row.categoryId" clearable filterable @change="categoryChange(row)" placeholder="选择分类">
            <el-option v-for="category in categoryListWithoutTotal" :key="category.id" :label="category.name" :value="category.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="测试用例" align="center" prop="name" show-overflow-tooltip />
      <el-table-column label="描述" align="center" prop="description" show-overflow-tooltip />
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
    <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchActionList" />
  </div>
</template>

<script>
import { getCategoryList, deleteCategory } from '@/api/category'
import { getActionList, deleteAction, updateAction } from '@/api/action'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      selectedCategoryName: '全部',
      categoryList: [{
        name: '全部'
      }],
      actionList: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        type: 3,
        projectId: this.$store.state.project.id,
        name: '',
        state: undefined
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
    categoryListWithoutTotal() {
      return this.categoryList.filter(category => category.name !== '全部')
    }
  },
  created() {
    this.fetchCategoryList()
    this.fetchActionList()
  },
  methods: {
    onQueryBtnClick() {
      this.queryForm.pageNum = 1
      this.fetchActionList()
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
      const { data } = await getActionList(this.queryForm)
      this.actionList = data.data
      this.total = data.total
    },
    fetchCategoryList() {
      getCategoryList({
        projectId: this.projectId,
        type: 4 // 测试用例
      }).then(response => {
        this.categoryList = this.categoryList.concat(response.data)
      })
    },
    onTabClick(tab) {
      const activedCategory = this.categoryList.filter(category => category.name === tab.label)[0]
      this.queryForm.categoryId = activedCategory.id
      this.queryForm.pageNum = 1
      this.fetchActionList()
    },
    deleteCategory(name) {
      this.$confirm('删除' + name + '？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const category = this.categoryList.filter(category => category.name === name)[0]
        deleteCategory(category.id).then(response => {
          this.$notify.success(response.msg)
          // 移除tab，切换到全部，重新请求全部数据
          this.categoryList.splice(this.categoryList.indexOf(category), 1)
          this.selectedCategoryName = '全部'
          this.queryForm.categoryId = undefined
          this.queryForm.pageNum = 1
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
    categoryChange(row) {
      if (row.categoryId === '') { // 清除分类
        row.categoryId = null
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
    }
  }
}
</script>
