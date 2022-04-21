/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息
 */
<template>
    <div class="is-distributor">
        <kdx-form-title content="分销信息" class="form-title">
            <!-- become_condition 成为分销商条件 0: '无条件', 1: '购买商品',2: '消费金额',3: '支付订单数量',4: '申请' -->
            <!-- 申请中 -->
            <div
                    class="btn-box flex"
                    style="float:right;transform:translate(0,-5px)"
                    v-if="info.agent_info && info.agent_info.status == 0"
            >
                <Button
                        style="margin-right: 10px;"
                        :loading="loading"
                        :disabled="noManagePerm"
                        @click="handleOperate(1)"
                >
                    审核通过
                </Button>
                <Button
                        :loading="loading"
                        :disabled="noManagePerm"
                        @click="handleOperate(-1)"
                >
                    拒绝通过
                </Button>
            </div>
            <!-- 是分销商 -->
            <Button
                    style="float:right;transform:translate(0,-5px)"
                    :loading="loading"
                    :disabled="noManagePerm"
                    @click="cancel"
                    v-else-if="
                    info.agent_info &&
                        info.agent_info.status == 1 &&
                        settings.become_condition !== 0
                "
            >
                取消分销商资格
            </Button>
            <!-- 不是分销商 -->
            <Button
                    style="float:right;transform:translate(0,-5px)"
                    :loading="loading"
                    :disabled="noManagePerm"
                    @click="handleSet"
                    v-else-if="info.agent_info && !new Set(['0', '1']).has(info.agent_info.status)"
            >
                设为分销商
            </Button>
        </kdx-form-title>
        <ul class="info-box">
            <li class="info info1">
                <div class="user">
                    
                    <div class="user-information">
                        <p class="name">用户信息</p>
                        <Form :label-width="70">
                            <FormItem label="昵称：">
                                {{ basicInfo.member.nickname || '-' }}
                            </FormItem>
                            <FormItem label="真实姓名：">
                                {{ realName.name || '-' }}
                            </FormItem>
                            <FormItem label="联系电话：">
                                <div class="telephone-box">
                                    <i
                                            class="telephone-icon icon-dianhua iconfont"
                                    ></i>
                                    <span class="telephone">
                                        {{ realName.mobile || basicInfo.member.mobile || '-' }}
                                    </span>
                                </div>
                            </FormItem>
                            <FormItem label="会员等级：">
                                <span
                                        v-if="basicInfo.member.is_default_level"
                                        style="vertical-align: middle; margin-right: 5px;"
                                >
                                    {{ basicInfo.member.level_name }}
                                </span>
                                <span class="vip-grade" v-else>
                                    <i
                                            class="icon-huangguan icon iconfont"
                                            style="color:#EAD4A9"
                                    ></i>
                                    {{ basicInfo.member.level_name }}
                                </span>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </li>
            <li class="info info2">
                <p class="name">分销商信息</p>
                <Form :label-width="120">
                    <FormItem label="分销等级：">
                        <div class="flex-row level">
                            <!-- 不是分销商 -->
                            <span
                                    v-if="
                                    info.agent_info &&
                                        info.agent_info.status != 1
                                "
                            >
                                非分销商
                            </span>
                            <span
                                    class="level-name"
                                    v-else-if="
                                    info.agent_info &&
                                        info.agent_info.status == 1 &&
                                        info.agent_info.level_name
                                "
                            >
                                <i class="icon-fenxiao iconfont level-icon"></i>
                                {{ info.agent_info.level_name }}
                            </span>
                            <span
                                    style="display:block;margin-right:5px;"
                                    v-else
                            >
                                -
                            </span>
                            <Button
                                    type="text"
                                    :disabled="noManagePerm"
                                    class="btn"
                                    @click="selectLevel"
                                    v-if="
                                    info.agent_info &&
                                        info.agent_info.status == 1
                                "
                            >
                                修改
                            </Button>
                        </div>
                    </FormItem>
                    <FormItem label="上级分销商：" class="upline-formItem">
                        <div class="flex-row upline">
                            <img
                                    class="avatar"
                                    :src="$media(info.parent_info.avatar)"
                                    @error="replaceImage($event, 'avatar')"
                                    alt=""
                                    v-if="info.parent_info"
                            />
                            <img
                                    class="avatar"
                                    :src="$media('')"
                                    @error="replaceImage($event, 'avatar')"
                                    alt=""
                                    v-else
                            />
                            <span class="upline-name" v-if="info.parent_info">
                                {{ info.parent_info.nickname || '-' }}
                            </span>
                            <span class="upline-name" v-else>-</span>
                            <Button
                                    type="text"
                                    :disabled="noManagePerm"
                                    class="btn"
                                    @click="selectAgent"
                            >
                                修改
                            </Button>
                            <!-- 非分销 -->
                            <Button
                                    type="text"
                                    :disabled="noManagePerm"
                                    class="btn2"
                                    v-if="info.agent_info &&
                                    info.agent_info.status != 1 && info.parent_info"
                                    @click="unbindAgent()"
                            >
                                解绑上级
                            </Button>
                            <!-- 关系变更记录 -->
                            <Button class="btn2" type="text" @click="viewRelationLog">关系变更记录</Button>
                        </div>
                    </FormItem>
                    <FormItem
                            label="邀请人："
                            v-if="info.agent_info && info.agent_info.status == 0"
                    >
                        {{
                        (info.inviter_info
                        ? info.inviter_info.nickname
                        : '') || '总店'
                        }}
                    </FormItem>
                    <FormItem
                            label="姓名："
                            v-if="info.agent_info && info.agent_info.status == 0"
                    >
                        {{
                        info.agent_info.apply_data
                        ? JSON.parse(info.agent_info.apply_data).name
                        : basicInfo.member.realname || '-'
                        }}
                    </FormItem>
                    <FormItem
                            label="手机号码："
                            v-if="info.agent_info && info.agent_info.status == 0"
                    >
                        {{
                        info.agent_info.apply_data
                        ? JSON.parse(info.agent_info.apply_data).mobile
                        : basicInfo.member.mobile || '-'
                        }}
                    </FormItem>
                    <FormItem
                            label="成为分销商时间："
                            v-if="info.agent_info && info.agent_info.status == 1"
                    >
                        <div class="flex-row create-time">
                            <span>{{ info.agent_info.become_time || '-' }}</span>
                        </div>
                    </FormItem>
                    <FormItem
                            v-if="info.agent_info && info.agent_info.status == 1"
                    >
                        <p slot="label">
                            自动升级<kdx-hint-tooltip>如果强制不自动升级，满足任何条件，此分销商的级别也不会改变</kdx-hint-tooltip>：
                        </p>
                        <MyRadioGroup
                                :value="info.agent_info.is_auto_upgrade"
                                :items="upgrade"
                                :disabled="noManagePerm"
                                @change="setAutoUpgrade"
                                style="transform:translate(0,-1px)"
                        ></MyRadioGroup>
                    </FormItem>
                </Form>
            </li>
            <li
                    class="info info3"
                    v-if="info.agent_info && info.agent_info.status == 1"
            >
                <p class="name">用户信息</p>
                <Form :label-width="70">
                    <FormItem label="全部下级:">
                        <p>
                            <router-link
                                    class="num"
                                    target="_blank"
                                    :to="
                                    `/commission/relation?id=${basicInfo.member.id}`
                                "
                            >
                                {{ info.chile_count.all }}
                            </router-link>
                            人 (分销商：{{ info.chile_count.all_agent }}人）
                        </p>
                    </FormItem>
                    <FormItem label="一级:">
                        <p>
                            <router-link
                                    class="num"
                                    target="_blank"
                                    :to="
                                    `/commission/relation?id=${basicInfo.member.id}`
                                "
                            >
                                {{ info.chile_count.level1_all }}
                            </router-link>
                            人 (分销商：{{ info.chile_count.level1_agent }}人）
                        </p>
                    </FormItem>
                    <FormItem label="二级:">
                        <p>
                            <router-link
                                    class="num"
                                    target="_blank"
                                    :to="
                                    `/commission/relation?id=${basicInfo.member.id}`
                                "
                            >
                                {{ info.chile_count.level2_all }}
                            </router-link>
                            人 (分销商：{{ info.chile_count.level2_agent }}人）
                        </p>
                    </FormItem>
                    <FormItem label="三级:">
                        <p>
                            <router-link
                                    class="num"
                                    target="_blank"
                                    :to="
                                    `/commission/relation?id=${basicInfo.member.id}`
                                "
                            >
                                {{ info.chile_count.level3_all }}
                            </router-link>
                            人 (分销商：{{ info.chile_count.level3_agent }}人）
                        </p>
                    </FormItem>
                </Form>
            </li>
        </ul>
        <!--表单信息-->
        <form-info v-if="form.content" :data="form.content"></form-info>
        <kdx-form-title
                content="佣金信息"
                v-if="info.agent_info && info.agent_info.status == 1"
        ></kdx-form-title>
        <Row
                class="deal-information"
                v-if="info.agent_info && info.agent_info.status == 1"
        >
            <i-col :xxl="6" :xl="12" :lg="12" :md="12">
                <div class="deal-information-content">
                    <div class="left-icon">
                        <i class="iconfont icon-jinqian1"></i>
                    </div>
                    <div class="right-content">
                        <p class="title">累计佣金</p>
                        <div>
                            <span class="number">
                                ￥{{ info.agent_info.commission_total }}
                            </span>
                        </div>
                    </div>
                </div>
            </i-col>
            <i-col :xxl="6" :xl="12" :lg="12" :md="12">
                <div class="deal-information-content balance-color">
                    <div class="left-icon">
                        <i class="iconfont icon-yongjin"></i>
                    </div>
                    <div class="right-content">
                        <p class="title">已提现佣金</p>
                        <div>
                            <span class="number">
                                ￥{{ info.agent_info.commission_pay }}
                            </span>
                        </div>
                    </div>
                </div>
            </i-col>
            <i-col :xxl="6" :xl="12" :lg="12" :md="12">
                <div class="deal-information-content normal-color">
                    <div class="left-icon">
                        <i class="iconfont icon-fenxiao-leijiyongjin"></i>
                    </div>
                    <div class="right-content">
                        <p class="title">待入账佣金</p>
                        <div>
                            <span class="number">
                                ￥{{ info.agent_info.wait_commission }}
                            </span>
                        </div>
                    </div>
                </div>
            </i-col>
            <i-col :xxl="6" :xl="12" :lg="12" :md="12">
                <div class="deal-information-content">
                    <div class="left-icon">
                        <i class="iconfont icon-dingdan1"></i>
                    </div>
                    <div class="right-content">
                        <p class="title">分销订单</p>
                        <div>
                            <span class="number brand-color">
                                {{ info.agent_info.commission_order }}
                            </span>
                            <Button
                                    type="text"
                                    class="look-btn"
                                    @click="goCommision"
                            >
                                查看
                            </Button>
                        </div>
                    </div>
                </div>
            </i-col>
        </Row>
        <level-selector
                :current="currentLevel"
                ref="levelSelector"
                @change="getLevel"
                v-if="info.agent_info && info.agent_info.status == 1"
        ></level-selector>
        <agent-selector
            :current="curAgent"
            :basicInfo="basicInfo"
            :info="info"
            :close="true"
            ref="agentSelector"
            @change="getAgent"
        ></agent-selector>

        <relation-log v-model="relationModal" :member-id="basicInfo.member.id"></relation-log>

    </div>
</template>

<script>
    import MyRadioGroup from '@/components/decorate/RadioGroup'
    import LevelSelector from '@/components/selector/DistributorLevelSelector'
    import AgentSelector from '@/components/selector/DistributorSelector'
    import FormInfo from '@/components/form/FormInfo';
    import RelationLog from "./RelationLog";
    import { mapState } from 'vuex'
    export default {
        components: {
            MyRadioGroup,
            LevelSelector,
            AgentSelector,
            FormInfo,
            RelationLog
        },
        props: {
            basicInfo: {
                type: Object,
                default: () => ({}),
            },
            info: {
                type: Object,
                default: () => ({}),
            },
            form: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                upgrade: [
                    {
                        label: '是',
                        id: 1,
                    },
                    {
                        label: '否',
                        id: 0,
                    },
                ],
                showMore: false,
                loading: false,
                level: {},
                relationModal: false,
            }
        },
        computed: {
            ...mapState('commission/settings', ['settings']),
            curAgent() {
                return {
                    id: this.info?.parent_info?.id || '0',
                    member_id: this.info?.parent_info?.id || '0',
                }
            },
            noManagePerm() {
                //管理权限
                return !this.$getPermMap('member.list.manage')
            },
            currentLevel() {
                // 分销等级数据结构变更
                return {
                    id: this.info.agent_info.level_id,
                }
            },
            // 真实姓名
            realName() {
                let result = {
                    name: '',
                    mobile: ''
                };
                if (this.info?.agent_info?.apply_data) {
                    result = JSON.parse(this.info?.agent_info?.apply_data)
                }
                return result
            }
        },
        methods: {
            // 设为分销商
            handleSet() {
                if (this.settings.commission_level === 0) {
                    // 当分销层级关闭时，手动不能设置成为分销商
                    this.open()
                } else {
                    this.set()
                }
            },
            // 提示开启分销层级
            open() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '分销应用暂未开启，请开启后进行设置',
                    cancelText: '取消',
                    okText: '立即开启',
                    onOk: () => {
                        this.$router.push({
                            path: '/commission/settings',
                        })
                    },
                })
            },
            // 设为分销商
            set() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认设为分销商?',
                    cancelText: '取消',
                    onOk: () => {
                        this.loading = true
                        this.$api.commissionApi
                            .manualSetCommission({
                                id: this.basicInfo.member.id,
                            })
                            .then((res) => {
                                if (res.error == 0) {
                                    this.$Message.success('设置成功')
                                    this.$emit('reload')
                                }
                            })
                            .finally(() => {
                                this.loading = false
                            })
                    },
                })
            },
            // 通过审核、拒绝通过
            handleOperate(status) {
                this.loading = true
                this.$api.commissionApi
                    .changeStatus({
                        member_id: this.basicInfo.member.id,
                        status,
                    })
                    .then((res) => {
                        if (res.error == 0) {
                            this.$Message.success('设置成功')
                            this.$emit('reload')
                        }
                    })
                    .finally(() => {
                        this.loading = false
                    })
            },
            setAutoUpgrade(val) {
                this.$api.commissionApi
                    .autoUpgrade({
                        is_auto_upgrade: val,
                        member_id: this.basicInfo.member.id,
                    })
                    .then((res) => {
                        if (res.error == 0) {
                            this.$emit('reload')
                            this.$Message.success('设置成功')
                        }
                    })
            },
            selectAgent() {
                this.$refs.agentSelector.setValue()
            },
            getAgent(val) {
                this.$api.commissionApi
                    .changeAgent({
                        agent_id: val.member_id,
                        member_id: this.basicInfo.member.id,
                    })
                    .then((res) => {
                        if (res.error === 0) {
                            // 关闭选择器
                            this.$refs.agentSelector.setValue(false)
                            this.$emit('reload')
                            this.$Message.success('设置成功')
                        } else if (res.error !== 331116) {
                            // 关闭选择器
                            this.$refs.agentSelector.setValue(false)
                        }
                    })
            },
            getLevel(val) {
                this.$api.commissionApi
                    .changeLevel({
                        level_id: val.id,
                        member_id: this.basicInfo.member.id,
                    })
                    .then((res) => {
                        if (res.error == 0) {
                            this.$emit('reload')
                            this.$Message.success('设置成功')
                        }
                    })
            },
            selectLevel() {
                this.$refs.levelSelector.setValue()
            },
            cancel() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认取消分销商资格?',
                    cancelText: '取消',
                    onOk: () => {
                        this.loading = true
                        this.$api.commissionApi
                            .changeStatus({
                                member_id: this.basicInfo.member.id,
                                status: -2,
                            })
                            .then((res) => {
                                if (res.error == 0) {
                                    this.$Message.success('设置成功')
                                    this.$emit('reload')
                                }
                            })
                            .finally(() => {
                                this.loading = false
                            })
                    },
                })
            },
            goCommision() {
                this.$utils.openNewWindowPage('/commission/order/list', {
                    member_id: this.basicInfo.member.id,
                    member_type: '1',
                })
            },
            /*解绑上级分销商*/
            unbindAgent() {
                this.$Modal.confirm({
                    title: '确认解绑',
                    content: '解绑后当前会员可被重新绑定分销关系',
                    cancelText: '取消',
                    onOk: () => {
                        this.loading = true
                        this.$api.commissionApi
                            .unbindAgent({
                                member_id: this.basicInfo.member.id,
                                agent_id: 0
                            })
                            .then((res) => {
                                if (res.error == 0) {
                                    this.$Message.success('解绑成功')
                                    this.$emit('reload')
                                }
                            })
                            .finally(() => {
                                this.loading = false
                            })
                    },
                })
            },
            viewRelationLog() {
                this.relationModal = true
            }
        },
    }
