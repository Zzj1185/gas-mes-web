<template>
  <div class="lite-content">
    <el-table :data="tableData.list" :height="tableData.height ? tableData.height : 'auto'" header-row-class-name="lite-header" row-class-name="lite-row">
      <template v-for="item in tableData.type">
        <el-table-column :align="item.align || 'center'" :width="item.width || 'auto'" :prop="item.key" :label="item.label" :key="item.label"></el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    tableData: Object,
  },
}
</script>
<style lang="less" scoped>
.lite-content {
  flex: 1;
  overflow: hidden;
  padding: 10px 7px;
  border-radius: 10px;
  background-image: linear-gradient(to right, #29323dcc, #191919cc);

  .el-table {
    border: none;
    background-color: transparent;

    &::before {
      height: 0;
    }

    /deep/ .el-table__body-wrapper {
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
    }

    /deep/ .el-table__body {
      border: none;
    }

    /deep/ .lite-header {
      color: #fff;
      height: 31px;
      background-color: transparent;
      background-image: linear-gradient(45deg, #74458a, #072bf7);

      .el-table__cell {
        padding: 0;
        border: none;
        background-color: transparent;
      }
    }

    /deep/ .lite-row {
      color: #fff;
      background-color: transparent;

      .el-table__cell {
        border-bottom: #ffffff1a dotted 2px;
      }

      &:hover {
        .el-table__cell {
          background-color: transparent;
        }
      }
    }
  }
}
</style>
