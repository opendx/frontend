<template>
  <div>
    <el-popover v-model="visible" placement="left" trigger="click">
      <mobile-capture style="width: 1200px; height: 680px" v-if="initMobileCapture" @closeMobileCapture="visible = false" />
      <el-button slot="reference" :disabled="!$store.state.device.appiumSessionId" @click="initMobileCapture = true" size="mini">
        <svg-icon icon-class="capture" />
      </el-button>
    </el-popover>

    <screenshot-viewer />

    <el-button-group>
      <el-button size="mini" @click="clickHome" :disabled="!$store.state.device.appiumSessionId">Home</el-button>
      <el-button size="mini" @click="clickClose">Close</el-button>
    </el-button-group>

    <el-popover placement="left" trigger="click">
      <!-- 安装APP -->
      <el-upload drag action="/" :on-change="onChange" :multiple="false" :auto-upload="false">
        <i class="el-icon-upload" /><div>将app拖到此处，或<em>点击选择app</em></div>
      </el-upload>
      <el-button :loading="installBtnLoading" type="primary" size="mini" @click="installApp">{{ installBtnText }}</el-button>
      <el-button slot="reference" size="mini">...</el-button>
    </el-popover>
  </div>
</template>

<script>
import MobileCapture from '@/pages/mobile/components/MobileCapture'
import { installApp } from '@/api/agent'
import ScreenshotViewer from '@/pages/mobile/components/ScreenshotViewer'

export default {
  components: {
    ScreenshotViewer,
    MobileCapture
  },
  props: {
    iosWebsocket: WebSocket
  },
  data() {
    return {
      visible: false,
      initMobileCapture: false,
      installBtnLoading: false,
      installBtnText: '安装APP',
      choosedFile: null,
      home: {
        operation: 'home'
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
    }
  },
  methods: {
    // 选择app
    onChange(file) {
      this.choosedFile = file
    },
    // 点击安装APP按钮
    installApp() {
      // 是否选择了一个文件
      if (this.choosedFile == null) {
        this.$notify.error('请选择一个app')
        return
      }
      // 校验文件格式
      const app = this.choosedFile.raw
      if (!app.name.endsWith('.ipa') && !app.name.endsWith('.app')) {
        this.$notify.error('请选择.ipa或.app文件')
        return
      }

      this.installBtnText = '安装中...'
      this.installBtnLoading = true
      const form = new FormData()
      form.append('app', app)
      installApp(this.agentIp, this.agentPort, this.deviceId, form).then(response => {
        this.$notify.success(response.msg)
      }).finally(() => {
        this.installBtnText = '安装APP'
        this.installBtnLoading = false
      })
    },
    // 点击home
    clickHome() {
      this.iosWebsocket.send(JSON.stringify(this.home))
    },
    clickClose() {
      this.$store.dispatch('device/setShow', false) // AppMain.vue在v-if销毁右侧控制设备组件
    }
  }
}
</script>
