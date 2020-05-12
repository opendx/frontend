<template>
  <div v-loading="loading" :element-loading-text="loadingText" style="width: 100%; height: 100%">
    <el-button size="mini" @click="clickClose" style="width: 100%; bottom: 50%; position: absolute">关闭调试</el-button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loading: false,
      loadingText: '正在初始化...',
      closeBoardByClickCloseBtn: false,
      ws: null
    }
  },
  computed: {
    agentIp() {
      return this.$store.state.browser.agentIp
    },
    agentPort() {
      return this.$store.state.browser.agentPort
    },
    browserId() {
      return this.$store.state.browser.id
    },
    username() {
      return this.$store.state.user.name
    }
  },
  // 关闭窗口，组件销毁前
  beforeDestroy() {
    this.ws.close()
  },
  mounted() {
    this.loading = true

    this.ws = new WebSocket('ws://' + this.agentIp + ':' + this.agentPort + '/browser/' + this.browserId + '/user/' + this.username + '/project/' + this.$store.state.project.id)
    this.ws.onclose = () => {
      this.loading = false
      if (!this.closeBoardByClickCloseBtn) { // 点击关闭调试，不弹提示
        this.alertOnWsClose()
      }
      this.closeBoard()
    }
    this.ws.onerror = () => {
      this.loading = false
      this.alertOnWsError()
      this.closeBoard()
    }
    this.ws.onmessage = (message) => {
      console.log('ws-onmessage', message.data)
      if (message.data) {
        if (message.data.indexOf('driverSessionId') !== -1) {
          this.loading = false
          this.$store.dispatch('browser/setDriverSessionId', JSON.parse(message.data).driverSessionId)
        } else {
          this.loadingText = message.data
        }
      }
    }
  },
  methods: {
    clickClose() {
      this.closeBoardByClickCloseBtn = true
      this.closeBoard()
    },
    closeBoard() {
      this.$store.dispatch('browser/setShow', false) // AppMain.vue在v-if销毁该组件
    },
    alertOnWsClose() {
      this.$alert('浏览器连接已断开', '提示', {
        confirmButtonText: '确定'
      })
    },
    alertOnWsError() {
      this.$alert('浏览器连接错误', '提示', {
        confirmButtonText: '确定'
      })
    }
  }
}
</script>
