<template>
  <!-- 右下角控制 -->
  <div class="zoom-button mapWidget" v-if="map && initData">
    <div>
      <el-button type="primary" icon="el-icon-map-location" title="返回原点" class="to-home" :class="showToHome ? 'show' : ''" @click="toHome"></el-button>
    </div>
    <div class="scale-button">
      <el-button type="primary" icon="el-icon-zoom-in" title="地图放大" @click="zoomIn" :disabled="currentZoom == initData.maxZoom"></el-button>
      <el-button type="primary" icon="el-icon-zoom-out" title="地图缩小" @click="zoomOut" :disabled="currentZoom == initData.minZoom"></el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentCenter: [112.16636, 30.05515],
      currentZoom: 12,
    }
  },
  created() {
    if (this.map) {
      this.map.on('mapmove', () => {
        this.currentCenter = this.map.getCenter().toArray()
      })
      this.map.on('zoomchange', () => {
        this.currentZoom = this.map.getZoom(1)
      })
    }
  },
  props: {
    map: Object,
    initData: Object,
  },
  computed: {
    showToHome() {
      return this.currentCenter[0] != this.initData.center[0] || this.currentCenter[1] != this.initData.center[1] || this.currentZoom != this.initData.zoom
    },
  },
  methods: {
    // 返回原点
    toHome() {
      this.$emit('close-info')
      this.map.setCenter(this.initData.center)
      this.map.setZoom(this.initData.zoom)
    },
    // 地图放大
    zoomIn() {
      this.currentZoom += 0.5
      if (this.currentZoom > this.initData.maxZoom) {
        this.currentZoom = this.initData.maxZoom
      }
      this.map.setZoom(this.currentZoom)
    },
    // 地图缩小
    zoomOut() {
      this.currentZoom -= 0.5
      if (this.currentZoom < this.initData.minZoom) {
        this.currentZoom = this.initData.minZoom
      }
      this.map.setZoom(this.currentZoom)
    },
  },
}
</script>
<style lang="less" scoped>
.zoom-button {
  .el-button {
    width: 40px;
    padding: 12px;
    &--primary {
      border-color: #0c2eff;
      background-color: #0c2eff;
    }
  }

  .to-home {
    opacity: 0;
    transition: 0.2s linear(0 0%, 1 100%);

    &.show {
      opacity: 1;
    }
  }

  .scale-button {
    display: flex;
    flex-direction: column;
    margin-top: 10px;

    .el-button {
      border-radius: 0;
      &:first-child {
        border-bottom-color: rgba(34, 41, 51, 0.5);
        border-radius: 3px 3px 0 0;
      }
      &:last-child {
        border-radius: 0 0 3px 3px;
      }
    }
    .el-button + .el-button {
      margin-left: 0;
    }
  }
}
</style>
