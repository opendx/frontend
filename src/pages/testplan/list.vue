<template>
  <div class="app-container">
    <el-button @click="$router.push('/testplan/add')" style="margin-bottom: 10px">添加测试计划</el-button>
    <el-table :data="testPlanList" border fit>
      <el-table-column label="环境" align="center" width="200">
        <template scope="{ row }">
          <el-select v-model="row.environmentId" @change="environmentChange(row)">
            <el-option v-for="environment in environmentList" :key="environment.id" :value="environment.id" :label="environment.name" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="测试计划" align="center" prop="name" min-width="100" show-overflow-tooltip />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="设备" align="center" width="200" show-overflow-tooltip>
        <template scope="{ row }">
          <div v-for="deviceId in row.deviceIds" :key="deviceId">{{ deviceId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="录制视频" align="center" width="80">
        <template scope="{ row }">
          {{ row.enableRecordVideo === 1 ? '开启' : '关闭' }}
        </template>
      </el-table-column>
      <el-table-column label="失败重试次数" align="center" prop="failRetryCount" width="100" />
      <el-table-column label="定时任务" align="center" prop="description" width="80">
        <template scope="{ row }">
          {{ row.enableSchedule === 1 ?  '开启' : '关闭' }}
        </template>
      </el-table-column>
      <el-table-column label="cron表达式" align="center" prop="cronExpression" width="150" show-overflow-tooltip />
      <el-table-column label="创建时间" align="center" width="200" show-overflow-tooltip>
        <template scope="{ row }">
          {{ row.creatorNickName + ' ' + row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230">
        <template scope="{ row }">
          <el-button type="success" @click="commitTestPlan(row.id)">提交测试</el-button>
          <el-button type="primary" class="el-icon-edit" @click="goToUpdateTestPlanPage(row.id)" />
          <el-button type="danger" class="el-icon-delete" @click="deleteTestPlan(row)" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryTestPlanListForm.pageNum" :limit.sync="queryTestPlanListForm.pageSize" @pagination="fetchTestPlanList" />
    </div>
  </div>
</template>

<script>

import { deleteTestPlan, getTestPlanList, updateTestPlan } from '@/api/testPlan'
import { commitTestTask } from '@/api/testTask'
import { getEnvironmentList } from '@/api/environment'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      testPlanList: [],
      total: 0,
      queryTestPlanListForm: {
        pageNum: 1,
        pageSize: 10,
        projectId: this.$store.state.project.id // 这里不能用computed里的projectId，会拿到undefined
      },
      environmentList: [
        {
          id: -1,
          name: '默认'
        }
      ]
    }
  },
  methods: {
    fetchTestPlanList() {
      getTestPlanList(this.queryTestPlanListForm).then(response => {
        this.testPlanList = response.data.data
        this.total = response.data.total
      })
    },
    deleteTestPlan(testPlan) {
      this.$confirm('删除' + testPlan.name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTestPlan(testPlan.id).then(response => {
          this.$notify.success(response.msg)
          this.fetchTestPlanList()
        })
      })
    },
    goToUpdateTestPlanPage(id) {
      this.$router.push('/testPlan/update/' + id)
    },
    commitTestPlan(id) {
      commitTestTask({ testPlanId: id }).then(response => {
        this.$notify.success(response.msg)
        this.$router.push('/testTask/list')
      })
    },
    fetchEnvironmentList() {
      getEnvironmentList({ projectId: this.$store.state.project.id }).then(response => {
        this.environmentList = this.environmentList.concat(response.data)
      })
    },
    environmentChange(row) {
      updateTestPlan(row).then(response => {
        this.fetchTestPlanList()
      })
    }
  },
  created() {
    this.fetchEnvironmentList()
    this.fetchTestPlanList()
  }
}
</script>
