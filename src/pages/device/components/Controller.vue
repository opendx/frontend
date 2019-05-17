<!--<template>-->
  <!--<div>-->
    <!--&lt;!&ndash;画布&ndash;&gt;-->
    <!--<div align='center'>-->
      <!--<canvas id='canvas1'></canvas>-->
    <!--</div>-->
    <!--<div style='margin-top: 10px' align='center'>-->
      <!--<el-popover placement='left' width='1400' trigger='manual' v-model='showDumpWindow'>-->
        <!--<div v-if='showDumpWindow'>-->
          <!--<android-dump-->
            <!--:projectId='$store.state.mGlobleVar.projectId'-->
            <!--:deviceId='deviceId'-->
            <!--:agentIp='agentIp'-->
            <!--:agentPort='agentPort'-->
          <!--/>-->
        <!--</div>-->
        <!--<el-button slot='reference' @click='showDumpWindow = !showDumpWindow'>-->
          <!--<svg-icon icon-class='capture' height='100%'/>-->
        <!--</el-button>-->
      <!--</el-popover>-->

      <!--<el-button @click='goMenu()' size='mini'>Menu</el-button>-->
      <!--<el-button @click='goHome()' size='mini'>Home</el-button>-->
      <!--<el-button @click='goBack()' size='mini'>Back</el-button>-->
      <!--<el-button @click='goPower()' size='mini'>Power</el-button>-->

      <!--<el-popover-->
        <!--placement='left'-->
        <!--width='800'-->
        <!--trigger='click'>-->
        <!--&lt;!&ndash;minicap/touch/adbkit/uiautomator2信息&ndash;&gt;-->
        <!--<el-row style='margin-top: 20px'>-->
          <!--<el-card>-->
            <!--<div style='margin-bottom: 10px'>-->
              <!--<el-tag type='success'>minitouch</el-tag>-->
              <!--{{ minitouchMsg }}-->
            <!--</div>-->
            <!--<div style='margin-bottom: 10px'>-->
              <!--<el-tag type='warning'>minicap</el-tag>-->
              <!--{{ minicapMsg }}-->
            <!--</div>-->
            <!--<div style='margin-bottom: 10px'>-->
              <!--<el-tag type='danger'>uiautomator2 server</el-tag>-->
              <!--{{ uiautomator2ServerMsg }}-->
            <!--</div>-->
            <!--<div v-if='adbkitTip'>-->
              <!--<el-tag>adbkit</el-tag>-->
              <!--<span>{{ adbkitTip }}</span></div>-->
          <!--</el-card>-->
        <!--</el-row>-->
        <!--&lt;!&ndash;安装APP&ndash;&gt;-->
        <!--<el-row style='margin-top: 20px'>-->
          <!--<el-card>-->
            <!--<el-upload-->
              <!--drag-->
              <!--action='/'-->
              <!--:on-change='onChange'-->
              <!--:multiple='false'-->
              <!--:auto-upload='false'>-->
              <!--<i class='el-icon-upload'></i>-->
              <!--<div>将apk拖到此处，或<em>点击选择apk</em></div>-->
            <!--</el-upload>-->
            <!--<el-button :loading='installBtnLoading' @click='installApp()' type='primary' style='margin-top: 15px'>-->
              <!--{{installBtnText}}-->
            <!--</el-button>-->
          <!--</el-card>-->
        <!--</el-row>-->
        <!--&lt;!&ndash;开启远程调试&ndash;&gt;-->
        <!--<el-row style='margin-top: 20px'>-->
          <!--<el-card>-->
            <!--<el-button @click='startOrStopAdbKit' type='primary'>{{ adbKitBtnText }}</el-button>-->
            <!--<el-tag v-if='adbKitIsStart' type='success' style='margin-left: 15px'>{{ adbkitTip }}</el-tag>-->
          <!--</el-card>-->
        <!--</el-row>-->
        <!--<el-button slot='reference'>more</el-button>-->
      <!--</el-popover>-->
    <!--</div>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
<!--import AndroidDump from '../androiddump/index'-->
<!--import axios from 'axios'-->

