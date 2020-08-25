<template>
  <el-drawer
    :visible.sync="drawerVisible"
    direction="rtl"
    :with-header="false"
    size="60%"
    @open="onOpen"
  >
    <el-table :data="actions" highlight-current-row border>
      <el-table-column label="Action" align="center" prop="name" show-overflow-tooltip />
      <el-table-column label="描述" align="center" prop="description" show-overflow-tooltip />
      <el-table-column label="操作" width="180" align="center">
        <template scope="{ row }">
          <el-button size="mini" type="success" class="el-icon-document-copy" @click="copyAction(row)" />
          <el-button size="mini" type="primary" class="el-icon-edit" @click="updateAction(row.id)" />
          <el-button size="mini" type="danger" class="el-icon-delete" @click="deleteAction(row)" />
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>

<script>

import { getActionList, deleteAction } from '@/api/action'
export default {
  props: {
    visible: Boolean,
    pageId: Number
  },
  watch: {
    visible(val) {
      this.drawerVisible = val
    },
    drawerVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  data() {
    return {
      drawerVisible: false,
      actions: []
    }
  },
  methods: {
    onOpen() {
      this.fetchActionList()
    },
    fetchActionList() {
      getActionList({ pageId: this.pageId }).then(response => {
        this.actions = response.data
      })
    },
    copyAction(action) {
      this.drawerVisible = false
      const _action = JSON.parse(JSON.stringify(action))
      delete _action.id
      delete _action.createTime
      delete _action.creatorUid
      delete _action.creatorNickName
      delete _action.updateTime
      delete _action.updatorUid
      delete _action.updatorNickName
      this.$router.push({
        name: 'AddEncapsulationAction',
        params: _action
      })
    },
    updateAction(actionId) {
      this.drawerVisible = false
      this.$router.push({ name: 'UpdateEncapsulationAction', params: { actionId }})
    },
    deleteAction(action) {
      this.$confirm(`删除${action.name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAction(action.id).then(response => {
          this.$notify.success(response.msg)
          this.fetchActionList()
        })
      })
    }
  }
}
</script>
