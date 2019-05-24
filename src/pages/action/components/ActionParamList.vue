<template>
  <div>
    <el-table :data="params" border>
      <el-table-column align="center">
        <template slot="header">
          <el-button type="text" :disabled="!isAdd" @click="addParam">+</el-button>
          参数名
        </template>
        <template scope="{ row }">
          <el-input v-model="row.name" clearable>
            <el-button slot="append" v-clipboard:copy="'#{' + row.name + '}'" v-clipboard:success="onCopy">copy</el-button>
          </el-input>
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
