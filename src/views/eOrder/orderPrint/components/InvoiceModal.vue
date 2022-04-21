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
    <kdx-modal-frame
            :value="value"
            title="发货单打印提示（打印过程中请勿操作）"
            okText="打印"
            :width="450"
            :loading="loading"
            :disabledCancel="disabledCancel"
            :disabledOk="disabledOk"
            :closable="closable"
            @on-cancel="handleCancel"
            @on-ok="handleOk"
    >
        <div class="modal-content">
            <Form
                    ref="form"
                    :model="model"
                    :rules="rules"
                    :label-width="120"
            >
                <FormItem label="发货单模板：" prop="template_id">
                    <Select
                            v-model="model.template_id"
                            class="width-250"
                    >
                        <Option
                                v-for="item in list"
                                :key="item.id"
                                :value="item.id"
                        >
                            {{ item.name }}
                        </Option>
                    </Select>
                </FormItem>
            </Form>
        </div>
    </kdx-modal-frame>
</template>

<script>
    import {styleA4, styleA5} from "../invoiceTemplate";
    import {preview} from '@/helpers/print';

    export default {
        name: "InvoiceModal",
        props: {
            selectedData: {
                type: Array,
                default: () => []
            },
            LODOP: {
                type: Object
            }
        },
        data() {
            return {
                value: false,
                loading: false,
                list: [],
                model: {
                    template_id: ''
                },
                disabledCancel: false,
                disabledOk: false,
                closable: false,
                rules: {
                    template_id: [
                        {required: true, message: "发货单模板必选"}
                    ]
                },
                template: {
                    data: [], // checked选中数组
                    info: {}
                },
                express_log_id: [], // 记录id
            };
        },
        methods: {
            setValue() {
                this.value = !this.value;
                if (this.value) {
                    this.getData();
                }
            },
            // 获取模板和默认值
            getData() {
                this.loading = true;
                this.model.template_id = '';
                this.$api.eOrderApi.getInvoiceTemplateList().then(res => {
                    if (res.error === 0) {
                        this.list = res.list;
                        for (let item of this.list) {
                            if (item.is_default == 1) {
                                this.model.template_id = item.id;
                                break;
                            }
                        }
                    }
                }).finally(() => {
                    this.loading = false;
                });
            },
            handleOk() {
                this.$refs['form'].validate().then(async valid => {
                    if (valid) {
                        // loading
                        this.loading = true;
                        this.disabledCancel = true;
                        this.disabledOk = true;
                        await this.getTemplateData();
                       this.getHtmlData();
                    }
                });
            },
            async getHtmlData() {
                let htmlArr = [];
                this.express_log_id = [];
                for (let item of this.selectedData) {
                    let data = await this.getOrderData(item);
                    htmlArr.push(data);
                }
                // 通过selected-data数据渲染
                this.handlePreview(htmlArr);
            },
            // 获取默认模板信息
             getTemplateData() {
                return new Promise((resolve, reject) => {
                    this.$api.eOrderApi.getInvoiceTemplate({send_bill_template_id: this.model.template_id})
                        .then(res => {
                            let {data, error, ...info} = res;
                            if (error === 0) {
                               this.template.data = JSON.parse(data);
                               this.template.info = info;
                                resolve();
                            } else {
                                reject();
                            }
                        });
                });
            },
            // 订单数据获取
            getOrderData(params) {
                return new Promise(resolve => {
                    this.$api.eOrderApi.invoicePrint(params).then(res => {
                        if (res.error === 0) {
                            // 进行模板渲染
                            this.express_log_id.push(res.express_log_id);
                            if (this.template.info.type == 0) {
                                resolve(styleA4(this.template.data, this.template.info, res));
                            } else {
                                resolve(styleA5(this.template.data, this.template.info, res))
                            }
                        }
                    });
                });
            },
            handlePreview(htmlArr) {
                preview(htmlArr, this.LODOP, {ADD_PRINT_HTM: true}).then(status => {
                    if (status && status === 'cancle') {
                        // 关闭了预览窗口
                        this.loading = false;
                        this.disabledCancel = false;
                        this.disabledOk = false;
                        // 关闭弹窗
                        this.setValue();
                        this.$emit('on-change-preview')
                    } else {
                        console.log('打印完成啦！');
                        this.loading = false;
                        this.disabledCancel = false;
                        this.disabledOk = false;
                        // 关闭弹窗
                        this.setValue();
                        this.handleCallback()
                        // this.printCallback()
                    }
                }).catch(() => {
                    this.loading = false;
                    this.disabledCancel = false;
                    this.disabledOk = false;
                    // 关闭弹窗
                    this.setValue();
                });
            },
            handleCallback(){
                // 打印完成请求接口
                this.$api.eOrderApi.printSendCallback({express_log_id:this.express_log_id }).then(res=> {
                    console.log('请求成功',res)
                    // 打印成功回调 调用接口回复打印状态
                    this.$emit('on-change-preview')
                })
            },
            handleCancel() {
                this.setValue();
            }
        }
    };
</script>

<style scoped lang="scss">
    .modal-content {
        padding-top: 30px;
        padding-left: 20px;
        padding-bottom: 30px;
    }
</style>
