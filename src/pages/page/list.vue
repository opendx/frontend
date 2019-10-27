<template>
  <div class="app-container">
    <el-button @click="$router.push('/category/addPageCategory')" style="margin-bottom: 10px">添加分类</el-button>
    <!--page分类-->
    <el-tabs type="card" v-model="selectedCategoryName" @tab-remove="deletePageCategory" @tab-click="onTabClick">
      <el-tab-pane v-for="category in pageCategoryList" :key="category.id" :label="category.name" :name="category.name" :closable="category.name !== '全部'" />
    </el-tabs>
    <!--page列表-->
    <div>
      <el-table :data="pageList" highlight-current-row border>
        <el-table-column label="分类" align="center">
          <template scope="{ row }">
            <el-select v-model="row.categoryId" clearable filterable @change="categoryChange(row)" placeholder="选择分类">
              <el-option v-for="category in pageCategoryListWithoutTotal" :key="category.id" :value="category.id" :label="category.name" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="page" align="center" width="120px">
          <template scope="{ row }">
            <img v-if="row.imgUrl" :src="row.imgUrl" width="100px">
          </template>
        </el-table-column>
        <el-table-column label="page名" align="center" property="name" />
        <el-table-column label="描述" align="center" property="description" />
        <el-table-column label="创建时间" align="center">
          <template scope="{ row }">
            {{ row.creatorNickName + ' ' + row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template scope="{ row }">
            <el-button type="primary" class="el-icon-edit" @click="updatePage(row)" />
            <el-button type="danger" class="el-icon-delete" @click="deletePage(row.id)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryPageListForm.pageNum" :limit.sync="queryPageListForm.pageSize" @pagination="fetchPageList" />
    </div>
  </div>
</template>

<script>

import { getCategoryList, deleteCategory } from '@/api/category'
import { getPageList, deletePage, updatePage } from '@/api/page'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      selectedCategoryName: '全部',
      pageCategoryList: [
        {
          name: '全部'
        }
      ],
      pageList: [],
      total: 0,
      queryPageListForm: {
        pageNum: 1,
        pageSize: 10,
        projectId: this.$store.state.project.id, // 这里不能用computed里的projectId，会拿到undefined
        categoryId: undefined
      }
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.id
    },
    pageCategoryListWithoutTotal() {
      return this.pageCategoryList.filter(category => category.name !== '全部')
    }
  },
  created() {
    this.fetchCategoryList()
    this.fetchPageList()
  },
  methods: {
    fetchCategoryList() {
      getCategoryList({
        projectId: this.projectId,
        type: 1 // page
      }).then(response => {
        this.pageCategoryList = this.pageCategoryList.concat(response.data)
      })
    },
    fetchPageList() {
      getPageList(this.queryPageListForm).then(response => {
        this.pageList = response.data.data
        this.total = response.data.total
      })
    },
    onTabClick(tab) {
      const activeCategory = this.pageCategoryList.filter(category => category.name === tab.label)[0]
      this.queryPageListForm.categoryId = activeCategory.id
      this.queryPageListForm.pageNum = 1
      this.fetchPageList()
    },
    deletePageCategory(name) {
      this.$confirm('删除' + name + '？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const category = this.pageCategoryList.filter(category => category.name === name)[0]
        deleteCategory(category.id).then(response => {
          this.$notify.success(response.msg)
          // 移除tab，切换到全部，重新请求全部数据
          this.pageCategoryList.splice(this.pageCategoryList.indexOf(category), 1)
          this.selectedCategoryName = '全部'
          this.queryPageListForm.categoryId = undefined
          this.fetchPageList()
        })
      })
    },
    deletePage(id) {
      this.$confirm('删除该Page？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePage(id).then(response => {
          this.$notify.success(response.msg)
          this.fetchPageList()
        })
      })
    },
    updatePage(page) {
      this.$router.push({
        name: 'UpdatePage',
        params: page
      })
    },
    categoryChange(row) {
      if (row.categoryId === '') { // 清除分类
        row.categoryId = null
      }
      updatePage(row).then(response => {
        this.fetchPageList()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
