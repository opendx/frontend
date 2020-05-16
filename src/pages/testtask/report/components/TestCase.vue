<template>
  <div>
    <el-table :data="data" border>
      <el-table-column label="执行结果" align="center" width="80px">
        <template scope="{ row }">
          <el-tag :type="row.status === 0 ? 'danger' : row.status === 1 ? 'success' : 'warning'" size="small">
            {{ row.status === 0 ? '失败' : row.status === 1 ? '成功' : '跳过' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="测试用例" property="name" align="center" show-overflow-tooltip />
      <el-table-column label="开始时间" property="startTime" align="center" show-overflow-tooltip />
      <el-table-column label="结束时间" property="endTime" align="center" show-overflow-tooltip />
      <el-table-column label="耗时" align="center" show-overflow-tooltip>
        <template scope="{ row }">
          {{ parseInt(new Date(row.endTime) - new Date(row.startTime)) / 1000 + ' 秒' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template scope="{ row }">
          <el-button @click="clickDetailInfo(row)" size="small" type="text">详细信息</el-button>
          <el-button @click="$router.push({ name: 'UpdateTestcaseAction', params: { actionId: row.id }})" size="small" type="text">编辑用例</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      size="1300px"
      :title="testcase.name"
      :visible.sync="showDrawer">
      <div style="padding: 5px">
        <div>
          <div v-if="testcase.videoUrl" style="width: 300px; float:left; margin-right: 5px">
            <video :src="testcase.videoUrl" width="100%" controls="controls">浏览器不支持video标签</video>
          </div>
          <div style="width: 950px; float:left">
            <el-table :data="testcase.steps" border max-height="500px">
              <el-table-column prop="number" label="步骤" align="center" width="100" />
              <el-table-column prop="name" label="步骤名" align="center" min-width="100" show-overflow-tooltip />
              <el-table-column prop="startTime" label="开始时间" align="center" width="180" show-overflow-tooltip />
              <el-table-column prop="endTime" label="结束时间" align="center" width="180" show-overflow-tooltip />
              <el-table-column label="耗时" align="center" show-overflow-tooltip>
                <template scope="{ row }">
                  {{ row.endTime ? parseInt(new Date(row.endTime) - new Date(row.startTime)) / 1000 + '秒' : '-' }}
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center" width="90">
                <template scope="{ row }">
                  <el-tag :type="row.endTime ? 'success' : row.startTime ? 'danger' : 'info'" style="width: 65px;">
                    {{ row.endTime ? '完成' : row.startTime ? '失败' : '未执行' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="clear: both; margin-top: 5px">
          <div v-if="testcase.failImgUrl" style="width: 300px; float: left; margin-right: 5px">
            <el-image :src="testcase.failImgUrl" :preview-src-list="[testcase.failImgUrl]" width="100%" />
          </div>
          <div v-if="testcase.failInfo" style="width: 950px; float:left; font-size: 10px">
            <codemirror v-model="testcase.failInfo" :options="cmOptions" />
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import 'codemirror/mode/clike/clike.js'
import 'codemirror/theme/base16-dark.css'
export default {
  props: {
    data: Array
  },
  data() {
    return {
      showDrawer: false,
      cmOptions: {
        mode: 'clike',
        theme: 'base16-dark',
        lineNumbers: true,
        readOnly: true
      },
      testcase: {}
    }
  },
  methods: {
    clickDetailInfo(row) {
      this.testcase = row
      this.showDrawer = true
    }
  }
}
</script>

<style>
  .el-drawer__body {
    height: 100%;
    overflow: auto;
  }
  .CodeMirror {
    height: auto;
  }
</style>
