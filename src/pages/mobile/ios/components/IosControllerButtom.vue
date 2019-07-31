<template>
  <div>
    <el-popover v-model="showMobileCapture" placement="left" trigger="manual">
      <div v-if="showMobileCapture">
        <mobile-capture @closeMobileCapture="showMobileCapture = false" />
      </div>
      <el-button slot="reference" :disabled="!$store.state.device.appiumSessionId" @click="showMobileCapture = !showMobileCapture" size="mini">
        <svg-icon icon-class="capture" />
      </el-button>
    </el-popover>

    <el-button-group>
      <el-button size="mini" @click="clickHome" :disabled="!$store.state.device.appiumSessionId">Home</el-button>
      <el-button size="mini" @click="clickClose">Close</el-button>
    </el-button-group>

    <el-popover placement="left" trigger="click">
      <!-- 安装APP -->
      <el-upload drag action="/" :on-change="onChange" :multiple="false" :auto-upload="false">
        <i class="el-icon-upload" /><div>将ipa拖到此处，或<em>点击选择ipa</em></div>
      </el-upload>
      <el-button :loading="installBtnLoading" type="primary" size="mini" @click="installApp">{{ installBtnText }}</el-button>
    </el-popover>
  </div>
</template>

<script>
import MobileCapture from '@/pages/mobile/components/MobileCapture'
import { installApp, iosPressHome } from '@/api/agent'

export default {
  components: {
    MobileCapture
  },
  data() {
    return {
      showMobileCapture: false,
      installBtnLoading: false,
      installBtnText: '安装APP',
      choosedFile: null
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
    // 选择ipa
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
      // 选择的文件是否以ipa结尾
      const app = this.choosedFile.raw
      if (!app.name.endsWith('.ipa')) {
        this.$notify.error('请选择ipa文件')
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
      iosPressHome(this.agentIp, this.agentPort, this.deviceId)
    },
    clickClose() {
      this.$store.dispatch('device/setShow', false) // AppMain.vue在v-if销毁右侧控制设备组件
    }
  }
}
</script>
