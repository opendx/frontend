<template>
  <div>
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
      <canvas id="iosControllerCanvas" :width="displayWidth" :height="displayHeight"></canvas>
      <img v-if="mjpegServerPort" :src="'http://' + agentIp + ':' + mjpegServerPort" :width="displayWidth">
    </div>
    <div style="margin-top: 2px" align="center">
      <ios-controller-buttom />
    </div>
  </div>
</template>

<script>
import IosControllerButtom from './IosControllerButtom'
import { freshDriver } from '@/api/agent'

export default {
  components: {
    IosControllerButtom
  },
  data() {
    return {
      showAlert: false,
      minitouchWebsocket: null,
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
    this.minitouchWebsocket.close()
  },
  mounted() {
    const canvas = document.getElementById('iosControllerCanvas')
    const canvasContext = canvas.getContext('2d')
    // freshDriver
    freshDriver(this.agentIp, this.agentPort, this.deviceId).then(response => {
      const data = response.data
      this.$store.dispatch('device/setAppiumSessionId', data.appiumSessionId)
      this.mjpegServerPort = data.mjpegServerPort
      this.displayWidth = data.displayWidth
      this.displayHeight = data.displayHeight
    })
    // minitouch
    this.minitouchWebsocket = new WebSocket('ws://' + this.agentIp + ':' + this.agentPort + '/minitouch/' + this.deviceId)
    this.minitouchWebsocket.onclose = () => {
      this.showAlert = true
    }
    this.minitouchWebsocket.onerror = () => {
      this.showAlert = true
    }
    let isMouseDown = false
    // 当鼠标处于按下的状态移出画布,这个时候体验不好，需要在移出的时候，发送鼠标抬起事件,并将鼠标状态设为抬起
    canvas.onmouseleave = () => {
      if (isMouseDown) {
        this.minitouchWebsocket.send(JSON.stringify(this.touchUp))
        isMouseDown = false
      }
    }
    // 当鼠标按下时，将按下的XY坐标发送给服务器处理，XY坐标为相对比例，如：0.5,0.5 则代表屏幕中心
    canvas.onmousedown = (e) => {
      isMouseDown = true
      this.touchDown.percentOfX = this.getPercentOfX(e, canvas)
      this.touchDown.percentOfY = this.getPercentOfY(e, canvas)
      this.minitouchWebsocket.send(JSON.stringify(this.touchDown))
    }
    // 鼠标抬起
    canvas.onmouseup = () => {
      isMouseDown = false
      this.minitouchWebsocket.send(JSON.stringify(this.touchUp))
    }
    // 鼠标移动
    canvas.onmousemove = (e) => {
      // 鼠标按下才发送移动事件,防止在画布上移动鼠标也发送移动事件
      if (isMouseDown) {
        this.touchMove.percentOfX = this.getPercentOfX(e, canvas)
        this.touchMove.percentOfY = this.getPercentOfY(e, canvas)
        this.minitouchWebsocket.send(JSON.stringify(this.touchMove))
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
    }
  }
}
</script>
