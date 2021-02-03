<template>
  <el-container style="height: 100%">
    <el-header height="50px">
      <span>连接状态: {{ connectionStatus }}</span>
      <el-checkbox v-model="autoScroll">自动滚动</el-checkbox>
      <el-button @click="cleanLogs">清除日志</el-button>
    </el-header>
    <el-main style="background-color: #f5f5f5; font-size: 10px; padding: 5px">
      <div id="log-container">
        <pre v-for="logRow in logRows">{{ logRow }}</pre>
      </div>
    </el-main>
  </el-container>
</template>
<script>

export default {
  name: 'Log',
  data() {
    return {
      ws: null,
      logRows: [],
      connectionStatus: '已连接',
      autoScroll: true
    }
  },
  mounted() {
    const ws = new WebSocket(this.$route.params.wsUrl)
    this.ws = ws

    ws.onclose = () => {
      this.connectionStatus = '已断开'
    }
    ws.onerror = () => {
      this.connectionStatus = '已断开'
    }

    const logContainer = document.getElementById('log-container')

    ws.onmessage = (message) => {
      // 最多保留1w条 防止数组无限扩张消耗内存
      if (this.logRows.length === 10000) {
        this.logRows.splice(0, 1)
      }

      this.logRows.push(message.data)
      if (this.autoScroll) {
        // 滚动到底部
        logContainer.scrollIntoView(false)
      }
    }
  },
  methods: {
    cleanLogs() {
      this.logRows.splice(0, this.logRows.length)
    }
  },
  destroyed() {
    if (this.ws) {
      this.ws.close()
    }
  }

}
</script>
<style scoped>
</style>
