<template>
  <div id="app">
    <div v-if="scale" id="big-screen">
      <!-- <div class="lighting-effects" v-if="showEffects"></div> -->
      <router-view />
    </div>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: 1920,
      height: 1080,
      scale: true,
    }
  },
  computed: {
    showEffects() {
      return this.$route.path !== '/map'
    },
  },
  mounted() {
    let route = location.hash.replace(/\/$/, '')
    this.scale = route != '#/map/amap'
    if (this.scale) {
      this.setScale()
      document.body.onresize = this.setScale
    }
  },
  beforeDestroy() {
    document.body.onresize = null
  },
  methods: {
    setScale() {
      let ww = window.innerWidth / this.width
      let wh = window.innerHeight / this.height
      let scale = ww < wh ? ww : wh
      document.getElementById('big-screen').style.transform = `scale(${scale}) translate(-50%, -50%)`
    },
  },
}
</script>

<style lang="less">
body {
  overflow: hidden;

  * {
    font-family: 'Source Han Sans SC';
  }

  #app {
    width: 100vw;
    height: 100vh;
    position: relative;
    background-color: #222933;

    #big-screen {
      position: fixed;
      left: 50%;
      top: 50%;
      width: 1920px;
      height: 1080px;
      transform-origin: 0 0;
      transition: 0.3s;
    }
    .lighting-effects {
      z-index: 1;
      position: absolute;
      width: 1920px;
      height: 1080px;
      pointer-events: none;
      background-image: linear-gradient(168deg, #ff8000b0, #ff800010 20%, #ffffff10 100%);
      background-image: url(@/assets/bg1.png);
    }
    .entity-box {
      position: relative;
      z-index: 2;
    }

    input::placeholder,
    textarea::placeholder {
      color: #fff6;
    }

    input[type='password'] {
      font-family: SimSun;
    }
  }

  a {
    text-decoration: none;
  }

  .el-popper {
    position: absolute !important;
    top: 27px !important;
    left: 0 !important;
  }

  .el-button {
    color: #fff;
    border-radius: 6px;
    border-color: #3d3d3d;
    background-color: #3d3d3d;
    box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.16);

    &:focus {
      color: #fff;
      border-color: #3d3d3d;
      background-color: #3d3d3d;
    }

    &:hover {
      color: #fff;
      border-color: #3d3d3dcc;
      background-color: #3d3d3dcc;
    }

    &.el-button--text {
      border-color: transparent;
      background-color: transparent;
      &:hover {
        border-color: transparent;
        background-color: transparent;
      }
    }

    &.el-button--primary {
      border-color: #002aff;
      background-color: #002aff;
      &:hover {
        border-color: #002affcc;
        background-color: #002affcc;
      }
    }

    &.el-button--success {
      border-color: #00a610;
      background-color: #00a610;
      &:hover {
        border-color: #00a610cc;
        background-color: #00a610cc;
      }
    }

    &.el-button--info {
      border-color: #ff4200;
      background-color: #ff4200;
      &:hover {
        border-color: #ff4200cc;
        background-color: #ff4200cc;
      }
    }

    &.el-button--warning {
      border-color: #ff7e00;
      background-color: #ff7e00;
      &:hover {
        border-color: #ff7e00cc;
        background-color: #ff7e00cc;
      }
    }

    &.el-button--danger {
      border-color: #ff0000;
      background-color: #ff0000;
      &:hover {
        border-color: #ff0000cc;
        background-color: #ff0000cc;
      }
    }
  }

  // 修改el-input，el-textarea
  .el-input__inner,
  .el-textarea__inner {
    border: 1px solid rgba(255, 255, 255, 0);
    background-color: #191919;
    border-radius: 10px;
  }

  .el-date-table th {
    text-align: center;
  }

  .el-image-viewer__close {
    top: 100px;
    right: 20px;
  }

  .el-dialog__header {
    .el-dialog__title,
    .el-dialog__close {
      color: #fff;
    }
  }

  .el-dialog__footer {
    display: flex;
    justify-content: center;
    > div {
      width: 50%;
      display: flex;
      justify-content: space-around;

      .el-button {
        box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.05);
        border-radius: 10px;
      }
    }
  }
}
</style>
