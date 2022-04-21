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
    <div class="create-basic">
        <kdx-form-title>基本信息</kdx-form-title>
        <div class="basic-info">
            <p class="basic-title">填写基本信息</p>
            <Form
                class="basic-form"
                :label-width="120"
                :model="model"
                :rules="rules"
                ref="basicForm"
            >
                <form-item
                    label="直播间标题："
                    prop="title"
                >
                    <Input
                        placeholder="请输入直播间标题"
                        maxlength="17"
                        show-word-limit
                        v-model="model.title"
                    />
                </form-item>
                <form-item
                    label="开播时间："
                    prop="time"
                >
                    <DatePicker
                        v-model="model.time"
                        type="datetimerange"
                        placeholder="开播时间"
                        @on-change="changeTime"
                        style="width:100%;"
                        :options="options"
                    ></DatePicker>
                    <kdx-hint-text>
                        开播时间段仅供参考，不是实际直播间可以开播的时间。<br />
                        直播间在开始时间前也可以开播，并且到结束时间后不会强制结束。<br />
                        若到结束时间仍未开播，则直播间无法再开播。</kdx-hint-text>
                </form-item>
                <form-item
                    label="主播昵称："
                    prop="anchor_name"
                >
                    <Input
                        placeholder="请输入主播昵称"
                        maxlength="15"
                        show-word-limit
                        v-model="model.anchor_name"
                    />
                </form-item>
                <form-item
                    label="主播微信账号："
                    prop="anchor_wechat"
                >
                    <Input
                        placeholder="请输入主播微信账号"
                        v-model="model.anchor_wechat"
                    />
                    <div class="flex link-container">
                        <kdx-hint-text class="wechat-link">请填写已认证的主播微信账号,如未认证请到微信小程序后台认证</kdx-hint-text>
                        <span
                            @click="skipWechat"
                            class="link-skip"
                        >立即前往</span>
                    </div>
                    <kdx-hint-text style="padding-top:0;">每个直播间需要绑定一个用作核实主播身份，不会展示给观众</kdx-hint-text>
                </form-item>
            </Form>
            <div class="btn-group">
                <Button @click="backHandler">上一步</Button>
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


        const validTitle = (field, value, callback) => {
            if (value.length < 3 || value.length > 17) {
                callback(new Error('直播标题必须为3-17个汉字(一个字等于两个英文字符或特殊字符)'))
            } else {
                callback()
            }
        }

        const validName = (field, value, callback) => {
            if (value.length < 2 || value.length > 15) {
                callback(new Error('主播昵称必须为2-15个汉字(一个字等于两个英文字符或特殊字符)'))
            } else {
                callback()
            }
        }

        const validTime = (field, value, callback) => {
            if (value[0] || value[1]) {
                let min_10 = Date.now() + 1000 * 60 * 10
                let now = new Date()
                // 开播时间需要在当前时间的10分钟后
                if (value[0] < min_10) {
                    callback(new Error('开播时间需要在当前时间的10分钟后'))
                    return
                }

                let nowYear = now.getFullYear()
                let checkYear = value[0].getFullYear()
                let nowMonth = now.getMonth()
                let checkMonth = value[0].getMonth();

                if (checkYear > nowYear) {
                    checkMonth += ((checkYear - nowYear) * 12)
                }

                let nowDate = now.getDate()
                let checkDate = value[0].getDate()
                if (checkMonth - nowMonth > 6) {
                    callback(new Error('开播时间不能在6个月后'))
                    return
                } else if (checkMonth - nowMonth == 6 && checkDate > nowDate) {
                    callback(new Error('开播时间不能在6个月后'))
                    return
                }

                let min_30 = 30 * 60 * 1000
                let hour_12 = 24 * min_30;

                if (value[1] - value[0] > hour_12 || value[1] - value[0] < min_30) {
                    callback('开播时间间隔不得短于30分钟，不得超过12小时')
                    return
                }

                callback()
            } else {
                callback(new Error('请选择计划直播时间'))
            }
        }
        return {
            model: {
                title: '',
                time: [],
                anchor_name: '',
                anchor_wechat: ''
            },
            rules: {
                title: [{ required: true, validator: validTitle }],
                time: [{ required: true, validator: validTime }],
                anchor_name: [{ required: true, validator: validName }],
                anchor_wechat: [{ required: true, message: '请输入主播微信号' }],

            },
            timerange: [],
            options: {
                disabledDate(date) {
                    let nowDate = new Date()
                    nowDate.setHours(0)
                    nowDate.setMinutes(0)
                    nowDate.setSeconds(0)
                    nowDate.setMilliseconds(0)
                    return date < nowDate;
                }
            }
        }
    },
    methods: {
        changeTime(e) {
            this.timerange = e
        },
        skipWechat() {
            window.open('https://mp.weixin.qq.com/')
        },
        nextHandler() {
            this.$refs.basicForm.validate(valid => {
                if (valid) {
                    let { time, ...info } = this.model
                    let [start_time, end_time] = this.timerange
                    console.log('time', time)

                    this.$emit('on-next', { start_time, end_time, ...info })
                }
            })

        },
        backHandler() {
            this.$emit('on-back')
        }
    }
}
</script>

<style lang="scss" scoped>
.create-basic {
    margin-top: 20px;
    padding: 40px;
    background-color: #fff;
    border-radius: 2px;

    .basic {
        &-info {
            margin: 90px auto 0;
            width: 560px;
        }

        &-title {
            margin-bottom: 66px;
            font-size: 18px;
            font-weight: bold;
            line-height: 25px;
            text-align: center;
            color: #262b30;
        }

        &-form {
            width: 100%;

            .status {
                margin-top: 10px;

                &-text {
                    &.pending {
                        color: $brand-color;
                        .status-icon {
                            color: $brand-color;
                        }
                    }

                    &.success {
                        color: #19be6b;
                        .status-icon {
                            color: #19be6b;
                        }
                    }

                    &.no-valid {
                        color: #ff1f2c;
                        .status-icon {
                            color: #ff1f2c;
                        }
                    }
                }

                &-icon {
                    margin-right: 2px;
                }
            }

            .spin-icon-load {
                animation: ani-demo-spin 1s linear infinite;
            }

            @keyframes ani-demo-spin {
                0% {
                    transform: rotate(0deg);
                }

                50% {
                    transform: rotate(180deg);
                }

                to {
                    transform: rotate(1turn);
                }
            }

            .wx-code {
                width: 100px;
                height: 100px;
            }
        }
    }

    .link-container {
        align-items: center;
    }

    .link-skip {
        font-size: 12px;
        line-height: 16px;
        padding-top: 10px;
        margin-left: 10px;
        color: $brand-color;
        cursor: pointer;

    }

    .btn-group {
        margin-top: 90px;
        display: flex;
        justify-content: space-between;
        /deep/ .ivu-btn {
            width: 250px;
        }
    }
}
</style>