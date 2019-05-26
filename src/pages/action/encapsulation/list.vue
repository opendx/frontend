<template>
  <div class="app-container">
    <!--page-->
    <div>
      <el-tabs type="card" @tab-click="onTabClick">
        <el-tab-pane v-for="page in pageList" :key="page.id" :label="page.name" />
      </el-tabs>
    </div>
    <!--action列表-->
    <div>
      <el-table :data="actionList" highlight-current-row border>
        <el-table-column label="Action名" align="center" prop="name" />
        <el-table-column label="描述" align="center" prop="description" />
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

import { getActionList, deleteAction } from '@/api/action'
import { getPageList } from '@/api/page'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      pageList: [{
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
    }
  },
  created() {
    this.fetchPageList()
    this.fetchActionList()
  },
  methods: {
    copyAction(action) {
      const _action = JSON.parse(JSON.stringify(action))
      delete _action.id
      delete _action.createdTime
      delete _action.creatorUid
      delete _action.updateTime
      delete _action.updatorUid
      this.$router.push({
        name: 'EncapsulationActionAdd',
        params: _action
      })
    },
    async fetchActionList() {
      const { data } = await getActionList(this.queryActionListForm)
      this.actionList = data.data
      this.total = data.total
    },
    async fetchPageList() {
      const { data } = await getPageList({ projectId: this.projectId })
      this.pageList = this.pageList.concat(data)
    },
    onTabClick(tab) {
      const activedPage = this.pageList.filter(page => page.name === tab.label)[0]
      this.queryActionListForm.pageId = activedPage.id
      this.fetchActionList()
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
    }
  }
}
</script>
