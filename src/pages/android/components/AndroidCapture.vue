<!--<template>-->
  <!--<div>-->
    <!--<el-row style="margin-bottom: 3px">-->
      <!--<el-card>-->
        <!--<svg-icon icon-class="android" style="vertical-align: middle;margin-right: 10px"></svg-icon>-->
        <!--<el-button size="mini" type="primary" v-clipboard:copy="addPageForm.imgUrl" v-clipboard:success="copyImgURL">复制图片地址</el-button>-->
        <!--<el-button size="mini" type="primary" v-clipboard:copy="addPageForm.windowHierarchyJson" v-clipboard:success="copyTreeData">复制布局树</el-button>-->
        <!--<el-button size="mini" type="success" icon="el-icon-refresh" @click="refresh()"></el-button>-->
      <!--</el-card>-->
    <!--</el-row>-->

    <!--&lt;!&ndash; inspector &ndash;&gt;-->
    <!--<div style="margin-bottom: 3px">-->
      <!--<androidInspector :imgInfo="screenShotResp" :windowHierarchyJSON="windowHierarchyJSONObject" :treeLoading="treeLoading" canvasId="canvas_dump"></androidInspector>-->
    <!--</div>-->

    <!--<el-row>-->
      <!--&lt;!&ndash; 添加到page &ndash;&gt;-->
      <!--<el-card>-->
        <!--<el-form :data="addPageForm" label-width="80px" :inline="true" style="margin-top: 10px">-->
          <!--<el-form-item label="page名" :rules="[{required: true}]">-->
            <!--<el-input v-model.trim="addPageForm.name" clearable style="width: 200px"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="分类">-->
            <!--<el-select v-model="addPageForm.categoryId" @visible-change="getCategoryList" clearable filterable>-->
              <!--<el-option v-for="category in pageCategories" :value="category.id" :label="category.name"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item>-->
            <!--<el-button @click="showAddPageCategoryDialog">+</el-button>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="描述">-->
            <!--<el-input v-model.trim="addPageForm.description" style="width: 300px" clearable></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item>-->
            <!--<el-button  @click="addPage" :loading="addPageBtnLoading" type="primary">保存</el-button>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
      <!--</el-card>-->
    <!--</el-row>-->
    <!--&lt;!&ndash; 添加page分类dialog &ndash;&gt;-->
    <!--<el-dialog title="添加page分类" :visible.sync="addPageCategoryDialogVisible" center width="500px">-->
      <!--<el-form :data="savePageCategoryForm" label-width="80px">-->
        <!--<el-form-item label="分类名" class="content-center" :rules="[{required: true}]">-->
          <!--<el-input v-model.trim="savePageCategoryForm.name" clearable style="width: 300px" ></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="addPageCategoryDialogVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="savePageCategory">保 存</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
<!--import { dump, screenshot } from '@/api/agent'-->
<!--import androidInspector from '../common/AndroidInspector'-->
<!--import { addPage } from '@/api/page'-->
<!--import {getCategoryList, addCategory} from '@/api/category'-->

<!--let categoryType =  1-->

