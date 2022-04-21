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
    <kdx-content-bar>
        <div class="content">
            <Form ref="form" :model="model" :label-width="120" :rules="rule">
                <kdx-form-title>基础设置</kdx-form-title>
                <kdx-hint-alert :showIcon="false" style="margin-bottom: 30px;">
                    <div class="text">1、请前往注册快递鸟账号。</div>
                    <div class="text">
                        2、快递鸟返回的均是快递公司官方认可的电子面单模板。
                    </div>
                    <div class="text">
                        3、打印前请先设置默认电子面单模板。
                    </div>
                </kdx-hint-alert>
                <FormItem label="接口类型选择：" prop="type">
                    <RadioGroup class="radio-group" v-model="model.type">
                        <Radio label="0" border>
                            <img
                                src="@/assets/image/eOrder/kdn.png"
                                alt=""
                            />
                            <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
                        </Radio>
                        <!-- <Radio label="1" border>
                            <img
                                src="@/assets/image/eOrder/cn.png"
                                alt=""
                            />
                            <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
                        </Radio> -->
                    </RadioGroup>
                </FormItem>
                <FormItem label="用户ID：" prop="appid">
                    <i-input
                        placeholder="请输入"
                        class="width-340"
                        type="textarea"
                        :rows="1"
                        show-word-limit
                        maxlength="120"
                        v-model="model.appid"
                    />
                    <kdx-hint-text>
                        没有<span>{{
                            model.type === '0' ? '快递鸟' : '菜鸟'
                        }}</span
                        >账号？点击这里<span
                            class="link"
                            @click="openNewWindow"
                        >
                            {{ model.type === '0' ? '快递鸟' : '菜鸟' }} </span
                        >前往注册
                    </kdx-hint-text>
                </FormItem>
                <FormItem label="API Key" prop="key">
                    <i-input
                        placeholder="请输入"
                        class="width-340"
                        type="textarea"
                        :rows="1"
                        show-word-limit
                        maxlength="120"
                        v-model="model.key"
                    />
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button
                class="primary-long"
                type="primary"
                :loading="loading"
                :disabled="noManagePerm"
                @click="handleSave"
            >
                保存
            </Button>
        </template>
    </kdx-content-bar>
</template>

<script>
export default {
    data() {
        return {
            model: {
                type: '0',
                appid: '',
                key: '',
            },
            rule: {
                type: [{ required: true, message: '接口类型必选' }],
                appid: [
                    { required: true, message: '用户ID必填' },
                    { whitespace: true, message: '用户ID必填' },
                ],
                key: [
                    { required: true, message: 'API Key必填' },
                    { whitespace: true, message: 'API Key必填' },
                ],
            },
            loading: false,
        }
    },
    computed: {
        noManagePerm() {
            // 管理权限
            return !this.$getPermMap('expressHelper.manage')
        },
    },
    created() {
        this.getBasicSetting()
    },
    methods: {
        // 获取基础设置
        getBasicSetting() {
            this.$api.eOrderApi.getBasicSetting().then((res) => {
                if (res.error == 0) {
                    console.log(res)
                    this.model = {
                        ...this.model,
                        ...res,
                    }
                }
            })
        },
        handleSave() {
            this.$refs['form'].validate().then((valid) => {
                if (valid) {
                    this.loading = true
                    this.setBasicSetting()
                }
            })
        },
        // 保存基础设置
        setBasicSetting() {
            let params = this.formatParams()
            this.$api.eOrderApi
                .setBasicSetting({ ...params })
                .then((res) => {
                    this.loading = false
                    if (res.error == 0) {
                        this.$Message.success('保存成功')
                    }
                })
        },
        // 处理保存参数
        formatParams() {
            let { type, appid, key } = this.model
            let params = {
                type,
                appid,
                key,
            }
            return params
        },
        // 跳转 快递鸟/菜鸟
        openNewWindow() {
            let url = 'http://www.kdniao.com'
            if (this.model.type === '1') {
                url =
                    'https://fahuo.cainiao.com/consigns/user/waybillPrinterSetting.htm'
            }
            window.open(url)
        },
    },
}
</script>

<style scoped lang="scss">
.content {
    padding: 40px;
    background: #fff;
    min-height: 100%;
}
.radio-group {
    display: flex;
    align-items: center;
    /deep/ .ivu-radio {
        display: none;
    }
    .ivu-radio-group-item {
        position: relative;
        box-sizing: border-box;
        padding-left: 0;
        padding-right: 0;
        width: 160px;
        height: 80px;
        border-radius: 2px;
        margin-left: 0;
        margin-right: 20px;
        background-color: #fff;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            display: block;
            width: 100%;
            height: 100%;
        }
        .icon {
            position: absolute;
            font-size: 24px;
            bottom: -2px;
            right: 0;
            color: $brand-color;
            display: none;
        }
    }
    .ivu-radio-wrapper-checked {
        border-width: 2px;
        .icon {
            display: inline-block;
        }
    }
    /deep/ .ivu-btn {
        span {
            color: $brand-color;
        }
    }
}
.link {
    cursor: pointer;
    color: $brand-color;
    font-weight: bold;
}
</style>
