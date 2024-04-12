<template>
  <div class="lite-table">
    <div class="table-header">
      <TitleCmpt v-if="title" :title="title" :iconName="iconName" />
      <slot name="title-slot"></slot>
    </div>
    <ContentCmpt v-if="tableData" :tableData="tableData" />
    <slot name="table-slot"></slot>
  </div>
</template>
<script>
import TitleCmpt from './tableLiteTitleCmpt.vue'
import ContentCmpt from './tableLiteContentCmpt.vue'
export default {
  components: { TitleCmpt, ContentCmpt },
  props: {
    title: String,
    iconName: String,
    tableData: Object,
  },
}
</script>
<style lang="less" scoped>
.lite-table {
  gap: 10px;
  display: flex;
  overflow: hidden;
  padding: 10px 0 0;
  border-radius: 10px;
  flex-direction: column;
  background-image: linear-gradient(to right, #29323dcc, #191919cc);

  .table-header {
    padding: 0 7px;
  }
}
</style>
