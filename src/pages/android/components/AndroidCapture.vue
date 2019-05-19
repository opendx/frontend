<template>
  <div>
    <el-row style="margin-bottom: 3px">
      <el-card>
        <!--<svg-icon icon-class="android" style="vertical-align: middle;margin-right: 10px"></svg-icon>-->
        <!--<el-button size="mini" type="primary" v-clipboard:copy="addPageForm.imgUrl" v-clipboard:success="copyImgURL">复制图片地址</el-button>-->
        <!--<el-button size="mini" type="primary" v-clipboard:copy="addPageForm.windowHierarchyJson" v-clipboard:success="copyTreeData">复制布局树</el-button>-->
        <el-button size="mini" type="success" icon="el-icon-refresh" @click="refresh" />
      </el-card>
    </el-row>

    <!-- inspector -->
    <div style="margin-bottom: 3px">
      <android-inspector :img-info="imgInfo" :window-hierarchy-j-s-o-n="windowHierarchyJSONObject" :tree-loading="treeLoading" />
    </div>

    <div>
      <save-device-page-form :is-add="true" />
    </div>
  </div>
</template>

<script>
import { dump, screenshot } from '@/api/agent'
import AndroidInspector from './AndroidInspector'
import SaveDevicePageForm from '@/pages/page/components/SaveDevicePageForm'

export default {

  components: {
    AndroidInspector,
    SaveDevicePageForm
  },
  data() {
    return {
      // 传递给AndroidInspctor组件的数据
      imgInfo: {
        imgWidth: null,
        imgHeight: null,
        downloadURL: null
      },
      windowHierarchyJSONObject: null,
      treeLoading: false
    }
  },
  computed: {
    agentIp() {
      return this.$store.state.device.agentIp
    },
    agentPort() {
      return this.$store.state.device.agentPort
    },
    deviceId() {
      return this.$store.state.device.id
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchScreenShot() {
      screenshot(this.agentIp, this.agentPort, this.deviceId).then(response => {
        this.imgInfo = response.data
      })
    },
    fetchWindowHierarchyJSON() {
      this.treeLoading = true
      dump(this.agentIp, this.agentPort, this.deviceId).then(response => {
        this.windowHierarchyJSONObject = JSON.parse(response.data)
        // this.addPageForm.windowHierarchyJson = JSON.stringify(this.windowHierarchyJSONObject)
      }).finally(() => {
        this.treeLoading = false
      })
    },
    fetchData() {
      this.fetchScreenShot()
      this.fetchWindowHierarchyJSON()
    },
    refresh() {
      this.fetchData()
    }
  }
}
</script>
