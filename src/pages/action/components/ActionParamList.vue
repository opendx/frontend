<template>
  <el-table :data="paramList" border>
    <el-table-column align="center">
      <template slot="header">
        <el-button type="text" class="el-icon-circle-plus" @click="addParam" />
        方法参数类型
      </template>
      <template scope="{ row }">
        <el-input v-model.trim="row.type" clearable />
      </template>
    </el-table-column>
    <el-table-column label="方法参数名" align="center">
      <template scope="{ row }">
        <el-input v-model.trim="row.name" clearable />
      </template>
    </el-table-column>
    <el-table-column label="描述" align="center">
      <template scope="{ row }">
        <el-input type="textarea" v-model.trim="row.description" :autosize="{ minRows: 1 }" />
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="45">
      <template scope="scope">
        <el-button type="text" class="el-icon-delete" @click="deleteParam(scope.$index)" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    params: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    params() {
      this.paramList = this.params
    },
    paramList() {
      this.$emit('update:params', this.paramList)
    }
  },
  data() {
    return {
      paramList: this.params
    }
  },
  methods: {
    addParam() {
      this.paramList.push({
        type: 'String',
        name: '',
        description: ''
      })
    },
    deleteParam(index) {
      this.paramList.splice(index, 1)
    }
  }
}
</script>
