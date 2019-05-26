<template>
  <el-dialog :title="title" :visible="true" :show-close="false">
    <el-form :data="testSuite" label-width="100px">
      <el-form-item label="测试集名" :rules="[{required: true}]">
        <el-input v-model.trim="testSuite.name" clearable style="width: 300px" />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="saveTestSuite">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>

import { addTestSuite } from '@/api/testSuite'

export default {
  props: {
    isAdd: Boolean
  },
  data() {
    return {
      title: this.isAdd ? '添加测试集' : '更新测试集',
      testSuite: {
        id: undefined,
        name: '',
        description: '',
        projectId: this.$store.state.project.id
      }
    }
  },
  methods: {
    cancel() {
      this.$router.back()
    },
    saveTestSuite() {
      if (this.isAdd) {
        addTestSuite(this.testSuite).then(response => {
          this.$notify.success(response.msg)
          this.$router.back()
        })
      }
    }
  }
}
</script>
