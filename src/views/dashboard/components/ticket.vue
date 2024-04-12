<template>
  <TableLite class="ticket" title="本月工单管理" iconName="ticket">
    <template #table-slot>
      <div class="ticket-info" :style="height ? `height: ${height}` : ''">
        <div class="ticket-item">
          <div class="ticket-data hexagon hexagon-white" @click="gotoPage('repair', 'pending')">{{ pending }}</div>
          <div class="ticket-name">未处理</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-data hexagon hexagon-orange" @click="gotoPage('repair', 'handling')">{{ handling }}</div>
          <div class="ticket-name">处理中</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-data hexagon hexagon-green" @click="gotoPage('repair', 'completed')">{{ completed }}</div>
          <div class="ticket-name">已处理</div>
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
      pending: 0,
      handling: 0,
      completed: 0,
      start_date: '',
      end_date: '',
    }
  },
  mounted() {
    this.start_date = this.$moment().format('YYYY-MM-01')
    this.end_date = this.$moment().format('YYYY-MM-DD')
    this.updateTicketCount()
  },
  props: { height: String },
  components: { TableLite },
  computed: {
    month() {
      return this.$moment().month()
    },
  },
  watch: {
    month() {
      this.updateTicketCount()
    },
  },
  methods: {
    getPendingCount() {
      let data = { state: 'pending', start_date: this.start_date }
      apiv2.CommonData.RepairCountReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.pending = res.data.count
        }
      })
    },
    getHandlingCount() {
      let data = { state: 'handling', start_date: this.start_date }
      apiv2.CommonData.RepairCountReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.handling = res.data.count
        }
      })
    },
    getCompletedCount() {
      let data = { state: 'completed', start_date: this.start_date }
      apiv2.CommonData.RepairCountReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.completed = res.data.count
        }
      })
    },
    updateTicketCount() {
      this.getPendingCount()
      this.getHandlingCount()
      this.getCompletedCount()
    },
    gotoPage(name, state) {
      this.$router.push({ name, params: { state, date_range: [this.start_date, this.end_date] } })
    },
  },
}
</script>
<style lang="less" scoped>
.ticket {
  .ticket-info {
    display: flex;
    min-height: 127px;
    align-items: center;
    padding-bottom: 10px;
    justify-content: space-around;

    .ticket-item {
      gap: 10px;
      display: flex;
      align-items: center;
      flex-direction: column;

      .ticket-data {
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
