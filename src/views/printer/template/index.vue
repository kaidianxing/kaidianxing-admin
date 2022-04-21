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
    <div class="printer-template-index flex" v-loading="loading">
        <printer-preview :templateList="templateList" :footer="data.footer"></printer-preview>
        <div class="right">
            <kdx-content-bar class="content-bar-template">
                <div class="content">
                    <Form ref="form" :model="data" :rules="rules" :label-width="120">
                        <kdx-form-title>模板信息</kdx-form-title>
                        <FormItem class="r-form-item-checkbox" label="模板类型：">
                            <RadioGroup v-model="data.type">
                                <Radio :label="1">商品订单</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem class="r-form-item-checkbox" label="打印纸宽：">
                            <RadioGroup v-model="data.width">
                                <Radio :label="1">58mm</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="模板名称：" prop="name">
                            <Input class="width-340" type="text" v-model="data.name" maxlength="20" show-word-limit
                                   placeholder="请输入模板名称"/>
                        </FormItem>
                        <kdx-form-title>展示内容</kdx-form-title>
                        <div class="form-list">
                            <div class="table-content-item flex" v-for="(item, index) in templateList" :key="index">
                                <div class="item-left">{{item.value}}</div>
                                <div class="flex item-right-box">
                                    <div class="item-right" v-for="(childrenItem, childrenIndex) in item.children"
                                         :key="childrenIndex">
                                        <Checkbox v-model="childrenItem.status" :true-value="1" :false-value="0"
                                                  :disabled="childrenItem.disabled"
                                                  @on-change="handleChange(childrenItem, item.children)">
                                            {{childrenItem.value}}
                                            <kdx-hint-tooltip
                                                type="form"
                                                :max-width="340"
                                                v-if="childrenItem.type=='dispatch_price'"
                                            >
                                                <Form>
                                                    <FormItem label="">虚拟商品、虚拟卡密商品无运费时，<br />打印小票时的运费不展示</FormItem>
                                                </Form>
                                            </kdx-hint-tooltip>
                                        </Checkbox>
                                        <Input v-if="childrenItem.type == 'qrcode' && childrenItem.status == 1"
                                               v-model="data.qrcode" type="text" class="width-340"
                                               placeholder="请输入二维码内容"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <FormItem label="底部信息：" prop="footer">
                            <Input v-model="data.footer" type="textarea" :autosize="{ minRows: 3 }" class="width-430"
                                   placeholder="请输入底部信息"/>
                        </FormItem>
                    </Form>
                </div>
                <template #btn>
                    <Button class="default-long" @click="handleCancel">取消</Button>
                    <Button class="primary-long" @click="handleSave">保存</Button>
                </template>
            </kdx-content-bar>
        </div>
    </div>
</template>

