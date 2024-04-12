<template>
  <layout-cmpt :tableFlag="false">
    <template #title>
      <title-cmpt title="数据总览"></title-cmpt>
    </template>
    <template #special>
      <div class="overview">
        <div class="overview-type">
          <template v-for="(type, index) in overview_type">
            <el-button type="text" size="small" :class="select_type == type.value ? 'active' : ''" :key="index" @click="changeType(type.value)">{{ type.label }}</el-button>
          </template>
        </div>
        <div class="overview-list">
          <template v-for="(site, index) in data_list">
            <div class="box" :key="index">
              <div class="item top">
                <div>{{ site.site_name }}</div>
              </div>
              <template v-for="(tag, idx) in site.tag_list">
                <div class="item" :key="idx">
                  <template v-if="customOrder.includes(tag.tag_name)">
                    <template v-if="tag.tag_name == '时间'">
                      <div>
                        <span>上传时间：</span><span>{{ formatDateTime(tag.acq_value) }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <div>
                        <span v-if="tag.tag_name == '温度'">当前温度：</span>
                        <span v-else-if="tag.tag_name == '压力'">当前压力：</span>
                        <span v-else-if="tag.tag_name == '甲烷'">甲烷浓度：</span>
                        <span v-else-if="tag.tag_name == '电量'">电池电量：</span>
                        <span v-else-if="tag.tag_name == '信号'">网络信号：</span>
                        <span v-else>{{ tag.tag_name + '：' }}</span>
                        <span>{{ tag.acq_unit ? tag.acq_value + ' ' + tag.acq_unit : tag.acq_value }}</span>
                      </div>
                      <div>
                        <span>状态：</span>
                        <template v-if="tag.alarm_level">
                          <router-link to="/alarm/handle">
                            <b class="alarm">{{ alarmLevel[tag.alarm_level] }}</b>
                          </router-link>
                        </template>
                        <template v-else>
                          <span v-if="tag.acq_value == '-'"><b>-</b></span>
                          <span v-else><b class="normal">正常</b></span>
                        </template>
                      </div>
                    </template>
                  </template>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </template>
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
export default {
  data() {
    return {
      alarmLevel: {
        critical: '1级',
        warning: '2级',
        important: '3级',
        notice: '4级',
      },
      customOrder: ['时间', '压力', '温度', '甲烷', '电量', '信号'],
      overview_type: [],
      overview_list: {},
      data_list: [],
      select_type: '',
    }
  },
  mounted() {
    this.getOverviewType()
  },
  computed: {
    alarmData() {
      return this.$store.state.alarm.alarmData
    },
    alarmCount() {
      return this.$store.state.alarm.alarmCount
    },
    newAlarmData() {
      return this.$store.state.alarm.newData
    },
    acqData() {
      return this.$store.state.acquisition.acqData
    },
    newAcqData() {
      return this.$store.state.acquisition.newData
    },
  },
  watch: {
    alarmCount() {
      this.updateAlarmData()
    },
    'newAcqData.time'() {
      this.updateAcqData()
    },
  },
  methods: {
    getOverviewType() {
      apiv2.CommonData.ConfigDataReq({ key: 'overview_type' }).then((res) => {
        if (res.data.value) {
          try {
            this.overview_type = JSON.parse(res.data.value)
            this.getOverviewData()
          } catch (error) {
            this.$message.error('系统配置overview_type数据格式有误')
          }
        } else {
          this.$message.error('缺少系统配置overview_type')
        }
      })
    },
    getOverviewData() {
      for (let i = 0; i < this.overview_type.length; i++) {
        const typeObj = this.overview_type[i]
        apiv2.DataStats.OverviewReq({ site_type: typeObj.value }).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            let data = res.data.list
            for (let j = 0; j < data.length; j++) {
              const site = data[j]
              if (site.tag_list && site.tag_list.length) {
                site.tag_list = site.tag_list.map((o) => ((o.acq_value = '-'), o))
                const topic = site.tag_list[0].topic
                site.tag_list.push({ tag_name: '时间', tag_code: 'timestamp', acq_value: 0, topic })
                site.tag_list.sort((a, b) => {
                  let indexA = this.customOrder.indexOf(a.tag_name)
                  let indexB = this.customOrder.indexOf(b.tag_name)
                  return indexA - indexB
                })
                site.tag_list.forEach((tag) => {
                  const obj = this.acqData[tag.topic]
                  if (obj && obj[tag.tag_code] != undefined) {
                    tag.acq_value = obj[tag.tag_code]
                  }
                  tag.alarm_level = ''
                  for (const topic in this.alarmData) {
                    if (Object.hasOwnProperty.call(this.alarmData, topic)) {
                      const data = this.alarmData[topic]
                      if (data.site_name == site.site_name && data.tag_name == tag.tag_name) {
                        tag.alarm_level = data.alarm_level
                      }
                    }
                  }
                })
              } else {
                site.tag_list = []
              }
            }
            this.overview_list[typeObj.value] = data
            if (i == 0) {
              this.changeType(typeObj.value)
            }
          }
        })
      }
    },
    changeType(type) {
      this.select_type = type
      this.data_list = this.overview_list[type]
    },
    formatDateTime(timestamp) {
      return timestamp ? this.$moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    updateAcqData() {
      this.overview_type.forEach((typeObj) => {
        const list = this.overview_list[typeObj.value]
        list.forEach((site) => {
          site.tag_list.forEach((tag) => {
            if (this.newAcqData.topic == tag.topic) {
              const obj = this.newAcqData.data
              if (obj && obj[tag.tag_code] != undefined) {
                tag.acq_value = obj[tag.tag_code]
              }
            }
          })
        })
      })
    },
    updateAlarmData() {
      this.overview_type.forEach((typeObj) => {
        const list = this.overview_list[typeObj.value]
        if (list) {
          list.forEach((site) => {
            site.tag_list.forEach((tag) => {
              tag.alarm_level = ''
              if (this.newAlarmData) {
                const data = this.newAlarmData
                if (data.site_name == site.site_name && data.tag_name == tag.tag_name) {
                  tag.alarm_level = data.alarm_level
                }
              }
            })
          })
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.overview {
  flex: 1;
  gap: 19px;
  display: flex;
  overflow: auto;
  flex-direction: column;

  .overview-type {
    height: 43px;
    line-height: 43px;

    /deep/ .el-button {
      color: #fff;
      font-size: 13px;
      padding: 10px 30px;
      background-color: #414141;
      box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.16);
      border-radius: 10px;

      &:hover {
        color: #fff;
        background-color: #0055ff;
      }

      &.active {
        background-color: #002aff;
      }
    }
  }

  .overview-list {
    flex: 1;
    gap: 20px;
    display: flex;
    overflow: auto;
    flex-wrap: wrap;
    overflow-y: auto;
    align-content: flex-start;

    /*定义滚动条*/
    &::-webkit-scrollbar {
      width: 2px;
      height: 2px;
    }
    /*定义滚动条轨道*/
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      background-color: #696968;
    }

    .box {
      width: 250px;
      height: 250px;
      overflow: hidden;
      border-radius: 12px;
      box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.19);

      .item {
        display: flex;
        font-size: 14px;
        padding: 0 10px;
        line-height: 40px;
        justify-content: space-between;

        &:nth-child(even) {
          background-color: rgba(255, 255, 255, 0.02);
        }

        &:nth-child(odd) {
          background-color: rgba(0, 0, 0, 0.05);
        }

        /deep/ b {
          width: 28px;
          font-weight: normal;
          display: inline-block;

          &.normal {
            color: green;
          }

          &.alarm {
            color: red;
          }
        }
      }

      .top {
        font-size: 18px;
        line-height: 50px;
        justify-content: center;
        background-size: 1px 100%;
        background-repeat: repeat-x;
        background-image: url('@/assets/table/headBg.png');
      }
    }
  }
}
</style>
