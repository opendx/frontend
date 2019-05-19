<template>
  <div style="width: 1400px;height: 820px;margin-bottom: 10px">
    <i class="el-icon-refresh" style="font-size: 20px;color: green" title="重新获取" @click="refresh" />
    <i class="el-icon-circle-plus" style="font-size: 20px;color: black" title="添加page" @click="addPage" />
    <!-- inspector -->
    <div>
      <android-inspector :img-info="imgInfo" :window-hierarchy-j-s-o-n="windowHierarchyJSONObject" :tree-loading="treeLoading" />
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
      this.$emit('addPageClicked')
      this.$router.push({
        name: 'AddPage',
        params: {
          imgUrl: this.imgInfo.downloadURL,
          imgHeight: this.imgInfo.imgHeight,
          imgWidth: this.imgInfo.imgWidth,
          deviceId: this.deviceId,
          windowHierarchyJson: JSON.stringify(this.windowHierarchyJSONObject)
        }
      })
    }
  }
}
</script>
