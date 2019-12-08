<template>
  <el-dialog :title="title" :visible="true" :show-close="false">
    <el-form :data="category" label-width="100px">
      <el-form-item label="分类名" :rules="[{required: true}]">
        <el-input v-model.trim="category.name" clearable style="width: 300px" />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button type="primary" @click="saveCategory">保 存</el-button>
    </div>
  </el-dialog>
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
      title: this.isAdd ? '添加分类' : '更新分类',
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
          this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
          this.$router.back()
        })
      }
    }
  }
}
</script>
