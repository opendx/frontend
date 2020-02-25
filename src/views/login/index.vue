<template>
  <div class="app-container">
    <div style="margin-top: 150px">
      <div align="center" style="margin-bottom: 10px">
        <img :src="logo" style="width: 80px;height: 80px">
      </div>
      <div style="width: 300px; margin: auto;">
        <el-input v-model="loginForm.username" tabindex="1" clearable style="margin-bottom: 20px">
          <template slot="prepend">账号</template>
        </el-input>
        <el-input v-model="loginForm.password" tabindex="2" show-password clearable style="margin-bottom: 20px" @keyup.enter.native="handleLogin">
          <template slot="prepend">密码</template>
        </el-input>
        <el-button style="width: 100%" type="primary" @click.native.prevent="handleLogin">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import logo from '@/assets/logo.png'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      redirect: undefined,
      logo: logo
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
    }
  }
}
</script>
