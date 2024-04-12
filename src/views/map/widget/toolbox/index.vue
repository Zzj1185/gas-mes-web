<template>
  <div>
    <div class="mapWidget">
      <div class="general opacity-box">
        <div class="opacity-box">
          <div class="entity-box">
            <div class="regular-tool">
              <!-- 兴趣点搜索栏 -->
              <Search class="search" v-if="authCheck('SiteView')" :map="map" />
              <div class="control">
                <!-- 展示层控制 -->
                <Overlay ref="overlay" class="overlay" :map="map" />
                <!-- 巡检管理 -->
                <Patrol ref="patrol" v-if="authCheck('PatrolMgmt')" class="patrol" :map="map" @close-all="closeAllDrawer" @drawRange="openDraw" />
              </div>
            </div>
          </div>
        </div>
        <!-- 小工具 -->
        <Tool class="small-tool" :map="map" :defaultStyle="defaultStyle" :customStyle="customStyle" @prompt="callbackPrompt" />
      </div>
      <div class="advanced">
        <!-- 管线管理 -->
        <PipeLine ref="pipeline" v-if="authCheck('PipeLineMgmt')" @close-all="closeAllDrawer" @resetPipeLine="resetPipeLine" />
        <!-- 站点管理 -->
        <Site ref="site" v-if="authCheck('SiteMgmt')" @close-all="closeAllDrawer" @getLocation="startLocation" @resetPipeLine="resetPipeLine" @resetSiteList="resetSiteList" />
        <!-- 站点类型管理 -->
        <SiteType ref="sitetype" v-if="authCheck('SiteTypeMgmt')" @close-all="closeAllDrawer" @resetSiteList="resetSiteList" />
      </div>
    </div>
    <template v-if="showEndButton">
      <el-button icon="el-icon-close" type="danger" class="end-btn" title="结束绘制范围" @click="closeDraw"></el-button>
    </template>
  </div>
</template>

<script>
import apiv2 from '@/api/v2'
import Overlay from './overlay.vue'
import Patrol from './patrol/index.vue'
import PipeLine from './pipeLine/index.vue'
import Search from './search.vue'
import Site from './site/index.vue'
import SiteType from './siteType/index.vue'
import Tool from './tool.vue'

