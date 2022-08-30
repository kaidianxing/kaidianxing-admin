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
    <div class="order-list-item-box">
        <div class="order-list-item" @click="handleClick">
            <div class="header">
                <div class="group-no">
                    <span>拼团编号: {{ data.team_no }}</span>
                    <kdx-copy-text :text="data.team_no">
                        <Button type="text">复制</Button>
                    </kdx-copy-text>
                </div>
                <div class="status" v-if="data.success == 2">
                    未成团
                </div>
                <div class="status success-color" v-else-if="data.success == 1">
                    已成团
                </div>
                <div class="status brand-color" v-else-if="data.success == 0">
                    待成团
                </div>
            </div>
            <div class="content">
                <div class="title">
                    {{ data.title }}
                </div>
                <div class="info">
                    <div class="info-item">
                        <div class="info-label">
                            拼团进度：
                        </div>
                        <div class="info-content">
                            <progress-bar :current="data.count" :total="data.success_num"></progress-bar>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">
                            拼团类型：
                        </div>
                        <div class="info-type-brand flex" v-if="data.is_ladder == 0">
                            <i class="iconfont icon-yingyong-pintuan-putong2"></i>
                            普通拼团
                        </div>
                        <div class="info-type-warning flex" v-else-if="data.is_ladder == 1">
                            <i class="iconfont icon-yingyong-pintuan-jieti2"></i>
                            阶梯拼团
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">
                            开团时间：
                        </div>
                        <div class="info-content info-time">
                            {{ data.create_time }}
                        </div>
                    </div>
                </div>
                <div class="user-head">
                    <img :src="data.avatar" alt="" @error="replaceImage($event, 'avatar')">
                    <div class="user-mode">
                        团长
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProgressBar from './ProgressBar';

export default {
    name: "ListItem",
    components: {
        ProgressBar
    },
    props: {
        data: {
            type: Object,
            default: () => {
            }
        }
    },
    methods: {
        handleClick() {
            this.$emit('on-click', this.data.id)
        }
    }
};
</script>

<style lang="scss" scoped>
.order-list-item-box {
    padding-right: 20px;
    padding-bottom: 20px;
}

.order-list-item {
    padding: 0 10px;
    background-color: #F7F8FF;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.6s;
    &:hover {
        //background-color: #ffffff;
        transform: translateY(-10px);
        box-shadow: 0 1px 4px rgba(133, 148, 162, 0.2);
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid $border-color;

        .group-no {
            flex: 1;

            > span {
                font-size: 12px;
                line-height: 16px;
                color: $text-second;
                padding-right: 10px;
                display: inline-block;
            }

            .kdx-copy-text {
                height: 16px;
                display: none;

                .ivu-btn {
                    line-height: 16px;
                }
            }
        }

        .status {
            font-size: 16px;
            line-height: 22px;
            font-weight: bold;
            color: $text-third;

            &.info {
                color: $brand-color;
            }

            &.success {
                color: $success-color;
            }
        }

        &:hover {
            .kdx-copy-text {
                display: inline-block;
            }
        }
    }

    .content {
        padding: 16px 20px 16px;
        position: relative;

        .title {
            font-size: 14px;
            line-height: 20px;
            font-weight: bold;
            color: $text-first;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .info-item {
            display: flex;
            align-items: center;
            padding-top: 16px;

            .info-label {
                font-size: 12px;
                line-height: 16px;
                color: $text-second;
            }

            .info-time {
                font-size: 12px;
                line-height: 16px;
                color: $text-second;
            }
            .info-type-brand {
                @include font-12-16
                color: $brand-color;
                i {
                    font-size: 18px;
                    color: $brand-color;
                }
            }
            .info-type-warning {
                @include font-12-16;
                color: $warning-color;
                i {
                    font-size: 18px;
                    color: $warning-color;
                }
            }
        }

        .user-head {
            width: 36px;
            height: 36px;
            position: absolute;
            right: 20px;
            top: 56px;
            border-radius: 100%;

            img {
                width: 100%;
                height: 100%;
                border-radius: 100%;
            }

            .user-mode {
                position: absolute;
                left: 0;
                bottom: -6px;
                color: #ff3c29;
                font-size: 10px;
                line-height: 12px;
                padding: 2px 6px;
                background-color: $warning-light;
                border-radius: 12px;
                width: 36px;
                text-align: center;
                box-sizing: border-box;
            }
        }
    }
}
</style>
