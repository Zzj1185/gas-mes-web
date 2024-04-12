<template>
  <div class="permission">
    <template v-for="(item, index) in permissionTree">
      <div class="box" :key="index">
        <div class="top">
          <div>{{ item.permission_name }}</div>
        </div>
        <div class="child">
          <template v-for="(child, idx) in item.children">
            <div class="item" :key="idx">
              <el-checkbox v-model="child.checked" @change="(e) => updateRolePermission(child, e)">{{ child.permission_name }}</el-checkbox>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import apiv2 from '@/api/v2'
export default {
  props: {
    roleId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      permissionList: [],
      permissionTree: [],
    }
  },
  mounted() {
    this.getRolePermission()
  },
  methods: {
    getRolePermission() {
      apiv2.RoleAuth.ViewReq({ role_id: this.$props.roleId }).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.permissionList = res.data.list
          this.getPermissionTree()
        }
      })
    },
    getPermissionTree() {
      this.permissionTree = []
      apiv2.SystemAuth.SelectReq().then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          for (let i = 0; i < res.data.list.length; i++) {
            let item = res.data.list[i]
            if (item.children) {
              for (let j = 0; j < item.children.length; j++) {
                let child = item.children[j]
                child.checked = this.permissionList.includes(child.permission_id)
              }
            }
            this.permissionTree.push(item)
          }
        }
      })
    },
    updateRolePermission(item, checked) {
      let data = {
        role_id: this.$props.roleId,
        permission_id: item.permission_id,
        auth_mode: checked ? 'assign' : 'cancel',
      }
      let message = checked ? '分配' : '取消'
      apiv2.RoleAuth.UpdateReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.$message.success(message + '角色权限成功')
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.permission {
  gap: 26px;
  display: flex;
  flex-wrap: wrap;

  .box {
    width: 175px;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.19);

    .top {
      background-color: #666666;
    }

    &:nth-child(9n),
    &:nth-child(9n + 1),
    &:nth-child(9n + 3),
    &:nth-child(9n + 5),
    &:nth-child(9n + 7) {
      .top {
        background-color: #0060ff;
      }
    }

    .top,
    .item {
      font-size: 14px;
      padding: 0 20px;
      line-height: 40px;

      /deep/ .el-checkbox__inner {
        border-color: #fff;
        background-color: transparent;

        &::after {
          border-color: #fff;
        }
      }

      /deep/ .el-checkbox__label {
        color: #fff;
      }
    }

    .item {
      &:nth-child(even) {
        background-color: rgba(0, 0, 0, 0.05);
      }

      &:nth-child(odd) {
        background-color: rgba(255, 255, 255, 0.02);
      }
    }

    .child {
      height: 164px;
      overflow-y: auto;
    }
  }
}
</style>
