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
    <kdx-modal-frame :value="value" title="上级分销关系变更记录" width="744" okText="关闭" :isCancel="false" @on-cancel="handleCancel" @on-ok="handleCancel">
        <div class="relation-log">
            <!-- 固定表头 -->
            <div class="head flex">
                <p >分销关系变更时间</p>
                <p >上级分销商</p>
                <p>变更原因</p>
            </div>
            <div class="body-content" v-if="list.length">
                <div class="item flex" v-for="item in list" :key="item.id">
                    <div class="time flex">
                        <div class="line"></div>
                        <div>{{item.created_at}}</div>
                    </div>

                    <div class="vip-info">
                        <img :src="$utils.media(item.parent_avatar)" alt="" @error="replaceImage($event, 'avatar')"/>
                        <p class="name">
                            <span style="margin-bottom:4px;">{{ item.parent_nickname||'-' }}</span>
                            <i class="iconfont" :class="{
                                        'icon-H': item.parent_source === '10',
                                        'icon-weixin': item.parent_source === '20',
                                        'icon-weixinxiaochengxu': item.parent_source === '21'}"
                               v-if="new Set(['10', '20', '21']).has(item.parent_source)">
                            </i>
                            <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2" v-else-if="item.parent_source === '30'"></kdx-svg-icon>
                            <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban" v-else-if="item.parent_source === '32'"></kdx-svg-icon>
                            <kdx-svg-icon class="iconfont" type="icon-douyin" v-else-if="item.parent_source === '31'"></kdx-svg-icon>
                            <span style="color:#12aa9c;font-size:16px" class="iconfont icon-PCduan" v-else-if="item.parent_source === '70'"></span>
                        </p>
                    </div>
                    <div class="line-hide">{{item.relation_reason}}</div>
                </div>
            </div>
            <div class="no-data" v-else>
                暂无上级分销商关系信息
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "RelationLog",
        components: {},
        props: {
            value: {
                type: Boolean,
                default: false
            },
            memberId: {
                type: [String, Number],
                default: ''
            }
        },
        data() {
            return {
                list: [],
                columns: [
                    {
                        title: '分销关系变更时间',
                        key: 'created_at',
                    },
                    {
                        title: '上级分销商',
                        slot: 'parent_nickname',
                    },
                    {
                        title: '变更原因',
                        key: 'relation_reason',
                    },
                ]
            }
        },
        computed: {},
        watch: {
            memberId(oldVal, val) {
                if (oldVal !== val) {
                    this.list = [];
                    this.getList()
                }
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            handleCancel() {
                this.$emit('input', false)
            },
            handleReachBottom() {},
            getList() {
                let params = {
                    id: this.memberId,
                };
                this.$api.memberApi.getRelationLog(params).then(res => {
                    if (res.error === 0) {
                        this.list = res.list;
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .relation-log {
        padding: 20px;
        height: 368px;
        width: 100%;
        .head {
            padding-left: 20px;
            height: 40px;
            font-weight: 600;
            align-items: center;
            background-color: $background-color;
            p {
                color: #262B30;
                flex: 2;
                &:last-child {
                    flex: 1;
                }
            }
        }
        .body-content {
            height: 288px;
            overflow-y: scroll;
            .item {
                padding-left: 20px;
                height: 72px;
                align-items: center;
                >div {
                    flex: 2;
                    color: #262B30;
                    //width: 270px;
                    &:last-child {
                        flex: 1;
                    }
                }
                .time {
                    align-items: center;
                    height: 100%;
                    .line {
                        position: relative;
                        margin-right: 9px;
                        width: 5px;
                        height: 5px;
                        background-color: $border-color;
                        border-radius: 50%;
                        &:before {
                            content: '';
                            position: absolute;
                            left: 2px;
                            bottom: 0;
                            width: 1px;
                            background-color: $border-color;
                            height: 72px;
                        }
                    }
                }
                &:first-child {
                    .time .line {
                        background-color: $success-color;
                        &:before {
                            content: '';
                            position: absolute;
                            left: 0;
                            bottom: 0;
                            width: 0;
                            height: 0;
                            z-index: 0;
                        }
                    }
                }
            }
        }

        .no-data {
            width: 100%;
            text-align: center;
            padding-top: 136px;
            color: $text-zhushi;
        }
        .vip-info {
            display: flex;
            flex-wrap: nowrap;
            img {
                width: 44px;
                height: 44px;
                border: 1px solid #e9edef;
                box-sizing: border-box;
                border-radius: 50%;
                margin-right: 10px;
            }
            .name {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .iconfont {
                font-size: 20px;
                width: 20px;
                height: 20px;
                line-height: 20px;
                text-align: center;
            }
            .icon-weixin {
                color: $success-color;
            }
            .icon-weixinxiaochengxu {
                color: #677de0;
            }
            .icon-toutiaoxiaochengxu {
                color: #239bff;
            }

            .icon-zhifubaoxiaochengxu {
                color: #2094e7;
            }

            .icon-baiduxiaochengxu {
                color: #306cff;
            }

            .icon-H {
                color: #ff6004;
            }
        }
    }
</style>