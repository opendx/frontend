<template>
  <div class="app-container">

    <!--筛选-->
    <div style="margin-top: 10px">
      <!--项目类型-->
      <el-select v-model="queryListForm.type" placeholder="项目类型" clearable>
        <el-option v-for="projectType in projectTypes" :label="projectType.name" :value="projectType.type">
          <svg-icon v-if="projectType.type === 1" style="vertical-align: middle" icon-class="android" />
          <svg-icon v-else-if="projectType.type === 2" style="vertical-align: middle" icon-class="ios" />
          <svg-icon v-else style="vertical-align: middle" icon-class="web" />
          <span>{{ projectType.name }}</span>
        </el-option>
      </el-select>
    </div>
    <!-- 项目列表 -->
    <div style="margin-top: 10px">
      <el-table :data="projectList" highlight-current-row border>
        <el-table-column label="项目类型" align="center">
          <template scope="scope">
            <svg-icon v-if="scope.row.type === 1" icon-class="android" />
            <svg-icon v-else-if="scope.row.type === 2" icon-class="ios" />
            <svg-icon v-else icon-class="web" />
          </template>
        </el-table-column>
        <el-table-column label="项目名称" align="center" prop="name" />
        <el-table-column label="项目描述" align="center" prop="description" />
        <el-table-column label="创建人" align="center" prop="creatorNickName" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="操作" width="300" align="center">
          <template scope="scope">
            <el-button size="small" type="success" @click="selectProject(scope.row)">选择</el-button>
            <el-button size="small" type="primary" @click="updateProject(scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="deleteProject(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 只有当所有条目大于每页的条目 才需要显示分页控件 -->
    <div v-if=" total > queryListForm.pageSize" align="center" style="margin-top: 10px">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="queryListForm.pageNum"
        :total="pages*10"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>

import { getProjectList, deleteProject } from '@/api/project'

export default {
  data() {
    return {
      addProjectData: {},
      addProjectDialogVisible: false,

      updateProjectData: {},
      updateProjectDialogVisible: false,

      projectTypes: [],

      // 项目列表数据
      projectList: [],
      // 一共有几页
      pages: null,
      // 所有项目数
      total: 0,
      // 请求项目列表的form表单
      queryListForm: {
        pageNum: 1,
        pageSize: 10,
        type: null
      }
    }
  },
  watch: {
    queryListForm: {
      handler() {
        console.log('检测到请求form有变化')
        this.requestProjectList()
      },
      deep: true
    }
  },

  // 初始化数据
  created() {
    this.requestProjectList()
  },
  methods: {
    updateProject(data) {
      this.$router.push({
        name: 'UpdateProject',
        params: data
      })
    },
    // 选择项目
    selectProject(project) {
      this.$confirm('切换到该项目', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('setProjectId', project.id)
        this.$store.dispatch('setProjectType', project.type)
        this.$store.dispatch('setProjectName', project.name)
        window.location.reload()
      })
    },
    // 点击分页
    handleCurrentChange(val) {
      console.log('点击页码', val)
      this.queryListForm.pageNum = val
    },
    // 删除项目
    deleteProject(item) {
      this.$confirm('删除该项目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProject(item.id).then(resp => {
          // 删除成功
          this.$notify.success(resp.msg)
          // 重新请求刷新数据
          this.requestProjectList()
        })
      })
    },
    // 打开修改项目窗口
    makeUpdateProjectDialogVisible(item) {
      // copy一份数据 可以保证修改的同时不改变table行数据
      var _item = Object.assign({}, item)
      this.updateProjectData = _item
      this.updateProjectDialogVisible = true
    },
    // 请求项目列表数据
    requestProjectList() {
      getProjectList(this.queryListForm).then(resp => {
        this.projectList = resp.data.data
        this.total = resp.data.total
        this.pages = resp.data.pages
      })
    },
    requestProjectTypes() {
      getProjectTypes().then(resp => {
        this.projectTypes = resp.data
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
