<template>
  <div class="app-container">
    <div style="margin-top: 200px">
      <h2 align="center">DaXiang</h2>
      <el-tabs v-model="activeName" style="width: 98px;margin: auto">
        <el-tab-pane label="登录" name="login" />
        <el-tab-pane label="注册" name="register" />
      </el-tabs>
      <div v-if="activeName === 'login'" style="width: 20%; margin: auto">
        <el-input v-model="loginForm.username" tabindex="1" clearable style="margin-bottom: 10px">
          <template slot="prepend">账号</template>
        </el-input>
        <el-input v-model="loginForm.password" tabindex="2" show-password clearable style="margin-bottom: 10px" @keyup.enter.native="handleLogin">
          <template slot="prepend">密码</template>
        </el-input>
        <el-button style="width: 100%" type="primary" @click.native.prevent="handleLogin">登录</el-button>
      </div>
      <div v-if="activeName === 'register'" style="width: 20%; margin: auto">
        <el-input v-model="registerForm.username" tabindex="1" clearable style="margin-bottom: 10px">
          <template slot="prepend">账号</template>
        </el-input>
        <el-input v-model="registerForm.password" tabindex="2" show-password clearable style="margin-bottom: 10px">
          <template slot="prepend">密码</template>
        </el-input>
        <el-input v-model="registerForm.nickName" tabindex="3" clearable style="margin-bottom: 10px" @keyup.enter.native="handleRegister">
          <template slot="prepend">昵称</template>
        </el-input>
        <el-button style="width: 100%" type="primary" @click.native.prevent="handleRegister">注册</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from '@/api/user'
export default {
  name: 'Login',
  data() {
    return {
      activeName: 'login',
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        nickName: ''
      },
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$store.dispatch('user/login', this.loginForm).then(() => {
        this.$router.push({ path: this.redirect || '/' })
      })
    },
    handleRegister() {
      register(this.registerForm).then(response => {
        this.$notify.success(response.msg)
        this.activeName = 'login'
      })
    }
  }
}
</script>
