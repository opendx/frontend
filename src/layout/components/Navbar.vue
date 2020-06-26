<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />
        <!--<error-log class="errLog-container right-menu-item hover-effect" />-->
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <!--<el-tooltip content="Global Size" effect="dark" placement="bottom">-->
          <!--<size-select id="size-select" class="right-menu-item hover-effect" />-->
        <!--</el-tooltip>-->
      </template>
      <span class="right-menu-item" style="margin-right: -16px; font-size: 12px; color: #2d2f33">当前项目:</span>
      <el-select v-model="projectId" placeholder="选择项目" class="right-menu-item" size="mini" @change="selectedUserProject">
        <el-option
          v-for="project in userProjects"
          :key="project.id"
          :label="project.name"
          :value="project.id"
        />
      </el-select>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div>
          <i class="el-icon-user-solid" /><span style="font-size: 15px; margin-left: 5px">{{ name }}</span>
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
      'device',
      'projectId',
      'userProjects',
      'roles'
    ])
  },
  data() {
    return {
    }
  },
  created() {
    if (this.userProjects.length === 0) { // 未分配项目
      if (this.roles.indexOf('admin') === -1) { // 非管理员
        this.$alert('未加入任何项目，请联系管理员添加', '提示', {
          showClose: false,
          center: true,
          confirmButtonText: '登出',
          callback: () => {
            this.logout()
          }
        })
      } else {
        this.$alert('未加入任何项目', '提示', {
          confirmButtonText: '创建项目',
          cancelButtonText: '加入项目',
          showCancelButton: true,
          callback: (action) => {
            if (action === 'confirm') {
              this.$router.push({
                name: 'AddProject'
              })
            } else {
              this.$router.push({
                name: 'UserList'
              })
            }
          }
        })
      }
    } else { // 用户已分配项目
      if (this.projectId && this.userProjects.filter(p => p.id === this.projectId).length !== 0) { // 当前选择的项目在用户分配的项目中
        return
      }
      // 取第一个项目，作为当前项目
      const projet = this.userProjects[0]
      this.$store.dispatch('project/setId', projet.id)
      this.$store.dispatch('project/setPlatform', projet.platform)
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    selectedUserProject(projectId) {
      const selectedProject = this.userProjects.filter(project => project.id === projectId)[0]
      this.$store.dispatch('project/setId', selectedProject.id)
      this.$store.dispatch('project/setPlatform', selectedProject.platform)
      location.reload()
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
