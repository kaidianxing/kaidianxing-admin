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
    <div class="content">
        <div class="content-box">
            <div class="title" @click="upgradeInit">
                <kdx-form-title :hasMargin="false">系统升级</kdx-form-title>
            </div>
            <div class="isnew">
                <div class="version-info">
                    <div class="version-info-tips" v-if="versionInfo">
                        当前为最新版本
                    </div>
                    <div class="version-info-code">
                        {{ versionInfo.version }}
                    </div>
                    <div class="version-info-time">
                        发行版本号 {{ versionInfo.release }}
                    </div>
                </div>

                <div class="upgrade-status">
                    <div class="item">
                        <div
                            class="text"
                            style="font-size: 12px;color:#939799;line-height:16px;"
                        >
                            升级请下载最新代码
                        </div>
                    </div>
                </div>

                <div class="btn-box" >
                    <div class="operate-btn" @click="startUpgrade1">下载后端代码</div>
                    <div class="operate-btn" @click="startUpgrade2">下载前端代码</div>
                </div>
            </div>

            <slot></slot>
        </div>
    </div>
</template>
<script>

export default {

    data() {
        return {
            versionInfo: {
                version: "",
                release:''
            }, // 版本信息
        }
    },
    created() {
        this.upgradeInit()
    },
    methods: {
        // upgradeInit 获取基本的版本信息
        upgradeInit() {
            this.$api.systemApi.getUpgradeInfo().then(res => {
                if (res.error === 0) {
                    this.versionInfo = res
                }
            })
        },
        startUpgrade1() {
            window.open("https://gitee.com/kaidianxing/kaidianxing")
        },
        startUpgrade2() {
            window.open("https://gitee.com/kaidianxing/kaidianxing-admin")
        },

    }
}
</script>
<style lang="scss" scoped>
.content {
    width: 100%;
    margin: 20px auto;

    .content-box{
        padding: 20px;
        background-color: #ffffff;
    }
    .title {
        margin-bottom: 20px;
    }

    .isnew {
        padding: 40px;
        background: #fafdff;
        border: 1px solid #e9edef;
        border-radius: 2px;

        .version-info {
            border-bottom: 1px solid #e9edef;
            padding-bottom: 20px;
            margin-bottom: 20px;

            .version-info-tips {
                font-weight: bold;
                font-size: 14px;
                line-height: 20px;
                color: #19be6b;
                margin-bottom: 20px;
            }

            .version-info-code {
                font-weight: bold;
                font-size: 16px;
                line-height: 22px;
                color: $text-first;
                margin-bottom: 10px;
            }

            .version-info-time {
                font-size: 12px;
                line-height: 16px;
                color: #939799;
            }
        }

        .update-info {
            border-bottom: 1px solid #e9edef;
            padding-bottom: 20px;

            ul {
                li {
                    display: flex;
                    margin-top: 20px;

                    .left {
                        border-radius: 2px;
                        width: 40px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 10px;
                        flex-shrink: 0;

                        &.add {
                            color: #197be1;
                            background: $brand-light;
                        }

                        &.optimization {
                            color: #19be6b;
                            background: #edfff3;
                        }

                        &.repair {
                            color: #ff9900;
                            background: #fff9e6;
                        }
                    }

                    .right {
                        flex: 1;
                        font-size: 14px;
                        line-height: 20px;
                        color: $text-first;
                    }
                }
            }
        }

        .upgrade-status {
            padding-top: 20px;

            .item {
                display: flex;
                align-items: center;

                .icon {
                    font-size: 14px;
                    padding-right: 4px;

                    &.icon-tishi-prompt {
                        color: $warning-color;
                    }

                    &.icon-xitong-sousuo {
                        color: $success-color;
                    }

                    &.icon-xitong-sousuo.danger {
                        color: $danger-color;
                    }

                    &.icon-yes {
                        color: $success-color;
                    }

                    &.icon-del {
                        color: $danger-color;
                    }
                }

                .text {
                    font-size: 14px;
                    line-height: 20px;
                    color: $text-first;

                    .warning {
                        color: $warning-color;
                    }

                    .success {
                        color: $success-color;
                    }

                    .danger {
                        color: $danger-color;
                    }

                    &.danger {
                        color: $danger-color;
                    }
                }

                .refres {
                    //text-decoration: underline;
                    font-size: 12px;
                    line-height: 17px;
                    color: $brand-color;
                    cursor: pointer;
                    margin-right: 20px;
                    margin-left: 10px;
                }
            }
        }

        .btn-box {
            display: flex;
            align-items: center;
            margin-top: 20px;
            padding-bottom: 20px;
            //border-bottom: 1px solid #e9edef;
            .operate-btn {
                //text-decoration: underline;
                font-size: 12px;
                line-height: 17px;
                color: #ffffff;
                cursor: pointer;
                margin-right: 20px;
                background-color: $brand-color;
                padding: 6px 16px;
                border-radius: 2px;

                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
}

.circular {
    height: 14px;
    width: 14px;
    animation: loading-rotate 2s linear infinite;

    .path {
        animation: loading-dash 1.5s ease-in-out infinite;
        stroke-dasharray: 90, 150;
        stroke-dashoffset: 0;
        stroke-width: 4;
        stroke: #409eff;
        stroke-linecap: round;
    }
}

@keyframes loading-rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes loading-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -40px;
    }
    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -120px;
    }
}
</style>