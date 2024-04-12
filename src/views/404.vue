<template>
  <div class="container">
    <div class="http-404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/error/404.png" alt="404" />
        <img class="pic-404__child left" src="@/assets/error/404_cloud.png" alt="404" />
        <img class="pic-404__child mid" src="@/assets/error/404_cloud.png" alt="404" />
        <img class="pic-404__child right" src="@/assets/error/404_cloud.png" alt="404" />
      </div>
      <div class="text-404">
        <div class="text-404__oops">{{ oops }}</div>
        <div class="text-404__headline">
          <p id="text1">{{ headline }}</p>
        </div>
        <div class="text-404__info">
          <p id="text2">{{ info }}</p>
        </div>
        <div class="text-404__return-home">
          <el-button type="primary" @click="returnHome" round> 返回首页 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  computed: {
    oops() {
      return '404错误'
    },
    headline() {
      return '找不到网页'
    },
    info() {
      let str1 = ['对不起', '您正在寻找的页面不存在'].join('\uff0c')
      let str2 = ['尝试检查URL的错误', '然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容'].join('\uff0c')
      return [str1, str2].join('\u3002')
    },
  },
  methods: {
    returnHome() {
      localStorage.setItem('current-menu', 'dashboard')
      this.$router.push('/')
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
  background-color: black;

  #text1 {
    color: pink;
    font-family: system-ui;
  }

  #text2 {
    color: wheat;
    font-family: system-ui;
  }

  .http-404 {
    position: relative;
    width: 1200px;
    padding: 0 50px;
    overflow: hidden;

    .pic-404 {
      position: relative;
      float: left;
      width: 600px;
      overflow: hidden;

      &__parent {
        width: 100%;
      }

      &__child {
        position: absolute;

        &.left {
          width: 80px;
          top: 17px;
          left: 220px;
          opacity: 0;
          animation-name: cloudLeft;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }

        &.mid {
          width: 46px;
          top: 10px;
          left: 420px;
          opacity: 0;
          animation-name: cloudMid;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1.2s;
        }

        &.right {
          width: 62px;
          top: 100px;
          left: 500px;
          opacity: 0;
          animation-name: cloudRight;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }

        @keyframes cloudLeft {
          0% {
            top: 17px;
            left: 220px;
            opacity: 0;
          }

          20% {
            top: 33px;
            left: 188px;
            opacity: 1;
          }

          80% {
            top: 81px;
            left: 92px;
            opacity: 1;
          }

          100% {
            top: 97px;
            left: 60px;
            opacity: 0;
          }
        }

        @keyframes cloudMid {
          0% {
            top: 10px;
            left: 420px;
            opacity: 0;
          }

          20% {
            top: 40px;
            left: 360px;
            opacity: 1;
          }

          70% {
            top: 130px;
            left: 180px;
            opacity: 1;
          }

          100% {
            top: 160px;
            left: 120px;
            opacity: 0;
          }
        }

        @keyframes cloudRight {
          0% {
            top: 100px;
            left: 500px;
            opacity: 0;
          }

          20% {
            top: 120px;
            left: 460px;
            opacity: 1;
          }

          80% {
            top: 180px;
            left: 340px;
            opacity: 1;
          }

          100% {
            top: 200px;
            left: 300px;
            opacity: 0;
          }
        }
      }
    }

    .text-404 {
      position: relative;
      float: left;
      width: 300px;
      padding: 30px 0;
      overflow: hidden;

      &__oops {
        font-size: 32px;
        font-weight: bold;
        line-height: 40px;
        margin-bottom: 20px;
      }

      &__headline {
        font-size: 20px;
        line-height: 24px;
        font-weight: bold;
        margin-bottom: 10px;
        animation-delay: 0.1s;
      }

      &__info {
        font-size: 13px;
        line-height: 21px;
        margin-bottom: 30px;
        animation-delay: 0.2s;
      }

      &__return-home {
        animation-delay: 0.3s;
      }
    }

    [class^='text-404__'] {
      opacity: 0;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }

    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }

      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}
</style>
