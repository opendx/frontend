<template>
  <div v-loading="loading" element-loading-text="正在初始化.... 请确保屏幕处于解锁显示状态" style="width: 100%">
    <el-alert
      v-if="showAlert"
      style="position: fixed"
      :closable="false"
      title="远程连接已断开"
      type="error"
      show-icon
    />
    <!--画布-->
    <div style="width: 100%">
      <canvas id="stfCanvas" style="width: 100%" />
    </div>
    <div style="margin-top: 2px" align="center">
      <android-controller-buttom :android-websocket="androidWebsocket" />
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
      showAlert: false,
      androidWebsocket: null,
      touchDown: {
        operation: 'd',
        pressure: 50
      },
      touchMove: {
        operation: 'm',
        pressure: 50
      },
      touchUp: {
        operation: 'u'
      }
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
    const canvas = document.getElementById('stfCanvas')
    const g = canvas.getContext('2d')
    const BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    const URL = window.URL || window.webkitURL

    let platform = this.$store.state.project.platform
    // platform: 1.android 3.android wxtools 4.android wx appbrand 5. android chrome
    if (platform !== 1 && platform !== 3 && platform !== 4 && platform !== 5) {
      platform = 1
    }

    this.androidWebsocket = new WebSocket('ws://' + this.agentIp + ':' + this.agentPort + '/stf/android/' + this.deviceId + '/user/' + this.username + '/platform/' + platform)
    this.androidWebsocket.binaryType = 'blob'
    this.androidWebsocket.onclose = () => {
      this.showAlert = true
      this.loading = false
    }
    this.androidWebsocket.onerror = () => {
      this.showAlert = true
      this.loading = false
    }
    this.androidWebsocket.onmessage = (message) => {
      if (message.data instanceof Blob) {
        let blob = new Blob([message.data], { type: 'image/jpeg' })
        let url = URL.createObjectURL(blob)
        let img = new Image()
        img.src = url
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          g.drawImage(img, 0, 0)

          img.onload = null
          img.src = BLANK_IMG
          img = null
          blob = null

          URL.revokeObjectURL(url)
          url = null
        }
      } else {
        console.log('androidWebsocket-onmessage', message.data)
        if (message.data && message.data.indexOf('appiumSessionId') !== -1) {
          this.loading = false
          this.$store.dispatch('device/setAppiumSessionId', JSON.parse(message.data).appiumSessionId)
        }
      }
    }
    let isMouseDown = false
    // 当鼠标处于按下的状态移出画布,这个时候体验不好，需要在移出的时候，发送鼠标抬起事件,并将鼠标状态设为抬起
    canvas.onmouseleave = () => {
      if (isMouseDown) {
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
    canvas.onmouseup = () => {
      isMouseDown = false
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
  }
}
</script>
