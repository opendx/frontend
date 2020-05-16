<template>
  <div>
    <i class="el-icon-refresh" style="font-size: 20px;color: green;cursor: pointer" title="重新获取" @click="refresh" />
    <i class="el-icon-circle-plus" style="font-size: 20px;color: black;cursor: pointer" title="添加page" @click="addPage" />
    <!-- inspector -->
    <device-inspector canvas-id="mobile-capture-canvas" :page-type="pageType" :window-info="windowInfo" :window-hierarchy="windowHierarchy" :tree-loading="treeLoading" />
  </div>
</template>

<script>
import { dump, screenshot } from '@/api/agent'
import DeviceInspector from '@/pages/device/DeviceInspector'

export default {

  components: {
    DeviceInspector
  },
  data() {
    return {
      windowHierarchy: null,
      pageType: null,
      windowInfo: {
        windowWidth: null,
        windowHeight: null,
        windowOrientation: null,
        imgUrl: null,
        imgPath: null
      },
      treeLoading: false
    }
  },
  computed: {
    agentIp() {
      return this.$store.state.mobile.agentIp
    },
    agentPort() {
      return this.$store.state.mobile.agentPort
    },
    mobileId() {
      return this.$store.state.mobile.id
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchScreenShot() {
      screenshot(this.agentIp, this.agentPort, this.mobileId).then(response => {
        this.windowInfo = response.data
      })
    },
    fetchWindowHierarchy() {
      this.treeLoading = true
      dump(this.agentIp, this.agentPort, this.mobileId).then(response => {
        const page = response.data
        this.windowHierarchy = page.pageSource
        this.pageType = page.type
      }).finally(() => {
        this.treeLoading = false
      })
    },
    fetchData() {
      this.fetchScreenShot()
      this.fetchWindowHierarchy()
    },
    refresh() {
      this.fetchData()
    },
    addPage() {
      this.$emit('closeMobileCapture')
      this.$router.push({
        name: 'AddPage',
        params: {
          projectId: this.$store.state.project.id,
          imgUrl: this.windowInfo.imgUrl,
          imgPath: this.windowInfo.imgPath,
          windowHeight: this.windowInfo.windowHeight,
          windowWidth: this.windowInfo.windowWidth,
          windowOrientation: this.windowInfo.windowOrientation,
          deviceId: this.mobileId,
          windowHierarchy: this.windowHierarchy,
          type: this.pageType,
          elements: [],
          bys: []
        }
      })
    }
  }
}
</script>
