<template>
  <div class="custom-table">
    <el-table :height="height" v-loading="loading" :data="tableData.list" :stripe="stripe">
      <template v-for="item in tableData.type">
        <!-- 标签 -->
        <el-table-column v-if="item.cmpt == 'tag'" :key="item.label" :label="item.label" :width="item.width"
          :prop="item.key" align="center">
          <template slot-scope="scope">
            <el-tag effect="dark" :type="item.types[scope.row[item.key]]">{{ scope.row[item.key] }}</el-tag>
          </template>
        </el-table-column>
        <!-- 开关 -->
        <el-table-column v-else-if="item.cmpt == 'switch'" :key="item.label" :label="item.label" :width="item.width"
          :prop="item.key" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.state == 'repair'">维修中</div>
            <template v-else>
              <template v-if="checkShow(item.permissionApi, scope.row[item.check])">
                <el-switch v-model="scope.row[item.key]" :active-text="item.activeText || '启用'"
                  :inactive-text="item.inactiveText || '停用'" :active-value="item.activeValue || 'active'"
                  :inactive-value="item.inactiveValue || 'deactive'"
                  @change="changeState(item.doName || '修改状态', scope.row, scope.row[item.key])"> </el-switch>
              </template>
              <template v-else>
                <div>{{ scope.row[item.key] == (item.activeValue ? item.activeValue : 'active') ? (item.activeText ?
                  item.activeText : '启用') : item.inactiveText ? item.inactiveText : '停用' }}</div>
              </template>
            </template>
          </template>
        </el-table-column>
        <!-- 颜色圆点 -->
        <el-table-column v-else-if="item.cmpt == 'iconDot'" :key="item.label" :prop="item.key" :label="item.label"
          align="center">
          <template slot-scope="scope">
            <div style="display: flex; justify-content: space-around" :style="{ color: scope.row[item.key] }">{{
              scope.row[item.key] }}</div>
          </template>
        </el-table-column>
        <!-- 风险进度条 -->
        <el-table-column v-else-if="item.key == 'risk_percentage'" :key="item.label" :label="item.label" :prop="item.key"
          align="center">
          <template slot-scope="scope" v-if="scope.row.max_interval">
            <div class="list-progress">
              <el-progress :show-text="false" :stroke-width="20" :percentage="scope.row.risk_percentage"
                :color="getColor(scope.row.risk_percentage)"></el-progress>
              <div class="progress-text" :style="'color: ' + getTextColor(scope.row.risk_percentage)">{{
                scope.row.risk_percentage + '%' }}</div>
            </div>
          </template>
        </el-table-column>
        <!-- 完成进度条 -->
        <el-table-column v-else-if="item.key == 'completion_rate'" :key="item.label" :label="item.label" :prop="item.key"
          align="center">
          <template slot-scope="scope">
            <div class="list-progress">
              <el-progress :show-text="false" :stroke-width="20"
                :percentage="scope.row.completion_rate > 100 ? 100 : scope.row.completion_rate"
                color="#3ABF1C"></el-progress>
              <div class="progress-text" :style="'color: ' + getTextColor(scope.row.completion_rate)">{{
                scope.row.completion_rate + '% (' + scope.row.formula + ')' }}</div>
            </div>
          </template>
        </el-table-column>
        <!-- 按钮操作 -->
        <el-table-column v-else-if="item.key == 'do'" :label="item.label" align="center"
          :width="item.width ? item.width : '200px'" :key="item.label">
          <template slot-scope="scope">
            <div class="btnBox">
              <template v-for="(btn, idx) in item.doList">
                <div class="btn-list" v-if="Array.isArray(btn)" :key="idx">
                  <template v-for="(subBtn, i) in btn">
                    <el-button :style="subBtn.style" :type="getBtnType(subBtn)"
                      v-if="checkShow(subBtn.permissionApi, scope.row[subBtn.check])" size="mini" :key="i"
                      @click="handleDo(scope.$index, scope.row, subBtn.name)">{{ subBtn.name }}</el-button>
                  </template>
                </div>
                <template v-else>
                  <el-button :style="btn.style" :type="getBtnType(btn)"
                    v-if="checkShow(btn.permissionApi, scope.row[btn.check])" size="mini" :key="idx"
                    @click="handleDo(scope.$index, scope.row, btn.name)">{{ btn.name }}</el-button>
                </template>
              </template>
            </div>
          </template>
        </el-table-column>
        <!-- 视频操作 -->
        <el-table-column v-else-if="item.key == 'doVideo'" :label="item.label" align="center" width="200"
          :key="item.label" :prop="item.key">
          <template slot-scope="scope">
            <div class="btnBox">
              <el-button size="mini" :disabled="scope.row.disabled"
                :type="!scope.row.state ? item.doList[0].type : item.doList[1].type"
                @click="handleDoVideo(scope.$index, scope.row)"> {{ !scope.row.state ? item.doList[0].name :
                  item.doList[1].name }}</el-button>
            </div>
          </template>
        </el-table-column>
        <!-- 管线颜色 -->
        <el-table-column v-else-if="item.label == '管线颜色'" align="center" :prop="item.key" :label="item.label"
          :key="item.label" :width="item.width">
          <template slot-scope="scope">
            <div :style="{ color: scope.row[item.key] }">{{
              scope.row[item.key] }}</div>
          </template>
        </el-table-column>
        <!-- 一般普通文本 -->
        <el-table-column v-else align="center" :prop="item.key" :label="item.label" :key="item.label" :width="item.width">

        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    stripe: {
      type: Boolean,
      default: true,
    },
    tableData: {
      type: Object,
      default: () => {
        return {
          type: [],
          list: [],
        }
      },
    },
    height: {
      type: String,
      default: '100%',
    },
  },
  methods: {
    // 按钮类名
    getBtnType(btn) {
      if (btn.name == '编辑') {
        return 'warning'
      } else if (btn.name == '删除') {
        return 'danger'
      } else {
        return btn.type || 'text'
      }
    },
    // 校验权限
    checkShow(permissionApi, custom) {
      const checkAuth = permissionApi === undefined ? true : this.$auth(permissionApi)
      const checkCustom = custom === undefined ? true : custom
      return checkCustom && checkAuth
    },
    // 是否为关键标签
    changeState(itm, row, state) {
      this.$emit('tableEvent', { itm, row: Object.assign(row, { state }) })
    },
    handleDo(idx, row, itm) {
      // 重置验证 通知 dialogCmpt 验证
      let data = { idx, row, itm }
      if (data.itm == '删除') {
        this.$confirm('此操作将永久删除该数据，是否继续？', { type: 'warning' })
          .then(() => {
            this.$emit('tableEvent', data)
          })
          .catch(() => { })
      } else {
        this.$emit('tableEvent', data)
      }
    },
    getColor(e) {
      let color = 255 - Math.ceil(e * 2.55)
      return `rgb(204,${color},0)`
    },
    getTextColor(e) {
      return e > 60 ? '#fff' : '#000'
    },
    handleDoVideo(idx, row) {
      let data = { idx, row }
      this.$emit('handleDoVideo', data)
    },
  },
}
</script>

