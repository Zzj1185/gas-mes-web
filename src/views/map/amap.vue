<template>
  <div class="container">
    <!-- <div class="lighting-effects"></div> -->
    <!-- 地图 -->
    <div id="amap"></div>
    <!-- 地图操作 -->
    <template v-if="map">
      <!-- 左上角工具箱 -->
      <Toolbox ref="toolbox" class="toolbox" :map="map" :defaultStyle="defaultStyle" :customStyle="customStyle" @prompt="callbackPrompt" @resetPipeLine="resetPipeLine" @resetSiteList="resetSiteList" />
      <!-- 右下角缩放按钮 -->
      <Zoom class="zoom" :map="map" :initData="initData" />
      <Markers ref="markers" :map="map" @open-window="openWindow" />
      <InfoWindow ref="infoWindow" @close="closeWindow" />
    </template>
  </div>
</template>

<script>
import apiv2 from '@/api/v2'
import gcoord from 'gcoord'
import AMapLoader from '@amap/amap-jsapi-loader'
import Toolbox from './widget/toolbox/index.vue'
import Zoom from './widget/zoom.vue'
import Markers from './marker.vue'
import InfoWindow from './infoWindow.vue'

const mapInitZoom = process.env.VUE_APP_ZOOM
const mapInitCenter = [process.env.VUE_APP_LONGITUDE, process.env.VUE_APP_LATITUDE]
export default {
  components: { Toolbox, Zoom, Markers, InfoWindow },
  name: 'AMap',
  data() {
    return {
      map: null,
      amapKey: '5daf74ab719b596c91babb178a29dbfe',
      amapCode: '38c6f83c3871906843484f7ec7c6ef9c',
      defaultZoom: mapInitZoom,
      maxZoom: 20,
      minZoom: 4,
      defaultCenter: mapInitCenter,
      defaultStyle: 'amap://styles/normal',
      customStyle: 'amap://styles/dark',
      initData: null,
      maskLayer: null,
      promptMarker: null,
      showInfoWindow: false,
      infoWindow: null,
      timer: 0,
      newAcqData: { time: 0, topic: '', data: null },
    }
  },
  mounted() {
    this.createMap()
    this.timer = setInterval(() => {
      const data = localStorage.getItem('vuex')
      if (data) {
        try {
          const store = JSON.parse(data)
          if (store) {
            if (store.acquisition) {
              if (store.acquisition.newData) {
                this.newAcqData = store.acquisition.newData
              }
            }
          }
        } catch (error) { }
      }
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    if (this.map) {
      this.map.destroy()
    }
  },
  watch: {
    'newAcqData.time'() {
      this.updateInfoWindowData()
    },
  },
  methods: {
    // 获取管线列表
    getPipeLine() {
      apiv2.PipeLine.ViewReq().then((res) => {
        const overlayCmpt = this.$refs.toolbox.$refs.overlay
        if (res.data && res.data.list && res.data.list.length) {
          let overlayGroup = overlayCmpt.createOverlayGroup('pipeline')
          for (let i = 0; i < res.data.list.length; i++) {
            let path = []
            let record = res.data.list[i]
            let line = record.line_nodes.split(',')
            if (line.length % 4 != 0) {
              console.error(record.line_name + '数据有误！')
              continue
            }

            for (let j = 0; j < line.length;) {
              let x1 = line[j++]
              let y1 = line[j++]
              let x2 = line[j++]
              let y2 = line[j++]
              let p1 = gcoord.transform([x1, y1], gcoord.WGS84, gcoord.AMap)
              let p2 = gcoord.transform([x2, y2], gcoord.WGS84, gcoord.AMap)
              path.push([p1, p2])
            }

            let polyline = new AMap.Polyline({
              path,
              strokeColor: record.line_color,
              strokeOpacity: 1,
              strokeWeight: record.line_width,
              strokeStyle: 'solid',
            })
            overlayGroup.addOverlay(polyline)
          }
          overlayCmpt.showPipeLine = true
        } else {
          overlayCmpt.showPipeLine = false
        }
      })
    },
    // 获取站点列表
    getSiteList() {
      apiv2.SiteMgmt.ViewReq().then((res) => {
        const overlayCmpt = this.$refs.toolbox.$refs.overlay
        if (res.data && res.data.list && res.data.list.length) {
          const markerCmpt = this.$refs.markers
          for (let i = 0; i < res.data.list.length; i++) {
            let site = res.data.list[i]
            let siteType = overlayCmpt.siteTypeList.find((o) => o.type_id == site.type_id)
            if (!siteType) {
              overlayCmpt.siteTypeList.push({
                type_id: site.type_id,
                type_name: site.type_name,
                type_icon: site.type_icon,
                icon_color: site.icon_color,
              })
            }
            markerCmpt.createSiteMarker(site)
            let overlayGroup = overlayCmpt.createOverlayGroup('type' + site.type_id)
            overlayGroup.addOverlay(site.marker)
          }
          overlayCmpt.showSiteType = true
        } else {
          overlayCmpt.showSiteType = false
        }
        this.getLinePoint()
      })
    },
    // 获取管点列表
    getLinePoint() {
      apiv2.SiteMgmt.ViewReq({ type_id: 4 }).then((res) => {
        const overlayCmpt = this.$refs.toolbox.$refs.overlay
        if (res.data && res.data.list && res.data.list.length) {
          const markerCmpt = this.$refs.markers
          for (let i = 0; i < res.data.list.length; i++) {
            let site = res.data.list[i]
            let siteType = overlayCmpt.siteTypeList.find((o) => o.type_id == site.type_id)
            if (!siteType) {
              overlayCmpt.siteTypeList.push({
                type_id: site.type_id,
                type_name: site.type_name,
                type_icon: site.type_icon,
                icon_color: site.icon_color,
              })
            }
            const point = gcoord.transform([site.longitude, site.latitude], gcoord.WGS84, gcoord.AMap)
            site.longitude = point[0]
            site.latitude = point[1]
            markerCmpt.createSiteMarker(site)
            let overlayGroup = overlayCmpt.createOverlayGroup('type' + site.type_id)
            overlayGroup.addOverlay(site.marker)
          }
        }
      })
    },
    // 重置管线列表
    resetPipeLine() {
      const overlayCmpt = this.$refs.toolbox.$refs.overlay
      let overlays = overlayCmpt.overlayGroup['pipeline']
      overlays.clearOverlays()
      this.getPipeLine()
    },
    // 重置站点列表
    resetSiteList() {
      this.closeWindow()
      const overlayCmpt = this.$refs.toolbox.$refs.overlay
      overlayCmpt.siteTypeList = []
      for (let typeId in overlayCmpt.overlayGroup) {
        if (typeId.includes('type')) {
          if (overlayCmpt.overlayGroup.hasOwnProperty(typeId)) {
            let overlays = overlayCmpt.overlayGroup[typeId]
            overlays.clearOverlays()
          }
        }
      }
      this.getSiteList()
    },
    // 创建地图
    createMap() {
      window._AMapSecurityConfig = {
        securityJsCode: this.amapCode,
      }
      AMapLoader.load({
        key: this.amapKey,
        version: '2.0',
        plugins: ['AMap.TileLayer.Satellite', 'AMap.MouseTool', 'AMap.PlaceSearch', 'AMap.MoveAnimation', 'AMap.PolygonEditor'],
      }).then(() => {
        // 创建地图
        this.map = new AMap.Map('amap', {
          zoom: this.defaultZoom,
          zooms: [this.minZoom, this.maxZoom],
          center: this.defaultCenter,
          mapStyle: this.customStyle,
        })
        this.initData = {
          minZoom: this.minZoom,
          maxZoom: this.maxZoom,
          center: this.defaultCenter,
          zoom: this.defaultZoom,
        }
        this.initMap()

        if (this.$auth(apiv2.PipeLine.ViewRoute)) {
          this.getPipeLine()
        }
        if (this.$auth(apiv2.SiteMgmt.ViewRoute)) {
          this.getSiteList()
        }
      })
    },
    // 初始化地图
    initMap() {
      if (this.map) {
        // 创建蒙层
        this.createMask()
        // 创建窗体
        this.createInfoWindow()
      } else {
        setTimeout(() => {
          this.initMap()
        }, 500)
      }
    },
    // 创建蒙层
    createMask() {
      let outer = [new AMap.LngLat(-360, 90, true), new AMap.LngLat(-360, -90, true), new AMap.LngLat(360, -90, true), new AMap.LngLat(360, 90, true)]
      this.maskLayer = new AMap.Polygon({
        bubble: true,
        path: [outer],
        strokeWeight: 1,
        fillOpacity: 0.5,
        cursor: 'crosshair',
        fillColor: '#71B3ff',
        strokeColor: '#00eeff',
      })
      this.maskLayer.hide()
      this.maskLayer.on('show', this.hideAllOverlay)
      this.maskLayer.on('hide', this.showAllOverlay)
      this.map.add(this.maskLayer)
    },
    // 打开蒙层
    openMask(prompt) {
      this.maskLayer.show()
      this.hideWidget()
      this.addPromptMarker(prompt)
    },
    // 关闭蒙层
    closeMask() {
      this.maskLayer.hide()
      this.showWidget()
      this.removePromptMarker()
    },
    // 显示控件
    showWidget() {
      let list = document.querySelectorAll('.mapWidget')
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        ele.style.display = ''
      }
    },
    // 隐藏控件
    hideWidget() {
      let list = document.querySelectorAll('.mapWidget')
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        ele.style.display = 'none'
      }
    },
    // 创建信息窗体
    createInfoWindow() {
      if (!this.infoWindow) {
        if (this.$refs.infoWindow) {
          this.infoWindow = new AMap.InfoWindow({
            // 使用自定义窗体
            isCustom: true,
            // 只有当组件渲染完毕后，通过$el才能拿到原生的dom对象
            content: this.$refs.infoWindow.$el,
          })
        } else {
          this.$nextTick(() => {
            this.createInfoWindow()
          })
        }
      }
    },
    // 打开信息窗体
    openWindow(site) {
      this.closeWindow()
      let position = [site.longitude, site.latitude]
      this.map.setCenter(position, false, 200)
      this.map.panBy(0, 200, 200)
      this.infoWindow.open(this.map, position)
      this.$refs.infoWindow.openWindow(site)
      this.showInfoWindow = true
    },
    // 关闭信息窗体
    closeWindow() {
      if (this.infoWindow.getIsOpen()) {
        this.infoWindow.close()
        this.map.panBy(0, -200, 200)
        this.showInfoWindow = false
      }
    },
    // 更新信息窗体数据 {
    updateInfoWindowData() {
      if (this.infoWindow && this.infoWindow.getIsOpen()) {
        this.$refs.infoWindow.updateData(this.newAcqData)
      }
    },
    // 回调控制工具提示栏
    callbackPrompt(method, data) {
      if (method == 'add') {
        this.addPromptMarker(data)
      }
      if (method == 'remove') {
        this.removePromptMarker()
      }
      if (method == 'update') {
        this.updatePrompt(data)
      }
    },
    // 添加工具提示栏
    addPromptMarker(prompt) {
      let marker = new AMap.Marker({
        map: this.map,
        zIndex: 999,
        content: this.setPromptContent(prompt),
        offset: { x: 22, y: 12 },
      })
      this.promptMarker = marker
      this.promptMarker.hide()
      this.map.on('mousemove', this.changePromptPosition)
    },
    // 移除工具提示栏
    removePromptMarker() {
      if (this.promptMarker) {
        this.map.off('mousemove', this.changePromptPosition)
        this.promptMarker.setMap(null)
        this.promptMarker.destroy()
        this.promptMarker = null
      }
    },
    // 设置工具提示栏内容
    setPromptContent(prompt) {
      let container = document.createElement('div')
      container.className = 'tool-prompt-marker'
      let content = document.createElement('div')
      content.title = prompt
      content.innerHTML = prompt
      container.appendChild(content)
      return container
    },
    // 改变工具提示栏内容
    changePromptContent(value) {
      let content = this.promptMarker.getContent()
      if (value) {
        content.firstElementChild.innerHTML = value
      } else {
        content.firstElementChild.innerHTML = content.firstElementChild.title
      }
    },
    // 改变工具提示栏位置
    changePromptPosition(e) {
      if (this.promptMarker) {
        this.promptMarker.setPosition(e.lnglat)
        this.promptMarker.show()
      }
    },
    // 更新工具提示框
    updatePrompt(prompt) {
      this.changePromptContent(prompt)
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  height: 100%;

  #amap {
    height: 100vh;
    cursor: default !important;

    /deep/ .amap-marker {
      cursor: pointer !important;

      .siteIcon {
        font-size: 0;
        padding: 10px;
      }

      .amap-marker-label {
        border: none;
        padding: 0;
        line-height: 1;
        font-size: 1rem;
        cursor: pointer !important;
        background-color: transparent;

        .siteInfo {
          padding: 7px 13px;
          font-size: 18px;
          line-height: 18px;
          margin-bottom: 4px;
          border-radius: 3px;

          .siteTitle {
            text-align: center;
          }

          .siteData {
            font-size: 14px;
          }
        }
      }

      .tool-prompt-marker {
        position: relative;
        padding: 3px 10px;
        white-space: nowrap;
      }

      .amap-ranging-label,
      .amap-overlay-text-container,
      .tool-prompt-marker {
        font-size: 12px;
        border-radius: 2px;
        backdrop-filter: blur(5px);
        background-color: #ffffff80;
      }
    }

    /deep/ .amap-logo {
      padding-right: 4px;
      background-color: #fff8;
    }
  }

  .toolbox {
    position: absolute;
    width: 384px;
    left: 2px;
    top: 170px;
  }

  .zoom {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
</style>
