<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4" style="overflow: auto">
        <category-tree :type="1" @categoryClick="onCategoryClick" />
      </el-col>
      <el-col :span="20">
        <el-table :data="pageList" highlight-current-row border>
          <el-table-column label="page" align="center" width="120">
            <template scope="{ row }">
              <el-image v-if="row.imgUrl" :src="row.imgUrl" :preview-src-list="[row.imgUrl]" width="100px" />
            </template>
          </el-table-column>
          <el-table-column label="page名" align="center" property="name" show-overflow-tooltip />
          <el-table-column label="描述" align="center" property="description" show-overflow-tooltip />
          <el-table-column label="创建时间" align="center" width="200" show-overflow-tooltip>
            <template scope="{ row }">
              {{ row.creatorNickName + ' ' + row.createTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template scope="{ row }">
              <el-button type="primary" class="el-icon-edit" @click="updatePage(row)" />
              <el-button type="danger" class="el-icon-delete" @click="deletePage(row)" />
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchPageList" />
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { getPageList, deletePage } from '@/api/page'
import Pagination from '@/components/Pagination'
import CategoryTree from '@/pages/category/components/CategoryTree'

export default {
  components: {
    Pagination,
    CategoryTree
  },
  data() {
    return {
      pageList: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        projectId: this.$store.state.project.id,
        categoryId: undefined
      }
    }
  },
  created() {
    this.fetchPageList()
  },
  methods: {
    fetchPageList() {
      getPageList(this.queryForm).then(response => {
        this.pageList = response.data.data
        this.total = response.data.total
      })
    },
    deletePage(page) {
      this.$confirm('删除' + page.name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePage(page.id).then(response => {
          this.$notify.success(response.msg)
          this.fetchPageList()
        })
      })
    },
    updatePage(page) {
      this.$router.push({ name: 'UpdatePage', params: { pageId: page.id }})
    },
    onCategoryClick(categoryId) {
      this.queryForm.categoryId = categoryId
      this.queryForm.pageNum = 1
      this.fetchPageList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