<!--export default {-->

  <!--components:{-->
    <!--androidInspector: androidInspector-->
  <!--},-->
  <!--computed: {-->
    <!--projectId() {-->
      <!--return this.$store.state.project.id-->
    <!--},-->
    <!--agentIp() {-->
      <!--return this.$store.state.device.agentIp-->
    <!--},-->
    <!--agentPort() {-->
      <!--return this.$store.state.device.agentPort-->
    <!--},-->
    <!--deviceId() {-->
      <!--return this.$store.state.device.id-->
    <!--}-->
  <!--},-->
  <!--data() {-->
    <!--return {-->
      <!--// 添加page提交的数据-->
      <!--addPageForm: {-->
        <!--deviceId: this.deviceId,-->
        <!--projectId: this.projectId-->
      <!--},-->

      <!--//新增page按钮loading-->
      <!--addPageBtnLoading:false,-->
      <!--//添加page所属分类的dialog-->
      <!--addPageCategoryDialogVisible:false,-->
      <!--savePageCategoryForm:{-->
        <!--projectId: this.projectId,-->
        <!--type: categoryType-->
      <!--},-->

      <!--request:null,-->
      <!--//page的分类-->
      <!--pageCategories:[],-->

      <!--//传递给AndroidInspctor组件的数据-->
      <!--screenShotResp:{},-->
      <!--windowHierarchyJSONObject:{},-->
      <!--treeLoading: false-->
    <!--}-->
  <!--},-->
  <!--methods:{-->
    <!--//保存page分类-->
    <!--savePageCategory(){-->
      <!--addCategory(this.savePageCategoryForm).then(resp=>{-->
        <!--this.$notify.success(resp.msg)-->
        <!--this.addPageCategoryDialogVisible = false-->
      <!--})-->
    <!--},-->
    <!--//点击显示添加分类弹窗-->
    <!--showAddPageCategoryDialog(){-->
      <!--this.addPageCategoryDialogVisible = true-->
    <!--},-->
    <!--//新增page-->
    <!--addPage(){-->
      <!--this.addPageBtnLoading = true-->
      <!--addPage(this.addPageForm).then(resp=>{-->
        <!--this.$notify.success(resp.msg)-->
        <!--this.addPageBtnLoading = false-->
      <!--}).catch(()=>{-->
        <!--this.addPageBtnLoading = false-->
      <!--})-->
    <!--},-->
    <!--getCategoryList(type){-->
      <!--if(type === true){-->
        <!--//pageCategoryType == 1-->
        <!--getCategoryList({-->
          <!--projectId: this.projectId,-->
          <!--type: categoryType-->
        <!--}).then(resp=>{-->
          <!--this.pageCategories = resp.data-->
        <!--})-->
      <!--}-->
    <!--},-->
    <!--fetchScreenShot() {-->
      <!--screenshot(this.agentIp, this.agentPort).then(response => {-->
        <!--this.screenShotResp = response.data-->
        <!--// 图片的宽高-->
        <!--this.addPageForm.imgHeight = this.screenShotResp.imgHeight-->
        <!--this.addPageForm.imgWidth = this.screenShotResp.imgWidth-->
        <!--// 图片地址-->
        <!--this.addPageForm.imgUrl = this.screenShotResp.downloadURL-->
      <!--})-->
    <!--},-->
    <!--fetchWindowHierarchyJSON() {-->
      <!--this.treeLoading = true-->
      <!--dump(this.agentIp, this.agentPort).then(response => {-->
        <!--this.windowHierarchyJSONObject = JSON.parse(response.data)-->
        <!--this.addPageForm.windowHierarchyJson = JSON.stringify(this.windowHierarchyJSONObject)-->
      <!--}).finally(() => {-->
        <!--this.treeLoading = false-->
      <!--})-->
    <!--},-->
    <!--//复制图片地址-->
    <!--copyImgURL(e){-->
      <!--if(e.text){-->
        <!--this.$notify.success('图片地址复制成功')-->
      <!--}-->
    <!--},-->
    <!--//复制布局树-->
    <!--copyTreeData(e){-->
      <!--if(e.text){-->
        <!--this.$notify.success('布局树复制成功')-->
      <!--}-->
    <!--},-->
    <!--fetchData() {-->
      <!--this.fetchScreenShot()-->
      <!--this.fetchWindowHierarchyJSON()-->
    <!--},-->
    <!--refresh() {-->
      <!--this.fetchData()-->
    <!--}-->
  <!--},-->
  <!--created() {-->
    <!--this.fetchData()-->
  <!--}-->
<!--}-->
<!--</script>-->

<!--&lt;!&ndash; Add "scoped" attribute to limit CSS to this component only &ndash;&gt;-->
<!--<style>-->
<!--</style>-->
