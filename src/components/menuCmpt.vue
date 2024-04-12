<template>
  <div class="nav-menu">
    <div class="menu-list">
      <div class="menu-type">
        <div class="menu-title">
          <router-link to="/">驾驶舱</router-link>
        </div>
      </div>
      <div class="menu-type" v-if="authCheck('管网地图')">
        <div class="menu-title">
          <router-link to="/map">管网地图</router-link>
        </div>
      </div>
      <div class="menu-type" v-if="authCheck('生产监控')">
        <div class="menu-title">
          <router-link to="/monitor/process">生产监控</router-link>
        </div>
      </div>
      <div class="menu-type" v-if="authCheck('告警处理') || authCheck('视频监控')">
        <div class="menu-title">
          安全监控<span class="arrow"><i class="icon"></i></span>
        </div>
        <div class="menu-item">
          <router-link to="/alarm/handle" v-if="authCheck('告警处理')">告警处理</router-link>
          <router-link to="/monitor/video" v-if="authCheck('视频监控')">视频监控</router-link>
        </div>
      </div>
      <div class="menu-type" v-if="authCheck('数据总览') || authCheck('数据报表') || authCheck('趋势分析') || dataRecordAuthCheck()">
        <div class="menu-title">
          数据统计<span class="arrow"><i class="icon"></i></span>
        </div>
        <div class="menu-item">
          <router-link to="/monitor/overview" v-if="authCheck('数据总览')">数据总览</router-link>
          <router-link to="/analysis/report" v-if="authCheck('数据报表')">数据报表</router-link>
          <router-link to="/analysis/trend" v-if="authCheck('趋势分析')">趋势分析</router-link>
          <router-link to="/analysis/record" v-if="dataRecordAuthCheck()">记录报表</router-link>
        </div>
      </div>
      <div class="menu-type" v-if="authCheck('设备管理') || authCheck('设备类型') || authCheck('备件管理') || authCheck('备件类型')">
        <div class="menu-title">
          资产管理<span class="arrow"><i class="icon"></i></span>
        </div>
        <div class="menu-item">
          <router-link to="/site/device" v-if="authCheck('设备管理')">设备管理</router-link>
          <router-link to="/device/type" v-if="authCheck('设备类型')">设备类型</router-link>
          <router-link to="/device/part" v-if="authCheck('备件管理')">备件管理</router-link>
          <router-link to="/part/type" v-if="authCheck('备件类型')">备件类型</router-link>
        </div>
      </div>
      <div class="menu-type" v-if="authCheck('维修工单') || authCheck('生命周期管理')">
        <div class="menu-title">
          资产维护<span class="arrow"><i class="icon"></i></span>
        </div>
        <div class="menu-item">
          <router-link to="/repair/ticket" v-if="authCheck('维修工单')">维修工单</router-link>
          <router-link to="/site/device/maintenance" style="font-size: 15px" v-if="authCheck('生命周期管理')">生命周期管理</router-link>
        </div>
      </div>
      <div class="menu-type" v-if="authCheck('知识类别') || authCheck('知识菜单')">
        <div class="menu-title">
          知识库管理<span class="arrow"><i class="icon"></i></span>
        </div>
        <div class="menu-item">
          <router-link to="/knowledge/category" v-if="authCheck('知识类别')">知识类别</router-link>
          <template v-for="item in category">
            <router-link :to="'/archive/knowledge/' + item.category_id + '/' + item.category_name" :key="item.category_id">{{ item.category_name }}</router-link>
          </template>
        </div>
      </div>
      <div class="menu-type" v-if="authCheck('用户管理') || authCheck('角色管理') || authCheck('权限策略') || authCheck('系统配置')">
        <div class="menu-title">
          系统管理<span class="arrow"><i class="icon"></i></span>
        </div>
        <div class="menu-item">
          <router-link to="/system/user" v-if="authCheck('用户管理')">用户管理</router-link>
          <router-link to="/system/role" v-if="authCheck('角色管理')">角色管理</router-link>
          <router-link to="/system/policy" v-if="authCheck('权限策略')">权限策略</router-link>
          <router-link to="/system/config" v-if="authCheck('系统配置')">系统配置</router-link>
        </div>
      </div>
    </div>
    <div class="user-info">
      <div class="menu-type">
        <div class="menu-title">{{ userInfo.fullname }}</div>
        <div class="menu-item">
          <a href="javascript:;" @click="handleChange('password')">修改密码</a>
          <a href="javascript:;" @click="handleChange('userinfo')">修改信息</a>
        </div>
      </div>
      <form-dialog :dialogData="dialogPassword" @dialogEvent="changePassword"></form-dialog>
      <form-dialog :dialogData="dialogUserInfo" @dialogEvent="changeUserInfo"></form-dialog>
    </div>
  </div>
