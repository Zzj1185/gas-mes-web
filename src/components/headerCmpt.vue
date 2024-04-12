<template>
  <el-header height="86px">
    <div class="bg-img"></div>
    <div class="head">
      <div class="logo-title">
        <!-- <div class="logo"><img src="@/assets/logo.png" /></div> -->
        <div class="title">{{ projectName }}</div>
      </div>
      <NavMenu class="menu"></NavMenu>
      <div class="system">
        <el-badge :value="alarmCount" :hidden="alarmCount == 0">
          <template v-if="alarmCount">
            <i class="btn alarm el-icon-bell" :title="`您有${alarmCount}条报警未处理,请前往处理`" @click="handleAlarm"></i>
          </template>
          <template v-else>
            <i class="btn el-icon-bell" @click="handleAlarm"></i>
          </template>
        </el-badge>
        <i class="btn logout el-icon-switch-button" @click="handleLogout" title="退出登录"></i>
      </div>
    </div>
  </el-header>
</template>

<script>
import apiv2 from '@/api/v2'
import NavMenu from './menuCmpt.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    NavMenu,
  },
  data() {
    return {
      clock: '',
      time: '',
      weeks: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],

      cityCode: null,
      weatherInfo: {
        loc: '',
        img: '',
        temp: '',
        weather: '',
      },
      projectName: null,
    }
  },
  computed: {
    alarmCount() {
      return this.$store.state.alarm.alarmCount
    },
  },
  mounted() {
    this.getProjectName()
    this.updateTime()

    setInterval(() => {
      this.updateTime()
    }, 1000)
  },

  methods: {
    ...mapActions(['removeUserInfo']),
    updateTime() {
      let date = this.$moment().format('YYYY/MM/DD')
      let week = this.weeks[this.$moment().format('d')]
      let time = this.$moment().format('HH:mm:ss')
      this.clock = `${date} ${week}`
      this.time = time
    },
    handleLogout() {
      this.$confirm('确认退出系统')
        .then(() => {
          this.removeUserInfo()
        })
        .catch(() => {})
    },
    handleAlarm() {
      this.$router.push('/alarm/handle')
    },

    // 获取project_name
    getProjectName() {
      apiv2.CommonData.ConfigDataReq({ key: 'project_name' }).then((res) => {
        if (res.data.value) {
          this.projectName = res.data.value
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.bg-img {
  top: 0;
  left: 0;
  width: 613px;
  height: 195px;
  position: absolute;
  pointer-events: none;
  background: url('@/assets/header/headerBg.png') no-repeat;
}

.head {
  width: 100%;
  height: 100%;
  display: flex;

  .logo-title {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .logo {
      height: 50px;

      img {
        width: 143px;
        height: 97px;
        transform: translateY(-16px);
      }
    }

    .title {
      width: max-content;
      font-size: 25px;
      font-family: Source Han Sans SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 30px;
      text-shadow: 3px 5px 3px rgba(0, 0, 0, 0.07);
    }
  }

  .menu {
    width: 100%;
    display: flex;
    padding: 0 20px;
    position: relative;
  }

  .system {
    gap: 40px;
    font-size: 0;
    display: flex;
    margin-left: 20px;
    align-items: center;

    .btn {
      color: #fff;
      font-size: 26px;
      cursor: pointer;

      &.logout {
        transform: rotate(90deg);
      }

      &:hover {
        color: #67c4ff;
      }
    }

    /deep/ sup {
      color: #fff;
    }

    .alarm {
      color: #f00;
      animation: float 8s linear infinite;
    }

    @keyframes float {
      0% {
        transform: scale(80%);
      }

      50% {
        transform: scale(120%);
      }

      100% {
        transform: scale(80%);
      }
    }
  }
}
</style>
