<template>
  <div class="containerBox">
    <!-- 标题 -->
    <div class="title" v-if="titleFlag">
      <slot name="title"></slot>
      <!-- 管理按钮 右上角 -->
      <slot name="manageBtn"></slot>
    </div>
    <slot name="special"></slot>
    <div class="tableContent" v-if="tableFlag">
      <div class="entity-box">
        <div class="form" v-if="formFlag">
          <slot name="form"></slot>
        </div>
        <div class="table">
          <slot name="table"></slot>
        </div>
      </div>

      <div class="pageContent" v-if="pageFlag">
        <slot name="page"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    titleFlag: {
      type: Boolean,
      default: true,
    },
    formFlag: {
      type: Boolean,
      default: true,
    },
    tableFlag: {
      type: Boolean,
      default: true,
    },
    pageFlag: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="less" scoped>
.containerBox {
  flex: 1;
  gap: 19px;
  display: flex;
  overflow: hidden;
  position: relative;
  flex-direction: column;
  justify-content: space-between;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tableContent {
    flex: 1;
    display: flex;
    overflow: hidden;
    background-size: 100%;
    flex-direction: column;
    background-repeat: no-repeat;
    background-image: url('@/assets/table/bg.png');

    .entity-box {
      flex: 1;
      display: flex;
      padding: 0 30px;
      overflow: hidden;
      flex-direction: column;

      .form {
        height: 82px;
        display: flex;
        align-items: center;
      }

      .table {
        flex: 1;
        display: flex;
        overflow: hidden;
        flex-direction: column;
      }
    }

    .pageContent {
      height: 67px;
      display: flex;
      padding: 0 30px;
      align-items: center;
      background-repeat: no-repeat;
      background-image: url('@/assets/table/pageBg.png');
    }
  }
}
</style>
