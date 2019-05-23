<template>
  <div style="width: 1400px;height: 900px;margin-bottom: 10px">
    <i class="el-icon-refresh" style="font-size: 20px;color: green" title="重新获取" @click="refresh" />
    <i class="el-icon-circle-plus" style="font-size: 20px;color: black" title="添加page" @click="addPage" />
    <i class="el-icon-error" style="font-size: 20px;color: black" title="关闭" @click="destoryCurrentComponent" />
    <!-- inspector -->
    <div>
      <android-inspector :canvas-id="canvasId" :img-info="imgInfo" :window-hierarchy-json="windowHierarchyJson" :tree-loading="treeLoading" />
    </div>
  </div>
</template>

<script>
import { dump, screenshot } from '@/api/agent'
import AndroidInspector from './AndroidInspector'

export default {

  components: {
    AndroidInspector
  },
  data() {
    return {
      // 传递给AndroidInspctor组件的数据
      canvasId: 'android-capture-canvas',
      imgInfo: {
        imgWidth: null,
        imgHeight: null,
        imgUrl: null
      },
      windowHierarchyJson: null,
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
    fetchWindowHierarchyJSON() {
      this.treeLoading = true
      dump(this.agentIp, this.agentPort, this.deviceId).then(response => {
        this.windowHierarchyJson = JSON.parse(response.data)
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
    },
    addPage() {
      this.destoryCurrentComponent()
      this.$router.push({
        name: 'AddPage',
        params: {
          imgUrl: this.imgInfo.imgUrl,
          imgHeight: this.imgInfo.imgHeight,
          imgWidth: this.imgInfo.imgWidth,
          deviceId: this.deviceId,
          windowHierarchyJson: JSON.stringify(this.windowHierarchyJson)
        }
      })
    },
    destoryCurrentComponent() {
      this.$emit('closeAndroidCapture')
    }
  }
}
</script>
