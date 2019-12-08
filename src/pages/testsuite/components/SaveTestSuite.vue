<template>
  <el-form :data="testSuite" label-width="100px">
    <el-form-item label="测试集名" :rules="[{required: true}]">
      <el-input v-model.trim="testSuite.name" clearable style="width: 300px" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveTestSuite">保 存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>

import { addTestSuite } from '@/api/testSuite'

export default {
  props: {
    isAdd: Boolean
  },
  data() {
    return {
      testSuite: {
        id: undefined,
        name: '',
        description: '',
        projectId: this.$store.state.project.id
      }
    }
  },
  methods: {
    saveTestSuite() {
      if (this.isAdd) {
        addTestSuite(this.testSuite).then(response => {
          this.$notify.success(response.msg)
          // 关闭当前tagview
          this.$store.dispatch('tagsView/delView', this.$store.state.tagsView.visitedViews.filter(item => item.path === this.$route.path)[0])
          this.$router.back()
        })
      }
    }
  }
}
</script>
