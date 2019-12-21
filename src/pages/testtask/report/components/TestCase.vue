<template>
  <div>
    <el-collapse>
      <el-collapse-item v-for="testcase in data" :key="testcase.id">
        <template slot="title">
          <el-tag :type="testcase.status === 0 ? 'danger' : testcase.status === 1 ? 'success' : 'warning'" size="small" style="margin-right: 5px">
            {{ testcase.status === 0 ? '失败' : testcase.status === 1 ? '成功' : '跳过' }}
          </el-tag>
          <el-tag size="small" style="color: black; background-color: white; margin-right: 5px">
            {{ testcase.name }}
            <el-divider direction="vertical" />
            {{ testcase.startTime }}
            <el-divider direction="vertical" />
            {{ testcase.endTime }}
            <el-divider direction="vertical" />
            耗时: {{ parseInt(new Date(testcase.endTime) - new Date(testcase.startTime)) / 1000 + ' 秒' }}
          </el-tag>
          <el-tag @click="$router.push('/action/testcase/update/'+testcase.id)" size="small" type="primary">查看用例</el-tag>
        </template>
        <el-row :gutter="2">
          <el-col :span="4">
            <video v-if="testcase.videoUrl" :src="testcase.videoUrl" width="100%" controls="controls">浏览器不支持video标签</video>
          </el-col>
          <el-col :span="13">
            <el-table :data="testcase.steps" border max-height="700">
              <el-table-column prop="number" label="步骤" align="center" width="70" />
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
          </el-col>
          <el-col :span="7">
            <el-col>
              <el-col :span="8">
                <img v-if="testcase.failImgUrl" :src="testcase.failImgUrl" width="100%" />
              </el-col>
              <el-col :span="16">
                <div style="color:red;max-height: 700px;overflow: auto" v-if="testcase.failInfo">{{ testcase.failInfo }}</div>
              </el-col>
            </el-col>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  props: {
    data: Array
  }
}
</script>
