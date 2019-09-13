<template>
  <div>
    <el-collapse>
      <el-collapse-item v-for="testcase in data" :key="testcase.id">
        <template slot="title">
          <el-tag :type="testcase.status === 0 ? 'danger' : testcase.status === 1 ? 'success' : 'warning'" size="small" style="margin-right: 5px">
            {{ testcase.status === 0 ? '失败' : testcase.status === 1 ? '成功' : '跳过' }}
          </el-tag>
          <el-tag size="small" style="color: black; background-color: white; margin-right: 5px">
            {{ testcaseTitle(testcase) }}
          </el-tag>
          <el-tag @click="$router.push('/action/testcase/update/'+testcase.id)" size="small" type="info">查看用例</el-tag>
        </template>
        <div style="float: left">
          <video :src="testcase.videoUrl" width="300px" controls="controls">浏览器不支持video标签</video>
        </div>
        <div style="float: left;margin-left: 5px;max-height: 600px;overflow: auto">
          <el-table :data="testcase.steps" border>
            <el-table-column prop="number" label="步骤" align="center" width="50px" />
            <el-table-column prop="name" label="步骤名" align="center" width="200px" />
            <el-table-column prop="startTime" label="开始时间" align="center" width="160px" />
            <el-table-column prop="endTime" label="结束时间" align="center" width="160px" />
            <el-table-column label="耗时" align="center" width="100px">
              <template scope="{ row }">
                {{ row.endTime ? parseInt(new Date(row.endTime) - new Date(row.startTime)) / 1000 + 's' : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="90px">
              <template scope="{ row }">
                <el-tag :type="row.endTime ? 'success' : row.startTime ? 'danger' : 'info'" style="width: 65px;">
                  {{ row.endTime ? '完成' : row.startTime ? '失败' : '未执行' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="float: left;margin-left: 5px" v-if="testcase.failInfo || testcase.failImgUrl">
          <el-table :data="[testcase]" border>
            <el-table-column label="失败信息" align="center" width="280px">
              <template scope="{ row }">
                <span style="color:red" v-if="row.failInfo">{{ row.failInfo }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="失败时截图" align="center" width="320px">
              <template scope="{ row }">
                <img v-if="row.failImgUrl" :src="row.failImgUrl" style="width: 300px" />
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  props: {
    data: Array
  },
  computed: {
    testcaseTitle() {
      return function(testcase) {
        const spendTimeSec = parseInt(new Date(testcase.endTime) - new Date(testcase.startTime)) / 1000
        return '【 ' + testcase.startTime + ' - ' + testcase.endTime + ' - 耗时' + spendTimeSec + '秒 】 【 ' + testcase.name + ' 】'
      }
    }
  }
}
</script>
