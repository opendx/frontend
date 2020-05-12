<template>
  <div v-loading="loading" :element-loading-text="loadingText" style="width: 100%">
    <div id="canvas-container" style="width: 100%; min-height: 200px" />
    <div style="margin-top: 2px" align="center">
      <android-controller-buttom ref="controllerButtom" :android-websocket="androidWebsocket" @onClickClose="clickClose" />
    </div>
  </div>
</template>

<script>
import AndroidControllerButtom from './AndroidControllerButtom'

export default {
  components: {
    AndroidControllerButtom
  },
  data() {
    return {
      loading: false,
      loadingText: '正在初始化...',
      closeBoardByClickCloseBtn: false,
      androidWebsocket: null,
      touchDown: {
        operation: 'd'
      },
      touchMove: {
        operation: 'm'
      },
      touchUp: {
        operation: 'u'
      }
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
    },
    username() {
      return this.$store.state.user.name
    }
  },
  // 关闭控制窗口，组件销毁前
  beforeDestroy() {
    this.androidWebsocket.close()
  },
  mounted() {
    this.loading = true
    const player = new Player()
    const canvas = player.canvas
    canvas.setAttribute('id', 'scrcpyCanvas') // style width: 100%;
    document.getElementById('canvas-container').appendChild(canvas)

    this.androidWebsocket = new WebSocket('ws://' + this.agentIp + ':' + this.agentPort + '/scrcpy/android/' + this.mobileId + '/user/' + this.username + '/project/' + this.$store.state.project.id)
    this.androidWebsocket.binaryType = 'arraybuffer'
    this.androidWebsocket.onclose = () => {
      this.loading = false
      if (!this.closeBoardByClickCloseBtn) { // 点击关闭，不弹提示
        this.alertOnWsClose()
      }
      this.$refs.controllerButtom.closeBoard()
    }
    this.androidWebsocket.onerror = () => {
      this.loading = false
      this.alertOnWsError()
      this.$refs.controllerButtom.closeBoard()
    }
    this.androidWebsocket.onmessage = (message) => {
      if (message.data instanceof ArrayBuffer) {
        player.decode(new Uint8Array(message.data))
      } else {
        console.log('ws-onmessage', message.data)
        if (message.data) {
          if (message.data.indexOf('driverSessionId') !== -1) {
            this.loading = false
            this.$store.dispatch('mobile/setDriverSessionId', JSON.parse(message.data).driverSessionId)
          } else {
            this.loadingText = message.data
          }
        }
      }
    }
    let isMouseDown = false
    // 当鼠标处于按下的状态移出画布,这个时候体验不好，需要在移出的时候，发送鼠标抬起事件,并将鼠标状态设为抬起
    canvas.onmouseleave = (e) => {
      if (isMouseDown) {
        const rect = canvas.getBoundingClientRect()
        this.touchUp.x = parseInt((e.clientX - rect.left) / rect.width * canvas.width)
        this.touchUp.y = parseInt((e.clientY - rect.top) / rect.height * canvas.height)
        this.touchUp.width = canvas.width
        this.touchUp.height = canvas.height
        this.androidWebsocket.send(JSON.stringify(this.touchUp))
        isMouseDown = false
      }
    }
    // 鼠标按下
    canvas.onmousedown = (e) => {
      isMouseDown = true
      const rect = canvas.getBoundingClientRect()
      this.touchDown.x = parseInt((e.clientX - rect.left) / rect.width * canvas.width)
      this.touchDown.y = parseInt((e.clientY - rect.top) / rect.height * canvas.height)
      this.touchDown.width = canvas.width
      this.touchDown.height = canvas.height
      this.androidWebsocket.send(JSON.stringify(this.touchDown))
    }
    // 鼠标抬起
    canvas.onmouseup = (e) => {
      isMouseDown = false
      const rect = canvas.getBoundingClientRect()
      this.touchUp.x = parseInt((e.clientX - rect.left) / rect.width * canvas.width)
      this.touchUp.y = parseInt((e.clientY - rect.top) / rect.height * canvas.height)
      this.touchUp.width = canvas.width
      this.touchUp.height = canvas.height
      this.androidWebsocket.send(JSON.stringify(this.touchUp))
    }
    // 鼠标移动
    canvas.onmousemove = (e) => {
      // 鼠标按下才发送移动事件,防止在画布上移动鼠标也发送移动事件
      if (isMouseDown) {
        const rect = canvas.getBoundingClientRect()
        this.touchMove.x = parseInt((e.clientX - rect.left) / rect.width * canvas.width)
        this.touchMove.y = parseInt((e.clientY - rect.top) / rect.height * canvas.height)
        this.touchMove.width = canvas.width
        this.touchMove.height = canvas.height
        this.androidWebsocket.send(JSON.stringify(this.touchMove))
      }
    }
  },
  methods: {
    alertOnWsClose() {
      this.$alert('AndroidMobile连接已断开', '提示', {
        confirmButtonText: '确定'
      })
    },
    alertOnWsError() {
      this.$alert('AndroidMobile连接错误', '提示', {
        confirmButtonText: '确定'
      })
    },
    clickClose() {
      this.closeBoardByClickCloseBtn = true
    }
  }
}
</script>
<style>
  #scrcpyCanvas {
    width: 100%;
  }
</style>
