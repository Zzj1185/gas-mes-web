<template>
  <div>
    <formCmpt :formData="formDataAlarm" @formEvent="formEventAlarm"></formCmpt>

    <!-- <layout-cmpt> -->
    <!-- <template #top> -->
    <el-input v-model="input" placeholder="请输入内容"></el-input>

    <table-cmpt :tableData="tableDataAlarm" @tableEvent="tableEventAlarm"></table-cmpt>
    <!-- </template> -->

    <!-- <template #special> -->
    <form-dialog :dialogData="dialogDataAlarm" @dialogEvent="dialogEventAlarm"></form-dialog>
    <!-- </template> -->
    <!-- </layout-cmpt> -->
  </div>
</template>

<script>
import formCmpt from '@/components/formCmpt.vue'
export default {
  components: {
    formCmpt,
  },
  data() {
    return {
      // 告警规则

      formDataAlarm: {
        type: [
          {
            type: 'select',
            key: 'state',
            label: '告警状态',
            clearable: 'true',
            options: [
              {
                value: 'active',
                label: '启用',
              },
              {
                value: 'deactive',
                label: '不启用',
              },
            ],
          },
          {
            type: 'select',
            key: 'compare_mode',
            label: '比较模式',
            clearable: 'true',
            options: [
              {
                value: 'eq',
                label: '等于',
              },
              {
                value: 'gt',
                label: '大于',
              },
              {
                value: 'gte',
                label: '大于等于',
              },
              {
                value: 'lt',
                label: '小于',
              },
              {
                value: 'lte',
                label: '小于等于',
              },
              ,
              {
                value: 'neq',
                label: '不等于',
              },
            ],
          },
          {
            type: 'select',
            key: 'alarm_level',
            label: '告警等级',
            clearable: 'true',
            options: [
              {
                value: 'critical',
                label: '1级',
              },
              {
                value: 'warning',
                label: '2级',
              },
              {
                value: 'important',
                label: '3级',
              },
              {
                value: 'notice',
                label: '4级',
              },
            ],
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: '/acquisition/tag/list',
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            permissionApi: '/acquisition/tag/create',
          },
        ],
        bindData: {
          tag_id: 0, //点击 告警规则绑定
          state: 'active',
          compare_mode: 'string',
          alarm_level: 'string',
        },
      },
      tableDataAlarm: {
        type: [
          {
            key: 'state',
            label: '告警状态',
          },
          {
            key: 'tag_name',
            label: '标签名称',
          },
          {
            key: 'compare_mode',
            label: '比较模式',
          },
          {
            key: 'compare_value',
            label: '比较数值',
          },
          {
            key: 'acq_unit',
            label: '采集单位',
          },
          {
            key: 'alarm_level',
            label: '告警等级',
          },
          {
            key: 'alarm_text',
            label: '告警文本',
          },

          {
            key: 'do',
            label: '操作',
            // width: '300px',
            doList: [
              { name: '编辑', type: 'warning', permissionApi: '/alarm/rule/update' },
              { name: '删除', type: 'danger', permissionApi: '/alarm/rule/delete' },
            ],
          },
        ],
        list: [],
      },
      pageDataAlarm: {
        page: 1,
        size: 20,
        total: 0,
      },
      dialogDataAlarm: {
        dialogVisible: false,
        title: '新增文档',
        width: '50%',
        // 绑定表单
        form: {
          state: 'active',
          tag_id: 0,
          compare_mode: 'eq',
          compare_value: 0,
          alarm_level: 'critical',
          alarm_text: 'string',
        },
        // 循环表单
        formList: [
          [
            {
              label: '告警状态',
              binding: 'state',
              cmpt: 'select',
              options: [
                {
                  value: 'active',
                  label: '启用',
                },
                {
                  value: 'deactive',
                  label: '不启用',
                },
              ],
            },

            {
              label: '比较模式',
              binding: 'compare_mode',
              cmpt: 'select',
              options: [
                {
                  value: 'eq',
                  label: '等于',
                },
                {
                  value: 'gt',
                  label: '大于',
                },
                {
                  value: 'gte',
                  label: '大于等于',
                },
                {
                  value: 'lt',
                  label: '小于',
                },
                {
                  value: 'lte',
                  label: '小于等于',
                },
                ,
                {
                  value: 'neq',
                  label: '不等于',
                },
              ],
            },
          ],
          [
            {
              label: '比较数值',
              binding: 'compare_value',
              cmpt: 'input',
            },

            {
              label: '告警等级',
              binding: 'alarm_level',
              cmpt: 'select',
              options: [
                {
                  value: 'critical',
                  label: '1级',
                },
                {
                  value: 'warning',
                  label: '2级',
                },
                {
                  value: 'important',
                  label: '3级',
                },
                {
                  value: 'notice',
                  label: '4级',
                },
              ],
            },
          ],
          [
            {
              type: 'input',
              key: 'alarm_text',
              label: '告警文本',
              clearable: 'true',
            },
          ],
        ],
        // 规则验证
        rules: {
          topic: [{ required: true, message: '请输入订阅主题', trigger: 'submit' }],
          tag_name: [{ required: true, message: '请输入标签名称', trigger: 'submit' }],
          acq_unit: [{ required: true, message: '请输入采集单位', trigger: 'submit' }],
          acq_type: [{ required: true, message: '请选择采集类型', trigger: 'submit' }],
        },
        labelWidth: '120px',
      },
    }
  },
}
</script>

<style>
</style>