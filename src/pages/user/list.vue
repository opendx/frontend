<template>
  <div class="app-container">
    <div>
      <el-button @click="$router.push({ name: 'AddUser' })">添加用户</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-input v-model="queryForm.username" placeholder="用户名" style="width: 200px" clearable />
      <el-button type="primary" class="el-icon-search" @click="onQueryBtnClick" />
    </div>
    <!-- 列表 -->
    <div style="margin-top: 10px">
      <el-table :data="userList" highlight-current-row border>
        <el-table-column label="用户名" align="center" prop="username" show-overflow-tooltip />
        <el-table-column label="昵称" align="center" prop="nickName" show-overflow-tooltip />
        <el-table-column label="角色" align="center">
          <template scope="{ row }">
            <div v-for="role in row.roles" :key="role.id">
              {{ role.alias }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="项目" align="center">
          <template scope="{ row }">
            <div v-for="project in row.projects" :key="project.id">
              {{ project.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip />
        <el-table-column label="状态" align="center" show-overflow-tooltip>
          <template scope="{ row }">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template scope="{ row }">
            <el-button type="primary" class="el-icon-edit" @click="updateUser(row)" />
            <el-button type="danger" class="el-icon-delete" @click="deleteUser(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchUserList" />
    </div>
  </div>
</template>

<script>
import { getUserList, deleteUser } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserList',
  components: {
    Pagination
  },
  data() {
    return {
      userList: [],
      total: 0,
      queryForm: {
        username: undefined,
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.fetchUserList()
  },
  methods: {
    onQueryBtnClick() {
      this.queryForm.pageNum = 1
      this.fetchUserList()
    },
    updateUser(user) {
      this.$router.push({ name: 'UpdateUser', params: { userId: user.id }})
    },
    deleteUser(user) {
      this.$confirm('删除' + user.username, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(user.id).then(resp => {
          this.$notify.success(resp.msg)
          this.fetchUserList()
        })
      })
    },
    fetchUserList() {
      getUserList(this.queryForm).then(resp => {
        this.userList = resp.data.data
        this.total = resp.data.total
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
