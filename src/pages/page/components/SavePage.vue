<template>
  <div>
    <mobile-inspector canvas-id="page-canvas" :window-info="windowInfo" :window-hierarchy="savePageForm.windowHierarchy" :tree-loading="false" />
    <el-form label-width="80px" style="margin-top: 5px">
      <el-form-item label="元素">
        <el-button @click="addElement">+</el-button>
        <el-row :gutter="2" v-for="(element, index) in savePageForm.elements" :key="index" style="margin-top: 3px">
          <el-col :span="6">
            <el-input v-model.trim="element.name" clearable placeholder="元素名">
              <template slot="prepend">WebElement</template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-cascader v-model="element.findBy" :options="findBys" placeholder="findBy" style="width: 100%"/>
          </el-col>
          <el-col :span="12">
            <el-input v-model.trim="element.value" clearable placeholder="value">
              <el-button slot="append" v-clipboard:copy="savePageForm.name + '_' + element.name" v-clipboard:success="onCopy">引用</el-button>
              <el-button slot="append" @click="delElement(index)">删除</el-button>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form label-width="80px">
          <el-form-item label="page名" :rules="[{required: true}]">
            <el-input v-model="savePageForm.name" clearable />
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="savePageForm.categoryId" clearable filterable @visible-change="pageCategorySelectChange" placeholder="选择分类">
              <el-option v-for="category in pageCategoryList" :key="category.id" :value="category.id" :label="category.name" />
            </el-select>
            <el-button @click="$router.push({ name: 'AddPageCategory' })">+</el-button>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="savePageForm.description" clearable />
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
        <el-form label-width="100px">
          <el-form-item label="图片名">
            <el-input v-model="savePageForm.imgPath" clearable :disabled="isAdd" />
          </el-form-item>
          <el-form-item label="window高">
            <el-input v-model="savePageForm.windowHeight" clearable :disabled="isAdd" />
          </el-form-item>
          <el-form-item label="window宽">
            <el-input v-model="savePageForm.windowWidth" clearable :disabled="isAdd" />
          </el-form-item>
          <el-form-item label="window方向">
            <el-input v-model="savePageForm.windowOrientation" clearable :disabled="isAdd" />
          </el-form-item>
          <el-form-item label="图片布局">
            <el-input v-model="savePageForm.windowHierarchy" clearable :disabled="isAdd" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import { addPage, updatePage, getPageList } from '@/api/page'
import { getCategoryList } from '@/api/category'
import MobileInspector from '@/pages/mobile/components/MobileInspector'
import clipboard from '@/directive/clipboard/index.js'

export default {
  directives: {
    clipboard
  },
  props: {
    isAdd: Boolean
  },
  components: {
    MobileInspector
  },
  data() {
    return {
      savePageForm: {
        id: undefined,
        name: '',
        projectId: this.$store.state.project.id,
        categoryId: undefined,
        description: '',
        imgPath: '',
        imgUrl: '',
        windowHeight: undefined,
        windowWidth: undefined,
        windowOrientation: undefined,
        deviceId: undefined,
        windowHierarchy: '',
        elements: []
      },
      pageCategoryList: []
    }
  },
  computed: {
    windowInfo() {
      return {
        windowWidth: this.savePageForm.windowWidth,
        windowHeight: this.savePageForm.windowHeight,
        windowOrientation: this.savePageForm.windowOrientation,
        imgUrl: this.savePageForm.imgUrl
      }
    },
    findBys() {
      const findBys = [{
        value: '@AndroidFindBy',
        label: 'AndroidFindBy',
        children: [{
          value: 'uiAutomator',
          label: 'uiAutomator'
        }, {
          value: 'accessibility',
          label: 'accessibility'
        }, {
          value: 'id',
          label: 'id'
        }, {
          value: 'xpath',
          label: 'xpath'
        }]
      }, {
        value: '@iOSXCUITFindBy',
        label: 'iOSFindBy',
        children: [{
          value: 'iOSClassChain',
          label: 'iOSClassChain'
        }, {
          value: 'iOSNsPredicate',
          label: 'iOSNsPredicate'
        }, {
          value: 'accessibility',
          label: 'accessibility'
        }, {
          value: 'id',
          label: 'id'
        }, {
          value: 'xpath',
          label: 'xpath'
        }]
      }, {
        value: '@FindBy',
        label: 'WebFindBy',
        children: [{
          value: 'id',
          label: 'id'
        }, {
          value: 'name',
          label: 'name'
        }, {
          value: 'className',
          label: 'className'
        }, {
          value: 'css',
          label: 'css'
        }, {
          value: 'tagName',
          label: 'tagName'
        }, {
          value: 'linkText',
          label: 'linkText'
        }, {
          value: 'partialLinkText',
          label: 'partialLinkText'
        }, {
          value: 'xpath',
          label: 'xpath'
        }]
      }]
      const platform = this.$store.state.project.platform
      if (platform === 1 || platform === 3 || platform === 4) {
        // 移除iOS
        findBys.splice(1, 1)
      } else if (platform === 2) {
        // 移除android
        findBys.splice(0, 1)
      } else {
        // 移除android ios
        findBys.splice(0, 2)
      }
      return findBys
    }
  },
  created() {
    this.fetchPageCategoryList() // 防止el-select只显示category id
    if (!this.isAdd) {
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
    onCopy(e) {
      this.$notify.success(e.text + '复制成功')
    },
    savePageSuccess(msg) {
      this.$notify.success(msg)
      if (this.isAdd) {
        // 关闭当前tagview
        this.$store.dispatch('tagsView/delView', this.$store.state.tagsView.visitedViews.filter(item => item.path === this.$route.path)[0])
        this.$router.back()
      }
    },
    savePage() {
      if (this.isAdd) {
        addPage(this.savePageForm).then(response => {
          this.savePageSuccess(response.msg)
        })
      } else {
        updatePage(this.savePageForm).then(response => {
          this.savePageSuccess(response.msg)
        })
      }
    },
    // el-select实时获取最新的page分类
    pageCategorySelectChange(type) {
      if (type) {
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
        findBy: [],
        value: ''
      })
    },
    delElement(index) {
      this.savePageForm.elements.splice(index, 1)
    }
  }
}
</script>
