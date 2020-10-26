<template>
  <div v-loading="loading" :element-loading-text="loadingText" style="width: 100%; height: 100%; padding: 5px; border: 1px solid #dfe6ec">
    <el-row>
      <el-button v-if="!loading" style="width: 100%" size="mini" :loading="true">调试中</el-button>
    </el-row>
    <el-divider/>
    <el-row>
      <el-button style="width: 100%" size="mini" @click="addPage" :loading="addPageBtnLoading">添加Page</el-button>
    </el-row>
    <el-divider/>
    <el-row>
      <el-button style="width: 100%" size="mini" @click="clickClose">关闭调试</el-button>
    </el-row>
  </div>
</template>

<script>
import { dump, screenshot } from '@/api/agent'

export default {
  data() {
    return {
      loading: false,
      loadingText: '正在初始化...',
      closeBoardByClickCloseBtn: false,
      ws: null,
      addPageBtnLoading: false
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
    this.closeBoardByClickCloseBtn = false

    this.ws = new WebSocket('ws://' + this.agentIp + ':' + this.agentPort + '/browser/' + this.browserId + '/user/' + this.username + '/project/' + this.$store.state.project.id)
    this.ws.onclose = () => {
      this.loading = false
      if (!this.closeBoardByClickCloseBtn) { // 点击关闭调试，不弹提示
        this.alertOnWsClose()
        this.closeBoard()
      }
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
    },
    addPage() {
      this.addPageBtnLoading = true
      screenshot(this.agentIp, this.agentPort, this.browserId).then(screenshotResponse => {
        const windowInfo = screenshotResponse.data
        dump(this.agentIp, this.agentPort, this.browserId).then(dumpResponse => {
          const page = dumpResponse.data
          this.addPageBtnLoading = false
          this.$router.push({
            name: 'AddPage',
            params: {
              projectId: this.$store.state.project.id,
              imgUrl: windowInfo.imgUrl,
              imgPath: windowInfo.imgPath,
              deviceId: this.browserId,
              windowHierarchy: page.pageSource,
              type: page.type,
              elements: [],
              bys: []
            }
          })
        }).catch(() => {
          // dump失败
          this.addPageBtnLoading = false
        })
      }).catch(() => {
        // 截图失败
        this.addPageBtnLoading = false
      })
    }
  }
}
</script>
