<template>
  <span>
    <el-image-viewer v-if="show" :url-list="[imgUrl]" :on-close="closeImageViewer" />
    <el-button :disabled="!$store.state.mobile.driverSessionId" size="mini" icon="el-icon-full-screen" @click="showImageViewer" :loading="loading" />
  </span>
</template>
<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { screenshot } from '@/api/agent'
export default {
  components: { ElImageViewer },
  data() {
    return {
      show: false,
      imgUrl: '',
      loading: false
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
  methods: {
    showImageViewer() {
      this.loading = true
      screenshot(this.agentIp, this.agentPort, this.mobileId).then(response => {
        this.imgUrl = response.data.imgUrl
        this.show = true
      }).finally(() => {
        this.loading = false
      })
    },
    closeImageViewer() {
      this.show = false
    }
  }
}
</script>
