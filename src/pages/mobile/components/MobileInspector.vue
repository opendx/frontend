<template>
  <div>
    <el-image-viewer v-if="showImageViewer" :url-list="[windowInfo.imgUrl]" :on-close="closeImageViewer" />
    <!--gutter 列的间距-->
    <el-row :gutter="2">
      <!--左侧图片-->
      <el-col :span="6" style="max-height:650px; overflow: auto">
        <i style="background-color: #fff; position: fixed" class="el-icon-full-screen" @click="showImageViewer = true" />
        <canvas :id="canvasId" style="width: 100%" />
      </el-col>
      <!--中间布局树-->
      <el-col v-if="!isWebView" :span="10" style="max-height:650px; overflow: auto">
        <el-tree
          ref="tree"
          v-loading="treeLoading"
          :data="treeData"
          :props="defaultProps"
          highlight-current
          :expand-on-click-node="false"
          node-key="id"
          :default-expanded-keys="currentExpandedKey"
          @node-click="nodeClick"
        />
      </el-col>
      <!--右侧控件信息-->
      <el-col v-if="!isWebView" :span="8" style="max-height:650px; overflow: auto">
        <ul style="list-style: none;word-break: break-all;padding: 0px;font-size: 13px;">
          <li v-for="(value,key) in nodeDetail" :key="key" style="border-bottom: 1px solid #eee">
            <label style="width: 100px;display: inline-block;">{{ key }}</label>
            <div v-clipboard:copy="value" v-clipboard:success="onCopy" title="click to copy" style="display: inline;color: #8cc5ff;cursor: pointer;">{{ value }}</div>
          </li>
        </ul>
      </el-col>
      <!--WebView-->
      <el-col v-if="isWebView" :span="18" align="center" style="max-height:650px; overflow: auto">
        <iframe :srcdoc="windowHierarchy" width="100%" height="100%"></iframe>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import _ from 'lodash'
import { getXPath, getXPathLite, getAndroidUiautomator, getIOSNsPredicateString } from '@/utils/xpath'
import clipboard from '@/directive/clipboard/index.js'

