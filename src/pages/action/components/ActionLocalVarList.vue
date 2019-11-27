<template>
  <div>
    <el-table :data="localVars" border height="250">
      <el-table-column label="" align="center" width="200">
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
      <el-table-column label="局部变量值" align="center" width="920">
        <template scope="{ row }">
          <el-row v-for="(environmentValue, index) in row.environmentValues" :key="environmentValue.environmentId" style="margin-bottom: 5px">
            <el-col :span="6">
              <el-select v-model="environmentValue.environmentId" placeholder="选择环境">
                <el-option v-for="environment in environmentList" :key="environment.id" :value="environment.id" :label="environment.name" />
              </el-select>
            </el-col>
            <el-col :span="15">
              <el-input v-model.trim="environmentValue.value" clearable/>
            </el-col>
            <el-col :span="3">
              <el-button style="margin-left: 5px" @click="addEnvironmentValue(row)">+</el-button>
              <el-button style="margin-left: 1px" @click="delEnvironmentValue(row, index)" :disabled="index === 0">-</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" width="200">
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
  props: {
    environmentList: Array
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
        type: 'String',
        name: '',
        environmentValues: [
          {
            environmentId: -1,
            value: ''
          }
        ],
        description: ''
      })
    },
    deleteLocalVar(index) {
      this.localVars.splice(index, 1)
    },
    addEnvironmentValue(row) {
      row.environmentValues.push({
        environmentId: undefined,
        value: ''
      })
    },
    delEnvironmentValue(row, index) {
      row.environmentValues.splice(index, 1)
    }
  }
}
</script>
