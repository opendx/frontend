<template>
  <el-container style="height: 100%">
    <el-header height="50px">
      <el-popover placement="right" trigger="click">
        <device-inspector style="width: 1200px; height: 650px" canvas-id="page-canvas" :page-type="savePageForm.type" :window-info="windowInfo" :window-hierarchy="savePageForm.windowHierarchy" :tree-loading="false" />
        <el-button icon="el-icon-search" slot="reference">{{ `${pageType} - Inspector` }}</el-button>
      </el-popover>

      <el-select v-model="savePageForm.categoryId" clearable filterable @visible-change="pageCategorySelectChange" placeholder="选择分类">
        <el-option v-for="category in pageCategoryList" :key="category.id" :value="category.id" :label="category.name" />
      </el-select>

      <span class="required" /><el-input v-model="savePageForm.name" clearable style="width: 200px" placeholder="page名" />
      <el-button type="primary" @click="savePage">保 存</el-button>

      <el-button @click="addAction">添加Action</el-button>
      <el-button @click="showPageAction">查看Action</el-button>
    </el-header>

    <page-action-drawer :page-id="savePageForm.id" :visible.sync="showPageActionDrawer" />

    <el-main>
      <el-form label-width="80px">
        <el-form-item label="描述">
          <el-input v-model="savePageForm.description" type="textarea" :autosize="{ minRows: 1 }" clearable />
        </el-form-item>
        <el-form-item label="元素">
          <el-table :data="savePageForm.elements" border>
            <el-table-column align="center">
              <template slot="header">
                <el-button @click="addElement(savePageForm.elements.length)" type="text" class="el-icon-circle-plus" />
                WebElement
              </template>
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
                  filterable
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
                <el-input v-model="row.description" type="textarea" :autosize="{ minRows: 1 }" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
              <template scope="scope">
                <el-button-group>
                  <el-button size="mini" v-clipboard:copy="`${savePageForm.name}_${scope.row.name}`" v-clipboard:success="onCopySuccess">引用</el-button>
                  <el-button size="mini" @click="addElement(scope.$index)">+</el-button>
                  <el-button size="mini" @click="delElement(scope.$index)">-</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="By">
          <el-table :data="savePageForm.bys" border>
            <el-table-column align="center">
              <template slot="header">
                <el-button @click="addBy(savePageForm.bys.length)" type="text" class="el-icon-circle-plus" />
                By
              </template>
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
                  filterable
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
                <el-input v-model="row.description" type="textarea" :autosize="{ minRows: 1 }" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
              <template scope="scope">
                <el-button-group>
                  <el-button size="mini" v-clipboard:copy="`${savePageForm.name}_${scope.row.name}`" v-clipboard:success="onCopySuccess">引用</el-button>
                  <el-button size="mini" @click="addBy(scope.$index)">+</el-button>
                  <el-button size="mini" @click="delBy(scope.$index)">-</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <el-row :gutter="10">
        <el-col :span="8">
          <el-form label-width="80px">
            <el-form-item label="deviceId">
              <el-input v-model="savePageForm.deviceId" clearable />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form label-width="100px">
            <el-form-item label="图片Path">
              <el-input v-model="savePageForm.imgPath" clearable />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form label-width="100px">
            <el-form-item label="布局">
              <el-input v-model="savePageForm.windowHierarchy" clearable />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="pageType !== 'Web'">
        <el-col :span="8">
          <el-form label-width="80px">
            <el-form-item label="window宽">
              <el-input v-model="savePageForm.windowWidth" clearable />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form label-width="100px">
            <el-form-item label="window高">
              <el-input v-model="savePageForm.windowHeight" clearable />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form label-width="100px">
            <el-form-item label="window方向">
              <el-input v-model="savePageForm.windowOrientation" clearable />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>

import { addPage, updatePage, getPageById } from '@/api/page'
import { getCategoryList } from '@/api/category'
import DeviceInspector from '@/pages/device/DeviceInspector'
import clipboard from '@/directive/clipboard/index.js'
import ImageInput from '@/components/ImageInput'
import PageActionDrawer from './PageActionDrawer'

export default {
  directives: {
    clipboard
  },
  props: {
    isAdd: Boolean
  },
  components: {
    DeviceInspector,
    ImageInput,
    PageActionDrawer
  },
  data() {
    return {
      showPageActionDrawer: false,
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
      pageCategoryList: [],
      added: false // 是否已添加成功
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
        label: 'FindBy',
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
        label: 'MobileBy',
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
      },
      {
        value: 'By',
        label: 'By',
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
      if (pageType === 3) { // web
        bys.splice(0, 1)
      } else {
        bys.splice(1, 1)
      }
      return bys
    }
  },
  created() {
    this.fetchPageCategoryList() // 防止el-select只显示category id
    if (!this.isAdd) {
      getPageById(this.$route.params.pageId).then(response => {
        this.savePageForm = response.data
      })
    } else {
      this.$nextTick(() => {
        this.savePageForm = this.$route.params
      })
    }
  },
  methods: {
    onCopySuccess(e) {
      this.$notify.success('引用已添加到剪切板')
    },
    savePage() {
      if (this.isAdd && !this.added) {
        addPage(this.savePageForm).then(response => {
          this.$notify.success(response.msg)
          this.savePageForm = response.data
          this.added = true
        })
      } else {
        updatePage(this.savePageForm).then(response => {
          this.$notify.success(response.msg)
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
    addElement(index) {
      this.savePageForm.elements.splice(index + 1, 0, {
        name: '',
        findBy: [],
        value: ''
      })
    },
    addBy(index) {
      this.savePageForm.bys.splice(index + 1, 0, {
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
    },
    addAction() {
      if (!this.savePageForm.id) {
        this.$notify.error('page未保存，无法添加')
        return
      }
      this.$router.push({
        name: 'AddEncapsulationAction',
        params: {
          pageId: this.savePageForm.id
        }
      })
    },
    showPageAction() {
      if (!this.savePageForm.id) {
        this.$notify.error('page未保存，无法查看')
        return
      }
      this.showPageActionDrawer = true
    }
  }
}
</script>
