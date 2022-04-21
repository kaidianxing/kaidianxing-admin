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
    <div class="invoice-add-box" v-loading="loading">
        <div class="invoice-add">
            <invoice-note :data="data" :note="note" :checked-key="checkedKey" @on-change-key="changeKey"></invoice-note>
            <form-info ref="form" :model="data" :expressList="expressList" :list="checkedList" :checked-key="checkedKey"
                       @on-change="changeData" @on-change-type="changeType" @on-change-list="changeList"
                       @on-change-key="changeKey"></form-info>
        </div>
        <div class="invoice-add-btn">
            <Button class="primary-long marginR-10" @click="handleSave">保存</Button>
            <Button class="default-long" to="/eOrder/templateManagement/invoice/index">取消</Button>
        </div>
    </div>
</template>

<script>
    import InvoiceNote from "./components/InvoiceNote";
    import FormInfo from "./components/FormInfo";

    export default {
        name: "index",
        components: {
            InvoiceNote,
            FormInfo
        },
        data() {
            return {
                data: {},
                expressList: [],
                checkedList: [],
                note: {},
                id: '',
                checkedKey: '',
                loading: false
            };
        },
        mounted() {
            this.id = this.$route.query.id || 0;
            this.getExpressList();
            this.getData();
        },
        methods: {
            // 获取快递公司列表
            getExpressList() {
                !this.expressList?.length && this.$api.settingApi.getExpressList().then((res) => {
                    if (res.error == 0) {
                        this.expressList = res.list;
                    }
                });
            },
            getData() {
                this.loading = true;
                this.resetModel();
                if (this.id) {
                    this.$api.eOrderApi.getInvoice({id: this.id}).then(res => {
                        if (res.error === 0) {
                            let {data, ...obj} = res.data;
                            Object.assign(this.data, obj);
                            this.defaultList(JSON.parse(data));
                        }
                    }).finally(() => {
                        this.loading = false;
                    });
                } else {
                    this.$api.eOrderApi.getInvoiceCheckedList().then(res => {
                        if (res.error === 0) {
                            this.defaultList(res.list);
                        }
                    }).finally(() => {
                        this.loading = false;
                    });
                }
            },
            // 处理数据的半选状态
            defaultList(list = []) {
                list.forEach(item => {
                    let childChecked = item.children ? item.children.filter(child => child.checked) : [];
                    if (childChecked.length === item.children.length) {
                        item.indeterminate = false;
                        item.checked = true;
                    } else if (childChecked?.length > 0) {
                        item.indeterminate = true;
                        item.checked = false;
                    } else {
                        item.indeterminate = false;
                        item.checked = false;
                    }
                });
                this.checkedList = list;
                this.delayList();
            },
            resetModel() {
                this.data = {
                    name: '',
                    express_code: '',
                    type: 0,
                    send_title: '发货单',
                    logo: this.$store.state.config.baseSetting?.logo || '',
                    qr_code: '',
                    footer: ''
                };
            },
            handleSave() {
                this.$refs['form'].validate().then(valid => {
                    if (valid) {
                        this.loading = true;
                        console.log('invoice', valid);
                        let params = Object.assign(this.data, {data: JSON.stringify(this.checkedList)});
                        if (this.id) {
                            this.editInvoice(params);
                        } else {
                            this.addInvoice(params);
                        }
                    }
                });
            },
            addInvoice(params) {
                this.$api.eOrderApi.addInvoice(params).then(res => {
                    if (res.error === 0) {
                        this.$Message.success('发货单模板新增成功');
                        this.$router.push({
                            path: '/eOrder/templateManagement/invoice/index'
                        });
                    }
                }).finally(() => {
                    this.loading = false;
                });
            },
            editInvoice(params) {
                this.$api.eOrderApi.editInvoice(params).then(res => {
                    if (res.error === 0) {
                        this.$Message.success('发货单模板修改成功');
                        this.$router.push({
                            path: '/eOrder/templateManagement/invoice/index'
                        });
                    }
                }).finally(() => {
                    this.loading = false;
                });
            },
            changeData(data) {
                this.data = data;
            },
            changeType(type) {
                console.log('change-type', type);
            },
            changeList(list) {
                this.checkedList = list;
                this.delayList();
            },
            // checked 数据扁平化
            delayList() {
                let data = {}, keys = ['send_message', 'consignee_message', 'price_message'];
                this.checkedList.forEach(item => {
                    data[item.key] = {
                        name: item.name,
                        checked: item.checked,
                        indeterminate: item.indeterminate,
                    };
                    if (keys.indexOf(item.key) > -1) {
                        let childData = {};
                        item.children.forEach(child => {
                            if (child.checked) {
                                childData[child.key] = {
                                    name: child.name,
                                    // checked: child.checked
                                };
                            }
                        });
                        // Object.assign(data[item.key], childData)
                        data[item.key].children = childData;
                    } else {
                        data[item.key].children = item.children;
                    }
                });
                this.note = data;
            },
            changeKey(key) {
                this.checkedKey = key;
            }
        }
    };
</script>

<style scoped lang="scss">
    .invoice-add-box {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;

        .invoice-add {
            flex: 1;
            height: 0;
            display: flex;
            flex-direction: row;
            margin: 20px 0;
            /*height: 100%;*/
            overflow-y: hidden;

            /*.invoice-add-form-info {*/
            /*    flex-shrink: 0;*/
            /*}*/
        }

        .invoice-add-btn {
            /*flex-shrink: 0;*/
            /*padding-left: 173px;*/
            background-color: #FFFFFF;
            border-top: 1px solid $border-color;
            padding: 16px 0 16px 160px; // border-top: 1px solid $border-color;
            box-sizing: border-box;
        }
    }
</style>
