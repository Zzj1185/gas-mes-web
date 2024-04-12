<template>
  <TableLite class="weather" :class="weatherIcon" :title="weatherInfo.location" iconName="location">
    <template #table-slot>
      <div class="location-info">
        <div class="weatherInfo">
          <div>{{ weatherInfo.nowtemp }} ℃</div>
          <div class="weatherMore">
            <div>{{ weatherInfo.weather }}</div>
            <div>{{ weatherInfo.nighttemp }} °C ~ {{ weatherInfo.daytemp }} °C</div>
          </div>
        </div>
        <div class="dateTime round-bar">
          <div>{{ date }}</div>
          <div>{{ time }}</div>
        </div>
      </div>
    </template>
  </TableLite>
</template>
<script>
import apiv2 from '@/api/v2'
import TableLite from '@/components/tableLiteCmpt.vue'
export default {
  data() {
    return {
      timer: 0,
      timestamp: 0,
      weatherIcon: 'heavy',
      city_code: 0,
      weatherInfo: {
        location: '',
        iconName: '',
        nowtemp: '',
        daytemp: '',
        nighttemp: '',
        weather: '',
      },
    }
  },
  created() {
    this.getLocationName()
    this.getCityCode()
  },
  mounted() {
    this.timer = setInterval(() => {
      this.timestamp = new Date().getTime()
    }, 100)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  components: { TableLite },
  computed: {
    date() {
      return this.$moment(this.timestamp).format('YYYY/MM/DD')
    },
    time() {
      return this.$moment(this.timestamp).format('HH:mm:ss')
    },
    hour() {
      return this.$moment(this.timestamp).hour()
    },
  },
  watch: {
    hour() {
      if (this.city_code) {
        this.getWeather()
      }
    },
  },
  methods: {
    getLocationName() {
      apiv2.CommonData.ConfigDataReq({ key: 'location_name' }).then((res) => {
        if (res.data.value) {
          try {
            const configData = JSON.parse(res.data.value)
            this.weatherInfo.location = configData.location_name
          } catch (error) {
            this.$message.error('系统配置location_name数据格式有误')
          }
        } else {
          this.$message.error('缺少系统配置location_name')
        }
      })
    },
    getCityCode() {
      apiv2.CommonData.ConfigDataReq({ key: 'city_code' }).then((res) => {
        if (res.data.value) {
          try {
            const configData = JSON.parse(res.data.value)
            this.city_code = configData.city_code
            this.getWeather()
          } catch (error) {
            this.$message.error('系统配置city_code数据格式有误')
          }
        } else {
          this.$message.error('缺少系统配置city_code')
        }
      })
    },
    getWeather() {
      fetch(`https://restapi.amap.com/v3/weather/weatherInfo?city=${this.city_code}&extensions=base&key=2273139206b76c753dcdc4e2b2e8ab8d`, {
        method: 'get',
      }).then(async (res) => {
        const data = await res.json()
        if (data.status == '1') {
          const live = data.lives[0]
          this.weatherInfo.weather = live.weather
          this.weatherInfo.nowtemp = live.temperature
          if (live.weather.includes('云')) {
            this.weatherIcon = 'cloud'
          } else if (live.weather.includes('雨')) {
            this.weatherIcon = 'rain'
          } else if (live.weather.includes('雪')) {
            this.weatherIcon = 'snow'
          } else if (live.weather.includes('晴')) {
            this.weatherIcon = 'sunny'
          } else {
            this.weatherIcon = 'heavy'
          }
        }
      })

      fetch(`https://restapi.amap.com/v3/weather/weatherInfo?city=${this.city_code}&extensions=all&key=2273139206b76c753dcdc4e2b2e8ab8d`, {
        method: 'get',
      }).then(async (res) => {
        const data = await res.json()
        if (data.status == '1') {
          const forecast = data.forecasts[0]
          const cast = forecast.casts[0]
          this.weatherInfo.daytemp = cast.daytemp
          this.weatherInfo.nighttemp = cast.nighttemp
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.weather {
  .location-info {
    flex: 1;
    gap: 10px;
    display: flex;
    padding: 0 7px 10px;
    flex-direction: column;

    .weatherInfo {
      flex: 1;
      width: 255px;
      min-height: 72px;
      justify-content: space-around;
      display: flex;
      align-items: center;
      font-size: 40px;
      font-weight: bold;

      .weatherMore {
        font-size: 20px;
        font-weight: normal;
      }
    }

    .weatherIcon {
      width: 56px;
      height: 56px;
    }

    .dateTime {
      width: 255px;
      height: 31px;
      display: flex;
      font-size: 17px;
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>
