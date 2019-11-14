<template>
  <div>
    <el-popover v-model="visible" placement="left" trigger="click">
      <div v-if="initMobileCapture">
        <mobile-capture @closeMobileCapture="visible = false" />
      </div>
      <el-button slot="reference" :disabled="!$store.state.device.appiumSessionId" @click="initMobileCapture = true" size="mini">
        <svg-icon icon-class="capture" />
      </el-button>
    </el-popover>

    <el-button-group>
      <el-button size="mini" @click="clickMenu" :disabled="!$store.state.device.appiumSessionId">Menu</el-button>
      <el-button size="mini" @click="clickHome" :disabled="!$store.state.device.appiumSessionId">Home</el-button>
      <el-button size="mini" @click="clickBack" :disabled="!$store.state.device.appiumSessionId">Back</el-button>
      <el-button size="mini" @click="clickPower" :disabled="!$store.state.device.appiumSessionId">Power</el-button>
      <el-button size="mini" @click="clickClose">Close</el-button>
    </el-button-group>

    <el-popover placement="left" trigger="click">
      <!-- 安装APP -->
      <el-upload drag action="/" :on-change="onChange" :multiple="false" :auto-upload="false">
        <i class="el-icon-upload" /><div>将apk拖到此处，或<em>点击选择apk</em></div>
      </el-upload>
      <el-button :loading="installBtnLoading" type="primary" size="mini" @click="installApp">{{ installBtnText }}</el-button>
      <el-divider />
      <!--开启远程调试-->
      <el-button type="primary" size="mini" @click="startOrStopAdbKit">{{ adbKitBtnText }}</el-button>
      <el-tag v-if="adbKitIsStart" type="success">{{ adbkitTip }}</el-tag>
      <el-divider />
      <!--切换输入法-->
      <el-select v-model="ime" @visible-change="selectIme" @change="imeSelected" placeholder="切换输入法" style="width: 100%">
        <el-option
          v-for="ime in imeList"
          :key="ime.value"
          :label="ime.label"
          :value="ime.value"
        />
      </el-select>
      <el-divider />
      <el-button slot="reference" size="mini">...</el-button>
    </el-popover>
  </div>
</template>

<script>
import MobileCapture from '@/pages/mobile/components/MobileCapture'
import { startAdbKit, stopAdbKit, installApp, getImeList, setIme } from '@/api/agent'

export default {
  components: {
    MobileCapture
  },
  props: {
    androidWebsocket: WebSocket
  },
  data() {
    return {
      visible: false,
      initMobileCapture: false,
      ime: undefined,
      imeList: [],
      adbKitBtnText: '开启远程调试',
      adbkitTip: '',
      adbKitIsStart: false,
      installBtnLoading: false,
      installBtnText: '安装APP',
      choosedFile: null,
      menu: {
        operation: 'menu'
      },
      home: {
        operation: 'home'
      },
      back: {
        operation: 'back'
      },
      power: {
        operation: 'power'
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
    selectIme(type) {
      if (type) {
        this.fetchImeList()
      }
    },
    imeSelected(ime) {
      setIme(this.agentIp, this.agentPort, this.deviceId, ime).then(response => {
        this.$notify.success(response.msg)
      })
    },
    fetchImeList() {
      getImeList(this.agentIp, this.agentPort, this.deviceId).then(response => {
        this.imeList = response.data.map(ime => {
          return { value: ime, label: ime }
        })
      })
    },
    startOrStopAdbKit() {
      if (!this.adbKitIsStart) {
        startAdbKit(this.agentIp, this.agentPort, this.deviceId).then(response => {
          this.adbKitIsStart = true
          this.adbKitBtnText = '关闭远程调试'
          this.adbkitTip = 'adb connect ' + this.agentIp + ':' + response.data.port
        })
      } else {
        stopAdbKit(this.agentIp, this.agentPort, this.deviceId).then(() => {
          this.adbKitIsStart = false
          this.adbKitBtnText = '开启远程调试'
          this.adbkitTip = ''
        })
      }
    },
    // 选择apk
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
      // 选择的文件是否以apk结尾
      const app = this.choosedFile.raw
      if (!app.name.endsWith('.apk')) {
        this.$notify.error('请选择apk文件')
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
    // 点击menu
    clickMenu() {
      this.androidWebsocket.send(JSON.stringify(this.menu))
    },
    // 点击home
    clickHome() {
      this.androidWebsocket.send(JSON.stringify(this.home))
    },
    // 点击back
    clickBack() {
      this.androidWebsocket.send(JSON.stringify(this.back))
    },
    // 点击power
    clickPower() {
      this.androidWebsocket.send(JSON.stringify(this.power))
    },
    clickClose() {
      this.$store.dispatch('device/setShow', false) // AppMain.vue在v-if销毁右侧控制设备组件
    }
  }
}
</script>
