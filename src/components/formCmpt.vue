<template>
  <div class="table-form">
    <!-- 左边盒子 -->
    <div class="form-params">
      <slot v-if="formData.special" name="special"></slot>
      <el-form v-else :inline="true" :model="formData.bindData">
        <template v-for="(item, index) in formData.type">
          <template v-if="checkAuth(item.permissionApi)">
            <el-form-item :label="item.label" :key="index" :size="item.size || 'small'" :label-width="item.labelWidth || '80px'">
              <el-input v-if="item.type == 'input'" :size="item.size || 'small'" :clearable="item.clearable == 'true' ? true : false" @clear="handleClear($event, item.key)" v-model="formData.bindData[item.key]" :placeholder="item.placeholder || '请输入'" :style="item.width ? 'width: ' + item.width : ''"></el-input>

              <el-select v-else-if="item.type == 'select'" :size="item.size || 'small'" :popper-append-to-body="false" :clearable="item.clearable === 'false' ? false : true" :multiple="item.multiple ? true : false" collapse-tags @clear="handleClear($event, item.key)" @change="changeSelect($event, item.key)" :multiple-limit="4" v-model="formData.bindData[item.key]" placeholder="请选择" :style="item.width ? 'width: ' + item.width : ''">
                <el-option v-for="itm in item.options" :key="itm.value" :label="itm.label" :value="itm.value"> </el-option>
              </el-select>

              <el-cascader v-else-if="item.type == 'cascader'" :append-to-body="false" v-model="formData.bindData[item.key]" :options="item.options" :props="{ expandTrigger: 'hover' }" @change="handleCascaderChange"></el-cascader>

              <el-date-picker v-else-if="item.type == 'datePicker'" :append-to-body="false" v-model="formData.bindData[item.key]" :size="item.size || 'small'" :type="item.subType ? item.subType : 'daterange'" :multiple="true" :style="item.width ? 'width: ' + item.width : ''" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="item.pickerOptions" :clearable="item.clearable === 'false' ? false : true" @change="changeDate" @clear="handleClear($event, item.key)" :format="item.format ? item.format : ''" :value-format="item.format ? item.format : ''" />
            </el-form-item>
          </template>
        </template>
      </el-form>
    </div>

    <div class="form-button">
      <template v-for="(item, index) in formData.btn">
        <el-button class="btnForm" v-if="checkAuth(item.permissionApi)" :key="index" :size="item.size || 'small'" :icon="item.icon" :type="item.type" @click="handleBtn(item.key)">{{ item.label }}</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { DateRangePicker } from 'tdesign-vue'
import 'tdesign-vue/es/style/index.css'
document.documentElement.setAttribute('theme-mode', 'dark') //暗黑模式

export default {
  components: { DateRangePicker },
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          type: [
            {
              type: 'input',
              key: 'user',
              label: '用户',
              placeholder: '请输入用户名称',
            },
            {
              type: 'select',
              key: 'department',
              label: '部门',
              options: [
                {
                  value: '1',
                  label: '选项一',
                },
                {
                  value: '2',
                  label: '选项二',
                },
              ],
            },
          ],
          btn: [
            {
              key: 'search',
              label: '查询',
            },
            {
              key: 'add',
              label: '新增',
              type: 'primary',
            },
          ],
          bindData: {
            user: '',
            department: '',
          },
        }
      },
    },
  },
  data() {
    return {}
  },
  methods: {
    // 校验权限
    checkAuth(permissionApi) {
      return permissionApi === undefined ? true : this.$auth(permissionApi)
    },
    handleBtn(type) {
      this.$emit('formEvent', type)
    },
    isObjectEmpty(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            // 递归调用isObjectEmpty函数来检查内部对象的属性
            if (!this.isObjectEmpty(obj[key])) {
              return false
            }
          } else if (Array.isArray(obj[key])) {
            // 如果属性是数组，遍历数组并检查每个元素的属性
            for (var i = 0; i < obj[key].length; i++) {
              if (!this.isObjectEmpty(obj[key][i])) {
                return false
              }
            }
          } else if (obj[key] !== null && obj[key] !== '') {
            return false // 如果存在非空属性，返回false
          }
        }
      }
      return true // 所有属性都为空，返回true
    },
    // 判断对象里面的key或者数组都为空
    isObjectEmpty1(obj) {
      for (var key in obj) {
        if (Array.isArray(obj[key])) {
          if (obj[key].length > 0) {
            return false
          }
        } else {
          if (obj[key] !== null && typeof obj[key] === 'object') {
            if (!this.isObjectEmpty1(obj[key])) {
              return false
            }
          } else {
            if (obj[key]) {
              return false
            }
          }
        }
      }
      return true
    },
    handleClear(event, key) {
      this.$emit('formEvent', 'clearFactor', key)
    },
    changeSelect(event, key) {
      if (key == 'report_type') {
        this.$emit('changeReportType', event)
        return
      }
      if (key == 'statis_type') {
        this.$emit('changeStatisType', event)
        return
      }

      let data = {
        key: key,
        value: event,
      }

      this.$emit('formEvent', 'changeSelect', data)
    },
    changeDate(e) {
      this.$emit('formEvent', 'changeDate', e)
    },
    handleCascaderChange(e) {},
  },
}
</script>

<style lang="less" scoped>
.table-form {
  gap: 58px;
  width: 100%;
  display: flex;
  justify-content: space-between;

  .form-params {
    /deep/ .el-form--inline {
      gap: 58px;
      display: flex;

      .el-form-item {
        margin: 0;
        height: 42px;
        display: flex;

        .el-form-item__label,
        .el-form-item__content {
          line-height: 42px;
        }

        .el-form-item__label {
          text-align: left;
        }

        .el-form-item__content {
          .el-input__inner {
            border-radius: 10px;
            background-color: #191919;
            box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.25);
          }
        }
      }
    }
  }

  .form-button {
    display: flex;
    gap: 16px;

    .el-button {
      font-size: 15px;
      padding: 13px 23px 12px;
      border-radius: 10px;
    }
  }
}
</style>