export default {
  components: {ElImageViewer},
  directives: {
    clipboard
  },
  props: {
    canvasId: String,
    windowInfo: Object,
    windowHierarchy: String,
    treeLoading: Boolean
  },
  data() {
    return {
      showImageViewer: false,

      img: null,
      canvas: null,
      canvasCtx: null,

      defaultProps: {
        children: 'nodes',
        label: 'class'
      },
      isAndroid: false,
      isIos: false,
      isWebView: false,
      // 右侧节点详细数据
      nodeDetail: {},
      treeData: [],
      // 当前选中的node
      selectedNode: {},
      // 当前展开的key
      currentExpandedKey: [],
      // 所有的节点
      allNodes: [],
      // 树节点索引  从0开始 累加
      nodeIndex: 0
    }
  },
  watch: {
    windowInfo() {
      this.img = new Image()
      this.img.src = this.windowInfo.imgUrl

      this.img.onload = () => {
        let scale
        if (this.windowInfo.windowOrientation === 'portrait') { // 竖屏以window宽为准，window高不包含虚拟按键
          scale = this.windowInfo.windowWidth / this.img.width
        } else {
          scale = this.windowInfo.windowHeight / this.img.height
        }
        console.log('scale', scale)

        this.canvas.width = parseInt(this.img.width * scale)
        this.canvas.height = parseInt(this.img.height * scale)

        this.canvasCtx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvas.width, this.canvas.height)
      }
    },
    windowHierarchy() {
      if (!this.windowHierarchy) {
        return
      }
      console.log('windowHierarchy', this.windowHierarchy)
      let windowHierarchyJson
      try {
        windowHierarchyJson = JSON.parse(this.windowHierarchy)
      } catch (e) {
        // 先粗暴处理，转换不了json就是webview。webview返回的是xml
        this.isWebView = true
        this.isAndroid = false
        this.isIos = false
        return
      }
      if (windowHierarchyJson.hierarchy.platform === 1) {
        this.isAndroid = true
        this.isIos = false
        this.isWebView = false
      } else if (windowHierarchyJson.hierarchy.platform === 2) {
        this.isIos = true
        this.isAndroid = false
        this.isWebView = false
      }
      // 重新初始化数据，防止点击刷新按钮，数据错乱
      this.nodeDetail = {}
      this.treeData = []
      this.selectedNode = {}
      this.currentExpandedKey = []
      this.allNodes = []
      this.nodeIndex = 0
      // from macaca Inspector start https://github.com/macacajs/app-inspector/blob/master/lib/android.js
      const matchedNode = _.findLast(windowHierarchyJson.hierarchy, i => {
        return (
          i !== null &&
          typeof i === 'object' &&
          i.package !== 'com.android.systemui'
        )
      })
      const data = this.adaptor(matchedNode)
      // from macaca Inspector end
      // 树所有数据
      this.treeData.push(data)
      console.log('treeData', this.treeData)
    },
    // 监听当前选中的node发生改变
    // 点击截图或点击树节点 都将触发selectedNode变更
    selectedNode(curVal) {
      if (curVal.id === undefined) {
        return
      }
      // 1.重新绘制红色区域
      // 清除上一次的红色区域
      this.canvas.height = this.canvas.height // 重置canvas
      this.canvasCtx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvas.width, this.canvas.height)

      if (this.isWebView) {
        return
      }

      this.canvasCtx.fillStyle = 'red'
      // 透明度
      this.canvasCtx.globalAlpha = 0.5
      this.canvasCtx.fillRect.apply(this.canvasCtx, curVal.bounds)
      // 2.网页中间部分选中树
      // 展开树
      this.currentExpandedKey.splice(0, 1, curVal.id)
      // 当前选中
      this.$refs.tree.setCurrentKey(curVal.id)
      // 3.改变右侧节点详细信息
      // 使用macaca xpath计算方法
      this.selectedNode.xpath = getXPath(this.treeData[0], this.getNodePath(this.treeData[0], this.selectedNode.id))
      this.selectedNode.xpath_lite = getXPathLite(this.treeData[0], this.getNodePath(this.treeData[0], this.selectedNode.id))
      if (this.isAndroid) {
        this.selectedNode.uiautomator = getAndroidUiautomator(this.treeData[0], this.getNodePath(this.treeData[0], this.selectedNode.id))
      } else if (this.isIos) {
        this.selectedNode.iOSNsPredicateString = getIOSNsPredicateString(this.treeData[0], this.getNodePath(this.treeData[0], this.selectedNode.id))
      }
      // copy对象
      const nodeDetail = Object.assign({}, this.selectedNode)
      // 去除id nodes
      delete nodeDetail.id
      delete nodeDetail.nodes
      if (this.isIos) {
        // 为了复用一套前端代码，后台在ios dump时添加了一个class属性
        delete nodeDetail.class
      }

      this.nodeDetail = nodeDetail
    }
  },
  mounted() {
    // init canvas
    const canvas = document.getElementById(this.canvasId)
    this.canvas = canvas
    this.canvasCtx = canvas.getContext('2d')
    // 点击左侧屏幕截图
    canvas.onmousedown = e => {
      const rect = canvas.getBoundingClientRect()
      const x = parseInt((e.clientX - rect.left) / rect.width * canvas.width)
      const y = parseInt((e.clientY - rect.top) / rect.height * canvas.height)
      console.log('点击手机屏幕:' + x + ',' + y)

      // 最小面积的节点
      let leastNode = {}
      // 选出最小面积的节点
      this.allNodes.forEach(item => {
        if (x >= item.bounds[0] && y >= item.bounds[1] && x <= item.bounds[0] + item.bounds[2] && y <= item.bounds[1] + item.bounds[3]) {
          if (leastNode.id) {
            if (leastNode.bounds[2] * leastNode.bounds[3] >= item.bounds[2] * item.bounds[3]) {
              leastNode = item
            }
          } else {
            leastNode = item
          }
        }
      })
      this.selectedNode = leastNode
      console.log('最小面积的节点:', this.selectedNode)
    }
  },
  methods: {
    closeImageViewer() {
      this.showImageViewer = false
    },
    // 点击复制到粘贴板
    onCopy() {
      this.$notify.success('复制成功')
    },
    // 获取当前节点在整个tree里的位置，计算xpath的时候需要传入，如：[0,0,1,1]
    getNodePath(tree, targetId) {
      let nodePath = null
      function walk(node, path) {
        if (node.id === targetId) {
          nodePath = path
        }
        if (node.nodes) {
          node.nodes.forEach((child, index) => {
            walk(child, path.concat([index]))
          })
        }
      }
      walk(tree, [])
      return nodePath
    },
    // 树节点被点击
    nodeClick(data) {
      console.log('点击树', data)
      this.selectedNode = data
    },
    // this method from macaca Inspector https://github.com/macacajs/app-inspector/blob/master/lib/android.js
    adaptor(node) {
      if (node.bounds) {
        const bounds = node.bounds.match(/[\d\.]+/g)

        // [ x, y, width, height]
        node.bounds = [
          ~~bounds[0],
          ~~bounds[1],
          bounds[2] - bounds[0],
          bounds[3] - bounds[1]
        ]
      }
      // not in macaca start
      // 所有节点
      // 新增一个id 用于标识node
      node.id = this.nodeIndex
      this.nodeIndex++
      this.allNodes.push(node)
      // not in macaca end

      if (node.node) {
        node.nodes = node.node.length ? node.node : [node.node]
        node.nodes.forEach(this.adaptor)
        delete node.node
      }
      return node
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  /*选中tree时候的背景色*/
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #8cc5ff;
  }
  .el-tree>.el-tree-node {
    min-width: 100%;
    display: inline-block;
  }
  .el-tree-node__label {
    font-size: 12px;
  }
</style>
