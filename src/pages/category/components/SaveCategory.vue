<template>
  <el-form :data="category" label-width="100px">
    <el-form-item label="分类名" :rules="[{required: true}]">
      <el-input v-model.trim="category.name" clearable style="width: 300px" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveCategory">保 存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>

import { addCategory } from '@/api/category'

export default {
  props: {
    isAdd: Boolean,
    type: Number
  },
  data() {
    return {
      category: {
        id: undefined,
        name: '',
        type: this.type,
        projectId: this.$store.state.project.id
      }
    }
  },
  methods: {
    saveCategory() {
      if (this.isAdd) {
        addCategory(this.category).then(response => {
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
