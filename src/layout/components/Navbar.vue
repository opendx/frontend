<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />
        <error-log class="errLog-container right-menu-item hover-effect" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <el-select v-model="idleDeviceId" placeholder="选择手机" style="top: -15px" size="mini" @visible-change="selectIdleDevice" @change="selectedIdleDevice">
        <el-option
          v-for="idleDevice in idleDeviceList"
          :key="idleDevice.id"
          :label="idleDevice.name"
          :value="idleDevice.id"
        />
      </el-select>
      <el-button icon="el-icon-warning" v-if="!$store.state.project.id" type="danger" style="position: relative; top: -15px" size="mini">选择一个项目作为当前的测试项目</el-button>
      <el-select v-model="projectId" placeholder="选择项目" style="top: -15px" size="mini" @visible-change="selectProject" @change="selectedProject">
        <el-option
          v-for="project in projectList"
          :key="project.id"
          :label="project.name"
          :value="project.id"
        />
      </el-select>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div>
          <svg-icon icon-class="people" /><span style="font-size: 15px; margin-left: 5px">{{ name }}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <a target="_blank" href="https://github.com/opendx">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import { getProjectList } from '@/api/project'
import { getDeviceList, deviceStart } from '@/api/device'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  data() {
    return {
      projectList: [],
      projectId: null,
      idleDeviceList: [],
      idleDeviceId: null
    }
  },
  async created() {
    this.projectId = this.$store.state.project.id
    this.projectList = [
      {
        id: this.projectId,
        name: this.$store.state.project.name
      }
    ]
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    selectProject(type) {
      if (type) {
        // el-select展开
        getProjectList().then(response => {
          this.projectList = response.data
        })
      }
    },
    selectedProject(projectId) {
      const selectedProject = this.projectList.filter(project => project.id === projectId)
      this.$store.dispatch('project/setId', selectedProject[0].id)
      this.$store.dispatch('project/setPlatform', selectedProject[0].platform)
      this.$store.dispatch('project/setName', selectedProject[0].name)
    },
    selectIdleDevice(type) {
      if (type) {
        // status: 2 在线闲置
        getDeviceList({ status: 2 }).then(response => {
          this.idleDeviceList = response.data
        })
      }
    },
    selectedIdleDevice(idleDeviceId) {
      this.idleDeviceId = null
      if (this.$store.state.device.show) {
        this.$notify.error('只能使用一台手机')
        return
      }
      deviceStart(idleDeviceId).then(() => {
        const device = this.idleDeviceList.filter(idleDevice => idleDevice.id === idleDeviceId)[0]
        this.$store.dispatch('device/setAgentIp', device.agentIp)
        this.$store.dispatch('device/setAgentPort', device.agentPort)
        this.$store.dispatch('device/setId', device.id)
        this.$store.dispatch('device/setPlatform', device.platform)
        this.$store.dispatch('device/setShow', true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 10px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
