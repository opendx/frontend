<template>
  <div>
    <i class="el-icon-refresh" style="font-size: 20px;color: green;cursor: pointer" title="重新获取" @click="refresh" />
    <i class="el-icon-circle-plus" style="font-size: 20px;color: black;cursor: pointer" title="添加page" @click="addPage" />
    <!-- inspector -->
    <mobile-inspector canvas-id="mobile-capture-canvas" :window-info="windowInfo" :window-hierarchy="windowHierarchy" :tree-loading="treeLoading" />
  </div>
</template>

<script>
import { dump, screenshot } from '@/api/agent'
import MobileInspector from './MobileInspector'

export default {

  components: {
    MobileInspector
  },
  data() {
    return {
      windowHierarchy: null,
      // 传递给MobileInspctor组件的数据
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
        this.windowInfo = response.data
      })
    },
    fetchWindowHierarchy() {
      this.treeLoading = true
      dump(this.agentIp, this.agentPort, this.deviceId).then(response => {
        this.windowHierarchy = response.data
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
          deviceId: this.deviceId,
          windowHierarchy: this.windowHierarchy,
          elements: []
        }
      })
    }
  }
}
</script>
