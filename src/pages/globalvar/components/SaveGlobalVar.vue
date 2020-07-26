<template>
  <el-form :data="globalVar" label-width="100px">
    <el-form-item label="分类">
      <el-select v-model="globalVar.categoryId" @visible-change="categorySelectChange" clearable filterable placeholder="选择分类">
        <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="变量类型" :rules="[{required: true}]">
      <el-input v-model.trim="globalVar.type" clearable style="width: 300px" />
    </el-form-item>
    <el-form-item label="变量名" :rules="[{required: true}]">
      <el-input v-model.trim="globalVar.name" clearable style="width: 300px" />
    </el-form-item>
    <el-form-item label="变量值" :rules="[{required: true}]">
      <el-table :data="globalVar.environmentValues" border>
        <el-table-column align="center" label="环境" width="200">
          <template scope="{ row }">
            <el-select v-model="row.environmentId" @visible-change="envSelectChange" placeholder="选择环境" style="width: 100%">
              <el-option v-for="environment in environmentList" :key="environment.id" :value="environment.id" :label="environment.name" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="值">
          <template scope="{ row }">
            <image-input v-model.trim="row.value" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template scope="scope">
            <el-button-group>
              <el-button @click="addEnvironmentValue(scope.$index)">+</el-button>
              <el-button @click="delEnvironmentValue(scope.$index)" :disabled="scope.$index === 0">-</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item label="描述">
      <el-input v-model.trim="globalVar.description" type="textarea" style="width: 300px" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveGlobalVar">保 存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>

import { addGlobalVar, updateGlobalVar, getGlobalVarList } from '@/api/globalvar'
import { getCategoryList } from '@/api/category'
import { getEnvironmentList } from '@/api/environment'
import ImageInput from '@/components/ImageInput'

export default {
  props: {
    isAdd: Boolean
  },
  components: {
    ImageInput
  },
  data() {
    return {
      globalVar: {
        id: undefined,
        type: 'String',
        name: '',
        environmentValues: [
          {
            environmentId: -1,
            value: ''
          }
        ],
        description: '',
        categoryId: undefined,
        projectId: this.$store.state.project.id
      },
      environmentList: [],
      categories: []
    }
  },
  created() {
    this.fetchEnvironmentList()
    this.fetchCategoryList()
    if (!this.isAdd) {
      getGlobalVarList({ id: this.$route.params.globalVarId }).then(response => {
        this.globalVar = response.data[0]
      })
    }
  },
  methods: {
    fetchCategoryList() {
      getCategoryList({ projectId: this.globalVar.projectId, type: 3 }).then(response => {
        this.categories = response.data
      })
    },
    categorySelectChange(type) {
      if (type) {
        this.fetchCategoryList()
      }
    },
    envSelectChange(type) {
      if (type) {
        this.fetchEnvironmentList()
      }
    },
    saveGlobalVarSuccess(msg) {
      this.$notify.success(msg)
      // 关闭当前tagview
      this.$store.dispatch('tagsView/delView', this.$store.state.tagsView.visitedViews.filter(item => item.path === this.$route.path)[0])
      this.$router.back()
    },
    saveGlobalVar() {
      if (this.isAdd) {
        addGlobalVar(this.globalVar).then(response => {
          this.saveGlobalVarSuccess(response.msg)
        })
      } else {
        updateGlobalVar(this.globalVar).then(response => {
          this.saveGlobalVarSuccess(response.msg)
        })
      }
    },
    fetchEnvironmentList() {
      getEnvironmentList({ projectId: this.$store.state.project.id }).then(response => {
        this.environmentList = [
          {
            id: -1,
            name: '默认'
          }
        ].concat(response.data)
      })
    },
    addEnvironmentValue(index) {
      this.globalVar.environmentValues.splice(index + 1, 0, {
        environmentId: undefined,
        value: ''
      })
    },
    delEnvironmentValue(index) {
      this.globalVar.environmentValues.splice(index, 1)
    }
  }
}
</script>
