<template>
  <div>
    <el-collapse>
      <el-collapse-item v-for="item in data" :key="item.id">
        <template slot="title">
          <el-tag size="small" type="info">开始时间：{{ item.startTime }}</el-tag>
          <el-tag size="small" type="info">结束时间：{{ item.endTime }}</el-tag>
          <el-tag size="small" type="info">{{ item.name }}</el-tag>
          <el-tag v-if="item.status === 0" type="danger" size="small">失败</el-tag>
          <el-tag v-else-if="item.status === 1" type="success" size="small">成功</el-tag>
          <el-tag v-else-if="item.status === 2" type="warning" size="small">跳过</el-tag>
        </template>
        <el-table :data="[item]" border>
          <el-table-column label="视频" align="center">
            <template scope="{ row }">
              <video :src="row.videoUrl" width="300px" controls="controls">浏览器不支持video标签</video>
            </template>
          </el-table-column>
          <el-table-column label="错误截图" align="center">
            <template scope="{ row }">
              <img :src="row.failImgUrl" style="width: 300px" />
            </template>
          </el-table-column>
          <el-table-column label="错误信息" align="center">
            <template scope="{ row }">
              <span style="color:red">{{ row.failInfo }}</span>
            </template>
          </el-table-column>
        </el-table>
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