</template>

<script>
import apiv2 from '@/api/v2'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      fullname: '',
      auth: null,
      category: null,
      dialogPassword: {
        dialogVisible: false,
        title: '修改密码',
        width: '30%',
        labelWidth: '100px',
        form: {
          password: '',
        },
        formList: [
          [
            {
              label: '登录密码',
              binding: 'password',
              cmpt: 'input',
              type: 'password',
              single: true,
            },
          ],
        ],
        rules: {
          password: [{ required: true, message: '请输入登录密码', trigger: 'submit' }],
        },
      },
      dialogUserInfo: {
        dialogVisible: false,
        title: '修改信息',
        width: '50%',
        labelWidth: '100px',
        form: {
          username: '',
          fullname: '',
          email: '',
          phone: '',
          note: '',
        },
        formList: [
          [
            {
              label: '登录账号',
              binding: 'username',
              cmpt: 'input',
            },
            {
              label: '用户名称',
              binding: 'fullname',
              cmpt: 'input',
            },
          ],
          [
            {
              label: '电子邮箱',
              binding: 'email',
              cmpt: 'input',
            },
            {
              label: '手机号码',
              binding: 'phone',
              cmpt: 'input',
            },
          ],
          [
            {
              label: '备注',
              binding: 'note',
              cmpt: 'inputTextarea',
              single: true,
            },
          ],
        ],
        rules: {
          username: [{ required: true, message: '请输入登录账号', trigger: 'submit' }],
          fullname: [{ required: true, message: '请输入用户名称', trigger: 'submit' }],
        },
      },
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.getUserInfo || { fullname: '' }
    },
    currentMenu() {
      return this.$store.getters.getCurrentMenu
    },
  },
  created() {
    this.getCategroyAll()
  },
  mounted() {
    this.bindSelect()
    let path = this.$route.path
    this.activeMenu(path)
  },
  watch: {
    currentMenu() {
      this.activeMenu(this.currentMenu)
    },
  },
  methods: {
    ...mapActions(['saveUserInfo']),
    authCheck(name) {
      const routeList = {
        管网地图: apiv2.SiteMgmt.ViewRoute,
        生产监控: apiv2.ProcessMgmt.ViewRoute,
        告警处理: apiv2.AlarmMgmt.ViewRoute,
        视频监控: apiv2.MonitorMgmt.ViewRoute,
        数据总览: apiv2.DataStats.OverviewRoute,
        数据报表: apiv2.DataStats.FormRoute,
        趋势分析: apiv2.DataStats.AnalysisRoute,
        设备管理: apiv2.DeviceMgmt.ListRoute,
        设备类型: apiv2.DeviceType.ListRoute,
        备件管理: apiv2.PartMgmt.ListRoute,
        备件类型: apiv2.PartType.ListRoute,
        维修工单: apiv2.RepairOrder.ListRoute,
        生命周期管理: apiv2.DeviceMaint.ListRoute,
        知识类别: apiv2.ArchiveType.ListRoute,
        知识菜单: apiv2.ArchiveType.ViewRoute,
        用户管理: apiv2.SystemUser.ListRoute,
        角色管理: apiv2.SystemRole.ListRoute,
        权限策略: apiv2.SystemAuth.ListRoute,
        系统配置: apiv2.SystemConfig.ListRoute,
      }

      return this.$auth(routeList[name])
    },
    dataRecordAuthCheck() {
      const acq = this.$auth(apiv2.DataRecord.AcquisitionRoute)
      const alm = this.$auth(apiv2.DataRecord.AlarmRoute)
      const evt = this.$auth(apiv2.DataRecord.EventRoute)
      const log = this.$auth(apiv2.DataRecord.LogRoute)
      return acq || alm || evt || log
    },
    bindSelect() {
      const list = this.$el.querySelectorAll('a')
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        ele.addEventListener('click', (event) => {
          this.activeMenu(event.target.hash)
        })
      }
    },
    activeMenu(path) {
      const list = this.$el.querySelectorAll('.menu-type.active')
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        ele.className = 'menu-type'
      }
      const ele = this.$el.querySelector(`a[href$="${path}"]`)
      if (ele) {
        let menuType = ele.parentElement.parentElement
        if (menuType) {
          menuType.className = 'menu-type active'
        }
      }
    },
    handleChange(type) {
      if (type == 'password') {
        this.dialogPassword.dialogVisible = true
      }
      if (type == 'userinfo') {
        this.dialogUserInfo.form = {
          username: this.userInfo.username,
          fullname: this.userInfo.fullname,
          email: this.userInfo.email,
          phone: this.userInfo.phone,
          note: this.userInfo.note,
        }
        this.dialogUserInfo.dialogVisible = true
      }
    },
    changePassword(data) {
      apiv2.AccountMgmt.ChangePasswordReq(data).then((res) => {
        if (res.message) {
          this.$message.error('修改密码失败：' + res.message)
        } else {
          this.$message.success('修改密码成功')
          this.dialogPassword.dialogVisible = false
        }
      })
    },
    changeUserInfo(data) {
      apiv2.AccountMgmt.ChangeInfoReq(data).then((res) => {
        if (res.message) {
          this.$message.error('修改信息失败：' + res.message)
        } else {
          this.$message.success('修改信息成功')
          let newUserInfo = Object.assign(this.userInfo, data)
          this.saveUserInfo(newUserInfo)
          this.dialogUserInfo.dialogVisible = false
        }
      })
    },
    getCategroyAll() {
      if (this.authCheck('知识菜单')) {
        apiv2.ArchiveType.ViewReq().then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.category = res.data.list
          }
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.nav-menu {
  display: flex;
  justify-content: space-between;

  .menu-list {
    gap: 20px;
    width: 100%;
    font-size: 0;
    display: flex;
    align-items: center;
  }

  .user-info {
    display: flex;
    align-items: center;
  }

  .menu-type {
    width: 104px;
    height: 45px;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;

    a {
      width: 104px;
      height: 45px;
      color: #fff;
      display: flex;
      font-size: 18px;
      align-items: center;
      text-decoration: none;
      justify-content: center;
    }

    .menu-title {
      width: 100%;
      height: 100%;
      display: flex;
      font-size: 18px;
      cursor: pointer;
      align-items: center;
      justify-content: center;

      .arrow {
        width: 11px;
        height: 11px;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
          width: 6px;
          height: 11px;
          background: url('@/assets/header/arrow.png') no-repeat;
        }
      }
    }

    .menu-item {
      top: 45px;
      width: 100%;
      display: none;
      position: absolute;
      background-color: #005affcc;

      a {
        height: 35px;
        font-size: 14px;

        &:hover {
          color: #67c4ff;
        }
      }
    }

    &:hover {
      .menu-title {
        .icon {
          width: 11px;
          height: 6px;
          background: url('@/assets/header/arrow-selected.png') no-repeat;
        }
      }
      .menu-item {
        display: block;
      }
    }

    &.active,
    &:hover {
      .menu-title {
        background-size: 100% 100%;
        background-image: url('@/assets/header/selected.png');
      }
    }
  }
}
</style>
