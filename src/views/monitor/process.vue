<template>
    <layout-cmpt :tableFlag="false">
        <template #title>
            <title-cmpt title="工艺监控"></title-cmpt>
        </template>
        <template #manageBtn>

            <processMange @update="getProcessList"></processMange>
        </template>
        <template #special>
            <div class="processBox" v-if="processList.length" v-loading="loading">
                <div class="imgContainer">
                    <el-image class="processFlow" :src="src"></el-image>

                    <div style="height: 926px; width: 1920px; position: relative">
                        <div>
                            <!-- 循环数字 -->
                            <template v-for="(item, index) in processList[tabIdx].tags">
                                <!-- 标签名 -->
                                <div :key="index">
                                    <div v-if="item.tag_name_style && item.type !== 'valve' && item.type !== 'text' && item.type !== 'ruler'"
                                        class="editable textClass2" :style="item.tag_name_style"
                                        :class="item.tag_name_class ? item.tag_name_class : ''">{{ item.tag_name }}
                                    </div>
                                    <div v-if="item.tag_code_style && item.type !== 'ruler'" class="editable textClass1"
                                        :style="item.tag_code_style"
                                        :class="item.tag_name_class ? item.tag_name_class : ''">{{ item.value }}
                                    </div>
                                    <div v-if="item.tag_unit_style" class="editable textClass1"
                                        :class="item.tag_unit_class ? item.tag_unit_class : ''"
                                        :style="item.tag_unit_style">{{
        item.tag_unit }}</div>
                                    <!-- 开启 停止 -->
                                    <div v-if="item.type == 'text'"
                                        :class="item.tag_name == 'stop' && item.value == 1 ? 'openClass' : 'stopClass'">
                                        <div v-if="item.tag_name == 'remote'" :style="item.tag_name_style"
                                            class="editable">
                                            {{ item.value == 1
        ? '远程' : '就地' }}</div>
                                        <div v-if="item.tag_name == 'stop'" :style="item.tag_name_style"
                                            class="editable">{{
        item.value == 1 ?
            '开启' : '关闭' }}</div>
                                    </div>
                                    <!-- 阀门图片 -->
                                    <div v-if="item.tag_name_style && item.type == 'valve'" :style="item.tag_name_style"
                                        class="editable">
                                        <img :class="item.transform ? 'rotate' : ''" v-if="item.value == 1"
                                            src="/img/on.png" alt="" />
                                        <img :class="item.transform ? 'rotate' : ''" v-else src="/img/off.png" alt="" />
                                    </div>

                                    <!-- 直尺 -->
                                    <div v-if="item.tag_name_style && item.type == 'ruler'" :style="item.tag_name_style"
                                        class="editable">
                                        <div class="ruler">
                                            <div :style="item.tag_code_style" class="scale editable">
                                                <!-- 不同刻度 -->
                                                <template v-if="item.tag_name[0] == 100">
                                                    <div style="width: 5px; background: yellow"
                                                        :style="{ height: `${item.value * (110 / 100)}px` }"></div>
                                                </template>
                                                <template v-else>
                                                    <div style="width: 5px; background: yellow"
                                                        :style="{ height: `${item.value * (110 / 23)}px` }">
                                                    </div>
                                                </template>
                                            </div>
                                            <template v-for="(r, i) in item.tag_name">
                                                <div :key="i">{{ r }}</div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <!-- tab切换 -->
                <div class="tabBox">
                    <div class="tab" v-for="(item, index) in processList" :key="index"
                        :class="tabIdx == index ? 'active' : ''" @click="handleClick(index)">{{ item.title }}</div>
                </div>
            </div>
        </template>
    </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
import processMange from './processMangeCmpt.vue'



