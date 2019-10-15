<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form :model="savePageForm" label-width="100px">
          <el-form-item label="page名" :rules="[{required: true}]">
            <el-input v-model="savePageForm.name" clearable />
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="savePageForm.categoryId" clearable filterable @visible-change="getPageCategoryList">
              <el-option v-for="category in pageCategoryList" :key="category.id" :value="category.id" :label="category.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="savePageForm.description" clearable />
          </el-form-item>
          <el-form-item label="图片下载地址">
            <el-input v-model="savePageForm.imgUrl" clearable :disabled="isAdd" />
          </el-form-item>
          <el-form-item label="图片高">
            <el-input v-model="savePageForm.imgHeight" clearable :disabled="isAdd" />
          </el-form-item>
          <el-form-item label="图片宽">
            <el-input v-model="savePageForm.imgWidth" clearable :disabled="isAdd" />
          </el-form-item>
          <el-form-item label="图片布局">
            <el-input v-model="savePageForm.windowHierarchy" clearable :disabled="isAdd" />
          </el-form-item>
          <el-form-item label="设备id">
            <el-input v-model="savePageForm.deviceId" clearable :disabled="isAdd" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="savePage">保 存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <img :src="savePageForm.imgUrl" style="width: 320px">
      </el-col>
    </el-row>
  </div>
</template>
<script>

import { addPage, updatePage } from '@/api/page'
import { getCategoryList } from '@/api/category'

export default {
  props: {
    isAdd: Boolean
  },
  data() {
    return {
      savePageForm: {
        id: undefined,
        name: '',
        projectId: undefined,
        categoryId: undefined,
        description: '',
        imgUrl: '',
        imgHeight: undefined,
        imgWidth: undefined,
        deviceId: undefined,
        windowHierarchy: ''
      },
      pageCategoryList: []
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.id
    }
  },
  created() {
    if (!this.isAdd) {
      this.fetchPageCategoryList() // 防止el-select只显示category id
    }
    this.savePageForm = this.$route.params
    this.savePageForm.projectId = this.projectId
  },
  methods: {
    savePage() {
      if (this.isAdd) {
        addPage(this.savePageForm).then(response => {
          this.$notify.success(response.msg)
          this.$router.push({
            path: '/page/list'
          })
        })
      } else {
        updatePage(this.savePageForm).then(response => {
          this.$notify.success(response.msg)
          this.$router.push({
            path: '/page/list'
          })
        })
      }
    },
    // el-select实时获取最新的page分类
    getPageCategoryList(type) {
      if (type === true) {
        this.fetchPageCategoryList()
      }
    },
    fetchPageCategoryList() {
      getCategoryList({
        projectId: this.projectId,
        type: 1 // pageCategory
      }).then(response => {
        this.pageCategoryList = response.data
      })
    }
  }
}
</script>
