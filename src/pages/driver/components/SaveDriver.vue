<template>
  <el-form :data="driver" label-width="80px">
    <el-form-item label="version" :rules="[{required: true}]">
      <el-input v-model.trim="driver.version" clearable style="width: 300px" />
    </el-form-item>
    <el-form-item label="类型" :rules="[{required: true}]">
      <el-radio-group v-model="driver.type">
        <el-radio v-for="(v, k) in driverType" :key="k" :label="v">
          {{ k }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="上传">
      <div v-for="url in driver.urls" :key="url.platform">
        <el-upload
          :action="uploadUrl"
          :limit="1"
          :multiple="false"
          :on-success="(response, file, fileList) => onFileUploadSuccess(response, file, fileList, url)">
          <el-button>{{ url.platform === 1 ? 'windows' : url.platform === 2 ? 'linux' : 'mac' }} - 点击上传</el-button>
          {{ url.downloadUrl }}
        </el-upload>
        <el-divider />
      </div>
    </el-form-item>
    <el-form-item label="devices">
      <el-select v-model="driver.deviceIds" @visible-change="deviceSelectChange" clearable filterable multiple style="width: 100%">
        <el-option v-for="device in devices" :label="device.id" :value="device.id" :key="device.id">
          <span>{{ device.id }}</span>
          <el-divider direction="vertical" />
          <span>{{ device.name }}</span>
          <el-divider direction="vertical" />
          <span>{{ device.systemVersion }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveDriver">保 存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { addDriver, updateDriver, getDriverList } from '@/api/driver'
import { getDeviceList } from '@/api/device'

export default {
  props: {
    isAdd: Boolean
  },
  data() {
    return {
      driverType: {
        'chromedriver': 1
      },
      driver: {
        id: undefined,
        version: '',
        type: 1, // 默认是chromedriver
        urls: [
          {
            platform: 1, // windows
            downloadUrl: ''
          }, {
            platform: 2, // linux
            downloadUrl: ''
          }, {
            platform: 3, // mac
            downloadUrl: ''
          }
        ],
        deviceIds: []
      },
      devices: [],
      uploadUrl: process.env.VUE_APP_BASE_API + '/upload/file?fileType=4'
    }
  },
  created() {
    if (!this.isAdd) {
      getDriverList({ id: this.$route.params.driverId }).then(response => {
        this.driver = response.data[0]
      })
    }
  },
  methods: {
    deviceSelectChange(type) {
      if (type) {
        this.fetDeviceList()
      }
    },
    fetDeviceList() {
      getDeviceList().then(response => {
        this.devices = response.data
      })
    },
    onFileUploadSuccess(response, file, fileList, url) {
      if (response.status !== 1) {
        this.$message.error(response.msg)
        return
      }
      url.downloadUrl = response.data.downloadURL
    },
    saveDriverSuccess(msg) {
      this.$notify.success(msg)
      // 关闭当前tagview
      this.$store.dispatch('tagsView/delView', this.$store.state.tagsView.visitedViews.filter(item => item.path === this.$route.path)[0])
      this.$router.back()
    },
    saveDriver() {
      if (this.isAdd) {
        addDriver(this.driver).then(response => {
          this.saveDriverSuccess(response.msg)
        })
      } else {
        updateDriver(this.driver).then(response => {
          this.saveDriverSuccess(response.msg)
        })
      }
    }
  }
}
</script>
