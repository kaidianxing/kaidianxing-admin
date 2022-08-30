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
    <kdx-content-bar :loading="loading">
        <div class="content">
            <kdx-form-title>拼团设置</kdx-form-title>
            <Form ref="form" :model="model" :rules="rules" :label-width="150">
                <FormItem label="商品详情中团列表：">
                    <RadioGroup v-model="model.team_list">
                        <Radio label="1" :disabled="noManagePerm">
                            <span>开启</span>
                            <kdx-hint-tooltip
                                    type="image"
                                    :image="require('@/assets/image/example/groups/goods_detail.png')"
                            ></kdx-hint-tooltip>
                        </Radio>
                        <Radio label="0" :disabled="noManagePerm">
                            <span>关闭</span>
                        </Radio>
                    </RadioGroup>
                    <kdx-hint-text>
                        开启后，用户可使用参团功能，选择已开团团长进行拼单。若关闭则只支持团长开团
                    </kdx-hint-text>
                </FormItem>
                <FormItem label="未付款订单：" prop="order_status">
                    <RadioGroup v-model="model.auto_close_open">
                        <Radio label="0" :disabled="noManagePerm">
                            <span>永不关闭</span>
                        </Radio>
                        <Radio label="1" :disabled="noManagePerm">
                            <span>自定义关闭时间</span>
                        </Radio>
                    </RadioGroup>
                    <kdx-hint-text>
                        拼团只读取本交易规则设置
                    </kdx-hint-text>
                    <div class="main marginT-10" v-if="model.auto_close_open == '1'">
                        <FormItem
                                label="拍下来付款订单："
                                class="number-input label-width-100 refund-input"
                                prop="auto_close_time"
                        >
                            <div class="flex width-340 ">
                                <kdx-rr-input
                                        v-model="model.auto_close_time"
                                        number
                                        :minValue="5"
                                        :maxValue="60"
                                        :fixed="0"
                                        :disabled="noManagePerm"
                                ></kdx-rr-input>
                                <span class="ivu-input-group-append item-append">分钟</span>
                                <span class="paddingL">內未付款，自动关闭订单</span>
                            </div>
                        </FormItem>
                        <kdx-hint-text style="margin-left: 20px"
                        >订单自动关闭时间必须在5-60分钟之间，订单关闭后自动退还库存。
                        </kdx-hint-text
                        >
                    </div>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" type="primary" :disabled="noManagePerm" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>
<script>
export default {
    data() {
        return {
            model: {
                team_list: "0",
                auto_close_open: "1",
                auto_close_time: '5',
            },
            rules: {
                auto_close_time: [{required: true, message: "请输入拍下来付款订单分钟"}, {
                    validator: (rule, value, callback) => {
                        value = parseInt(value);
                        if (value < 5) {
                            callback(new Error('订单自动关闭时间要大于5'))
                        } else if (value >60) {
                            callback(new Error('订单自动关闭时间要小于60'))
                        }
                        callback();
                    }
                }],
            },
            loading: false
        };
    },
    computed: {
        noManagePerm(){//无管理权限
            return !this.$getPermMap('groups_setting.manage')
        }
    },
    mounted() {
        this.getSetting();
    },
    methods: {
        getSetting() {
            this.$api.groupsApi.getGroupsSetting().then(res => {
                if (res.error === 0) {
                    console.log('res', res)
                    this.model.team_list = res.data.team_list || '0';
                    this.model.auto_close_open = res.data.auto_close?.open || '0';
                    this.model.auto_close_time = res.data.auto_close?.close_time || '0';
                }
            })
        },
        handleSave() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.$api.groupsApi.setGroupsSetting(this.model).then(res => {
                        if (res.error === 0) {
                            this.$Message.success('拼团设置成功');
                        }
                    }).finally(() => {
                        this.loading = false;
                    })
                }
            })
        }
    }
};
</script>
<style scoped lang="scss">
.content {
    padding: 40px;
    background: #fff;
    margin: auto 0;
    height: calc(100% - 76px);
    box-sizing: border-box;

    .main {
        padding: 30px 30px 30px 20px;
        background-color: #f4f6f8;
        border-radius: 2px;

        .ivu-form-item {
            margin-bottom: 0;
        }
    }

    .item-append {
        display: inline-block;
        padding: 0 7px;
        width: auto;
        height: 32px;
        line-height: 32px;
    }

    .paddingL {
        padding-left: 10px;
        white-space: nowrap;
    }
    /deep/.ivu-form-item-error-tip {
        margin-left: 150px;
    }
}
</style>
