<template>
  <div style="height: 250px; overflow: auto">
    <el-button size="mini" @click="addJavaImport">+</el-button>
    <el-input v-for="(javaImport, index) in javaImports" :key="index" placeholder="请输入内容" v-model.trim="javaImports[index]" style="margin-top: 3px">
      <el-button slot="append" icon="el-icon-delete" @click="deleteJavaImport(index)" />
    </el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      javaImports: []
    }
  },
  methods: {
    addJavaImport() {
      this.javaImports.push(';')
    },
    deleteJavaImport(index) {
      this.javaImports.splice(index, 1)
    }
  }
}
</script>
