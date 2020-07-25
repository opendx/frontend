<template>
  <el-drawer
    :visible.sync="drawerVisible"
    direction="rtl"
    :with-header="false"
    size="80%"
  >
    <el-button size="mini" @click="addJavaImport">添加Java Import</el-button>
    <el-input v-for="(javaImport, index) in javaImportList" :key="index" v-model="javaImportList[index]" placeholder="eg: import java.util.List" style="margin-top: 3px">
      <el-button slot="append" icon="el-icon-delete" @click="deleteJavaImport(index)" />
    </el-input>
  </el-drawer>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    javaImports: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    visible(val) {
      this.drawerVisible = val
    },
    drawerVisible(val) {
      this.$emit('update:visible', val)
    },
    javaImports() {
      this.javaImportList = this.javaImports
    },
    javaImportList() {
      this.$emit('update:javaImports', this.javaImportList)
    }
  },
  data() {
    return {
      drawerVisible: false,
      javaImportList: this.javaImports
    }
  },
  methods: {
    addJavaImport() {
      this.javaImportList.push('')
    },
    deleteJavaImport(index) {
      this.javaImportList.splice(index, 1)
    }
  }
}
</script>
