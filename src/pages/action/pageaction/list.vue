<template>
  <div class="app-container">
    <el-button v-if="queryActionListForm.pageId" style="margin-bottom: 10px" @click="addPageAction">+</el-button>
    <!--page-->
    <div>
      <el-tabs type="card" @tab-click="onTabClick">
        <el-tab-pane v-for="page in pageList" :key="page.id" :label="page.name" />
      </el-tabs>
    </div>
    <!--action列表-->
    <div>
      <el-table :data="actionList" highlight-current-row border>
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="PageAction名" align="center" prop="name" />
        <el-table-column label="描述" align="center" prop="description" />
        <el-table-column label="更新时间" align="center" prop="updateTime" />
        <el-table-column label="创建人" align="center" prop="creatorNickName" />
        <el-table-column label="更新人" align="center" prop="updatorNickName" />
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
      <pagination v-show="total>0" :total="total" :page.sync="queryActionListForm.pageNum" :limit.sync="queryActionListForm.pageSize" @pagination="fetchActionList" />
    </div>
  </div>
</template>

<script>

import { getActionList } from '@/api/action'
import { getPageList } from '@/api/page'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      pageList: [],
      actionList: [],
      total: 0,
      queryActionListForm: {
        pageNum: 1,
        pageSize: 10,
        pageId: undefined
      }
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.id
    }
  },
  async created() {
    await this.fetchPageList()
    if (this.pageList.length > 0) {
      // 默认用第一个pageId请求action
      this.queryActionListForm.pageId = this.pageList[0].id
      await this.fetchActionList()
    }
  },
  methods: {
    addPageAction() {
      this.$router.push('/action/pageAction/add/' + this.queryActionListForm.pageId)
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
      const activedPage = this.pageList.filter(page => page.name === tab.label)[0]
      this.queryActionListForm.pageId = activedPage.id
      this.fetchActionList()
    },
    deletePage(id) {
      this.$confirm('删除该Page？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
