<template>
  <el-form :data="app" label-width="80px" label-position="left">
    <el-form-item label="平台" :rules="[{required: true}]">
      <el-radio-group v-model="app.platform" :disabled="!isAdd">
        <el-radio v-for="platform in platforms" :key="platform.type" :label="platform.type">
          {{ platform.name }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="app" :rules="[{required: true}]" v-if="isAdd">
      <el-upload drag action="/" :on-change="onChange" :multiple="false" :auto-upload="false">
        <i class="el-icon-upload" /><div>将app拖到此处，或<em>点击选择app</em></div>
      </el-upload>
    </el-form-item>
    <el-form-item label="app名" :rules="[{required: true}]">
      <el-input v-model.trim="app.name" clearable style="width: 300px" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveApp" :loading="saveBtnLoading">保 存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>

import { uploadApp, updateApp, getAppList } from '@/api/app'

export default {
  props: {
    isAdd: Boolean
  },
  data() {
    return {
      platforms: [
        {
          type: 1,
          name: 'Android'
        },
        {
          type: 2,
          name: 'iOS'
        }
      ],
      choosedApp: null,
      saveBtnLoading: false,
      app: {
        id: undefined,
        name: '',
        platform: 1,
        projectId: this.$store.state.project.id
      }
    }
  },
  created() {
    if (!this.isAdd) {
      getAppList({ id: this.$route.params.appId }).then(response => {
        this.app = response.data[0]
      })
    }
  },
  methods: {
    // 选择app
    onChange(file) {
      this.choosedApp = file
    },
    saveAppSuccess(msg) {
      this.$notify.success(msg)
      // 关闭当前tagview
      this.$store.dispatch('tagsView/delView', this.$store.state.tagsView.visitedViews.filter(item => item.path === this.$route.path)[0])
      this.$router.back()
    },
    saveApp() {
      this.saveBtnLoading = true
      if (this.isAdd) {
        if (this.choosedApp == null) {
          this.$notify.error('请选择一个app')
          this.saveBtnLoading = false
          return
        }
        const formData = new FormData()
        formData.append('file', this.choosedApp.raw)
        for (const k in this.app) {
          if (this.app[k]) {
            formData.append(k, this.app[k])
          }
        }
        uploadApp(formData).then(response => {
          this.saveAppSuccess(response.msg)
        }).finally(() => {
          this.saveBtnLoading = false
        })
      } else {
        updateApp(this.app).then(response => {
          this.saveAppSuccess(response.msg)
        }).finally(() => {
          this.saveBtnLoading = false
        })
      }
    }
  }
}
</script>
