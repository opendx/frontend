<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-button @click="$router.push({ name: 'AddActionCategory' })">添加分类</el-button>
      <el-button @click="$router.push({ name: 'AddEncapsulationAction' })">添加Action</el-button>
    </div>
    <div style="margin-bottom: 10px">
      <el-cascader
        v-model="queryActionListForm.pageId"
        :props="{ value: 'id', label: 'name', children: 'children', emitPath: false }"
        :options="pageList"
        filterable
        clearable
        style="width: 300px"
        placeholder="选择page">
      </el-cascader>
      <el-button type="primary" class="el-icon-search" @click="onQueryBtnClick" />
    </div>
    <!--action分类-->
    <div>
      <el-tabs type="card" v-model="selectedCategoryName" @tab-remove="deleteActionCategory" @tab-click="onTabClick">
        <el-tab-pane v-for="category in actionCategoryList" :key="category.id" :label="category.name" :name="category.name" :closable="category.name !== '全部'" />
      </el-tabs>
    </div>
    <!--action列表-->
    <div>
      <el-table :data="actionList" highlight-current-row border>
        <el-table-column label="分类" align="center" width="200">
          <template scope="{ row }">
            <el-select v-model="row.categoryId" clearable filterable @change="categoryChange(row)" placeholder="选择分类">
              <el-option v-for="category in actionCategoryListWithoutTotal" :key="category.id" :label="category.name" :value="category.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Action名" align="center" prop="name" min-width="200" show-overflow-tooltip />
        <el-table-column label="描述" align="center" prop="description" show-overflow-tooltip />
        <el-table-column label="Page" align="center" width="300">
          <template scope="{ row }">
            <el-cascader
              v-model="row.pageId"
              :props="{ value: 'id', label: 'name', children: 'children', emitPath: false }"
              @change="pageChange(row)"
              :options="pageList"
              filterable
              clearable
              style="width: 100%"
              placeholder="选择page">
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
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryActionListForm.pageNum" :limit.sync="queryActionListForm.pageSize" @pagination="fetchActionList" />
    </div>
  </div>
</template>

<script>

import { getCategoryList, deleteCategory } from '@/api/category'
import { getActionList, deleteAction, updateAction } from '@/api/action'
import { getPageCascader } from '@/api/page'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      selectedCategoryName: '全部',
      pageList: [],
      actionCategoryList: [{
        name: '全部',
        id: undefined
      }],
      actionList: [],
      total: 0,
      queryActionListForm: {
        pageNum: 1,
        pageSize: 10,
        type: 2,
        projectId: this.$store.state.project.id,
        pageId: undefined
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
    actionCategoryListWithoutTotal() {
      return this.actionCategoryList.filter(category => category.name !== '全部')
    }
  },
  created() {
    this.fetchPageCascader()
    this.fetchCategoryList()
    this.fetchActionList()
  },
  methods: {
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
        name: 'AddEncapsulationAction',
        params: _action
      })
    },
    onQueryBtnClick() {
      this.queryActionListForm.pageNum = 1
      this.fetchActionList()
    },
    fetchCategoryList() {
      getCategoryList({
        projectId: this.projectId,
        type: 2 // action
      }).then(response => {
        this.actionCategoryList = this.actionCategoryList.concat(response.data)
      })
    },
    async fetchActionList() {
      const { data } = await getActionList(this.queryActionListForm)
      this.actionList = data.data
      this.total = data.total
    },
    async fetchPageCascader() {
      const { data } = await getPageCascader(this.projectId)
      this.pageList = data
    },
    onTabClick(tab) {
      const activedCategory = this.actionCategoryList.filter(category => category.name === tab.label)[0]
      this.queryActionListForm.categoryId = activedCategory.id
      this.queryActionListForm.pageNum = 1
      this.fetchActionList()
    },
    deleteActionCategory(name) {
      this.$confirm('删除' + name + '？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const category = this.actionCategoryList.filter(category => category.name === name)[0]
        deleteCategory(category.id).then(response => {
          this.$notify.success(response.msg)
          // 移除tab，切换到全部，重新请求全部数据
          this.actionCategoryList.splice(this.actionCategoryList.indexOf(category), 1)
          this.selectedCategoryName = '全部'
          this.queryActionListForm.categoryId = undefined
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
      this.$router.push({ name: 'UpdateEncapsulationAction', params: { actionId: id }})
    },
    categoryChange(row) {
      if (row.categoryId === '') { // 清除分类
        row.categoryId = null
      }
      updateAction(row).then(response => {
        this.fetchActionList()
      })
    },
    pageChange(row) {
      if (row.pageId === '') {
        row.pageId = null
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
