<template>
  <VChart id="myChart" :option="option" />
</template>

<script>
import apiv2 from '@/api/v2'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { LegendComponent, TooltipComponent, GridComponent, GraphicComponent } from 'echarts/components'
import { LinearGradient } from 'zrender'
import VChart from 'vue-echarts'

use([CanvasRenderer, BarChart, LegendComponent, TooltipComponent, GridComponent, GraphicComponent])

export default {
  name: 'bar',
  components: { VChart },
  data() {
    const digitAbbr = function (number) {
      if (number < 0.01) {
        return '0'
      }
      if (number >= 1e15) {
        return '∞'
      }

      if (number < 1e5) {
        // 保留两位小数
        return parseFloat(number.toFixed(2))
      }

      // 定义金额缩写的单位
      const abbreviations = ['', 'K', 'M', 'B', 'T']

      // 计算单位索引
      const index = Math.floor(Math.log10(number) / 3)

      // 计算缩写金额并保留两位小数
      const formattedAmount = parseFloat((number / Math.pow(1000, index)).toFixed(2))

      return `${formattedAmount}${abbreviations[index]}`
    }
    return {
      compareData: [],
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (item) => {
            let date = item[1].axisValue
            let name1 = item[1].seriesName
            let data1 = item[1].data ? digitAbbr(item[1].data) + ' m³' : '-'
            let name2 = item[3].seriesName
            let data2 = item[3].data ? digitAbbr(item[3].data) + ' m³' : '-'
            return `${date}<br />${name1}: ${data1}<br />${name2}: ${data2}`
          },
        },
        grid: { top: 45, right: 20, left: 50, bottom: 25 },
        legend: {
          top: '5%',
          right: '5%',
          itemWidth: 7,
          itemHeight: 13,
          selectedMode: false,
          textStyle: { fontSize: 13, color: '#fff' },
          data: [
            { name: '兴成燃气分输门站', icon: 'image:///img/legend1.png' },
            { name: '青吉燃气LNG储备站', icon: 'image:///img/legend2.png' },
          ],
        },
        xAxis: [
          {
            data: [],
            axisTick: { show: false },
            axisLine: { lineStyle: { color: '#FFFFFF', width: 2 } },
            axisLabel: { color: '#fff', fontSize: 13, interval: 0 },
          },
        ],
        yAxis: [
          {
            splitLine: { lineStyle: { type: 'dotted', color: 'rgba(255,255,255,0.5)' } },
            axisLabel: {
              textStyle: { color: '#fff', fontSize: 13 },
              formatter: (value) => digitAbbr(value),
            },
          },
        ],
        series: [
          {
            data: [],
            name: '兴成bg',
            type: 'line',
            symbol: 'image:///img/barBg1.png',
            symbolSize: [16, 150],
            symbolOffset: [-10, 75],
            cursor: 'auto',
            hoverAnimation: false,
            itemStyle: {
              color: 'rgba(0,0,0,0)',
              borderWidth: 2,
              borderColor: 'red',
              padding: 0,
            },
          },
          {
            z: 10,
            data: [],
            name: '兴成燃气分输门站',
            type: 'bar',
            barWidth: 16,
            cursor: 'auto',
            itemStyle: {
              normal: {
                color: new LinearGradient(0, 0, 0, 1, [
                  { offset: 1, color: 'rgba(0, 254, 75, 1)' },
                  { offset: 0, color: 'rgba(0, 129, 227, 1)' },
                ]),
              },
            },
          },
          {
            data: [],
            name: '青吉bg',
            type: 'line',
            symbol: 'image:///img/barBg2.png',
            symbolSize: [16, 150],
            symbolOffset: [10, 75],
            cursor: 'auto',
            hoverAnimation: false,
            itemStyle: {
              color: 'rgba(0,0,0,0)',
              borderWidth: 2,
              borderColor: '#10bffc',
              padding: 0,
            },
          },
          {
            z: 10,
            data: [],
            name: '青吉燃气LNG储备站',
            type: 'bar',
            barWidth: 16,
            cursor: 'auto',
            itemStyle: {
              normal: {
                color: new LinearGradient(0, 0, 0, 1, [
                  { offset: 1, color: 'rgba(255, 1, 0, 1)' },
                  { offset: 0, color: 'rgba(255, 179, 0, 1)' },
                ]),
              },
            },
          },
        ],
      },
    }
  },
  created() {
    this.getSystemCfg()
  },
  computed: {
    date() {
      return this.$moment().date()
    },
  },
  watch: {
    date() {
      if (this.compareData.length) {
        this.getBarData()
      }
    },
  },
  methods: {
    getEightDays() {
      const daysArray = []

      let date = this.$moment().subtract(7, 'd')
      for (let i = 0; i < 7; i++) {
        daysArray.push(date.format('MM月DD日'))
        date.add(1, 'd')
      }
      daysArray.push(date.format('MM月DD日'))

      return daysArray
    },
    getCarryValue(inputValue) {
      if (inputValue < 10) {
        return 10
      }
      const strNum = Math.floor(inputValue).toString()
      const len = strNum.length - 1
      const carry = Math.ceil(inputValue / Math.pow(10, len)) * Math.pow(10, len)
      return carry
    },
    getSystemCfg() {
      apiv2.CommonData.ConfigDataReq({ cfg_name: 'dashboard_compare_bar' }).then((res) => {
        if (res.data.value) {
          try {
            this.compareData = JSON.parse(res.data.value)
            this.getBarData()
          } catch (error) {
            this.$message.error('系统配置dashboard_compare_bar数据格式有误')
          }
        } else {
          this.$message.error('缺少系统配置dashboard_compare_bar')
        }
      })
    },
    getBarData() {
      const days = this.getEightDays()
      this.option.xAxis[0].data = days.slice(0, 7)

      let date = this.$moment()
      let end_date = date.format('YYYY-MM-DD')
      let start_date = date.subtract(7, 'd').format('YYYY-MM-DD')
      let params = {
        device_id: this.compareData[0].device_id,
        start_date: start_date,
        end_date: end_date,
        scale_unit: 'day',
        scale_value: 1,
      }

      let maxValue = 0
      let tempData = []
      apiv2.DataStats.AnalysisReq(params).then((res) => {
        if (res.data && res.data.list && res.data.list.length) {
          let allData = res.data.list
          for (let i = 0; i < days.length; i++) {
            const day = days[i]
            const dayList = allData.filter((o) => this.$moment(o.acq_time).format('MM月DD日') == day && this.compareData[0].tag_ids.includes(o.tag_id))
            if (dayList.length) {
              let total = 0
              for (let j = 0; j < dayList.length; j++) {
                const tagData = dayList[j]
                total += tagData.acq_value
              }
              tempData.push(total)
            } else {
              tempData.push(null)
            }
          }
        } else {
          tempData = Array(days.length).fill(null)
        }

        let data1 = []
        for (let i = 1; i < tempData.length; i++) {
          const v1 = tempData[i - 1]
          const v2 = tempData[i]
          if (v1 > 0 && v2 > 0) {
            const diff = v2 - v1
            if (diff > maxValue) {
              maxValue = diff
            }
            data1.push(diff)
          } else {
            data1.push(null)
          }
        }

        tempData = []
        params.device_id = this.compareData[1].device_id
        apiv2.DataStats.AnalysisReq(params).then((res) => {
          if (res.data && res.data.list && res.data.list.length) {
            let allData = res.data.list
            for (let i = 0; i < days.length; i++) {
              const day = days[i]
              const dayList = allData.filter((o) => this.$moment(o.acq_time).format('MM月DD日') == day && this.compareData[1].tag_ids.includes(o.tag_id))
              if (dayList.length) {
                let total = 0
                for (let j = 0; j < dayList.length; j++) {
                  const tagData = dayList[j]
                  total += tagData.acq_value
                }
                if (total > maxValue) {
                  maxValue = total
                }
                tempData.push(total)
              } else {
                tempData.push(null)
              }
            }
          } else {
            tempData = Array(days.length).fill(null)
          }

          let data2 = []
          for (let i = 1; i < tempData.length; i++) {
            const v1 = tempData[i - 1]
            const v2 = tempData[i]
            if (v1 > 0 && v2 > 0) {
              const diff = v2 - v1
              if (diff > maxValue) {
                maxValue = diff
              }
              data2.push(diff)
            } else {
              data2.push(null)
            }
          }

          maxValue = this.getCarryValue(maxValue) || 1
          let maxData = Array(days.length - 1).fill(maxValue)

          this.option.series[0].data = maxData
          this.option.series[1].data = data1
          this.option.series[2].data = maxData
          this.option.series[3].data = data2
        })
      })
    },
  },
}
</script>
