<template>
  <div class="app-container">
    <el-button @click="$router.push('/globalVar/add')" style="margin-bottom: 10px">添加全局变量</el-button>
    <!-- 列表 -->
    <div>
      <el-table :data="globalVarList" highlight-current-row border>
        <el-table-column label="变量类型" align="center" prop="type" />
        <el-table-column label="变量名" align="center" prop="name" />
        <el-table-column label="变量值" align="center" prop="value" />
        <el-table-column label="描述" align="center" prop="description" />
        <el-table-column label="创建时间" align="center">
          <template scope="{ row }">
            {{ row.creatorNickName + ' ' + row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template scope="{ row }">
            <el-button type="primary" class="el-icon-edit" @click="updateGlobalVar(row)" />
            <el-button type="danger" class="el-icon-delete" @click="deleteGlobalVar(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchGlobalVarList" />
    </div>
  </div>
</template>

<script>
import { getGlobalVarList, deleteGlobalVar } from '@/api/globalvar'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      globalVarList: [],
      total: 0,
      queryForm: {
        projectId: this.$store.state.project.id,
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.fetchGlobalVarList()
  },
  methods: {
    updateGlobalVar(globalVar) {
      this.$router.push({
        name: 'UpdateGlobalVar',
        params: globalVar
      })
    },
    deleteGlobalVar(globalVar) {
      this.$confirm('删除该变量？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGlobalVar(globalVar.id).then(resp => {
          this.$notify.success(resp.msg)
          this.fetchGlobalVarList()
        })
      })
    },
    fetchGlobalVarList() {
      getGlobalVarList(this.queryForm).then(resp => {
        this.globalVarList = resp.data.data
        this.total = resp.data.total
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