</script>

<style lang="scss" scoped>
    .is-distributor {
        width: 100%;
        /deep/ .form-title {
        }
        .info-box {
            display: flex;
            flex-wrap: nowrap;
            padding-left:53px;
            .info {
                flex: 1;
            }
            .info1 {
                flex-grow: 9;
            }
            .info2 {
                flex-grow: 8;
                .name {
                    padding-left: 35px;
                }
                .level-name {
                    background: linear-gradient(
                                    136.55deg,
                                    #ff6f29 0%,
                                    #fb7e0b 94.51%
                    ),
                    #ff9900;
                    font-family: PingFang SC;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 12px;
                    line-height: 16px;
                    padding: 1px 3px;
                    color: #fff;
                    border-radius: 2px;
                    margin-right: 10px;
                }
                .icon-icon-test {
                    margin-left: 2px;
                    cursor: pointer;
                }
                /deep/ .upline-formItem {
                    .ivu-form-item-label {
                        margin-top: 4px;
                    }
                    span {
                        padding-top: 5px;
                    }
                    .avatar {
                        width: 30px;
                        height: 30px;
                        border: 1px solid #e9edef;
                        border-radius: 50%;
                        margin-right: 10px;
                    }
                    .upline-name {
                        font-size: 14px;
                        margin-right: 10px;
                        color: #262b30;
                    }
                    .btn {
                        font-size: 14px;
                        /*padding-top: 6px;*/
                    }
                    .btn2 {
                        margin-left: 10px;
                        font-size: 14px;
                        line-height: 19px;
                    }
                }
                .level-icon {
                    font-size: 14px;
                    width: 14px;
                    height: 14px;
                    color: #fff;
                    margin-top: 1px;
                    vertical-align: -1px;
                    display: inline-block;
                }
                .btn {
                    /*font-family: PingFang SC;*/
                    /*font-style: normal;*/
                    /*font-weight: normal;*/
                    font-size: 12px;
                    line-height: 19px;

                    /* brand/def */
                    /*color: $brand-color;*/
                    /*cursor: pointer;*/
                }
            }
            .info3 {
                flex-grow: 7;
                .num {
                    color: $brand-color;
                }
            }
            .info {
                /deep/ .ivu-form-item {
                    margin-bottom: 20px;
                    .ivu-form-item-label {
                        padding: 0;
                    }
                    .ivu-form-item-content {
                        line-height: 20px;
                        padding-left: 6px;
                    }
                }
                .flex-row {
                    display: flex;
                    flex-wrap: nowrap;
                }
                .name {
                    @include font-14-20-bold;
                    color: $text-first;
                    padding-bottom: 20px;
                }
                .user {
                    display: flex;
                    flex-wrap: nowrap;
                    > .user-image {
                        margin-left: 40px;
                        margin-right: 20px;
                        width: 90px;
                        height: 90px;
                        border: 4px solid #ffffff;
                        border-radius: 100%;
                        box-shadow: 0 4px 10px rgba(0, 82, 169, 0.2);
                        display: inherit;
                        box-sizing: border-box;
                        flex-shrink: 0;
                        overflow: hidden;
                        > img {
                            width: 84px;
                            height: 84px;
                            border-radius: 100%;
                        }
                    }
                    > .user-information {
                        width: 100%;
                        .telephone-box {
                            display: flex;
                            flex-wrap: nowrap;
                        }
                        .telephone-icon {
                            color: #19be6b;
                            width: 20px;
                            height: 20px;
                            font-size: 20px;
                            line-height: 20px;
                            text-align: center;
                            margin-right: 3px;
                            transform: translate(0, 1px);
                        }
                        .telephone {
                            padding-right: 10px;
                        }
                        .vip-grade {
                            background: linear-gradient(
                                            90deg,
                                            #4a505c 0%,
                                            #45525f 100%
                            ),
                            #ff9900;
                            border-radius: 2px;
                            padding: 2px 3px;
                            color: #ffffff;
                            font-weight: 100;
                            @include font-12-16-bold;
                            margin: 10px;
                            > .icon {
                                color: linear-gradient(
                                                180deg,
                                                #f6f2e8 0%,
                                                #ebd9c1 100%
                                ),
                                #e6dab1;
                                padding-right: 2px;
                            }
                        }
                        .icon-huangguan {
                            width: 14px;
                            height: 14px;
                            text-align: center;
                            line-height: 14px;
                            font-size: 12px;
                            margin-right: 1px;
                        }
                        .tag-text {
                            color: #e18110;
                            background: #fff9e6;
                        }
                    }
                }
            }
        }
        .deal-information {
            margin-right: -20px;
            > .ivu-col {
                padding-right: 20px;
                padding-bottom: 20px;
                > .deal-information-content {
                    border: 1px solid $border-color;
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                    width: 100%;
                    padding: 30px 0 30px 30px;
                    > .left-icon {
                        width: 74px;
                        height: 74px;
                        background-color: $brand-light;
                        color: #f0faff;
                        margin-right: 20px;
                        border-radius: 100%;
                        text-align: center;
                        line-height: 74px;
                        > .iconfont {
                            font-size: 50px;
                            line-height: 74px;
                            color: $brand-color;
                        }
                    }
                    > .right-content {
                        > .title {
                            @include font-14-20;
                        }
                        .number {
                            color: #262b30;
                            font-size: 24px;
                            line-height: 34px;
                            font-weight: bold;
                            padding-right: 10px;
                            margin-top: 10px;
                            display: inline-block;
                        }

                        .look-btn {
                            margin-left: 10px;
                            font-size: 12px;
                            line-height: 19px;
                            color: $brand-color;
                        }
                    }
                }
                > .balance-color {
                    > .left-icon {
                        background-color: $success-light;
                        > .iconfont {
                            color: $success-color;
                        }
                    }
                    .number {
                        color: $warning-color;
                    }
                }
                > .normal-color {
                    > .left-icon {
                        background-color: $warning-light;
                        > .iconfont {
                            color: $warning-color;
                        }
                    }
                    .number {
                        color: $text-second;
                    }
                }
            }
        }
    }
</style>