<script>
    import printerPreview from './components/PrinterPreview'
    import {templateList} from './templateData'
    import {mapActions} from "vuex";

    export default {
        name: "index",
        components: {
            printerPreview
        },
        props: {},
        data() {
            return {
                disabled: false,
                loading: false,
                id: '',
                data: {
                    type: 1,
                    width: 1,
                    name: '',
                    footer: '谢谢惠顾，欢迎下次光临',
                    qrcode: '',
                    // logo_image: '',
                },
                templateList: JSON.parse(JSON.stringify((templateList))),
                rules: {
                    name: [
                        {required: true, message: '请输入打印机名称'}
                    ],
                    footer: [
                        {required: true, message: '请输入底部信息'}
                    ]
                },
                tempMap: null,
                deliveryType: {}, //配送是否开启
            }
        },
        computed: {},
        created() {
            this.getTemplateMap();
        },
        mounted() {
            this.getInfo().finally(() => {
                if (this.$route?.query.id) {
                    this.id = this.$route?.query.id || '';
                    this.getData()
                }
            });
        },
        methods: {
            ...mapActions('goodAddEdit', ['getDispatchEnable']),
            async getInfo() {
                // 获取配送方式开启状态
                let deliveryType = await this.getDispatchEnable();
                this.deliveryType = {...deliveryType}
            },
            getData() {
                this.loading = true;
                this.$api.printerApi.editPrinterTem({id: this.id}).then(res => {
                    if (res.error == 0) {
                        this.data = res.data;
                        this.templateList = res.data.content;
                        this.loading = false;
                    }
                })
            },
            handleCancel() {
                this.$router.replace({
                    path: '/printer/template/list',
                })
            },
            handleSave() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.submit()
                    }
                });
            },
            submit() {
                let obj = {
                    ...this.data,
                    content: JSON.stringify(this.templateList)
                };
                if (this.id) {
                    obj.id = this.id
                }
                this.$api.printerApi[this.id ? 'savePrinterTem' : 'addPrinterTem'](obj).then(res => {
                    if (res.error == 0) {
                        this.$Message.success('保存成功');
                        this.$router.replace({
                            path: '/printer/template/list',
                        })
                    }
                })
            },
            handleChange(item, arr) {
                if (item.type == 'goods_sku' || item.type == 'goods_option') {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '商品编码和商品规格只能选择一个',
                        onOk: () => {
                            this.handleDisable(item, arr)
                        },
                        onCancel: () => {
                            this.handleStatus(item, arr)
                        }
                    });
                }
            },
            handleDisable(item, arr) {
                let key = item.type == 'goods_sku' ? 'goods_option' : 'goods_sku';
                let status = item.status == '1'
                item.disabled = false;
                arr.filter(arrItem => arrItem.type == key)[0].disabled = status;
            },
            handleStatus(item, arr) {
                let status = item.status == 0 ? 1 : 0;
                arr.filter(arrItem => arrItem.type == item.type)[0].status = status;
            },
            /*
            * 表单按钮
            * 是否显示
            * 显示否置灰
            * */
            handleFormPerm(disabled) {
                const formTemp = ['order_form']
                if (this.tempMap.hasOwnProperty('order_info')) {
                    let tmp = this.templateList[this.tempMap.order_info.level1];
                    let valid = tmp.children.some(child => formTemp.includes(child.type));
                    if (!valid) {
                        formTemp.forEach(key => {
                            let tempItem = this.tempMap[key];
                            tmp.children.push({
                                ...this.templateList[tempItem.level1].children[tempItem.level2],
                                disabled
                            })
                        })
                    } else {
                        tmp.children.forEach((key) => {
                            if (key.type == 'order_form') {
                                key.disabled = disabled
                            }
                        })
                    }
                }
            },
            removeForm() {
                const orderForm = ['order_form'];
                this.templateList = this.templateList.map(item => {
                    if (item.type === 'order_info') {
                        item.children = item.children.filter(child => !orderForm.includes(child.type))
                    }
                    return item;
                })
            },
            // 获取模板的map
            getTemplateMap() {
                if (!this.tempMap) {
                    this.tempMap = {};
                    templateList.forEach((item, index) => {
                        this.tempMap[item.type] = {
                            level1: index
                        }
                        if (item.children?.length) {
                            item.children.forEach((child, childIndex) => {
                                this.tempMap[child.type] = {
                                    level1: index,
                                    level2: childIndex
                                };
                            })
                        }
                    })
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    .printer-template-index {
        .right {
            flex: 1;
            padding-top: 20px;
            height: calc(100vh - 110px);
            overflow-y: auto;

            .content {
                padding: 40px;
                background: #fff;
                min-height: 100%;

                .form-list {
                    margin-bottom: 30px;
                    border: 1px solid $border-color;

                    .table-content-item {
                        color: $text-first;
                        border-bottom: 1px solid $border-color;

                        &:last-child {
                            border-bottom: 0;
                        }

                        .item-left {
                            display: flex;
                            align-items: center;
                            flex-shrink: 0;
                            width: 179px;
                            padding: 16px 20px;
                            border-right: 1px solid $border-color;
                            font-weight: bold;
                            font-size: 14px;
                        }

                        .item-right-box {
                            padding-top: 16px;
                            flex-wrap: wrap;
                        }

                        .item-right {
                            flex-shrink: 0;
                            padding-left: 16px;
                            margin-bottom: 20px;
                        }
                    }
                }
            }

            .content-bar-template {
                /deep/ .app-overdue {
                    margin-top: 0;
                }
            }
        }
    }
</style>
