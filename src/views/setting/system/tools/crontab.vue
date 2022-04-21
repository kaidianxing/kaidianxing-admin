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
        <div class="container">
            <div class="content">
                <kdx-hint-alert :showIcon="false">
                    <div class="description">
                        <div class="tit">任务类型说明</div>
                        <div class="desc">
                            被动触发：当有用户访问商城时计划任务才进行工作，根据任务模式的参数进行任务内容
                        </div>
                        <div class="desc">
                            代码配置：需要配置操作系统的计划任务,如果没有配置，则不会进行自动收货等计划任务
                        </div>
                    </div>
                </kdx-hint-alert>
                <div class="content-body">
                    <Form
                        ref="form"
                        :model="formData"
                        :label-width="120"
                        :rules="rules"
                    >
                        <FormItem label="任务类型：" prop="execute_type">
                            <RadioGroup v-model="formData.execute_type">
                                <Radio label="0">
                                    <span>被动触发</span>
                                </Radio>
                                <Radio label="1">
                                    <span>代码配置（主动触发）</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        <div class="passive" v-if="formData.execute_type === '0'">
                            <Table border :columns="columns" :data="data">
                                <template slot-scope="{ row }" slot="setting">
                                    <span class="text">{{ row.setting }}</span>
                                    <Tooltip
                                        placement="top"
                                        max-width="200"
                                        :content="row.tooltips"
                                        theme="light"
                                        v-if="row.tooltips"
                                    >
                                        <i
                                            class="iconfont icon-icon-test"
                                            style="margin-left:5px;"
                                        ></i>
                                    </Tooltip>
                                </template>
                                <template slot-scope="{ row, index }" slot="high">
                                    <Radio
                                        v-model="data[index].highFlag"
                                        @on-change="highRadioChange(index)"
                                    >
                                        {{ row.high }}
                                    </Radio>
                                </template>
                                <template slot-scope="{ row, index }" slot="low">
                                    <Radio
                                        v-model="data[index].lowFlag"
                                        @on-change="lowRadioChange(index)"
                                    >
                                        {{ row.low }}
                                    </Radio>
                                </template>
                            </Table>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
        <template #btn>
            <Button
                type="primary"
                :loading="submitLoading"
                @click="handleSubmit"
            >提交
            </Button
            >
        </template>
    </kdx-content-bar>
</template>

<script>
export default {
    data() {
        return {
            formData: {
                execute_type: '0',
            },
            rules: {
                execute_type: [{required: true, message: '请选择任务类型'}],
            },
            highSelectAllFlag: false,
            lowSelectAllFlag: false,
            columns: [
                {
                    title: '统一设置',
                    align: 'right',
                    slot: 'setting',
                },
                {
                    title: '高效能模式',
                    align: 'center',
                    slot: 'high',
                    renderHeader: (h, params) => {
                        return h('div', [
                            h(
                                'Checkbox',
                                {
                                    props: {
                                        value: this.highSelectAllFlag,
                                    },
                                    on: {
                                        'on-change': () => {
                                            let flag = this.highSelectAllFlag
                                            this.highSelectAllFlag = !flag
                                            this.lowSelectAllFlag = flag
                                            // 改变radio
                                            this.data.forEach((item) => {
                                                item.highFlag = this.highSelectAllFlag
                                                item.lowFlag = !this
                                                    .highSelectAllFlag
                                            })
                                        },
                                    },
                                },
                                params.column.title
                            ),
                        ])
                    },
                },
                {
                    title: '低效能模式',
                    align: 'center',
                    slot: 'low',
                    renderHeader: (h, params) => {
                        return h('div', [
                            h(
                                'Checkbox',
                                {
                                    props: {
                                        value: this.lowSelectAllFlag,
                                    },
                                    on: {
                                        'on-change': () => {
                                            let flag = this.lowSelectAllFlag
                                            this.lowSelectAllFlag = !flag
                                            this.highSelectAllFlag = flag
                                            // 改变radio
                                            this.data.forEach((item) => {
                                                item.lowFlag = this.lowSelectAllFlag
                                                item.highFlag = !this
                                                    .lowSelectAllFlag
                                            })
                                        },
                                    },
                                },
                                params.column.title
                            ),
                        ])
                    },
                },
            ],
            data: [
                {
                    setting: '自动关闭未付款订单',
                    high: '10分钟/次',
                    low: '30分钟/次',
                    highFlag: true,
                    lowFlag: false,
                    tooltips: '',
                },
                {
                    setting: '关闭未付款订单通知',
                    high: '10分钟/次',
                    low: '30分钟/次',
                    highFlag: true,
                    lowFlag: false,
                    tooltips: '',
                },
                {
                    setting: '自动收货',
                    high: '10分钟/次',
                    low: '30分钟/次',
                    highFlag: true,
                    lowFlag: false,
                    tooltips: '',
                },
                {
                    setting: '优惠券自动返利',
                    high: '10分钟/次',
                    low: '30分钟/次',
                    highFlag: true,
                    lowFlag: false,
                    tooltips: '',
                },
                {
                    setting: '商品自动上下架',
                    high: '10分钟/次',
                    low: '30分钟/次',
                    highFlag: true,
                    lowFlag: false,
                    tooltips: '',
                },
            ],
            submitLoading: false,
        }
    },
    watch: {
        data: {
            handler(value) {
                this.highSelectAllFlag = !value.some((item) => {
                    return item.highFlag === false
                })
                this.lowSelectAllFlag = !value.some((item) => {
                    return item.lowFlag === false
                })
            },
            deep: true,
            immediate: true,
        },
    },
    created() {
        this.getCrontab()
    },
    methods: {
        // 读取设置
        getCrontab() {
            this.$api.systemApi.getCrontab({}).then((res) => {
                if (res.error === 0) {
                    this.formData.execute_type = res.execute_type + ''
                    this.data = res.params.map((item) => {
                        return {
                            setting: item.title,
                            high: '10分钟/次',
                            low: '30分钟/次',
                            highFlag: item.value === 10,
                            lowFlag: item.value === 30,
                            tooltips: item.tips,
                            resKey: item.key,
                        }
                    })
                }
            })
        },
        // 提交
        handleSubmit() {
            let _params = this.data.map((item) => {
                let resKey, highFlag
                for (let [key, value] of Object.entries(item)) {
                    if (key === 'highFlag') {
                        highFlag = value
                    }
                    if (key === 'resKey') {
                        resKey = value
                    }
                }
                return [resKey, highFlag ? 10 : 30]
            })
            _params = Object.fromEntries(_params)
            this.postCrontab(_params)
        },
        // 保存设置
        postCrontab(params) {
            this.submitLoading = true
            this.$api.systemApi.postCrontab({
                execute_type: this.formData.execute_type,
                ...params,
            }).then((res) => {
                this.submitLoading = false
                if (res.error === 0) {
                    this.$Message.success('保存成功')
                }
            })
        },
        // 切换高效能 radio
        highRadioChange(index) {
            this.data[index].lowFlag = false
        },
        // 切换低效能 radio
        lowRadioChange(index) {
            this.data[index].highFlag = false
        },
    },
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #fff;
    position: relative;
    min-height: 100%;
    margin-top: 20px;
}

.content {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 40px;
    padding-bottom: 64px;
    display: flex;
    flex-direction: column;

    .content-body {
        padding-top: 30px;

        .ivu-form .ivu-form-item {
            margin-bottom: 20px;
        }

        .passive {
            padding-left: 120px;
            width: 750px;
            box-sizing: content-box;
        }
    }
}
</style>
