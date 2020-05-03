<template>
  <div v-loading="loading" element-loading-text="正在初始化..." style="width: 100%; height: 100%">
    <el-alert
      v-if="showAlert"
      :closable="false"
      style="writing-mode: tb-rl"
      title="浏览器连接已断开"
      type="error"
      :show-icon="false"
    />
    <el-button size="mini" @click="closeBoard" style="width: 100%; bottom: 10px; position: absolute">关闭调试</el-button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loading: false,
      showAlert: false,
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

    this.ws = new WebSocket('ws://' + this.agentIp + ':' + this.agentPort + '/browser/' + this.browserId + '/user/' + this.username)
    this.ws.onclose = () => {
      this.showAlert = true
      this.loading = false
    }
    this.ws.onerror = () => {
      this.showAlert = true
      this.loading = false
    }
    this.ws.onmessage = (message) => {
      console.log('ws-onmessage', message.data)
      if (message.data && message.data.indexOf('driverSessionId') !== -1) {
        this.loading = false
        this.$store.dispatch('browser/setDriverSessionId', JSON.parse(message.data).driverSessionId)
      }
    }
  },
  methods: {
    closeBoard() {
      this.$store.dispatch('browser/setShow', false) // AppMain.vue在v-if销毁该组件
    }
  }
}
</script>
