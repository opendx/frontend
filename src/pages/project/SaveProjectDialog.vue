<template>
  <el-dialog :title="title" :visible="true" :show-close="false">
    <el-form :data="project" label-width="80px">
      <el-form-item label="项目名称" :rules="[{required: true}]">
        <el-input v-model.trim="project.name" clearable style="width: 300px" />
      </el-form-item>
      <el-form-item label="项目类型" :rules="[{required: true}]">
        <el-radio-group v-model="project.type" :disabled="!isAdd">
          <el-radio v-for="projectType in projectTypes" :key="projectType.type" :label="projectType.type">
            {{ projectType.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="项目描述">
        <el-input v-model.trim="project.description" type="textarea" clearable style="width: 300px" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="saveProject()">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addProject, updateProject } from '@/api/project'

export default {
  props: {
    isAdd: Boolean
  },
  data() {
    return {
      title: this.isAdd ? '添加项目' : '更新项目',
      projectTypes: [
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
        type: null
      }
    }
  },
  created() {
    if (!this.isAdd) {
      const _project = this.$route.params
      this.project.id = _project.id
      this.project.name = _project.name
      this.project.description = _project.description
      this.project.type = _project.type
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
