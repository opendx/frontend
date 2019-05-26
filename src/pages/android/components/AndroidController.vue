<template>
  <div>
    <!--画布-->
    <div align="center">
      <canvas id="androidControllerCanvas" />
    </div>
    <div style="margin-top: 2px" align="center">
      <android-controller-buttom :minitouch-websocket="minitouchWebsocket" />
    </div>
  </div>
</template>

<script>
import AndroidControllerButtom from './AndroidControllerButtom'
import { startUiautomator2Server } from '@/api/agent'

export default {
  components: {
    AndroidControllerButtom
  },
  data() {
    return {
      minicapWebsocket: null,
      minitouchWebsocket: null,
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
    this.minicapWebsocket.close()
    this.minitouchWebsocket.close()
  },
  mounted() {
    const canvas = document.getElementById('androidControllerCanvas')
    const canvasContext = canvas.getContext('2d')
    // 启动uiautomator2 server
    startUiautomator2Server(this.agentIp, this.agentPort, this.deviceId).then(response => {
      this.$store.dispatch('device/setPort', response.data.port)
    })
    // minicap
    const BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    this.minicapWebsocket = new WebSocket('ws://' + this.agentIp + ':' + this.agentPort + '/minicap/' + this.deviceId + '/' + this.username)
    this.minicapWebsocket.binaryType = 'blob'
    this.minicapWebsocket.onclose = () => {
      this.$notify({
        title: '提示',
        message: 'minicap websocet close',
        duration: 0
      })
    }
    this.minicapWebsocket.onerror = () => {
      this.$notify({
        title: '提示',
        message: 'minicap websocet error',
        duration: 0
      })
    }
    this.minicapWebsocket.onmessage = (message) => {
      if (typeof message.data !== 'string') {
        let blob = new Blob([message.data], { type: 'image/jpeg' })
        const URL = window.URL || window.webkitURL
        let u = URL.createObjectURL(blob)
        let img = new Image()
        img.src = u
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          canvasContext.drawImage(img, 0, 0)
          img.onload = null
          img.src = BLANK_IMG
          img = null
          u = null
          blob = null
        }
      }
    }
    // minitouch
    this.minitouchWebsocket = new WebSocket('ws://' + this.agentIp + ':' + this.agentPort + '/minitouch/' + this.deviceId)
    this.minitouchWebsocket.onclose = () => {
      this.$notify({
        title: '提示',
        message: 'minitouch websocet close'
      })
    }
    this.minitouchWebsocket.onerror = () => {
      this.$notify({
        title: '提示',
        message: 'minitouch websocet error'
      })
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
