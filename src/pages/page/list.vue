<template>
  <div class="app-container">
    <!--page分类-->
    <div>
      <el-tabs type="card" addable @tab-add="addPageCategory" @tab-click="onTabClick">
        <el-tab-pane v-for="category in pageCategoryList" :key="category.name" :label="category.name" />
      </el-tabs>
    </div>
    <!--page列表-->
    <div>
      <el-table :data="pageList" highlight-current-row border>
        <el-table-column label="page" align="center">
          <template scope="{ row }">
            <img v-if="row.imgUrl" :src="row.imgUrl" width="200px">
          </template>
        </el-table-column>
        <el-table-column label="page名" align="center" property="name" />
        <el-table-column label="描述" align="center" property="description" />
        <el-table-column label="创建人" align="center" prop="creatorNickName" />
        <el-table-column label="创建时间" align="center" property="createTime" />
        <el-table-column label="操作" width="150" align="center">
          <template scope="{ row }">
            <el-button size="small" type="primary" @click="updatePage(row)">修改</el-button>
            <el-button size="small" type="danger" @click="deletePage(row.id)">删除</el-button>
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

import { getCategoryList } from '@/api/category'
import { getPageList, deletePage } from '@/api/page'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
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
      this.fetchPageList()
    },
    addPageCategory() {
      this.$router.push({ path: '/category/addPageCategory' })
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
