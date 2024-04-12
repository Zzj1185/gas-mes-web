<template>
  <el-dialog destroy-on-close :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="dialogData.dialogVisible" :title="dialogData.title" :width="dialogData.width" @close="close">
    <el-form ref="form" :model="dialogData.form" :rules="dialogData.rules" :label-width="dialogData.labelWidth">
      <slot name="formItem"></slot>
    </el-form>
    <span slot="footer">
      <el-row :gutter="20">
        <template v-if="dialogData.title == '采集配置'">
          <el-col>
            <el-button @click="cancel">关闭</el-button>
          </el-col>
        </template>
        <template v-else>
          <el-col :span="10">
            <el-button @click="cancel">取消</el-button>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" @click="submit">确定</el-button>
          </el-col>
        </template>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'FormDialog',
  props: {
    dialogData: {
      type: Object,
      default: () => {
        return {
          dialogVisible: true,
          title: '默认标题',
          width: '60%',
          form: {},
          labelWidth: '100px',
        }
      },
    },
  },
  data() {
    return {
      form: null,
    }
  },
  mounted() {
    this.form = JSON.parse(JSON.stringify(this.$props.dialogData.form))
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 表单验证通过，提交表单数据
          this.$emit('dialogEvent', this.form)
        }
      })
    },
    cancel() {
      this.dialogData.dialogVisible = false
    },
    close() {
      this.$props.dialogData.form = this.form
      this.$refs.form.resetFields()
    },
  },
}
</script>
