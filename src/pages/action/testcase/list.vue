<template>
  <div class="app-container">
    <div style="margin-bottom: 10px">
      <el-button @click="$router.push({ name: 'AddTestcaseAction' })">添加测试用例</el-button>

      <el-input v-model="queryForm.name" style="width: 200px" placeholder="测试用例名" clearable />
      <el-select v-model="queryForm.state" clearable placeholder="状态" style="width: 100px">
        <el-option v-for="state in stateList" :key="state.state" :label="state.name" :value="state.state" />
      </el-select>
      <el-button type="primary" class="el-icon-search" @click="onQueryBtnClick" />
    </div>

    <el-row>
      <el-col :span="4" style="overflow: auto">
        <category-tree :type="4" @categoryClick="onCategoryClick" />
      </el-col>
      <el-col :span="20">
        <el-table :data="actionList" highlight-current-row border>
          <el-table-column label="测试用例" align="center" prop="name" show-overflow-tooltip />
          <el-table-column label="描述" align="center" prop="description" show-overflow-tooltip />
          <el-table-column label="创建时间" align="center" width="200" show-overflow-tooltip>
            <template scope="{ row }">
              {{ row.creatorNickName + ' ' + row.createTime }}
            </template>
          </el-table-column>
          <el-table-column label="更新时间" align="center" width="200" show-overflow-tooltip>
            <template scope="{ row }">
              {{ (row.updatorNickName ? row.updatorNickName : '') + ' ' + (row.updateTime ? row.updateTime : '') }}
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="100">
            <template scope="{ row }">
              <el-select v-model="row.state" @change="stateChange(row)">
                <el-option v-for="state in stateList" :key="state.state" :label="state.name" :value="state.state" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template scope="{ row }">
              <el-button type="success" @click="copyAction(row)">复制</el-button>
              <el-button type="primary" class="el-icon-edit" @click="updateAction(row.id)" />
              <el-button type="danger" class="el-icon-delete" @click="deleteAction(row)" />
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="fetchActionList" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getActionList, deleteAction, updateAction } from '@/api/action'
import Pagination from '@/components/Pagination'
import CategoryTree from '@/pages/category/components/CategoryTree'

export default {
  components: {
    Pagination,
    CategoryTree
  },
  data() {
    return {
      actionList: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        type: 3,
        projectId: this.$store.state.project.id,
        name: '',
        state: undefined,
        categoryId: undefined
      },
      stateList: [
        {
          state: 0,
          name: '禁用'
        }, {
          state: 1,
          name: '草稿'
        }, {
          state: 2,
          name: '发布'
        }
      ]
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.id
    },
    platform() {
      return this.$store.state.project.platform
    }
  },
  created() {
    this.fetchActionList()
  },
  methods: {
    onQueryBtnClick() {
      this.queryForm.pageNum = 1
      this.fetchActionList()
    },
    copyAction(action) {
      const _action = JSON.parse(JSON.stringify(action))
      delete _action.id
      delete _action.createTime
      delete _action.creatorUid
      delete _action.creatorNickName
      delete _action.updateTime
      delete _action.updatorUid
      delete _action.updatorNickName
      this.$router.push({
        name: 'AddTestcaseAction',
        params: _action
      })
    },
    async fetchActionList() {
      const { data } = await getActionList(this.queryForm)
      this.actionList = data.data
      this.total = data.total
    },
    deleteAction(action) {
      this.$confirm('删除' + action.name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAction(action.id).then(response => {
          this.$notify.success(response.msg)
          this.fetchActionList()
        })
      })
    },
    updateAction(id) {
      this.$router.push({ name: 'UpdateTestcaseAction', params: { actionId: id }})
    },
    stateChange(row) {
      updateAction(row).then(() => {
        this.fetchActionList()
      }).catch(() => {
        // 修改失败，重刷，否则当前select选择的值是错误的
        this.fetchActionList()
      })
    },
    onCategoryClick(categoryId) {
      this.queryForm.categoryId = categoryId
      this.queryForm.pageNum = 1
      this.fetchActionList()
    }
  }
}
</script>
