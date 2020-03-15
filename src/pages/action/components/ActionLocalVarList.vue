<template>
  <div>
    <el-table :data="localVars" border max-height="500">
      <el-table-column align="center" width="150">
        <template slot="header">
          <el-button type="text" class="el-icon-circle-plus" @click="addLocalVar" />
          局部变量类型
        </template>
        <template scope="{ row }">
          <el-input v-model.trim="row.type" type="textarea" />
        </template>
      </el-table-column>
      <el-table-column label="局部变量名" align="center" width="200">
        <template scope="{ row }">
          <el-input v-model.trim="row.name" type="textarea" />
        </template>
      </el-table-column>
      <el-table-column label="局部变量值" align="center" min-width="500">
        <template scope="{ row }">
          <el-table :data="row.environmentValues" border>
            <el-table-column label="环境" align="center" width="150">
              <template scope = "{ row }">
                <el-select v-model="row.environmentId" placeholder="选择环境" style="width: 100%">
                  <el-option v-for="environment in environmentList" :key="environment.id" :value="environment.id" :label="environment.name" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="值" align="center">
              <template scope="{ row }">
                <image-input v-model="row.value" />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template scope="scope">
                <el-button-group>
                  <el-button @click="addEnvironmentValue(row, scope.$index)">+</el-button>
                  <el-button @click="delEnvironmentValue(row, scope.$index)" :disabled="scope.$index === 0">-</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" width="150">
        <template scope="{ row }">
          <el-input type="textarea" v-model.trim="row.description" clearable />
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
import ImageInput from '@/components/ImageInput'
export default {
  props: {
    environmentList: Array
  },
  components: {
    ImageInput
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
    addEnvironmentValue(row, index) {
      row.environmentValues.splice(index + 1, 0, {
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
