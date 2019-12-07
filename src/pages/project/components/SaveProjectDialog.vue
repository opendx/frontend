<template>
  <el-dialog :title="title" :visible="true" :show-close="false">
    <el-form :data="project" label-width="60px">
      <el-form-item label="名称" :rules="[{required: true}]">
        <el-input v-model.trim="project.name" clearable style="width: 300px" />
      </el-form-item>
      <el-form-item label="平台" :rules="[{required: true}]">
        <el-radio-group v-model="project.platform" :disabled="!isAdd">
          <el-radio v-for="platform in platforms" :key="platform.type" :label="platform.type">
            {{ platform.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model.trim="project.description" type="textarea" style="width: 300px" />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button v-if="showCancel" @click="cancel">取 消</el-button>
      <el-button type="primary" @click="saveProject">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addProject, updateProject, getProjectList } from '@/api/project'

export default {
  props: {
    isAdd: Boolean,
    showCancel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      title: this.isAdd ? '添加项目' : '更新项目',
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
      project: {
        id: null,
        name: '',
        description: '',
        platform: null
      }
    }
  },
  created() {
    if (!this.isAdd) {
      getProjectList({ id: this.$route.params.projectId }).then(response => {
        this.project = response.data[0]
      })
    }
  },
  methods: {
    cancel() {
      this.$router.back()
    },
    goToProjectListPage() {
      this.$router.push({
        path: '/project/list'
      })
    },
    saveProject() {
      if (this.isAdd) {
        addProject(this.project).then(response => {
          this.$notify.success(response.msg)
          this.goToProjectListPage()
        })
      } else {
        updateProject(this.project).then(response => {
          this.$notify.success(response.msg)
          this.goToProjectListPage()
        })
      }
    }
  }
}
</script>