export default {
  data() {
    return {
      editor: null,
      showEndButton: false,
      siteMarkerList: [],
      authList: {
        SiteView: apiv2.SiteMgmt.ViewRoute,
        PatrolMgmt: apiv2.PatrolTask.ListRoute,
        PipeLineMgmt: apiv2.PipeLine.ListRoute,
        SiteMgmt: apiv2.SiteMgmt.ListRoute,
        SiteTypeMgmt: apiv2.SiteType.ListRoute,
      },
    }
  },
  mounted() {
    this.createEditor()
  },
  components: { Overlay, Patrol, Search, PipeLine, Site, SiteType, Tool },
  props: {
    map: Object,
    defaultStyle: String,
    customStyle: String,
    pipeLine: Array,
  },
  methods: {
    authCheck(type) {
      return this.$auth(this.authList[type])
    },
    // 重置管线列表
    resetPipeLine() {
      this.$emit('resetPipeLine')
    },
    // 重置站点列表
    resetSiteList() {
      this.$emit('resetSiteList')
    },
    // 关闭所有抽屉栏
    closeAllDrawer() {
      if (this.$refs.patrol) {
        this.$refs.patrol.closeDrawer()
      }
      if (this.$refs.pipeline) {
        this.$refs.pipeline.closeDrawer()
      }
      if (this.$refs.site) {
        this.$refs.site.closeDrawer()
      }
      if (this.$refs.sitetype) {
        this.$refs.sitetype.closeDrawer()
      }
    },
    // 开始设定坐标
    startLocation() {
      this.hideAll()
      this.callbackPrompt('add', '单击以选择位置坐标')
      this.map.on('mousemove', this.updatePrompt)
      this.map.on('click', this.inputLocation)
    },
    // 取消设定坐标
    cancelLocation() {
      this.showAll()
      this.callbackPrompt('remove')
      this.map.off('mousemove', this.updatePrompt)
      this.map.off('click', this.inputLocation)
    },
    // 填写坐标
    inputLocation(e) {
      this.$refs.site.dialogData.form.coordinate = e.lnglat.lng + ',' + e.lnglat.lat
      this.cancelLocation()
    },
    // 创建绘制工具
    createEditor() {
      // 创建几何编辑器
      this.editor = new AMap.PolygonEditor(this.map)
      // 添加顶点
      this.editor.on('addnode', (e) => {
        let path = e.target.getPath()
        if (this.editor.drawable && path.length > 3) {
          this.callbackPrompt('update', '单击继续，双击或右键结束')
        }
        if (this.editor.editable) {
          this.callbackRange(e.target)
        }
      })
      // 删除顶点
      this.editor.on('removenode', (e) => {
        if (this.editor.editable) {
          this.callbackRange(e.target)
        }
      })
      // 编辑顶点
      this.editor.on('adjust', (e) => {
        this.callbackRange(e.target)
      })
      // 创建几何
      this.editor.on('add', (e) => {
        this.callbackRange(e.target)
        this.callbackPrompt('update', '拖动顶点将改变范围，单击顶点将删除顶点')
      })
      // 结束绘制
      this.editor.on('end', (e) => {
        let path = e.target.getPath()
        if (path.length < 3) {
          // 重新绘制
          this.callbackPrompt('update', '单击创建顶点')
          this.$nextTick(() => {
            this.editor.open()
          })
        }
      })
    },
    // 打开绘制
    openDraw(type_id, path) {
      this.hideAll()
      this.$refs.overlay.showOverlay('type' + type_id)
      const overlays = this.$refs.overlay.overlayGroup['type' + type_id]
      this.siteMarkerList = overlays.getOverlays()
      if (path && path.length) {
        this.callbackPrompt('add', '拖动改变，单击删除')
        let polygon = new AMap.Polygon({ path })
        this.map.add(polygon)
        this.map.setFitView([polygon])
        this.editor.setTarget(polygon)
      } else {
        this.callbackPrompt('add', '单击创建顶点')
        this.editor.setTarget()
      }
      this.showEndButton = true
      this.editor.open()
    },
    // 关闭绘制
    closeDraw() {
      this.showAll()
      this.callbackPrompt('remove')
      this.showEndButton = false
      this.siteMarkerList = []
      this.editor.close()
      let target = this.editor.getTarget()
      if (target) {
        target.destroy()
      }
    },
    // 回调更新范围
    callbackRange(target) {
      if (target) {
        let ids = []
        let path = target.getPath()
        for (let i = 0; i < this.siteMarkerList.length; i++) {
          let marker = this.siteMarkerList[i]
          if (target.contains(marker.getPosition())) {
            const site = marker.getExtData()
            ids.push(site.site_id)
          }
        }
        this.$refs.patrol.updateRange(path.join(','), ids)
      } else {
        this.$refs.patrol.updateRange('', [])
      }
    },
    // 回调控制工具提示栏
    callbackPrompt(method, data) {
      this.$emit('prompt', method, data)
    },
    // 更新提示
    updatePrompt(e) {
      let lng = '<span style="color:#054bbe;font-weight:bold;">[' + e.lnglat.lng + ',</span>'
      let lat = '<span style="color:#054bbe;font-weight:bold;">' + e.lnglat.lat + ']</span>'
      let prompt = `<div style="display:flex;width:150px;justify-content:space-between;">${lng + lat}</div>`
      prompt += `<div>单击以选择位置坐标</div>`
      this.callbackPrompt('update', prompt)
    },
    // 显示所有
    showAll() {
      this.showModal()
      this.showDialog()
      this.showDrawer()
      this.showToolbox()
      this.$refs.overlay.showAllOverlay()
    },
    // 隐藏所有
    hideAll() {
      this.hideModal()
      this.hideDialog()
      this.hideDrawer()
      this.hideToolbox()
      this.$refs.overlay.hideAllOverlay()
    },
    // 显示模态框
    showModal() {
      let list = document.querySelectorAll('.v-modal')
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        ele.style.top = 0
      }
    },
    // 隐藏模态框
    hideModal() {
      let list = document.querySelectorAll('.v-modal')
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        ele.style.top = '100vh'
      }
    },
    // 显示对话框
    showDialog() {
      let list = document.querySelectorAll('.el-dialog__wrapper')
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        ele.style.top = 0
      }
    },
    // 隐藏对话框
    hideDialog() {
      let list = document.querySelectorAll('.el-dialog__wrapper')
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        ele.style.top = '100vh'
      }
    },
    // 显示边侧栏
    showDrawer() {
      let list = document.querySelectorAll('.el-drawer__wrapper')
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        ele.style.right = 0
      }
    },
    // 隐藏边侧栏
    hideDrawer() {
      let list = document.querySelectorAll('.el-drawer__wrapper')
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        ele.style.right = '100vw'
      }
    },
    // 显示边侧栏
    showToolbox() {
      let list = document.querySelectorAll('.mapWidget')
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        ele.style.display = 'block'
      }
    },
    // 隐藏边侧栏
    hideToolbox() {
      let list = document.querySelectorAll('.mapWidget')
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        ele.style.display = 'none'
      }
    },
  },
}
</script>

<style lang="less" scoped>
.opacity-box {
  width: 384px;
  border-radius: 10px;
  background-image: linear-gradient(90deg, #19191999, #29323d99);
  box-shadow: 0px 0px 38px 2px rgba(0, 0, 0, 0.53);
}
.regular-tool,
.small-tool {
  padding-left: 7px;
  padding-right: 26px;
}
.regular-tool {
  padding-bottom: 7px;
  padding-top: 23px;
  margin-bottom: 18px;
  > div:nth-child(2) {
    margin-top: 24px;
  }
  .control {
    display: flex;
    justify-content: space-between;

    .patrol {
      margin-right: -4px;
    }
  }
}
.small-tool {
  padding-bottom: 17px;
}
.advanced {
  width: 248px;
  display: flex;
  margin: 18px 68px;
  justify-content: space-between;
}
.end-btn {
  top: 88px;
  right: 20px;
  position: fixed;
}
</style>
