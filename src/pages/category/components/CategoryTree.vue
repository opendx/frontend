<template>
  <div>
    <el-tree
      :data="treeData"
      :props="{ children: 'children', label: 'name' }"
      highlight-current
      default-expand-all
      :expand-on-click-node="false"
      @node-click="nodeClick"
      :render-content="renderContent"
    >
    </el-tree>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="saveCategoryForm" label-width="100">
        <el-form-item label="分类名" :rules="[{required: true}]">
          <el-input v-model.trim="saveCategoryForm.name" clearable style="width: 300px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCategory">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { getCategoryTree, deleteCategory, addCategory, updateCategory } from '@/api/category'

export default {
  props: {
    type: Number
  },
  data() {
    return {
      treeData: [{
        name: '全部',
        id: undefined,
        children: []
      }],
      dialogTitle: '',
      dialogFormVisible: false,
      saveCategoryForm: {
        id: undefined,
        name: '',
        type: this.type,
        projectId: this.$store.state.project.id,
        parentId: 0
      },
      isAddCategory: false
    }
  },
  created() {
    this.fetchCategoryTree()
  },
  methods: {
    fetchCategoryTree() {
      getCategoryTree(this.$store.state.project.id, this.type).then(response => {
        this.treeData[0].children = response.data
      })
    },
    nodeClick(data) {
      this.$emit('categoryClick', data.id)
    },
    renderContent(h, { node, data, store }) {
      if (!data.id) { // 全部
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button class="el-icon-circle-plus" size="mini" type="text" on-click={ () => this.add(data) } />
            </span>
          </span>
        )
      }
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button class="el-icon-circle-plus" size="mini" type="text" on-click={ () => this.add(data) } />
            <el-button class="el-icon-edit" size="mini" type="text" on-click={ () => this.update(data) } />
            <el-button class="el-icon-delete" size="mini" type="text" on-click={ () => this.remove(node, data) } />
          </span>
        </span>
      )
    },
    add(data) {
      this.dialogTitle = '添加分类'
      this.isAddCategory = true
      this.saveCategoryForm.id = undefined
      this.saveCategoryForm.name = ''
      this.saveCategoryForm.parentId = data.id ? data.id : 0
      this.dialogFormVisible = true
    },
    update(data) {
      this.dialogTitle = '修改分类'
      this.isAddCategory = false
      this.saveCategoryForm.id = data.id
      this.saveCategoryForm.name = data.name
      this.saveCategoryForm.parentId = data.parentId
      this.dialogFormVisible = true
    },
    remove(node, data) {
      this.$confirm('删除' + data.name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategory(data.id, data.type, this.$store.state.project.id).then(resp => {
          this.$notify.success(resp.msg)
          this.fetchCategoryTree()
        })
      })
    },
    saveCategory() {
      if (this.isAddCategory) {
        addCategory(this.saveCategoryForm).then(() => {
          this.fetchCategoryTree()
          this.dialogFormVisible = false
        })
      } else {
        updateCategory(this.saveCategoryForm).then(() => {
          this.fetchCategoryTree()
          this.dialogFormVisible = false
        })
      }
    }
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
