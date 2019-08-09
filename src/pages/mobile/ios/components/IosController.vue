<template>
  <div v-loading="loading" element-loading-text="正在初始化.... 请确保屏幕处于解锁显示状态">
    <el-alert
      v-if="showAlert"
      style="position: fixed"
      :closable="false"
      title="远程连接已断开"
      type="error"
      show-icon
    />
    <!--画布-->
    <div align="center">
      <canvas id="iosControllerCanvas" :width="displayWidth" :height="displayHeight" style="position: absolute"></canvas>
      <img v-if="showImg" :src="'http://' + agentIp + ':' + agentPort + '/iproxy/' + deviceId" :width="displayWidth">
    </div>
    <div style="margin-top: 2px" align="center">
      <ios-controller-buttom :ios-websocket="iosWebsocket" @recreateImg="recreateImg" />
    </div>
  </div>
</template>

<script>
import IosControllerButtom from './IosControllerButtom'

export default {
  components: {
    IosControllerButtom
  },
  data() {
    return {
      loading: false,
      showAlert: false,
      iosWebsocket: null,
      showImg: false,
      mjpegServerPort: null,
      displayWidth: null,
      displayHeight: null,
      touchDown: {
        operation: 'd',
        percentOfX: 0.5,
        percentOfY: 0.5,
        pressure: 50
      },
      touchMove: {
        operation: 'm',
        percentOfX: 0.5,
        percentOfY: 0.5,
        pressure: 50
      },
      touchUp: {
        'operation': 'u'
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
    this.iosWebsocket.close()
  },
  mounted() {
    const canvas = document.getElementById('iosControllerCanvas')
    this.loading = true

    // iosWebsocket
    this.iosWebsocket = new WebSocket('ws://' + this.agentIp + ':' + this.agentPort + '/ios/' + this.deviceId + '/' + this.username)
    this.iosWebsocket.onclose = () => {
      this.showAlert = true
      this.loading = false
    }
    this.iosWebsocket.onerror = () => {
      this.showAlert = true
      this.loading = false
    }
    this.iosWebsocket.onmessage = (message) => {
      const data = message.data
      console.log('iosWebsocket', data)
      if (data === 'ok') {
        this.showImg = true
        this.loading = false
      } else {
        if (data.indexOf('appiumSessionId') !== -1) {
          const d = JSON.parse(data).data
          this.$store.dispatch('device/setAppiumSessionId', d.appiumSessionId)
          this.mjpegServerPort = d.mjpegServerPort
          this.displayWidth = d.displayWidth
          this.displayHeight = d.displayHeight
        }
      }
    }
    let isMouseDown = false
    // 当鼠标处于按下的状态移出画布,这个时候体验不好，需要在移出的时候，发送鼠标抬起事件,并将鼠标状态设为抬起
    canvas.onmouseleave = () => {
      if (isMouseDown) {
        this.iosWebsocket.send(JSON.stringify(this.touchUp))
        isMouseDown = false
      }
    }
    // 当鼠标按下时，将按下的XY坐标发送给服务器处理，XY坐标为相对比例，如：0.5,0.5 则代表屏幕中心
    canvas.onmousedown = (e) => {
      isMouseDown = true
      this.touchDown.percentOfX = this.getPercentOfX(e, canvas)
      this.touchDown.percentOfY = this.getPercentOfY(e, canvas)
      this.iosWebsocket.send(JSON.stringify(this.touchDown))
    }
    // 鼠标抬起
    canvas.onmouseup = () => {
      isMouseDown = false
      this.iosWebsocket.send(JSON.stringify(this.touchUp))
    }
    // 鼠标移动
    canvas.onmousemove = (e) => {
      // 鼠标按下才发送移动事件,防止在画布上移动鼠标也发送移动事件
      if (isMouseDown) {
        this.touchMove.percentOfX = this.getPercentOfX(e, canvas)
        this.touchMove.percentOfY = this.getPercentOfY(e, canvas)
        this.iosWebsocket.send(JSON.stringify(this.touchMove))
      }
    }
  },
  methods: {
    getPercentOfX(event, canvas) {
      const offsetX = event.offsetX
      const offsetWidth = canvas.offsetWidth
      return offsetX / offsetWidth
    },
    getPercentOfY(event, canvas) {
      const offsetY = event.offsetY
      const offsetHeight = canvas.offsetHeight
      return offsetY / offsetHeight
    },
    recreateImg() {
      this.showImg = false
      setTimeout(() => {
        this.showImg = true
      }, 500)
    }
  }
}
</script>
