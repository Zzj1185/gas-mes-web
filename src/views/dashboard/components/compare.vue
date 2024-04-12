<template>
  <TableLite class="compare" title="近7日用气量对比" iconName="gas">
    <template #table-slot>
      <BarChart class="chart" />
    </template>
  </TableLite>
</template>
<script>
import TableLite from '@/components/tableLiteCmpt.vue'
import BarChart from './compareBar.vue'
export default {
  data() {
    return {
      tableData: [],
    }
  },
  components: { TableLite, BarChart },
}
</script>
<style lang="less" scoped>
.compare {
  height: 220px;
  position: relative;
  padding-bottom: 10px;

  .chart {
    left: 0;
    top: 20px;
    height: 220px;
    position: absolute;
  }
}
</style>
