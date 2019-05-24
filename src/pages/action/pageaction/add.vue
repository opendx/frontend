<template>
  <div>
    <sticky :z-index="10" class-name="sub-navbar">
      <el-input v-model="saveActionForm.name" style="width: 200px" />
      <el-input v-model="saveActionForm.description" style="width: 400px" />
      <el-input v-model="saveActionForm.returnValue" style="width: 200px" />
      <el-button-group>
        <el-button>调试</el-button>
        <el-button>保存</el-button>
      </el-button-group>
      <el-select v-model="saveActionForm.pageId" @change="pageSelected" clearable filterable>
        <el-option v-for="page in pages" :label="page.name" :value="page.id" :key="page.id" />
      </el-select>
      <el-popover trigger="click" placement="left">
        <div style="width: 1400px;height: 850px;margin-bottom: 10px">
          <android-inspector :canvas-id="canvasId" :img-info="imgInfo" :window-hierarchy-json="windowHierarchyJson" :tree-loading="treeLoading" />
        </div>
        <el-button slot="reference" icon="el-icon-view" :disabled="windowHierarchyJson === null" />
      </el-popover>
    </sticky>
    <el-row :gutter="5">
      <el-col :span="8" style="max-height: 200px;overflow: auto;">
        <action-param-list :is-add="true" />
      </el-col>
      <el-col :span="12" style="max-height: 200px;overflow: auto;">
        <action-local-var />
      </el-col>
      <el-col :span="4" style="max-height: 200px;overflow: auto;">
        <global-var-list />
      </el-col>
    </el-row>
    <action-step-list />
  </div>
</template>
<script>
import AndroidInspector from '@/pages/android/components/AndroidInspector'
import ActionParamList from '../components/ActionParamList'
import ActionLocalVar from '../components/ActionLocalVarList'
import GlobalVarList from '../components/GlobalVarList'
import ActionStepList from '../components/ActionStepList'
import Sticky from '@/components/Sticky'
import { getPageList } from '@/api/page'
export default {
  components: {
    AndroidInspector,
    ActionParamList,
    ActionLocalVar,
    GlobalVarList,
    ActionStepList,
    Sticky
  },
  data() {
    return {
      saveActionForm: {
        projectId: this.$store.state.project.id,
        pageId: null,
        type: 2,
        returnValue: null
      },
      pages: [],
      // 传递给AndroidInspctor组件的数据
      canvasId: 'page-action-canvas',
      imgInfo: {
        imgWidth: null,
        imgHeight: null,
        imgUrl: null
      },
      windowHierarchyJson: null,
      treeLoading: false
    }
  },
  async created() {
    const { data } = await getPageList({ projectId: this.saveActionForm.projectId })
    this.pages = data
  },
  methods: {
    pageSelected(id) {
      if (id) {
        const currentPage = this.pages.filter(page => page.id === id)[0]
        this.imgInfo = {
          imgWidth: currentPage.imgWidth,
          imgHeight: currentPage.imgHeight,
          imgUrl: currentPage.imgUrl
        }
        this.windowHierarchyJson = JSON.parse(currentPage.windowHierarchyJson)
      } else {
        this.windowHierarchyJson = null
      }
    }
  }
}
</script>
