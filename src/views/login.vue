<template>
  <div class="login-container">
    <!-- 背景 -->
    <div class="video-box">
      <video class="video-background" autoplay loop muted>
        <source src="@/assets/company.mp4" type="video/mp4" />
      </video>
    </div>

    <div class="dv-border-1">
      <div class="login-title">智慧管控平台登录</div>
      <el-form class="login-form" ref="form" :model="form" :rules="rules" @keyup.enter.native="handleSubmit">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" class="customInput">
            <div slot="prefix">
              <img class="input-icon1" v-if="form.username == ''" src="@/assets/login/user.png" alt="" />
              <img class="input-icon2" v-else src="@/assets/login/usered.png" alt="" />
            </div>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="密码" type="password" class="customInput">
            <div slot="prefix">
              <img class="input-icon" v-if="form.password == ''" src="@/assets/login/lock.png" alt="" />
              <img class="input-icon" v-else src="@/assets/login/locked.png" alt="" />
            </div>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" :disabled="!form.username || !form.password" :loading="loading" @click="handleSubmit">登录</el-button>
        </el-form-item>
        <el-form-item>
          <div class="info">欢迎登陆后台管理系统</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import apiv2 from '@/api/v2'
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      loading: false,
    }
  },
  mounted() {
    localStorage.clear()
  },
  methods: {
    ...mapActions(['saveUserInfo', 'resetAlarmCount']),

    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 执行登录逻辑
          this.loading = true
          let data = {
            username: this.form.username,
            password: this.form.password,
          }
          apiv2.AccountMgmt.LoginReq(data).then((res) => {
            if (res.code) {
              this.loading = false
              this.$message.error(res.message)
              this.resetAlarmCount()
            } else {
              this.saveUserInfo(res.data.user)
              this.$router.push('/')
            }
          })
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, @login-color-g1 0%, @login-color-g2 100%);
}

.login-card {
  border: none;
  box-shadow: none;
  background-color: transparent;
}

.dv-border-1 {
  box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
  opacity: 1;
  -webkit-transition-timing-function: cubic-bezier(0.68, -0.25, 0.265, 0.85);
  -webkit-transition-property: -webkit-transform, opacity, box-shadow, top, left;
  transition-property: transform, opacity, box-shadow, top, left;
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
  -webkit-transform-origin: 161px 100%;
  -ms-transform-origin: 161px 100%;
  transform-origin: 161px 100%;
  -webkit-transform: rotateX(0deg);
  transform: rotateX(0deg);
  width: 370px;
  height: 420px;
  padding: 0px 40px 0px 40px;
  box-sizing: border-box;
  background: #35394a;
  /* Old browsers */
  /* FF3.6+ */
  background: -webkit-gradient(linear, left bottom, right top, color-stop(0%, #35394a), color-stop(100%, rgb(0, 0, 0)));
  /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, rgb(0, 0, 0) 100%);
  /* Chrome10+,Safari5.1+ */
  /* Opera 11.10+ */
  /* IE10+ */
  background: linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, rgb(0, 0, 0) 100%);
  /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='rgba(53, 57, 74, 0)', endColorstr='rgb(0, 0, 0)',GradientType=1 );
  /* IE6-9 fallback on horizontal gradient */
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.login-form {
  // width: 340px;
  // padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-title {
  color: #fff;

  font-size: 23px;
  text-align: center;
  margin-bottom: 10px;
}

.login-form {
  width: 100%;
}
// 图标
.input-icon1 {
  width: 14px;
  height: 14px;
}
.input-icon2 {
  width: 13px;
  height: 17px;
}
.login-btn {
  width: 112px;
  height: 34px;
  border: none;
  display: flex;
  border-radius: 17px;
  align-items: center;
  justify-content: center;
  background-color: #002aff;
}
.login-btn:hover {
  background-color: #0055ff;
}
.login-btn.is-disabled {
  color: #fff;
  background-color: #848485;
}
.info {
  color: rgba(177, 177, 177, 1);
  letter-spacing: 0.1em;
}
.video-box {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: transparent;
  /*进行视频裁剪*/
  overflow: hidden;
}

.video-box .video-background {
  position: absolute;
  left: 50%;
  top: 50%;
  /*保证视频内容始终居中*/
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  /*保证视频充满屏幕*/
  object-fit: cover;
  min-height: 800px;
}
</style>

<style lang="less" scoped>
.customInput {
  width: 270px;
}
//使用 /deep/
.el-input /deep/ .el-input__inner {
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
}
</style>
