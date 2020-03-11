<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-button @click="$router.push({ name: 'AddGlobalVarCategory' })">添加分类</el-button>
      <el-button @click="$router.push({ name: 'AddGlobalVar' })" style="margin-bottom: 10px">添加全局变量</el-button>
    </div>
    <div>
      <el-tabs type="border-card" v-model="selectedCategoryName" @tab-remove="deleteCategory" @tab-click="onTabClick">
        <el-tab-pane v-for="category in categoryList" :key="category.id" :label="category.name" :name="category.name" :closable="category.name !== '全部'">
          <el-table :data="globalVarList" highlight-current-row border>
            <el-table-column label="分类" align="center" width="200">
              <template scope="{ row }">
                <el-select v-model="row.categoryId" clearable filterable @change="categoryChange(row)" placeholder="选择分类">
                  <el-option v-for="category in categoryListWithoutTotal" :key="category.id" :label="category.name" :value="category.id" />
                </el-select>
              </template>
            </el-table-column>
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
          <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchGlobalVarList" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getCategoryList, deleteCategory } from '@/api/category'
import { getGlobalVarList, deleteGlobalVar, updateGlobalVar } from '@/api/globalvar'
import { getEnvironmentList } from '@/api/environment'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      selectedCategoryName: '全部',
      categoryList: [{
        name: '全部'
      }],
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
  computed: {
    projectId() {
      return this.$store.state.project.id
    },
    categoryListWithoutTotal() {
      return this.categoryList.filter(category => category.name !== '全部')
    }
  },
  created() {
    this.fetchCategoryList()
    this.fetchEnvironmentList()
    this.fetchGlobalVarList()
  },
  methods: {
    fetchCategoryList() {
      getCategoryList({
        projectId: this.projectId,
        type: 3 // 全局变量
      }).then(response => {
        this.categoryList = this.categoryList.concat(response.data)
      })
    },
    deleteCategory(name) {
      this.$confirm('删除' + name + '？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const category = this.categoryList.filter(category => category.name === name)[0]
        deleteCategory(category.id).then(response => {
          this.$notify.success(response.msg)
          // 移除tab，切换到全部，重新请求全部数据
          this.categoryList.splice(this.categoryList.indexOf(category), 1)
          this.selectedCategoryName = '全部'
          this.queryForm.categoryId = undefined
          this.queryForm.pageNum = 1
          this.fetchGlobalVarList()
        })
      })
    },
    categoryChange(row) {
      if (row.categoryId === '') { // 清除分类
        row.categoryId = null
      }
      updateGlobalVar(row).then(response => {
        this.fetchGlobalVarList()
      })
    },
    onTabClick(tab) {
      const activedCategory = this.categoryList.filter(category => category.name === tab.label)[0]
      this.queryForm.categoryId = activedCategory.id
      this.queryForm.pageNum = 1
      this.fetchGlobalVarList()
    },
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
