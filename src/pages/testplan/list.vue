<template>
  <div class="app-container">
    <el-button @click="$router.push('/testplan/add')" style="margin-bottom: 10px">添加测试计划</el-button>
    <el-table :data="testPlanList" border fit>
      <el-table-column label="测试计划" align="center" prop="name"></el-table-column>
      <el-table-column label="描述" align="center" prop="description"></el-table-column>
      <el-table-column label="设备" align="center">
        <template scope="{ row }">
          <div v-for="deviceId in row.deviceIds" :key="deviceId">{{ deviceId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="定时任务" align="center" prop="description">
        <template scope="{ row }">
          {{ row.enableSchedule === 1 ?  '开启' : '关闭' }}
        </template>
      </el-table-column>
      <el-table-column label="cron表达式" align="center" prop="cronExpression"></el-table-column>
      <el-table-column label="创建时间" align="center">
        <template scope="{ row }">
          {{ row.creatorNickName + ' ' + row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template scope="{ row }">
          <el-button type="success" @click="commitTestPlan(row.id)">提交测试</el-button>
          <el-button type="primary" class="el-icon-edit" @click="updateTestPlan(row.id)" />
          <el-button type="danger" class="el-icon-delete" @click="deleteTestPlan(row.id)" />
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

import { deleteTestPlan, getTestPlanList } from '@/api/testPlan'
import { commitTestTask } from '@/api/testTask'
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
      }
    }
  },
  methods: {
    fetchTestPlanList() {
      getTestPlanList(this.queryTestPlanListForm).then(response => {
        this.testPlanList = response.data.data
        this.total = response.data.total
      })
    },
    deleteTestPlan(id) {
      this.$confirm('删除该TestPlan？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTestPlan(id).then(response => {
          this.$notify.success(response.msg)
          this.fetchTestPlanList()
        })
      })
    },
    updateTestPlan(id) {
      this.$router.push('/testPlan/update/' + id)
    },
    commitTestPlan(id) {
      commitTestTask({ testPlanId: id }).then(response => {
        this.$notify.success(response.msg)
        this.$router.push('/testTask/list')
      })
    }
  },
  created() {
    this.fetchTestPlanList()
  }
}
</script>
