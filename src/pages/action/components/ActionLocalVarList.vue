<template>
  <div>
    <el-table :data="localVars" border>
      <el-table-column label="" align="center">
        <template slot="header">
          <el-button type="text" @click="addLocalVar">+</el-button>
          局部变量名
        </template>
        <template scope="{ row }">
          <el-input v-model="row.name" clearable>
            <el-button slot="append" v-clipboard:copy="'@{' + row.name + '}'" v-clipboard:success="onCopy">copy</el-button>
          </el-input>
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
