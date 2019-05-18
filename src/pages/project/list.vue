<template>
  <div class="app-container">
    <!--查询-->
    <div>
      <el-select v-model="queryForm.platform" placeholder="平台" clearable>
        <el-option v-for="platform in platforms" :key="platform.type" :label="platform.name" :value="platform.type" />
      </el-select>
      <el-button type="primary" @click="onQueryBtnClick">查询</el-button>
    </div>
    <!-- 列表 -->
    <div style="margin-top: 10px">
      <el-table :data="projectList" highlight-current-row border>
        <el-table-column label="平台" align="center">
          <template scope="{ row }">
            {{ row.platform === 1 ? 'Android' : 'iOS' }}
          </template>
        </el-table-column>
        <el-table-column label="项目名称" align="center" prop="name" />
        <el-table-column label="项目描述" align="center" prop="description" />
        <el-table-column label="创建时间" align="center">
          <template scope="{ row }">
            {{ row.creatorNickName + ' ' + row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template scope="{ row }">
            <el-button type="primary" @click="updateProject(row)">修改</el-button>
            <el-button type="danger" @click="deleteProject(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchProjectList" />
    </div>
  </div>
</template>

<script>

import { getProjectList, deleteProject } from '@/api/project'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      platforms: [
        {
          type: 1,
          name: 'Android'
        },
        {
          type: 2,
          name: 'iOS'
        }
      ],
      projectList: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        platform: null
      }
    }
  },
  created() {
    this.fetchProjectList()
  },
  methods: {
    onQueryBtnClick() {
      this.queryForm.pageNum = 1
      this.fetchProjectList()
    },
    updateProject(project) {
      this.$router.push({
        name: 'UpdateProject',
        params: project
      })
    },
    deleteProject(project) {
      this.$confirm('删除该项目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProject(project.id).then(resp => {
          this.$notify.success(resp.msg)
          this.fetchProjectList()
        })
      })
    },
    fetchProjectList() {
      getProjectList(this.queryForm).then(resp => {
        this.projectList = resp.data.data
        this.total = resp.data.total
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
