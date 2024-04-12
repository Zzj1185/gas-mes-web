<template>
  <el-drawer class="map-drawer" size="100%" :modal="false" :title="drawerData.title" :visible.sync="drawerData.drawerVisible">
    <div class="drawer-content">
      <slot name="form"></slot>
      <slot name="table"></slot>
      <slot name="page"></slot>
      <slot name="dialog"></slot>
    </div>
    <slot name="special"></slot>
  </el-drawer>
</template>

<script>
export default {
  props: {
    drawerData: Object,
  },
}
</script>

<style lang="less" scoped>
.map-drawer {
  left: auto;
  width: 736px;
  margin-top: 88px;

  /deep/ .el-drawer {
    border-radius: 10px;
    background-color: transparent;
    box-shadow: 0px 0px 38px 2px rgba(0, 0, 0, 0.35);
    background-image: linear-gradient(0deg, #191919cc 0%, #29323dcc 100%);

    .el-drawer__header {
      color: #fff;
      font-size: 21px;
      margin-bottom: 20px;

      .el-drawer__close-btn {
        i {
          font-size: 24px;

          &:hover {
            color: #00adff;
          }
        }
      }
    }

    .el-drawer__body {
      padding: 0 20px 20px;
    }
  }
  .drawer-content {
    gap: 20px;
    height: 100%;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
