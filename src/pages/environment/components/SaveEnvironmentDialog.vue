<template>
  <el-dialog :title="title" :visible="true" :show-close="false">
    <el-form :data="environment" label-width="60px">
      <el-form-item label="名称" :rules="[{required: true}]">
        <el-input v-model.trim="environment.name" clearable style="width: 300px" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model.trim="environment.description" type="textarea" style="width: 300px" />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="saveEnvironment">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addEnvironment, updateEnvironment, getEnvironmentList } from '@/api/environment'

export default {
  props: {
    isAdd: Boolean
  },
  data() {
    return {
      title: this.isAdd ? '添加环境' : '更新环境',
      environment: {
        id: undefined,
        name: '',
        description: '',
        projectId: this.$store.state.project.id
      }
    }
  },
  created() {
    if (!this.isAdd) {
      const environmentId = this.$route.params.environmentId
      getEnvironmentList({ id: environmentId }).then(response => {
        this.environment = response.data[0]
      })
    }
  },
  methods: {
    cancel() {
      this.$router.back()
    },
    goToEnvironmentListPage() {
      this.$router.push({
        path: '/environment/list'
      })
    },
    saveEnvironment() {
      if (this.isAdd) {
        addEnvironment(this.environment).then(response => {
          this.$notify.success(response.msg)
          this.goToEnvironmentListPage()
        })
      } else {
        updateEnvironment(this.environment).then(response => {
          this.$notify.success(response.msg)
          this.goToEnvironmentListPage()
        })
      }
    }
  }
}
</script>
