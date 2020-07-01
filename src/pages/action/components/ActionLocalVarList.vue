<template>
  <div>
    <el-table :data="localVarList" border :height="tableHeight">
      <el-table-column align="center">
        <template slot="header">
          <el-button type="text" class="el-icon-circle-plus" @click="addLocalVar(localVarList.length)" />
          局部变量类型
        </template>
        <template scope="{ row }">
          <el-input v-model.trim="row.type" clearable />
        </template>
      </el-table-column>
      <el-table-column label="局部变量名" align="center">
        <template scope="{ row }">
          <el-input v-model.trim="row.name" type="textarea" :autosize="{ minRows: 1 }" />
        </template>
      </el-table-column>
      <el-table-column label="局部变量值" align="center" min-width="320">
        <template scope="{ row }">
          <el-table :data="row.environmentValues" border>
            <el-table-column label="环境" align="center" width="120">
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
            <el-table-column label="操作" align="center" width="85">
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
      <el-table-column label="描述" align="center">
        <template scope="{ row }">
          <el-input type="textarea" v-model.trim="row.description" clearable :autosize="{ minRows: 1 }" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="85">
        <template scope="scope">
          <el-button-group>
            <el-button @click="addLocalVar(scope.$index)">+</el-button>
            <el-button @click="deleteLocalVar(scope.$index)">-</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ImageInput from '@/components/ImageInput'
export default {
  props: {
    environmentList: Array,
    tableHeight: Number,
    localVars: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ImageInput
  },
  watch: {
    localVars() {
      this.localVarList = this.localVars
    },
    localVarList() {
      this.$emit('update:localVars', this.localVarList)
    }
  },
  data() {
    return {
      returnValue: null,
      localVarList: this.localVars
    }
  },
  methods: {
    addLocalVar(index) {
      this.localVarList.splice(index + 1, 0, {
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
      this.localVarList.splice(index, 1)
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
