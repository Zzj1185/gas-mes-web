<template>
  <div v-if="allow" class="layout" :class="processFlag && 'blueBg'">
    <Header class="header"></Header>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script>
import apiv2 from '@/api/v2'
import Header from '@/components/headerCmpt.vue'
import MqttClient from '@/utils/mqtt'
import { mapActions } from 'vuex'

export default {
  name: 'Layout',
  components: {
    Header,
  },
  data() {
    return {
      allow: false,
      username: '',
      processFlag: false,
      topic: '',
      mqtt: null,
    }
  },
  created() {
    this.processFlag = this.$route.path == '/monitor/process'
    this.$router.afterEach((to) => {
      this.processFlag = to.path == '/monitor/process'
    })
  },
  mounted() {
    const userInfo = this.$store.getters.getUserInfo
    if (userInfo) {
      apiv2.AccountMgmt.CheckReq().then((res) => {
        this.allow = res.code == 0
        if (this.allow) {
          this.initMqtt()
        } else {
          this.removeUserInfo()
        }
      })
    } else {
      this.removeUserInfo()
    }
  },
  beforeDestroy() {
    if (this.mqtt) {
      this.mqtt.destroyConnection()
    }
  },
  methods: {
    ...mapActions(['saveAcqData', 'saveStockData', 'saveAlarmData', 'removeUserInfo', 'resetAlarmCount']),
    initMqtt() {
      const topic = process.env.VUE_APP_TOPIC
      this.topic = topic.replace('#', '')
      this.mqtt = new MqttClient(topic)
      this.mqtt.createConnection(this.onMqttMsg)
      this.mqtt.doSubscribe()
    },
    onMqttMsg(topic, msg) {
      topic = topic.replace(this.topic, '')
      let data = JSON.parse(String(msg) || 'null')
      if (topic.includes('system/account/login')) {
        if (data.user_id) {
          const userInfo = this.$store.getters.getUserInfo
          if (userInfo.user_id == data.user_id) {
            this.$message.warning('当前账号已在其他地方登录')
            this.resetAlarmCount()
            this.removeUserInfo()
          }
        }
      }
      if (topic.includes('system/notify/stock/')) {
        this.saveStockData(data)
      }
      if (topic.includes('system/alarm/')) {
        this.saveAlarmData({ topic, data })
      }
      if (topic.includes('device/')) {
        this.saveAcqData({ topic, data })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background: url('@/assets/screenBg.png') no-repeat;

  &.blueBg {
    background: linear-gradient(180deg, #000615, #004eff);
  }

  .header {
    width: 100%;
    z-index: 10;
  }

  .main {
    display: flex;
    overflow: hidden;
    box-sizing: border-box;
  }
}
</style>

<style>
.el-date-table th {
  text-align: center;
}
</style>
