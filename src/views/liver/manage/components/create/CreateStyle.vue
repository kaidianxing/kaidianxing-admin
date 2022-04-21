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
    <div class="create-style">
        <kdx-form-title>直播类型</kdx-form-title>
        <div class="style-info">
            <div class="choose-style">
                <!-- 手机直播 -->
                <div
                    class="style-list"
                    :class="{
                        'checked': model.broadcast_type == '0'
                    }"
                    @click="checkStyle('0')"
                >
                    <div class="style-box">
                        <i class="iconfont icon-shouji style-icon"></i>
                        <div class="style-title">手机直播</div>
                        <div class="style-desc">通过“小程序直播主播端小程序”发起直播</div>
                    </div>
                    <i
                        v-if="model.broadcast_type == '0'"
                        class="iconfont icon-yes1 check-icon"
                    ></i>

                </div>

                <!-- 推流设备直播 -->
                <div
                    class="style-list device"
                    :class="{
                    'checked': model.broadcast_type == '1'
                }"
                    @click="checkStyle('1')"
                >
                    <div class="style-box">
                        <i class="iconfont icon-zhibo-tuiliushebei style-icon"></i>
                        <div class="style-title">推流设备直播</div>
                        <div class="style-desc">通过第三方推流设备发起直播</div>
                        <div class="check-style">
                            <RadioGroup
                                v-model="model.screen_type"
                                vertical
                            >
                                <Radio label="1">
                                    <span>横屏</span>
                                    <p class="style-tip">适用于以下宽高比的视频 16:9、4:3、1.85:1</p>
                                </Radio>
                                <Radio label="0">
                                    <span>竖屏</span>
                                    <p class="style-tip">适用于以下宽高比的视频 9:16、2:3</p>
                                </Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <i
                        v-if="model.broadcast_type == '1'"
                        class="iconfont icon-yes1 check-icon"
                    ></i>
                </div>

            </div>

            <div class="footer-btn">
                <Button
                    type="primary"
                    @click="nextHandler"
                >下一步</Button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            model: {
                broadcast_type: '0',
                screen_type: '1'
            }
        }
    },
    methods: {
        checkStyle(i) {
            this.model.broadcast_type = i
        },
        nextHandler() {
            this.$emit('on-next', this.model)
        }
    }
}
</script>

<style lang="scss" scoped>
.create-style {
    margin-top: 20px;
    padding: 40px;
    background-color: #fff;
    border-radius: 2px;

    .style-info {
        margin: 90px auto 0;
        width: 560px;
    }

    .choose-style {
        display: flex;
        justify-content: space-between;

        .style-list {
            position: relative;
            overflow: hidden;
            border: 1px solid #e9edef;
            border-radius: 2px;
            width: 250px;
            height: 350px;
            cursor: pointer;

            &.checked {
                border: 2px solid $brand-color;
                .style-box {
                    .style-title,
                    .style-icon {
                        color: $brand-color;
                    }
                }

                &.device {
                    .style-box {
                        transition: top 0.1s linear;
                        top: -150px;
                    }

                    .check-style {
                        margin-top: 46px;
                    }
                }
            }

            .check-icon {
                position: absolute;
                bottom: -7px;
                right: -2px;
                z-index: 101;
                font-size: 24px;
                color: $brand-color;
            }

            .style-box {
                position: absolute;
                left: 0;
                top: 0;
                width: 250px;
                height: 350px;
                padding: 50px 38px 0;

                .style-icon {
                    display: block;
                    margin: 0 auto;
                    font-size: 90px;
                    line-height: 1;
                    height: 90px;
                    width: 90px;
                    color: #262b30;
                }

                .style-title {
                    margin-top: 60px;
                    font-weight: bold;
                    font-size: 18px;
                    text-align: center;
                    line-height: 25px;
                    color: #262b30;
                }

                .style-desc {
                    margin-top: 20px;
                    font-size: 12px;
                    text-align: center;
                    line-height: 16px;
                    color: #636669;
                }

                /deep/.ivu-radio-group-vertical .ivu-radio-wrapper {
                    height: 84px;
                }

                .check-style {
                    margin-top: 100px;
                }
                .style-tip {
                    margin-left: 20px;
                    width: 132px;
                    font-size: 12px;
                    line-height: 16px;
                    color: #636669;
                    white-space: normal;
                }
            }
        }
    }

    .footer-btn {
        margin-top: 100px;
        text-align: center;

        /deep/ .ivu-btn {
            width: 250px;
        }
    }
}
</style>