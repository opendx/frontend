<template>
  <el-form :data="user" label-width="80px">
    <el-form-item label="用户名" :rules="[{required: true}]">
      <el-input v-model.trim="user.username" :disabled="!isAdd" clearable style="width: 300px" />
    </el-form-item>
    <el-form-item label="密码" :rules="[{required: true}]">
      <el-input v-model.trim="user.password" clearable style="width: 300px" />
    </el-form-item>
    <el-form-item label="昵称" :rules="[{required: true}]">
      <el-input v-model.trim="user.nickName" clearable style="width: 300px" />
    </el-form-item>
    <el-form-item label="状态" :rules="[{required: true}]">
      <el-radio v-model="user.status" :label="1">启用</el-radio>
      <el-radio v-model="user.status" :label="0">禁用</el-radio>
    </el-form-item>
    <el-form-item label="角色" :rules="[{required: true}]">
      <el-select v-model="user.roles" multiple value-key="id" @visible-change="roleSelectVisibleChange">
        <el-option v-for="role in roleList" :key="role.id" :label="role.alias" :value="role" />
      </el-select>
    </el-form-item>
    <el-form-item label="项目">
      <el-select v-model="user.projects" multiple value-key="id" @visible-change="projectSelectVisibleChange">
        <el-option v-for="project in projectList" :key="project.id" :label="project.name" :value="project" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveUser">保 存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { addUser, updateUser, getUserList } from '@/api/user'
import { getRoleList } from '@/api/role'
import { getProjectList } from '@/api/project'
export default {
  props: {
    isAdd: Boolean
  },
  data() {
    return {
      user: {
        id: undefined,
        username: '',
        password: '',
        nickName: '',
        status: 1,
        roles: [],
        projects: []
      },
      roleList: [],
      projectList: []
    }
  },
  created() {
    this.fetchRoleList()
    this.fetchProjectList()
    if (!this.isAdd) {
      getUserList({ id: this.$route.params.userId }).then(response => {
        this.user = response.data[0]
      })
    }
  },
  methods: {
    saveUserSuccess(msg) {
      this.$notify.success(msg)
      // 关闭当前tagview
      this.$store.dispatch('tagsView/delView', this.$store.state.tagsView.visitedViews.filter(item => item.path === this.$route.path)[0])
      this.$router.back()
    },
    saveUser() {
      if (this.isAdd) {
        addUser(this.user).then(response => {
          this.saveUserSuccess(response.msg)
        })
      } else {
        updateUser(this.user).then(response => {
          this.saveUserSuccess(response.msg)
        })
      }
    },
    fetchRoleList() {
      getRoleList().then(response => {
        this.roleList = response.data
      })
    },
    fetchProjectList() {
      getProjectList().then(response => {
        this.projectList = response.data
      })
    },
    roleSelectVisibleChange(type) {
      if (type) {
        this.fetchRoleList()
      }
    },
    projectSelectVisibleChange(type) {
      if (type) {
        this.fetchProjectList()
      }
    }
  }
}
</script>