export default {
    components: { processMange },
    name: 'Process',

    data() {
        return {
            tabIdx: 0,
            src: '',
            processList: [],
            loading: false,
            first: false,
        }
    },
    computed: {
        acqData() {
            return this.$store.state.acquisition.acqData
        },
        newAcqData() {
            return this.$store.state.acquisition.newData
        },
    },
    watch: {
        'newAcqData.time'() {
            this.updateAcqData()
        },
    },
    mounted() {
        this.first = true
        this.loading = true
        this.getProcessList();
        console.log(this.acqData['device/300223120604/plc']);

    },
    methods: {
        handleClick(index) {
            let item = this.processList[index]
            this.src = item.src
            this.tabIdx = index
        },

        getProcessList() {
            this.processList = []
            apiv2.ProcessMgmt.ViewReq().then((res) => {
                this.loading = false
                if (res.code) {
                    this.$message.error(res.message)
                } else {
                    for (let i = 0; i < res.data.list.length; i++) {
                        const item = res.data.list[i]
                        if (item.diagram_data) {
                            try {
                                let diagramData = JSON.parse(item.diagram_data)
                                if (diagramData.src) {
                                    item.src = diagramData.src
                                } else {
                                    this.$message.warning(item.title + '缺少工艺图')
                                    continue
                                }
                                delete item.diagram_data

                                // 处理元素 会变化的数据
                                item.tags = []
                                if (diagramData.tag && Array.isArray(diagramData.tag)) {
                                    for (let j = 0; j < diagramData.tag.length; j++) {
                                        const tag = diagramData.tag[j]
                                        let data = {
                                            tag_name: tag.tag_name || '',
                                            tag_code: tag.tag_code || '',
                                            tag_unit: tag.tag_unit || '',
                                            tag_name_class: tag.tag_name_class || '',
                                            type: tag.type || '',
                                            transform: tag.transform || '',
                                            tag_name_position: tag.tag_name_position || '',
                                            tag_code_position: tag.tag_code_position || '',
                                            tag_unit_position: tag.tag_unit_position || '',
                                            tag_code_style: null,
                                            tag_unit_style: null,
                                            tag_name_style: null,
                                            value: 0,
                                            tag_unit_class: tag.tag_unit_class || '',


                                        }
                                        if (Array.isArray(data.tag_name_position)) {
                                            data.tag_name_style = { left: `${data.tag_name_position[0]}px`, top: `${data.tag_name_position[1]}px` }
                                        }
                                        if (Array.isArray(data.tag_code_position)) {
                                            data.tag_code_style = { left: `${data.tag_code_position[0]}px`, top: `${data.tag_code_position[1]}px` }
                                        }
                                        if (Array.isArray(data.tag_unit_position)) {
                                            data.tag_unit_style = { left: `${data.tag_unit_position[0]}px`, top: `${data.tag_unit_position[1]}px` }
                                        }
                                        item.tags.push(data)
                                    }
                                    this.getSiteTag(item)
                                }
                                this.processList.push(item)
                            } catch (e) {
                                this.$message.error(item.title + '工艺数据有误')
                            }
                        } else {
                            this.$message.warning(item.title + '缺少工艺数据')
                        }
                    }
                    if (this.processList.length) {
                        let index = 0
                        if (this.first && this.$route.params) {
                            for (let i = 0; i < this.processList.length; i++) {
                                const process = this.processList[i]
                                if (process.site_name == this.$route.params.name) {
                                    index = i
                                    this.$route.params.name = ''
                                }
                            }
                        }
                        this.first = false
                        this.handleClick(index)
                    }
                }
            })
        },
        getSiteTag(item) {
            apiv2.CommonData.SiteTagReq({ site_id: item.site_id }).then((res) => {

                if (res.code) {
                    this.$message.error(res.message)
                } else {
                    for (let i = 0; i < res.data.list.length; i++) {

                        const data = res.data.list[i]
                        let tag = item.tags.find((o) => o.tag_code == data.tag_code)
                        if (tag) {
                            tag.topic = data.topic
                            tag.tag_unit = data.acq_unit
                            if (this.acqData[tag.topic]) {
                                if (this.acqData[tag.topic][tag.tag_code]) {
                                    tag.value = this.acqData[tag.topic][tag.tag_code]
                                }
                            }
                        }
                    }
                }
            })
        },
        updateAcqData() {
            const acqData = this.newAcqData.data

            if (acqData) {
                const process = this.processList[this.tabIdx]
                if (process) {
                    const tag = process.tags.find((o) => o.topic == this.newAcqData.topic && acqData.hasOwnProperty(o.tag_code))
                    if (tag) {
                        tag.value = acqData[tag.tag_code]
                    }
                }

            }
        },
    },
}
</script>
<style lang="less" scoped>
.tabBox {
    width: 100%;
    display: flex;
    justify-content: space-around;
    // margin-bottom: 20px;
    margin-top: -10px;
    position: relative;
    cursor: pointer;
}

.tab {
    width: 306px;
    height: 33px;
    background: #414141;
    box-shadow: 0px 3px 3px 0px rgba(41, 41, 41, 0.53);
    border-radius: 10px;
    font-size: 17px;
    font-family: SourceHanSansSC;
    font-weight: 400;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
}

.active {
    background: #0c2eff;
}

.imgContainer {
    position: fixed;
    left: 0;
    bottom: 0;

    width: 1920px;
    height: auto;

    /deep/ .el-image__error {
        background-color: transparent;
    }
}

.processBox {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    // 管理按钮
    .processManage {
        position: absolute;
        right: 0;
        top: -40px;
    }

    .processFlow {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 1920px;
        height: 926px;
    }
}

.editable {
    position: absolute;
    font-size: 16px;
    color: red;
    font-weight: bold;
    // transform: translateX(-50%) translateY(-50%);
    left: 0;
    bottom: 0;
}

.textClass1 {
    //方框里面
    font-size: 16px;
    color: #fff;
    font-weight: normal;
}

.textClass2 {
    //方框里面
    font-size: 14px;
    color: #fff;
    font-weight: normal;
}

.boldClass {
    font-size: 18px !important;
    font-weight: bold !important;
}

.miniClass {
    font-size: 11px !important;
}

.smallClass {
    font-size: 13px !important;
}

.blackBlodClass {
    font-family: SourceHanSansSC, SourceHanSansSC;
    font-weight: 400;
    font-size: 15px;
    color: #000000;
}

.stopClass {
    font-size: 20px;
    color: #ff0000;
    text-shadow: -1px 0 rgba(255, 255, 255, 1), 0 1px rgba(255, 255, 255, 1), 1px 0 rgba(255, 255, 255, 1), 0 -1px rgba(255, 255, 255, 1);
}

.openClass {
    font-size: 20px;
    color: #7dff66;
    text-shadow: -1px 0 rgba(255, 255, 255, 1), 0 1px rgba(255, 255, 255, 1), 1px 0 rgba(255, 255, 255, 1), 0 -1px rgba(255, 255, 255, 1);
}

.blackClass {
    color: #000;
    font-size: 14px;
}

.rotate {
    transform: rotate(-90deg);
}

.notice {
    color: red;
    font-size: 20px;
    font-weight: bold;
}

.ruler {
    width: 70px;
    height: 122px;
    // border: 1px solid red;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;
    color: #fff;
    font-size: 12px;
}

.scale {
    width: 5px;
    height: 110px;

    display: flex;
    align-items: flex-end;
}
</style>
