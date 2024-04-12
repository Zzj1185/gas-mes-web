<template>
  <el-dialog destroy-on-close :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="dialogData.dialogVisible" :title="dialogData.title" :width="dialogData.width" @open="open" @close="close">
    <el-form ref="form" :model="dialogData.form" :rules="dialogData.rules" :label-width="dialogData.labelWidth">
      <!-- 如果只有备件数量 -->
      <el-row v-if="dialogData.claimFlag" :gutter="15" type="flex" justify="space-around">
        <el-col :span="8">
          <el-form-item label="领取数量" prop="quantity">
            <el-input size="small" v-model="dialogData.form.quantity"></el-input>
          </el-form-item>
        </el-col>
        <!-- 空 -->
        <el-col :span="8"> </el-col>
      </el-row>
      <!-- 如果只有报修 -->
      <el-row v-if="dialogData.repairFlag" :gutter="15" type="flex" justify="space-around">
        <el-col :span="8">
          <el-form-item label="问题描述" prop="problem">
            <el-input size="small" v-model="dialogData.form.problem"></el-input>
          </el-form-item>
        </el-col>
        <!-- 空 -->
        <el-col :span="8"> </el-col>
      </el-row>

      <!-- 正常循环 -->
      <template v-else v-for="(row, index) in dialogData.formList">
        <!-- 每一行 -->
        <el-row :gutter="15" type="flex" justify="space-around" :key="index">
          <!-- 里面再循环 -->
          <template v-for="itm in row">
            <!-- 输入框 -->
            <el-col v-if="itm.cmpt == 'input'" :span="spanNum(itm)" :key="itm.binding">
              <el-form-item :label="itm.label" :prop="itm.binding">
                <el-input size="small" v-model="dialogData.form[itm.binding]" :type="itm.type ? itm.type : 'text'" :placeholder="itm.placeholder || '请输入'" :show-password="itm.type == 'password'"></el-input>
              </el-form-item>
            </el-col>
            <!-- 输入框 -->
            <el-col v-if="itm.cmpt == 'number'" :span="spanNum(itm)" :key="itm.binding">
              <el-form-item :label="itm.label" :prop="itm.binding">
                <el-input-number size="small" v-model="dialogData.form[itm.binding]" :min="itm.min" :max="itm.max" :step="1" :placeholder="itm.placeholder || '请输入'"></el-input-number>
              </el-form-item>
            </el-col>
            <!-- 下拉框 -->
            <el-col v-if="itm.cmpt == 'select'" :span="spanNum(itm)" :key="itm.binding">
              <el-form-item :label="itm.label" :prop="itm.binding">
                <el-select @change="changeSelect(dialogData.form[itm.binding])" :clearable="itm.clearable" size="small" v-model="dialogData.form[itm.binding]" placeholder="请选择" :popper-append-to-body="false">
                  <el-option :label="optionItem.label" :value="optionItem.value" v-for="(optionItem, optionIndex) in itm.options" :key="optionIndex"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 级联下拉框 -->
            <el-col v-if="itm.cmpt == 'cascader'" :span="spanNum(itm)" :key="itm.binding">
              <el-form-item :label="itm.label" :prop="itm.binding">
                <el-cascader :options="itm.options" :props="{ checkStrictly: true }" :show-all-levels="false" @change="changeSelect(dialogData.form[itm.binding])" size="small" v-model="dialogData.form[itm.binding]" placeholder="请选择" :popper-append-to-body="false"></el-cascader>
              </el-form-item>
            </el-col>
            <!-- 日期 -->
            <el-col v-if="itm.cmpt == 'datePicker'" :span="spanNum(itm)" :key="itm.binding">
              <el-form-item :label="itm.label" :prop="itm.binding">
                <el-date-picker value-format="yyyy-MM-dd" :append-to-body="false" v-model="dialogData.form[itm.binding]" type="date" placeholder="选择日期"> </el-date-picker>
              </el-form-item>
            </el-col>
            <!-- 颜色 -->
            <el-col v-if="itm.cmpt == 'color'" :span="spanNum(itm)" :key="itm.binding">
              <el-form-item :label="itm.label" :prop="itm.binding"> <el-color-picker v-model="dialogData.form[itm.binding]"></el-color-picker></el-form-item>
            </el-col>
            <!-- 文本域 -->
            <el-col v-if="itm.cmpt == 'inputTextarea'" :span="spanNum(itm)" :key="itm.binding">
              <el-form-item :label="itm.label" :prop="itm.binding">
                <el-input size="small" v-model="dialogData.form[itm.binding]" type="textarea" :placeholder="itm.placeholder || '请输入'"></el-input>
              </el-form-item>
            </el-col>
            <!-- 选择坐标 -->
            <el-col v-if="itm.cmpt == 'inputCoordinate'" :span="spanNum(itm)" :key="itm.binding">
              <el-form-item :label="itm.label" :prop="itm.binding">
                <el-input size="small" prefix-icon="el-icon-location" v-model="dialogData.form[itm.binding]" placeholder="填写有效的经纬坐标">
                  <template slot="append"><el-button @click="getLocation">去地图上选择</el-button></template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 选择范围 -->
            <el-col v-if="itm.cmpt == 'selectRange'" :span="spanNum(itm)" :key="itm.binding">
              <el-form-item :label="itm.label" :prop="itm.binding">
                <span style="margin-right: 10px">{{ dialogData.form[itm.binding] }} 个</span>
                <template v-if="itm.drawing">
                  <el-button size="small" type="primary" @click="drawRange">绘制巡检范围</el-button>
                </template>
                <template v-else>
                  <el-button size="small" disabled title="请先选择站点类型">绘制巡检范围</el-button>
                </template>
              </el-form-item>
            </el-col>

            <!-- 空 -->
            <!-- <el-col :span="8" :key="idx" v-if="row.length == 1 && !row[0].single"></el-col> -->
          </template>
        </el-row>
      </template>
    </el-form>

    <div slot="footer">
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button type="success" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'FormDialog',
  props: {
    dialogData: {
      type: Object,
    },
  },
  data() {
    return {
      formData: null,
    }
  },
  mounted() {
    this.formData = JSON.parse(JSON.stringify(this.$props.dialogData.form))
  },
  methods: {
    open() {
      this.$props.dialogData.form = Object.assign({}, this.$props.dialogData.form)
    },
    close() {
      this.$props.dialogData.form = this.formData
      this.dialogData.formList.forEach((list) => {
        const formSiteNum = list.find((o) => o.binding == 'site_num')
        if (formSiteNum) {
          formSiteNum.drawing = false
        }
      })
      this.$refs.form.resetFields()
    },
    cancel() {
      this.dialogData.dialogVisible = false
    },
    spanNum(item) {
      return item.single ? 20 : 8
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 表单验证通过，提交表单数据
          this.$emit('dialogEvent', this.dialogData.form)
        }
      })
    },
    getLocation() {
      this.$emit('getLocation')
    },
    drawRange() {
      this.$emit('drawRange')
    },
    changeSelect(id) {
      this.$emit('changeSelect', id)
    },
  },
}
</script>
