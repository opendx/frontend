<template>
  <div>
    <el-button size="mini" type="primary" :disabled="!isAdd" @click="addParam">添加参数</el-button>
    <el-table :data="params" border style="margin-top: 4px">
      <el-table-column label="参数名" align="center">
        <template scope="{ row }">
          <el-input v-model="row.name" clearable style="width: 95%" />
          <el-button v-clipboard:copy="'#{' + row.name + '}'" v-clipboard:success="onCopy" type="text">copy</el-button>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template scope="{ row }">
          <el-input v-model="row.description" clearable />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template scope="scope">
          <el-button type="danger" size="mini" :disabled="!isAdd" @click="deleteParam(scope.$index)">删除</el-button>
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
  props: {
    isAdd: Boolean
  },
  data() {
    return {
      params: []
    }
  },
  methods: {
    addParam() {
      this.params.push({
        name: '',
        description: ''
      })
    },
    deleteParam(index) {
      this.params.splice(index, 1)
    },
    onCopy(e) {
      this.$notify.success(e.text + '复制成功')
    }
  }
}
</script>
