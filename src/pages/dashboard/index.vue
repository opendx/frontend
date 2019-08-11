<template>
  <div class="app-container">
    welcome,<a target="_blank" href="https://github.com/opendx">github star!</a>
  </div>
</template>
<script>
import { getProjectList } from '@/api/project'
export default {
  data() {
    return {
    }
  },
  created() {
    getProjectList().then(response => {
      const projectList = response.data
      if (projectList.length === 0) {
        this.$alert('暂无项目，创建一个项目', '提示', {
          confirmButtonText: '创建',
          showClose: false,
          callback: () => {
            this.$router.push('/project/add')
          }
        })
      }
    })
  }
}
</script>
