<template>
  <div style="width: 1400px;height: 850px">
    <i class="el-icon-refresh" style="font-size: 20px;color: green;cursor: pointer" title="重新获取" @click="refresh" />
    <i class="el-icon-circle-plus" style="font-size: 20px;color: black;cursor: pointer" title="添加page" @click="addPage" />
    <!-- inspector -->
    <div>
      <mobile-inspector :canvas-id="canvasId" :img-info="imgInfo" :window-hierarchy="windowHierarchy" :tree-loading="treeLoading" />
    </div>
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
      canvasId: 'mobile-capture-canvas',
      imgInfo: {
        imgWidth: null,
        imgHeight: null,
        imgUrl: null
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
        const imgData = response.data
        this.imgInfo = {
          imgWidth: imgData.imgWidth,
          imgHeight: imgData.imgHeight,
          imgUrl: imgData.downloadURL
        }
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
          imgUrl: this.imgInfo.imgUrl,
          imgHeight: this.imgInfo.imgHeight,
          imgWidth: this.imgInfo.imgWidth,
          deviceId: this.deviceId,
          windowHierarchy: this.windowHierarchy
        }
      })
    }
  }
}
</script>
