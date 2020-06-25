<template>
  <el-form :data="testSuite" label-width="100px">
    <el-form-item label="测试集名" :rules="[{required: true}]">
      <el-input v-model.trim="testSuite.name" clearable style="width: 300px" />
    </el-form-item>
    <el-form-item label="描述">
      <el-input type="textarea" v-model.trim="testSuite.description" clearable style="width: 300px" />
    </el-form-item>
    <el-form-item label="测试用例" :rules="[{required: true}]">
      <el-tree
        :data="treeData"
        show-checkbox
        :props="{ children: 'children', label: 'name' }"
        default-expand-all
        node-key="id"
        :default-checked-keys="testSuite.testcases"
        ref="tree"
      >
      </el-tree>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveTestSuite">保 存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>

import { addTestSuite, updateTestSuite, getTestSuiteList } from '@/api/testSuite'
import { getActionCascader } from '@/api/action'

export default {
  props: {
    isAdd: Boolean
  },
  data() {
    return {
      testSuite: {
        id: undefined,
        name: '',
        description: '',
        testcases: [],
        projectId: this.$store.state.project.id
      },
      treeData: []
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.id
    },
    platform() {
      return this.$store.state.project.platform
    }
  },
  created() {
    this.fetchActionCascader()
    if (!this.isAdd) {
      // 编辑
      getTestSuiteList({ id: this.$route.params.testSuiteId }).then(response => {
        this.testSuite = response.data[0]
      })
    } else {
      // 复制
      if (this.$route.params.name) {
        this.testSuite = this.$route.params
      }
    }
  },
  methods: {
    fetchActionCascader() {
      // 3: 测试用例
      getActionCascader(this.projectId, this.platform, 3).then(resp => {
        this.treeData = resp.data
      })
    },
    saveTestSuite() {
      // 获取当前选中的叶子节点
      this.testSuite.testcases = this.$refs.tree.getCheckedKeys().filter(key => key) // 过滤掉空值

      if (this.isAdd) {
        addTestSuite(this.testSuite).then(response => {
          this.saveTestSuiteSuccess(response.msg)
        })
      } else {
        updateTestSuite(this.testSuite).then(response => {
          this.saveTestSuiteSuccess(response.msg)
        })
      }
    },
    saveTestSuiteSuccess(msg) {
      this.$notify.success(msg)
      // 关闭当前tagview
      this.$store.dispatch('tagsView/delView', this.$store.state.tagsView.visitedViews.filter(item => item.path === this.$route.path)[0])
      this.$router.back()
    }
  }
}
</script>
