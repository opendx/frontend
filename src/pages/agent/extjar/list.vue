<template>
  <div class="app-container">
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      title="上传AgentJar"
    >
      <el-upload
        ref="elUpload"
        action=""
        :http-request="upload"
        multiple
        :auto-upload="false"
      >
        <el-button size="small">点击选择jar</el-button>
      </el-upload>
      <el-button style="margin-top: 10px" size="small" type="primary" @click="submitJars">提交</el-button>
    </el-dialog>
    <div>
      <el-button @click="dialogVisible = true">上传AgentJar</el-button>
    </div>
    <!--查询-->
    <div style="margin-top: 10px">
      <el-input v-model="queryForm.name" placeholder="name" style="width: 150px" clearable />
      <el-button type="primary" class="el-icon-search" @click="onQueryBtnClick" />
    </div>
    <!-- 列表 -->
    <div style="margin-top: 10px">
      <el-table :data="jarList" highlight-current-row border>
        <el-table-column label="name" align="center" prop="name" show-overflow-tooltip />
        <el-table-column label="version" align="center" prop="version" show-overflow-tooltip />
        <el-table-column label="上传时间" align="center" width="200" show-overflow-tooltip>
          <template scope="{ row }">
            {{ `${row.uploadorNickName} ${row.uploadTime}` }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="60">
          <template scope="{ row }">
            <el-button type="danger" class="el-icon-delete" @click="deleteJar(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryForm.pageNum"
        :limit.sync="queryForm.pageSize"
        @pagination="fetchJarList"
      />
    </div>
  </div>
</template>

<script>
import { getJarList, deleteJar, uploadJar } from '@/api/agentExtJar'
import Pagination from '@/components/Pagination'

export default {
  name: 'AgentExtJarList',
  components: {
    Pagination
  },
  data() {
    return {
      jarList: [],
      total: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        name: ''
      },
      dialogVisible: false
    }
  },
  created() {
    this.fetchJarList()
  },
  methods: {
    onQueryBtnClick() {
      this.queryForm.pageNum = 1
      this.fetchJarList()
    },
    deleteJar(jar) {
      this.$confirm(`删除${jar.filename}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteJar(jar.id).then(resp => {
          this.$notify.success(resp.msg)
          this.fetchJarList()
        })
      })
    },
    fetchJarList() {
      getJarList(this.queryForm).then(resp => {
        this.jarList = resp.data.data
        this.total = resp.data.total
      })
    },
    submitJars() {
      this.$refs.elUpload.submit()
    },
    // 自定义上传
    upload(jar) {
      const formData = new FormData()
      formData.append('file', jar.file)

      uploadJar(formData).then(response => {
        // 清除上传成功的文件
        const uploadFiles = this.$refs.elUpload.uploadFiles
        this.$refs.elUpload.uploadFiles = uploadFiles.filter(uploadFile => uploadFile.name !== jar.file.name)

        this.$notify.success(response.msg)
        this.fetchJarList()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