<!--export default {-->
  <!--components: {-->
    <!--AndroidDump-->
  <!--},-->
  <!--// 关闭远程控制手机窗口-->
  <!--beforeDestroy() {-->
    <!--this.minicapWebsocket.close()-->
    <!--this.minitouchWebsocket.close()-->
  <!--},-->
  <!--data() {-->
    <!--return {-->
      <!--minitouchMsg: '',-->
      <!--minicapMsg: '',-->
      <!--uiautomator2ServerMsg: '',-->
      <!--// 显示手机页面布局-->
      <!--showDumpWindow: false,-->
      <!--adbKitBtnText: '开启远程调试',-->
      <!--adbkitTip: '',-->
      <!--adbKitIsStart: false,-->
      <!--installBtnLoading: false,-->
      <!--installBtnText: '安装APP',-->
      <!--agentIp: null,-->
      <!--agentPort: null,-->
      <!--choosedFile: null,-->
      <!--deviceInfo: [],-->
      <!--canvas: null,-->
      <!--minicapWebsocket: null,-->
      <!--minitouchWebsocket: null,-->
      <!--menu: {-->
        <!--operation: 'menu'-->
      <!--},-->
      <!--home: {-->
        <!--operation: 'home'-->
      <!--},-->
      <!--back: {-->
        <!--operation: 'back'-->
      <!--},-->
      <!--power: {-->
        <!--operation: 'power'-->
      <!--},-->
      <!--touchDown: {-->
        <!--operation: 'd',-->
        <!--pX: 0.5,-->
        <!--pY: 0.5,-->
        <!--pressure: 50-->
      <!--},-->
      <!--touchMove: {-->
        <!--operation: 'm',-->
        <!--pX: 0.5,-->
        <!--pY: 0.5,-->
        <!--pressure: 50-->
      <!--},-->
      <!--touchUp: {-->
        <!--'operation': 'u'-->
      <!--}-->
    <!--}-->
  <!--},-->
  <!--methods: {-->
    <!--startOrStopAdbKit() {-->
      <!--if (!this.adbKitIsStart) {-->
        <!--axios.get('http://' + this.agentIp + ':' + this.agentPort + '/android/adbkit/start/' + this.deviceId).then(response => {-->
          <!--if (response.data.status === 1) {-->
            <!--this.adbKitIsStart = true-->
            <!--this.adbKitBtnText = '关闭远程调试'-->
            <!--this.adbkitTip = 'adb connect ' + this.agentIp + ':' + response.data.data.port-->
          <!--}-->
        <!--})-->
      <!--} else {-->
        <!--axios.get('http://' + this.agentIp + ':' + this.agentPort + '/android/adbkit/stop/' + this.deviceId).then(response => {-->
          <!--if (response.data.status === 1) {-->
            <!--this.adbKitIsStart = false-->
            <!--this.adbKitBtnText = '开启远程调试'-->
            <!--this.adbkitTip = ''-->
          <!--}-->
        <!--})-->
      <!--}-->
    <!--},-->
    <!--// 选择apk-->
    <!--onChange(file) {-->
      <!--this.choosedFile = file-->
    <!--},-->
    <!--// 点击安装APP按钮-->
    <!--installApp() {-->
      <!--// 是否选择了一个文件-->
      <!--if (this.choosedFile == null) {-->
        <!--this.$notify.error('请选择一个app')-->
        <!--return-->
      <!--}-->
      <!--// 选择的文件是否以apk结尾-->
      <!--var app = this.choosedFile.raw-->
      <!--if (!app.name.endsWith('.apk')) {-->
        <!--this.$notify.error('请选择apk文件')-->
        <!--return-->
      <!--}-->
      <!--this.installBtnText = '安装中...'-->
      <!--this.installBtnLoading = true-->
      <!--const form = new FormData()-->
      <!--form.append('apk', app)-->
      <!--const config = {-->
        <!--headers: { 'Content-Type': 'multipart/form-data' }-->
      <!--}-->
      <!--axios.post('http://' + this.agentIp + ':' + this.agentPort + '/android/installApk/' + this.deviceId, form, config).then(response => {-->
        <!--if (response.data.status === 1) {-->
          <!--this.$notify.success(response.data.msg)-->
        <!--} else {-->
          <!--this.$notify.error(response.data.msg)-->
        <!--}-->
      <!--}).finally(() => {-->
        <!--this.installBtnText = '安装APP'-->
        <!--this.installBtnLoading = false-->
      <!--})-->
    <!--},-->
    <!--//点击menu-->
    <!--goMenu() {-->
      <!--this.minitouchWebsocket.send(JSON.stringify(this.menu))-->
    <!--},-->
    <!--//点击home-->
    <!--goHome() {-->
      <!--this.minitouchWebsocket.send(JSON.stringify(this.home))-->
    <!--},-->
    <!--//点击back-->
    <!--goBack() {-->
      <!--this.minitouchWebsocket.send(JSON.stringify(this.back))-->
    <!--},-->
    <!--//点击power-->
    <!--goPower() {-->
      <!--this.minitouchWebsocket.send(JSON.stringify(this.power))-->
    <!--},-->
    <!--//在X轴 占的比例  比如点击画布水平中心 则返回0.5-->
    <!--getX(event) {-->
      <!--var offx = event.offsetX-->
      <!--var canvasWidth = this.canvas.offsetWidth-->
      <!--return offx / canvasWidth-->
    <!--},-->
    <!--//在Y轴 占的比例  比如点击画布垂直中心 则返回0.5-->
    <!--getY(event) {-->
      <!--var offy = event.offsetY;-->
      <!--var canvasHeight = this.canvas.offsetHeight;-->
      <!--return offy / canvasHeight-->
    <!--}-->
  <!--},-->
  <!--async mounted() {-->
    <!--this.canvas = document.getElementById('canvas1')-->
    <!--var g = this.canvas.getContext('2d')-->
    <!--//uiautomator2 server-->
    <!--axios.get('http://' + this.agentIp + ':' + this.agentPort + '/android/uiautomator2server/start/' + this.deviceId).then(response => {-->
      <!--this.uiautomator2ServerMsg = JSON.stringify(response.data)-->
      <!--if (response.data.status === 1) {-->
        <!--this.$store.dispatch('setPort', response.data.data.port)-->
      <!--}-->
    <!--})-->
    <!--//minicap-->
    <!--var BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='-->
    <!--this.minicapWebsocket = new WebSocket('ws://' + this.agentIp + ':' + this.agentPort + '/minicap/' + this.deviceId + '/' + this.name)-->
    <!--this.minicapWebsocket.binaryType = 'blob'-->
    <!--this.minicapWebsocket.onclose = () => {-->
      <!--this.minicapMsg = 'minicap websocket closed'-->
    <!--}-->
    <!--this.minicapWebsocket.onerror = () => {-->
      <!--this.minicapMsg = 'minicap websocket error'-->
    <!--}-->
    <!--this.minicapWebsocket.onmessage = (message) => {-->
      <!--if (typeof message.data === 'string') {-->
        <!--this.minicapMsg = message.data-->
      <!--} else {-->
        <!--var blob = new Blob([message.data], { type: 'image/jpeg' })-->
        <!--var URL = window.URL || window.webkitURL-->
        <!--var img = new Image()-->
        <!--var c = this.canvas-->
        <!--img.onload = () => {-->
          <!--c.width = img.width-->
          <!--c.height = img.height-->
          <!--g.drawImage(img, 0, 0)-->
          <!--img.onload = null-->
          <!--img.src = BLANK_IMG-->
          <!--img = null-->
          <!--u = null-->
          <!--blob = null-->
        <!--}-->
        <!--var u = URL.createObjectURL(blob)-->
        <!--img.src = u-->
      <!--}-->
    <!--}-->
    <!--// minitouch-->
    <!--this.minitouchWebsocket = new WebSocket('ws://' + this.agentIp + ':' + this.agentPort + '/minitouch/' + this.deviceId)-->
    <!--this.minitouchWebsocket.onmessage = (message) => {-->
      <!--this.minitouchMsg = message.data-->
    <!--}-->
    <!--this.minitouchWebsocket.onclose = () => {-->
      <!--this.minitouchMsg = 'minitouch websocket closed'-->
    <!--}-->
    <!--this.minitouchWebsocket.onerror = () => {-->
      <!--this.minitouchMsg = 'minitouch websocket error'-->
    <!--}-->
    <!--var isMouseDown = false;-->
    <!--//当鼠标处于按下的状态 移出画布 这个时候体验不好，需要在移出的时候，将发送鼠标抬起事件  并将鼠标状态设为抬起-->
    <!--this.canvas.onmouseleave = () => {-->
      <!--//当鼠标按下状态 移出canvas时 提交touchup-->
      <!--if (isMouseDown) {-->
        <!--this.minitouchWebsocket.send(JSON.stringify(this.touchUp))-->
        <!--//将鼠标设为未按下状态-->
        <!--isMouseDown = false-->
      <!--}-->
    <!--}-->
    <!--//当鼠标按下时，将按下的XY坐标发送给服务器处理，XY坐标为相对比例，如：0.5,0.5 则代表屏幕中心-->
    <!--this.canvas.onmousedown = (e) => {-->
      <!--isMouseDown = true;-->
      <!--this.touchDown.pX = this.getX(e);-->
      <!--this.touchDown.pY = this.getY(e);-->
      <!--this.minitouchWebsocket.send(JSON.stringify(this.touchDown))-->
    <!--}-->
    <!--//鼠标抬起-->
    <!--this.canvas.onmouseup = () => {-->
      <!--isMouseDown = false;-->
      <!--this.minitouchWebsocket.send(JSON.stringify(this.touchUp))-->
    <!--}-->
    <!--//鼠标移动-->
    <!--this.canvas.onmousemove = (e) => {-->
      <!--//鼠标按下 才发送移动事件  防止在画布上移动鼠标 也发送移动事件-->
      <!--if (isMouseDown) {-->
        <!--this.touchMove.pX = this.getX(e);-->
        <!--this.touchMove.pY = this.getY(e);-->
        <!--this.minitouchWebsocket.send(JSON.stringify(this.touchMove))-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--}-->
<!--</script>-->
