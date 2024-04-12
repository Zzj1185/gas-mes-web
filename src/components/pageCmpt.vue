<template>
  <div class="custom-pagination">
    <el-pagination class="page-box" layout="total, prev, pager, next, jumper" :current-page="pageData.page" :page-size="pageData.size" :total="pageData.total" @current-change="handleCurrentChange"> </el-pagination>
    <span class="el-pagination__sizes">
      <el-select size="mini" v-model="pageData.size" :popper-append-to-body="false" @change="handleSizeChange">
        <el-option v-for="(value, index) in pageSizes" :key="index" :label="value + '条/页'" :value="value"></el-option>
      </el-select>
    </span>
  </div>
</template>
<script>
export default {
  name: 'Pagination',
  props: ['pageData'],
  data() {
    return {
      pageSizes: [10, 20, 30, 40, 50, 100],
      pageparm: {
        page: this.pageData.page,
        size: this.pageData.size,
      },
    }
  },
  mounted() {
    const elPage = this.$el.firstChild
    const pageTotal = elPage.firstChild
    pageTotal.after(this.$el.lastChild)
  },
  methods: {
    handleSizeChange(val) {
      /**
       * 子传父
       * 参数1 父元素方法
       * 参数2 数据
       */
      this.pageData.size = val
      this.pageparm.size = val
      this.$emit('pageEvent', this.pageparm)
    },
    handleCurrentChange(val) {
      /**
       * 子传父
       * 参数1 父元素方法
       * 参数2 数据
       */
      this.pageData.page = val
      this.pageparm.page = val
      this.$emit('pageEvent', this.pageparm)
    },
  },
}
</script>

<style lang="less" scoped>
.custom-pagination {
  /deep/ .el-popper {
    top: auto !important;
    bottom: 28px !important;
    font-size: 21px !important;
  }
}
</style>
