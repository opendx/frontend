<template>
  <section class="app-main">
    <div :style="leftStyle">
      <!--<transition name="fade-transform" mode="out-in">-->
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
      <!--</transition>-->
    </div>
    <!--todo 先写死-->
    <div v-if="showDevice" style="width: 350px;height: calc(100% - 85px);position: fixed;top: 85px;right: 10px;overflow: auto;">
      <android-stf-controller v-if="screenType === 'stf'" />
      <android-scrcpy-controller v-else-if="screenType === 'scrcpy'" />
      <ios-controller v-else-if="screenType === 'ios'" />
    </div>
  </section>
</template>

<script>
import AndroidStfController from '@/pages/mobile/android/components/AndroidStfController'
import AndroidScrcpyController from '@/pages/mobile/android/components/AndroidScrcpyController'
import IosController from '@/pages/mobile/ios/components/IosController'

export default {
  name: 'AppMain',
  components: {
    AndroidStfController,
    AndroidScrcpyController,
    IosController
  },
  computed: {
    leftStyle() {
      // todo 先写死
      return this.$store.state.device.show ? 'width: calc(100% - 370px)' : ''
    },
    showDevice() {
      return this.$store.state.device.show
    },
    screenType() {
      const platform = this.$store.state.device.platform
      const systemVersion = this.$store.state.device.systemVersion
      if (platform === 1) {
        if (parseInt(systemVersion) >= 5) {
          // 版本5以上 scrcpy
          return 'scrcpy'
        } else {
          return 'stf'
        }
      } else if (platform === 2) { // ios
        return 'ios'
      } else {
        return 'unKnow platform'
      }
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
