<template>
  <div>
    <el-table :data="localVars" border height="250">
      <el-table-column label="" align="center">
        <template slot="header">
          <el-button type="text" class="el-icon-circle-plus" @click="addLocalVar" />
          局部变量类型
        </template>
        <template scope="{ row }">
          <el-input v-model.trim="row.type" clearable />
        </template>
      </el-table-column>
      <el-table-column label="局部变量名" align="center">
        <template scope="{ row }">
          <el-input v-model.trim="row.name" clearable />
        </template>
      </el-table-column>
      <el-table-column label="局部变量值" align="center">
        <template scope="{ row }">
          <el-input v-model.trim="row.value" clearable />
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template scope="{ row }">
          <el-input v-model.trim="row.description" clearable />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="50">
        <template scope="scope">
          <el-button type="text" class="el-icon-delete" @click="deleteLocalVar(scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      returnValue: null,
      localVars: []
    }
  },
  methods: {
    addLocalVar() {
      this.localVars.push({
        type: 'String',
        name: '',
        value: '',
        description: ''
      })
    },
    deleteLocalVar(index) {
      this.localVars.splice(index, 1)
    }
  }
}
</script>
