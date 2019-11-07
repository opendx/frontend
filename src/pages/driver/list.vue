<template>
  <div class="app-container">
    <div>
      <el-button @click="$router.push('/driver/add')">添加driver</el-button>
    </div>
    <!-- 列表 -->
    <div style="margin-top: 10px">
      <el-table :data="driverList" highlight-current-row border>
        <el-table-column label="类型" align="center">
          <template scope="{ row }">
            {{ row.type === 1 ? 'chromedriver' : 'todo' }}
          </template>
        </el-table-column>
        <el-table-column label="version" align="center" prop="version" />
        <el-table-column label="urls" align="center">
          <template scope="{ row }">
            <el-table :data="row.urls" border>
              <el-table-column label="平台" align="center">
                <template scope="{ row }">
                  {{ row.platform === 1 ? 'windows' : row.platform === 2 ? 'linux' : 'mac' }}
                </template>
              </el-table-column>
              <el-table-column label="下载地址" align="center" prop="downloadUrl" />
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="devices" align="center">
          <template scope="{ row }">
            <div v-for="deviceId in row.deviceIds" :key="deviceId">{{ deviceId }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template scope="{ row }">
            {{ row.creatorNickName + ' ' + row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template scope="{ row }">
            <el-button type="primary" class="el-icon-edit" @click="updateDriver(row)" />
            <el-button type="danger" class="el-icon-delete" @click="deleteDriver(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchDriverList" />
    </div>
  </div>
</template>

<script>

import { getDriverList, deleteDriver } from '@/api/driver'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      driverList: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 30
      }
    }
  },
  created() {
    this.fetchDriverList()
  },
  methods: {
    updateDriver(driver) {
      this.$router.push({
        name: 'UpdateDriver',
        params: driver
      })
    },
    deleteDriver(driver) {
      this.$confirm('删除该Driver？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDriver(driver.id).then(resp => {
          this.$notify.success(resp.msg)
          this.fetchDriverList()
        })
      })
    },
    fetchDriverList() {
      getDriverList(this.queryForm).then(resp => {
        this.driverList = resp.data.data
        this.total = resp.data.total
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
