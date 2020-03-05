<template>
  <div class="app-container">
    <el-button @click="$router.push({ name: 'AddGlobalVar' })" style="margin-bottom: 10px">添加全局变量</el-button>
    <!-- 列表 -->
    <div>
      <el-table :data="globalVarList" highlight-current-row border>
        <el-table-column label="变量类型" align="center" prop="type" width="180" show-overflow-tooltip />
        <el-table-column label="变量名" align="center" prop="name" width="180" show-overflow-tooltip />
        <el-table-column label="变量值" align="center">
          <template scope="{ row }">
            <el-table :data="row.environmentValues" border fit>
              <el-table-column label="环境" align="center" width="150" show-overflow-tooltip>
                <template scope="{ row }">
                  {{ environmentList.filter(env => env.id === row.environmentId)[0].name }}
                </template>
              </el-table-column>
              <el-table-column label="值" align="center" prop="value" show-overflow-tooltip/>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="description" width="150" show-overflow-tooltip />
        <el-table-column label="创建时间" align="center" width="200" show-overflow-tooltip>
          <template scope="{ row }">
            {{ row.creatorNickName + ' ' + row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
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
import { getEnvironmentList } from '@/api/environment'
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
      },
      environmentList: [
        {
          id: -1,
          name: '默认'
        }
      ]
    }
  },
  created() {
    this.fetchEnvironmentList()
    this.fetchGlobalVarList()
  },
  methods: {
    updateGlobalVar(globalVar) {
      this.$router.push({ name: 'UpdateGlobalVar', params: { globalVarId: globalVar.id }})
    },
    deleteGlobalVar(globalVar) {
      this.$confirm('删除' + globalVar.name, '提示', {
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
    },
    fetchEnvironmentList() {
      getEnvironmentList({ projectId: this.$store.state.project.id }).then(response => {
        this.environmentList = this.environmentList.concat(response.data)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
