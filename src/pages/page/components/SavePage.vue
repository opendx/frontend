<template>
  <el-container style="height: 100%">
    <el-container>
      <el-header height="50px">
        <el-popover placement="right" trigger="click">
          <mobile-inspector style="width: 1200px; height: 650px" canvas-id="page-canvas" :page-type="savePageForm.type" :window-info="windowInfo" :window-hierarchy="savePageForm.windowHierarchy" :tree-loading="false" />
          <el-button icon="el-icon-search" slot="reference">{{ pageType + ' - Inspector' }}</el-button>
        </el-popover>

        <el-button @click="$router.push({ name: 'AddPageCategory' })">添加分类</el-button>
        <el-select v-model="savePageForm.categoryId" clearable filterable @visible-change="pageCategorySelectChange" placeholder="选择分类">
          <el-option v-for="category in pageCategoryList" :key="category.id" :value="category.id" :label="category.name" />
        </el-select>

        <span style="margin-left: 10px" class="required"/><el-input v-model="savePageForm.name" clearable style="width: 200px" placeholder="page名" />
        <el-button type="primary" @click="savePage">保 存</el-button>
      </el-header>

      <el-main>
        <el-form label-width="80px">
          <el-form-item label="描述">
            <el-input v-model="savePageForm.description" type="textarea" :autosize="{ minRows: 1 }" clearable />
          </el-form-item>
          <el-form-item label="元素">
            <el-button @click="addElement" style="margin-bottom: 5px">+</el-button>
            <el-table :data="savePageForm.elements" border>
              <el-table-column align="center" label="WebElement">
                <template scope="{ row }">
                  <el-input v-model.trim="row.name" clearable />
                </template>
              </el-table-column>
              <el-table-column align="center" label="定位方式">
                <template scope="{ row }">
                  <el-cascader
                    v-model="row.findBy"
                    :options="findBys"
                    style="width: 100%"
                    :props="{ expandTrigger: 'hover' }"
                  />
                </template>
              </el-table-column>
              <el-table-column align="center" label="值">
                <template scope="{ row }">
                  <image-input v-model="row.value" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="描述">
                <template scope="{ row }">
                  <el-input v-model="row.description" type="textarea" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="150">
                <template scope="scope">
                  <el-button v-clipboard:copy="savePageForm.name + '_' + scope.row.name" v-clipboard:success="onCopy">引用</el-button>
                  <el-button @click="delElement(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="By">
            <el-button @click="addBy" style="margin-bottom: 5px">+</el-button>
            <el-table :data="savePageForm.bys" border>
              <el-table-column align="center" label="By">
                <template scope="{ row }">
                  <el-input v-model.trim="row.name" clearable />
                </template>
              </el-table-column>
              <el-table-column align="center" label="定位方式">
                <template scope="{ row }">
                  <el-cascader
                    v-model="row.findBy"
                    :options="bys"
                    style="width: 100%"
                    :props="{ expandTrigger: 'hover' }" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="值">
                <template scope="{ row }">
                  <image-input v-model="row.value" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="描述">
                <template scope="{ row }">
                  <el-input v-model="row.description" type="textarea" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="150">
                <template scope="scope">
                  <el-button v-clipboard:copy="savePageForm.name + '_' + scope.row.name" v-clipboard:success="onCopy">引用</el-button>
                  <el-button @click="delBy(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form label-width="80px">
              <el-form-item label="图片Path">
                <el-input v-model="savePageForm.imgPath" clearable :disabled="isAdd" />
              </el-form-item>
              <el-form-item label="布局">
                <el-input v-model="savePageForm.windowHierarchy" clearable :disabled="isAdd" />
              </el-form-item>
              <el-form-item label="设备id">
                <el-input v-model="savePageForm.deviceId" clearable :disabled="isAdd" />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form label-width="100px">
              <el-form-item label="window高">
                <el-input v-model="savePageForm.windowHeight" clearable :disabled="isAdd" />
              </el-form-item>
              <el-form-item label="window宽">
                <el-input v-model="savePageForm.windowWidth" clearable :disabled="isAdd" />
              </el-form-item>
              <el-form-item label="window方向">
                <el-input v-model="savePageForm.windowOrientation" clearable :disabled="isAdd" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>

import { addPage, updatePage, getPageList } from '@/api/page'
import { getCategoryList } from '@/api/category'
import MobileInspector from '@/pages/mobile/components/MobileInspector'
import clipboard from '@/directive/clipboard/index.js'
import ImageInput from '@/components/ImageInput'

export default {
  directives: {
    clipboard
  },
  props: {
    isAdd: Boolean
  },
  components: {
    MobileInspector,
    ImageInput
  },
  data() {
    return {
      savePageForm: {
        id: undefined,
        name: '',
        projectId: this.$store.state.project.id,
        type: undefined,
        categoryId: undefined,
        description: '',
        imgPath: '',
        imgUrl: '',
        windowHeight: undefined,
        windowWidth: undefined,
        windowOrientation: undefined,
        deviceId: undefined,
        windowHierarchy: '',
        elements: [],
        bys: []
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
    pageType() {
      const pageType = this.savePageForm.type
      if (pageType === 1) {
        return 'Android Native'
      } else if (pageType === 2) {
        return 'iOS Native'
      } else {
        return 'Web'
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

      const pageType = this.savePageForm.type
      if (pageType === 1) { // android原生
        // 移除iOS
        findBys.splice(1, 1)
      } else if (pageType === 2) { // ios原生
        // 移除android
        findBys.splice(0, 1)
      } else { // web
        // 移除android ios
        findBys.splice(0, 2)
      }

      return findBys
    },
    bys() {
      const bys = [{
        value: 'MobileBy',
        label: 'By',
        children: [{
          value: 'id',
          label: 'id'
        }, {
          value: 'AccessibilityId',
          label: 'AccessibilityId'
        }, {
          value: 'xpath',
          label: 'xpath'
        }, {
          value: 'AndroidUIAutomator',
          label: 'AndroidUIAutomator'
        }, {
          value: 'iOSClassChain',
          label: 'iOSClassChain'
        }, {
          value: 'iOSNsPredicateString',
          label: 'iOSNsPredicateString'
        }, {
          value: 'image',
          label: 'image'
        }, {
          value: 'className',
          label: 'className'
        }, {
          value: 'name',
          label: 'name'
        }, {
          value: 'cssSelector',
          label: 'cssSelector'
        }, {
          value: 'linkText',
          label: 'linkText'
        }, {
          value: 'partialLinkText',
          label: 'partialLinkText'
        }, {
          value: 'tagName',
          label: 'tagName'
        }]
      }]
      return bys
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
    addBy() {
      this.savePageForm.bys.push({
        name: '',
        findBy: [],
        value: ''
      })
    },
    delElement(index) {
      this.savePageForm.elements.splice(index, 1)
    },
    delBy(index) {
      this.savePageForm.bys.splice(index, 1)
    }
  }
}
</script>
<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 50px;
  }
</style>
