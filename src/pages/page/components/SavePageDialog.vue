<template>
  <el-dialog :title="title" :visible="true" :show-close="false" width="1300px">
    <mobile-inspector canvas-id="page-canvas" :img-info="imgInfo" :window-hierarchy="savePageForm.windowHierarchy" :tree-loading="false" />
    <el-form label-width="100px">
      <el-form-item label="元素">
        <el-button @click="addElement">+</el-button>
        <el-row :gutter="5" v-for="(element, index) in savePageForm.elements" :key="element.name" style="margin-top: 3px">
          <el-col :span="5">
            <el-input v-model.trim="element.name" clearable placeholder="元素名"/>
          </el-col>
          <el-col :span="4">
            <el-input v-model.trim="element.findBy" clearable placeholder="findBy"/>
          </el-col>
          <el-col :span="14">
            <el-input v-model.trim="element.value" clearable placeholder="value"/>
          </el-col>
          <el-col :span="1">
            <el-button @click="delElement(index)">-</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form label-width="100px">
          <el-form-item label="page名" :rules="[{required: true}]">
            <el-input v-model="savePageForm.name" clearable />
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="savePageForm.categoryId" clearable filterable @visible-change="getPageCategoryList" placeholder="选择分类">
              <el-option v-for="category in pageCategoryList" :key="category.id" :value="category.id" :label="category.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="savePageForm.description" clearable />
          </el-form-item>
          <el-form-item label="设备id">
            <el-input v-model="savePageForm.deviceId" clearable :disabled="isAdd" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form label-width="100px">
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
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button type="primary" @click="savePage">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>

import { addPage, updatePage, getPageList } from '@/api/page'
import { getCategoryList } from '@/api/category'
import MobileInspector from '@/pages/mobile/components/MobileInspector'

export default {
  props: {
    isAdd: Boolean
  },
  components: {
    MobileInspector
  },
  data() {
    return {
      title: this.isAdd ? '添加Page' : '更新Page',
      savePageForm: {
        id: undefined,
        name: '',
        projectId: this.$store.state.project.id,
        categoryId: undefined,
        description: '',
        imgUrl: '',
        imgHeight: undefined,
        imgWidth: undefined,
        deviceId: undefined,
        windowHierarchy: '',
        elements: []
      },
      pageCategoryList: []
    }
  },
  computed: {
    imgInfo() {
      return {
        imgWidth: this.savePageForm.imgWidth,
        imgHeight: this.savePageForm.imgHeight,
        imgUrl: this.savePageForm.imgUrl
      }
    }
  },
  created() {
    if (!this.isAdd) {
      this.fetchPageCategoryList() // 防止el-select只显示category id
      getPageList({ id: this.$route.params.pageId }).then(response => {
        this.savePageForm = response.data[0]
      })
    } else {
      setTimeout(() => {
        // 若这里不用异步 MobileInspector watch无法监听到windowHierarchy
        this.savePageForm = this.$route.params
      }, 100)
    }
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
        projectId: this.$store.state.project.id,
        type: 1 // pageCategory
      }).then(response => {
        this.pageCategoryList = response.data
      })
    },
    addElement() {
      this.savePageForm.elements.push({
        name: '',
        findBy: '',
        value: ''
      })
    },
    delElement(index) {
      this.savePageForm.elements.splice(index, 1)
    }
  }
}
</script>
