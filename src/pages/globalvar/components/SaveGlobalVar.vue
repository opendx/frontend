<template>
  <el-form :data="globalVar" label-width="100px">
    <el-form-item label="变量类型" :rules="[{required: true}]">
      <el-input v-model.trim="globalVar.type" clearable style="width: 300px" :disabled="!isAdd" />
    </el-form-item>
    <el-form-item label="变量名" :rules="[{required: true}]">
      <el-input v-model.trim="globalVar.name" clearable style="width: 300px" :disabled="!isAdd" />
    </el-form-item>
    <el-form-item label="变量值" :rules="[{required: true}]">
      <el-row :gutter="12" v-for="(environmentValue, index) in globalVar.environmentValues" :key="index" style="margin-bottom: 5px">
        <el-col :span="6">
          <el-select v-model="environmentValue.environmentId" placeholder="选择环境" style="width: 100%">
            <el-option v-for="environment in environmentList" :key="environment.id" :value="environment.id" :label="environment.name" />
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input v-model.trim="environmentValue.value" clearable />
        </el-col>
        <el-col :span="5">
          <el-button @click="addEnvironmentValue">+</el-button>
          <el-button @click="delEnvironmentValue(index)" :disabled="index === 0">-</el-button>
        </el-col>
      </el-row>
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
import { getEnvironmentList } from '@/api/environment'

export default {
  props: {
    isAdd: Boolean
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
        projectId: this.$store.state.project.id
      },
      environmentList: [
        {
          id: -1,
          name: '默认'
        }
      ]
    }
  },
  created() {
    if (!this.isAdd) {
      getGlobalVarList({ id: this.$route.params.globalVarId }).then(response => {
        this.globalVar = response.data[0]
      })
    }
    this.fetchEnvironmentList()
  },
  methods: {
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
        this.environmentList = this.environmentList.concat(response.data)
      })
    },
    addEnvironmentValue() {
      this.globalVar.environmentValues.push({
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
