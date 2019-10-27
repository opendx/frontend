<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-button @click="$router.push('/category/addActionCategory')">添加分类</el-button>
      <el-button @click="$router.push('/action/encapsulation/add')">添加Action</el-button>
    </div>
    <div style="margin-bottom: 10px">
      <el-select v-model="queryActionListForm.pageId" clearable filterable placeholder="选择Page">
        <el-option v-for="page in pageList" :key="page.id" :label="page.name" :value="page.id" />
      </el-select>
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
        <el-table-column label="分类" align="center">
          <template scope="{ row }">
            <el-select v-model="row.categoryId" clearable filterable @change="categoryChange(row)" placeholder="选择分类">
              <el-option v-for="category in actionCategoryListWithoutTotal" :key="category.id" :label="category.name" :value="category.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Action名" align="center" prop="name" />
        <el-table-column label="描述" align="center" prop="description" />
        <el-table-column label="Page" align="center">
          <template scope="{ row }">
            <el-select v-model="row.pageId" clearable filterable @change="pageChange(row)" placeholder="选择Page">
              <el-option v-for="page in pageList" :key="page.id" :label="page.name" :value="page.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template scope="{ row }">
            {{ row.creatorNickName + ' ' + row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template scope="{ row }">
            {{ (row.updatorNickName ? row.updatorNickName : '') + ' ' + (row.updateTime ? row.updateTime : '') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template scope="{ row }">
            <el-button type="success" @click="copyAction(row)">复制</el-button>
            <el-button type="primary" class="el-icon-edit" @click="updateAction(row.id)" />
            <el-button type="danger" class="el-icon-delete" @click="deleteAction(row.id)" />
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
import { getPageList } from '@/api/page'
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
      }
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
    this.fetchPageList()
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
        name: 'EncapsulationActionAdd',
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
    async fetchPageList() {
      const { data } = await getPageList({ projectId: this.projectId })
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
    deleteAction(id) {
      this.$confirm('删除该Action？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAction(id).then(response => {
          this.$notify.success(response.msg)
          this.fetchActionList()
        })
      })
    },
    updateAction(id) {
      this.$router.push('/action/encapsulation/update/' + id)
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
      if (row.pageId === '') { // 清除Page
        row.pageId = null
      }
      updateAction(row).then(response => {
        this.fetchActionList()
      })
    }
  }
}
</script>
