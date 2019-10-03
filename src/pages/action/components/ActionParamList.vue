<template>
  <div>
    <el-table :data="params" border height="250">
      <el-table-column align="center">
        <template slot="header">
          <el-button type="text" :disabled="!isAdd" class="el-icon-circle-plus" @click="addParam" />
          参数名
        </template>
        <template scope="{ row }">
          <el-input v-model="row.name" :disabled="!isAdd" clearable />
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template scope="{ row }">
          <el-input v-model="row.description" clearable />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="50">
        <template scope="scope">
          <el-button type="text" :disabled="!isAdd" class="el-icon-delete" @click="deleteParam(scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
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
    }
  }
}
</script>
