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
      <div v-for="driverFile in driver.files" :key="driverFile.platform">
        <el-upload
          :action="uploadUrl"
          :limit="1"
          :multiple="false"
          :on-success="(response, file, fileList) => onFileUploadSuccess(response, file, fileList, driverFile)">
          <el-button>{{ driverFile.platform === 1 ? 'windows' : driverFile.platform === 2 ? 'linux' : 'macos' }} - 点击上传</el-button>
          {{ driverFile.filePath }}
        </el-upload>
        <el-divider />
      </div>
    </el-form-item>
    <el-form-item label="mobiles">
      <el-select v-model="driver.deviceIds" @visible-change="mobileSelectChange" clearable filterable multiple style="width: 100%">
        <el-option v-for="mobile in mobiles" :label="mobile.id" :value="mobile.id" :key="mobile.id">
          <span>{{ mobile.id }}</span>
          <el-divider direction="vertical" />
          <span>{{ mobile.name }}</span>
          <el-divider direction="vertical" />
          <span>{{ mobile.systemVersion }}</span>
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
import { getMobileList } from '@/api/mobile'

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
        files: [
          {
            platform: 1, // windows
            filePath: ''
          }, {
            platform: 2, // linux
            filePath: ''
          }, {
            platform: 3, // mac
            filePath: ''
          }
        ],
        // todo mobileIds
        deviceIds: []
      },
      mobiles: [],
      uploadUrl: process.env.VUE_APP_BASE_API + '/upload/file/4'
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
    mobileSelectChange(type) {
      if (type) {
        this.fetchMobileList()
      }
    },
    fetchMobileList() {
      getMobileList({ platform: 1 }).then(response => {
        this.mobiles = response.data
      })
    },
    onFileUploadSuccess(response, file, fileList, driverFile) {
      if (response.status !== 1) {
        this.$message.error(response.msg)
        return
      }
      driverFile.filePath = response.data.filePath
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
