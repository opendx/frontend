<template>
  <el-dialog :title="title" :visible="true" :show-close="false">
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
          <el-divider></el-divider>
        </div>
      </el-form-item>
      <el-form-item label="devices">
        <el-select v-model="driver.deviceIds" clearable filterable multiple style="width: 100%">
          <el-option v-for="device in devices" :label="device.id" :value="device.id" :key="device.id">
            <span style="float: left;margin-right: 10px">{{ device.id }}</span>
            <span style="float: left;margin-right: 10px">{{ device.name }}</span>
            <span style="float: left">{{ device.systemVersion }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="saveDriver">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addDriver, updateDriver } from '@/api/driver'
import { getDeviceList } from '@/api/device'

export default {
  props: {
    isAdd: Boolean
  },
  data() {
    return {
      title: this.isAdd ? '添加Driver' : '更新Driver',
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
      uploadUrl: process.env.VUE_APP_BASE_API + '/upload/file'
    }
  },
  created() {
    if (!this.isAdd) {
      this.driver = this.$route.params
    }
    getDeviceList().then(response => {
      this.devices = response.data
    })
  },
  methods: {
    onFileUploadSuccess(response, file, fileList, url) {
      if (response.status !== 1) {
        this.$message.error(response.msg)
        return
      }
      url.downloadUrl = response.data.downloadURL
    },
    cancel() {
      this.$router.back()
    },
    goToDriverListPage() {
      this.$router.push({
        path: '/driver/list'
      })
    },
    saveDriver() {
      if (this.isAdd) {
        addDriver(this.driver).then(response => {
          this.$notify.success(response.msg)
          this.goToDriverListPage()
        })
      } else {
        updateDriver(this.driver).then(response => {
          this.$notify.success(response.msg)
          this.goToDriverListPage()
        })
      }
    }
  }
}
</script>
