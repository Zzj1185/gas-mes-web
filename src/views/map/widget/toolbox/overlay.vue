<template>
  <!-- 图层控件 -->
  <div class="overlay">
    <template v-if="showPipeLine">
      <div class="siteType" @click="controlOverlay($event, 'pipeline')">
        <i class="typeIcon iconfont icon-pipeline"></i>
        <div class="typeName">管线</div>
      </div>
    </template>
    <template v-if="showSiteType">
      <template v-for="(item, index) in siteTypeList">
        <div class="siteType" :key="index" :style="'background-color: ' + item.icon_color" @click="controlOverlay($event, 'type' + item.type_id)">
          <i :class="'typeIcon iconfont icon-' + item.type_icon"></i>
          <div class="typeName">{{ item.type_name }}</div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPipeLine: false,
      showSiteType: false,
      overlayGroup: {},
      siteTypeList: [],
    }
  },
  props: {
    map: Object,
  },
  methods: {
    // 创建覆盖物组
    createOverlayGroup(typeId) {
      let overlays = this.overlayGroup[typeId]
      if (!overlays) {
        overlays = new AMap.OverlayGroup()
        overlays.is_visible = true
        this.overlayGroup[typeId] = overlays
        this.map.add(overlays)
      }
      return overlays
    },
    // 添加覆盖物
    addOverlay(typeId, marker) {
      let overlays = this.createOverlayGroup(typeId)
      overlays.addOverlay(marker)
    },
    // 移除覆盖物
    removeOverlay(typeId, marker) {
      let overlays = this.overlayGroup[typeId]
      if (overlays) {
        overlays.removeOverlay(marker)
      }
    },
    // 清理覆盖物
    clearOverlay(typeId) {
      let overlays = this.overlayGroup[typeId]
      if (overlays) {
        overlays.clearOverlays()
      }
    },
    // 控制覆盖物显示
    controlOverlay(event, typeId) {
      let ele = event.target
      if (!ele.className.includes('siteType')) {
        ele = ele.parentNode
      }
      let overlays = this.overlayGroup[typeId]
      if (overlays) {
        if (overlays.is_visible) {
          overlays.hide()
          overlays.is_visible = false
          ele.classList.add('is-disabled')
        } else {
          overlays.show()
          overlays.is_visible = true
          ele.classList.remove('is-disabled')
        }
      }
    },
    // 显示特定类型覆盖物
    showOverlay(typeId) {
      let overlays = this.overlayGroup[typeId]
      if (overlays) {
        overlays.show()
      }
    },
    // 显示所有覆盖物
    showAllOverlay() {
      for (let typeId in this.overlayGroup) {
        if (this.overlayGroup.hasOwnProperty(typeId)) {
          let overlays = this.overlayGroup[typeId]
          if (overlays && overlays.is_visible) {
            overlays.show()
          }
        }
      }
    },
    // 隐藏所有覆盖物
    hideAllOverlay() {
      for (let typeId in this.overlayGroup) {
        if (this.overlayGroup.hasOwnProperty(typeId)) {
          let overlays = this.overlayGroup[typeId]
          if (overlays) {
            overlays.hide()
          }
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
.overlay {
  gap: 10px;
  width: 290px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .siteType {
    cursor: pointer;
    height: 18px;
    display: flex;
    padding: 8px 15px;
    margin-bottom: 17px;
    border-radius: 10px;
    align-items: center;
    background-color: #0c2eff;

    &.is-disabled {
      background-color: #5d5d5d !important;
    }

    .typeIcon {
      font-size: 18px;
    }

    .typeName {
      font-size: 16px;
      margin-left: 2px;
    }
  }
}
</style>
