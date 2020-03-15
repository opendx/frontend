<template>
  <span>
    <el-image
      v-if="isBase64Png"
      style="width: 100px"
      :src="src"
      :preview-src-list="[src]"
    />
    <el-input
      v-if="isBase64Png"
      style="width: 100px"
      v-model.trim="currentValue"
      clearable
      @paste.native="onpaste"
    />
    <el-input
      v-if="!isBase64Png"
      type="textarea"
      v-model.trim="currentValue"
      @paste.native="onpaste"
      :autosize="{ minRows: 1, maxRows: 10 }"
    />
  </span>
</template>

<script>
export default {
  name: 'ImageInput',
  props: {
    value: [String, Number]
  },
  data() {
    return {
      base64PngSrcPrefix: 'data:image/png;base64,',
      base64PngPrefix: 'iVBORw0KGgoAAAANSUhEUgAA',
      currentValue: this.value
    }
  },
  computed: {
    isBase64Png() {
      return this.currentValue ? this.currentValue.startsWith(this.base64PngPrefix) : false
    },
    src() {
      return this.base64PngSrcPrefix + this.currentValue
    }
  },
  watch: {
    value(newValue) {
      this.currentValue = newValue
    },
    currentValue(newValue) {
      this.$emit('input', newValue)
    }
  },
  methods: {
    onpaste(e) {
      if (!(e.clipboardData && e.clipboardData.items)) {
        return
      }
      const item = e.clipboardData.items[0]
      // 判断是否为图片数据
      if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
        console.log('paste img to base64')
        const imgFile = item.getAsFile()
        const reader = new FileReader()
        reader.onload = e => {
          // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA
          this.currentValue = e.target.result.substring(22)
        }
        reader.readAsDataURL(imgFile)
      }
    }
  }
}
</script>
