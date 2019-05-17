<template>
  <section class="app-main">
    <div :style="leftStyle">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </transition>
    </div>
    <div v-if="showDevice" style="width: 450px;height:100%;position: fixed;top: 50px;right: 0;background-color: #0a76a4">
      1234
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    leftStyle() {
      return this.$store.state.device.show ? 'width: calc(100% - 450px)' : ''
    },
    showDevice() {
      return this.$store.state.device.show
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