<style lang="less" scoped>
.custom-table {
  flex: 1;
  display: flex;
  overflow: hidden;

  /deep/ .el-table {
    flex: 1;
    color: #fff;
    background-color: transparent;

    .el-table__header-wrapper {
      background-size: 1px 100%;
      background-repeat: repeat-x;
      border-radius: 10px 10px 0px 0px;
      background-image: url('@/assets/table/headBg.png');

      .el-table__header {
        thead {
          color: #fff;

          tr {
            background-color: transparent;

            th {
              border: none;
              background-color: transparent;
            }

            // th.gutter {
            //   width: 7px !important;
            // }
          }
        }
      }
    }

    .el-table__body-wrapper {

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

      .el-table__body {
        tbody {
          tr {
            background-color: rgba(0, 0, 0, 0.05);

            &.el-table__row--striped {
              td {
                background-color: rgba(255, 255, 255, 0.05);
              }
            }

            &:hover {
              td {
                background-color: rgba(0, 15, 36, 0.5);
              }
            }

            td {
              border-bottom: 0;
            }
          }
        }
      }

      .list-progress {
        width: 100%;
        position: relative;
        display: inline-block;

        .progress-text {
          top: 0;
          left: 0;
          width: 100%;
          line-height: 20px;
          position: absolute;
          text-align: center;
        }
      }

      .el-tag {
        height: 26px;
        line-height: 26px;
        border-radius: 20px;
      }

      .btnBox {
        .el-button {
          padding: 0 8px;
          font-size: 17px;
          line-height: 30px;
        }

        .btn-list {
          display: flex;
          justify-content: center;

          +.btn-list {
            margin-top: 10px;
          }
        }
      }
    }

    .el-loading-mask {
      background-color: rgba(0, 0, 0, 0.9);
    }
  }
}
</style>
