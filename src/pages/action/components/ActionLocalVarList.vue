<template>
  <div>
    <el-button size="mini" type="primary" @click="addLocalVar">添加局部变量</el-button>
    <el-table :data="localVars" border style="margin-top: 4px">
      <el-table-column label="局部变量名" align="center">
        <template scope="{ row }">
          <el-input v-model="row.name" clearable style="width: 90%" />
          <el-button v-clipboard:copy="'@{' + row.name + '}'" v-clipboard:success="onCopy" type="text">copy</el-button>
        </template>
      </el-table-column>
      <el-table-column label="局部变量值" align="center">
        <template scope="{ row }">
          <el-input v-model="row.value" clearable />
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template scope="{ row }">
          <el-input v-model="row.description" clearable />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template scope="scope">
          <el-button type="danger" size="mini" @click="deleteLocalVar(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import clipboard from '@/directive/clipboard/index.js'
export default {
  directives: {
    clipboard
  },
  data() {
    return {
      returnValue: null,
      localVars: []
    }
  },
  methods: {
    addLocalVar() {
      this.localVars.push({
        name: '',
        value: '',
        description: ''
      })
    },
    deleteLocalVar(index) {
      this.localVars.splice(index, 1)
    },
    onCopy(e) {
      this.$notify.success(e.text + '复制成功')
    }
  }
}
</script>
