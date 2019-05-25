<template>
  <div>
    <el-table :data="params" border>
      <el-table-column align="center">
        <template slot="header">
          <i v-show="isAdd" class="el-icon-circle-plus" @click="addParam" />
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
      <el-table-column label="操作" align="center" width="50">
        <template scope="scope">
          <i class="el-icon-delete" @click="deleteParam(scope.$index)" />
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
