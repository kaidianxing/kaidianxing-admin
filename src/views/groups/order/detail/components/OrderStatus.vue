/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="order-status-box">
        <ul>
            <li class="order-status">
                <div class="title">
                    当前拼团状态
                </div>
                <div class="status">
                    <div class="icon">
                        <span class="iconfont icon-zujian-yingxiaoxinxi-duihao success-color" v-if="data.success == 1"></span>
                        <span class="iconfont icon-pintuan2-1" v-else></span>
                    </div>
                    <div class="name" v-if="data.success == 0">
                        待成团
                    </div>
                    <div class="name success-color" v-if="data.success == 1">
                        已成团
                    </div>
                    <div class="name danger-color" v-if="data.success == 2">
                        未成团
                    </div>
                </div>
                <div class="surplus-time" v-if="data.success == 0 && data.countTime">
                    剩余拼团时间：<span class="danger-color">{{ data.countTime }}</span>
                </div>
                <div class="action-btn" v-if="data.success == 0 && pastGroups">
                    <Button type="primary" class="status-btn" @click="confirmGroups">
                        确认成团
                    </Button>
                </div>
                <div class="explain-text" v-if="data.success == 2">
                    团长有效期内未成团，已付款订单自动退款
                </div>
                <div class="explain-text" v-if="data.success == 1">
                    拼团成功，请及时发货
                </div>
            </li>
            <li class="order-info">
                <div class="title">
                    拼团信息
                </div>
                <div class="item">
                    <div class="label">
                        拼团编号：
                    </div>
                    <div class="content team-no">
                        <span>{{ data.team_no }}</span>
                        <kdx-copy-text :text="data.team_no">
                            <Button type="text">复制</Button>
                        </kdx-copy-text>
                    </div>
                </div>
                <div class="item">
                    <div class="label">
                        开团时间：
                    </div>
                    <div class="content">
                        {{ data.create_time }}
                    </div>
                </div>
                <div class="item group-type">
                    <div class="label">
                        拼团类型：
                    </div>
                    <div class="content flex" v-if="data.is_ladder == 1">
                        <!--阶梯拼团-->
                        <span class="iconfont icon-yingyong-pintuan-jieti2 warning-color"></span>
                        <span class="text warning-color">阶梯拼团
                            <span v-if="data.is_fictitious == 1">(虚拟成团)</span>
                        </span>
                    </div>
                    <div class="content flex" v-else-if="data.is_ladder == 0">
                        <!--普通拼团-->
                        <span class="iconfont icon-yingyong-pintuan-putong2 brand-color"></span>
                        <span class="text brand-color">普通拼团
                            <span v-if="data.is_fictitious == 1">(虚拟成团)</span>
                        </span>
                    </div>
                </div>
            </li>
            <li class="order-progress">
                <div class="title">
                    拼团进度
                </div>
                <div class="item">
                    <div class="label">
                        当前进度：
                    </div>
                    <div class="content">
                        <progress-bar :current="data.count" :total="data.success_num"></progress-bar>
                    </div>
                </div>
                <div class="item">
                    <div class="label">
                        拼团成员：
                    </div>
                    <div class="content user">
                        <template v-for="(item, index) in userList">
                            <kdx-hint-tooltip :key="item.id" v-if="index < 5">
                                <template #header>
                                    <div class="header-list" :key="item.id" >
                                        <img :src="$media(item.avatar)" alt="" @error="replaceImage($event, 'avatar')">
                                    </div>
                                </template>
                                <div class="text">
                                   {{item.order_no ? item.nickname : '虚拟'}}
                                </div>
                            </kdx-hint-tooltip>
                        </template>
                        <div class="all" v-if="userList.length > 5">
                            <span>...</span>
                            <Button type="text" @click="readAll">查看全部</Button>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <group-user ref="group_user" :data="userList"></group-user>
    </div>
</template>

<script>
import ProgressBar from "../../list/components/ProgressBar";
import GroupUser from "../../detail/components/GroupUser";
import {mapGetters} from "vuex";

export default {
    name: "OrderStatus",
    components: {
        ProgressBar,
        GroupUser
    },
    props: {
        data: {
            type: Object,
            default: () => {
            }
        },
        userList: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        ...mapGetters('config', ['getAppPermMap']),
        pastGroups() {
            let groups = this.$store?.state?.config?.apps?.groups;
            // 显示拼团  有权限、在有效期
            return this.getAppPermMap('groups') && !(groups?.is_forever != 1 && groups?.about_expire == 1 && groups?.is_free != 1 && groups?.shop_app_status == 0);
        },
    },
    methods: {
        confirmGroups() {
            this.$emit('on-change')
        },
        readAll() {
            this.$refs['group_user'].setValue();
        }
    }
};
</script>

<style lang="scss" scoped>
.order-status-box {
    padding-top: 30px;
    padding-bottom: 75px;

    ul {
        display: flex;
        align-items: stretch;

        li {
            border-right: 1px solid $border-color;

            &:last-child {
                border-right: 0;
            }

            .title {
                padding-left: 20px;
                padding-bottom: 30px;
                @include font-16-22-bold;
                color: $text-first;
            }

            .item {
                display: flex;
                align-items: center;
                @include font-12-16;
                color: $text-first;
                padding-bottom: 20px;

                &:last-child {
                    padding-bottom: 0;
                }

                .label {
                    width: 100px;
                    flex-shrink: 0;
                    text-align: right;
                }

                .content {
                    flex: 1;
                }
            }
        }

        .order-status {
            padding-left: 60px;
            width: 30%;
            flex-shrink: 0;
            box-sizing: border-box;

            .title {
                padding-left: 0;
            }

            .status {
                display: flex;
                align-items: center;

                .icon {
                    .iconfont {
                        font-size: 32px;
                        color: #ff6543;
                    }
                }

                .name {
                    font-size: 24px;
                    line-height: 30px;
                    font-weight: bold;
                    color: $text-first;
                    padding-left: 4px;
                }
            }

            .surplus-time {
                @include font-14-20;
                color: #000000;
                padding-top: 20px;
                padding-bottom: 30px;
            }
            .explain-text {
                padding-top: 20px;
                @include font-12-16;
                color: $text-third;
            }
        }

        .order-info {
            width: 30%;
            flex-shrink: 0;
            box-sizing: border-box;
            .group-type {
                .iconfont {
                    font-size: 18px;
                    &.warning-color {
                        color: $warning-color;
                    }
                    &.brand-color {
                        color: $brand-color;
                    }
                }
                .text {
                    padding-left: 2px;
                }
            }
            .team-no {
                .kdx-copy-text {
                    line-height: 14px;
                }
                .ivu-btn {
                    font-size: 12px;
                    margin-left: 10px;
                    line-height: 14px;
                    display: none;
                }
                &:hover {
                    .ivu-btn {
                        display: block;
                    }
                }
            }
        }

        .order-progress {
            width: 40%;
            flex-shrink: 0;
            box-sizing: border-box;
            .user {
                display: flex;
                align-items: center;
            }

            .header-list {
                display: flex;

                img {
                    width: 24px;
                    height: 24px;
                    border-radius: 100%;
                    margin-right: 4px;
                }
            }

            .all {
                .ivu-btn {
                    margin-left: 4px;
                }
            }
        }
    }
}
</style>
