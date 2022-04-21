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
    <div class="container">
        <search-header
            :order_no="search.order_no"
            ref="search_header"
            @on-search="handleSearch"
        ></search-header>
        <div class="table-list-wrap" v-loading="loading">
            <div class="btn-wrap">
                <Button
                    type="primary"
                    :disabled="noManagePerm"
                    @click="handlePrint"
                >
                    打印电子面单
                </Button>
                <Button
                    type="primary"
                    :disabled="noManagePerm"
                    class="marginL-10"
                    @click="handleInvoicePrint"
                >
                    打印发货单
                </Button>
                <Button
                    type="error"
                    :disabled="noManagePerm"
                    class="marginL-10"
                    @click="handleEachPrint"
                >
                    同时打印
                </Button>
            </div>
            <table-list ref="tableList" :data="data" @on-change="change" />
            <div class="operate" v-if="data.length">
                <Checkbox
                    v-model="allSelectedFlag"
                    :indeterminate="indeterminate"
                    :disabled="disabled"
                    @on-change="changeAllSelected"
                ></Checkbox>
                <Button
                        type="primary"
                        :disabled="noManagePerm"
                        @click="handlePrint"
                >
                    打印电子面单
                </Button>
                <Button
                        type="primary"
                        :disabled="noManagePerm"
                        class="marginL-10"
                        @click="handleInvoicePrint"
                >
                    打印发货单
                </Button>
                <Button
                        type="error"
                        :disabled="noManagePerm"
                        class="marginL-10"
                        @click="handleEachPrint"
                >
                    同时打印
                </Button>
            </div>
            <div class="footer-page" v-show="data.length > 0">
                <kdx-page-component
                    ref="page"
                    :showSizer="false"
                    :pageSize="20"
                    :total="total"
                    @on-change="changePage"
                ></kdx-page-component>
            </div>
        </div>
        <kdx-modal-frame
            v-model="modalShowFlag"
            title="打印提示（打印过程中请勿操作）"
            okText="打印"
            :width="500"
            :loading="modalLoading"
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
                    <FormItem label="电子面单模板：" prop="express_template_id">
                        <Select
                            v-model="model.express_template_id"
                            class="width-250"
                            @on-change="changeExpressTemplate"
                        >
                            <Option
                                v-for="item in eOrderTempList"
                                :key="item.value"
                                :value="item.value"
                                :disabled="isTemplateDisabled(item)"
                            >
                                {{ item.label }}
                            </Option>
                        </Select>
                        <kdx-hint-text>如果订单通过子母模板进行过打印则不再支持非子母单模板</kdx-hint-text>
                    </FormItem>
                    <FormItem label="发件人模板：" prop="consigner_template_id">
                        <Select
                            v-model="model.consigner_template_id"
                            class="width-250"
                        >
                            <Option
                                v-for="item in senderTempList"
                                :key="item.value"
                                :value="item.value"
                            >
                                {{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="票单数量：" prop="number" v-if="expressTemplate.is_sub == '1'">
                        <kdx-rr-input v-model="model.number" number :fixed="0" :min-value="1"
                                  class="width-250"
                                  placeholder="请输入数量"></kdx-rr-input>
                        <kdx-hint-text>票单数量即一个订单要拆分的子母单包裹数量，不可为0</kdx-hint-text>
                    </FormItem>
                </Form>
            </div>
        </kdx-modal-frame>
        <invoice-modal ref="invoice_modal" :LODOP="LODOP" :selected-data="selectedData"
                       @on-change-preview="handleInvoicePreview"></invoice-modal>
        <slot></slot>
    </div>
</template>

<script>
import SearchHeader from './components/SearchHeader'
import TableList from './components/TableList'
import InvoiceModal from "./components/InvoiceModal";
import { getLodop } from '@/assets/helpers/LodopFuncs'
import { preview } from '@/helpers/print'

export default {
    components: {
        SearchHeader,
        TableList,
        InvoiceModal,
    },
    data() {
        return {
            loading: false,
            page: {
                pageSize: 20,
                pageNumber: 1,
            },
            search: {
                order_no: '',
                created_at: [],
                title: '',
                buyer_name: '',
                is_print: '',
                status: '',
            },
            allSelectedFlag: false, // 是否全部选中
            indeterminate: false, // 样式控制
            disabled: false, // 是否禁用
            data: [],
            selectedData: [], // 选中的数据
            postData: [], // 回调请求数据
            total: 0,
            modalShowFlag: false,
            model: {
                express_template_id: '', // 电子面单id
                consigner_template_id: '', // 发货人模板id
                number: ''
            },
            expressTemplateName: '',
            rules: {
                express_template_id: [
                    { required: true, message: '电子面单模板必选' },
                ],
                consigner_template_id: [
                    {required: true, message: '发件人模板必选'},
                ],
                number: [
                    {required: true, message: '票单数量必填'}
                ]
            },
            eOrderTempList: [], // 电子面单模板
            senderTempList: [], // 发件人模板
            modalLoading: false,
            disabledCancel: false,
            disabledOk: false,
            closable: false,
            LODOP: null,
            isEachPrint: false, // 是否同时打印
            expressTemplate: { // 电子面单选中的模板
                is_sub: 0
            },
        };
    },
    computed: {
        noManagePerm() {
            // 管理权限
            return !this.$getPermMap('expressHelper.print.manage')
        },
    },
    created() {
        const { order_no } = this.$route.query
        if (order_no) {
            this.search.order_no = order_no
        }
        this.getOrderList()
    },
    methods: {
        // 获取订单列表
        getOrderList() {
            this.loading = true
            let params = {
                ...this.search,
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
            }
            this.$api.eOrderApi.getOrderList(params).then((res) => {
                this.loading = false
                if (res.error === 0) {
                    this.data = res.list
                    this.total = res.total
                    // 处理禁用状态
                    this.data.forEach((item) => {
                        if (item.order_goods && item.order_goods.length) {
                            item._disabled = !item.order_goods.some(
                                (subItem) => {
                                    return parseInt(subItem.print_num) === 0
                                }
                            )
                        } else {
                            item._disabled = true
                        }
                    })
                    // 重置全选按钮状态
                    this.$nextTick(() => {
                        this.allSelectedFlag = false
                        this.indeterminate = false
                        this.disabled = !this.data.some((item) => {
                            return item._disabled === false
                        })
                    })
                }
            })
        },
        // 搜索
        handleSearch(value) {
            // 搜索时清空活动id
            this.search = { ...this.search, ...value }
            this.refreshTable()
        },
        // 切换页码
        changePage(page) {
            this.page = page
            this.getOrderList()
        },
        refreshTable() {
            this.page = {
                pageSize: 20,
                pageNumber: 1,
            }
            this.$refs['page'].reset(this.page)
            this.getOrderList()
        },
        // 选中改变
        change(data) {
            console.log('选中的数据:   ', data)
            this.selectedData = [...data]
            // 处理选中
            if (this.selectedData.length === 0) {
                // 一个未选
                this.allSelectedFlag = false
                this.indeterminate = false
                this.disabled = !this.data.some((item) => {
                    return item._disabled === false
                })
            } else {
                this.disabled = false
                if (this.selectedData.length !== this.data.length) {
                    // 有未选中的订单
                    this.allSelectedFlag = false
                    this.indeterminate = true
                } else {
                    // 所有的订单都被选中
                    let indeterminate = this.selectedData.some(
                        (item, index) => {
                            return (
                                item.order_goods_id.length !==
                                this.data[index].order_goods.length
                            )
                        }
                    )
                    this.allSelectedFlag = !indeterminate
                    this.indeterminate = indeterminate
                }
            }
        },
        // 点击全选
        changeAllSelected(value) {
            this.$refs['tableList'].changeAllSelected(value)
        },
        handleEachPrint() {
          this.isEachPrint = true;
          this.handlePrint();
        },
        // 打印
        async handlePrint() {
            // 判断是否有选中的订单
            if (this.selectedData.length === 0) {
                this.$Message.error('请选择要打印的订单')
                return
            }
            this.LODOP = getLodop()
            if (this.LODOP) {
                // 获取电子面单模板、发件人模板列表
                if (this.eOrderTempList.length === 0) {
                    await this.getEOrderTempSimpleList()
                } else {
                    // 设置电子面单模板的默认项
                    this.setEOrderTemplateDefault();
                }
                if (this.senderTempList.length === 0) {
                    await this.getSenderTempSimpleList()
                } else {
                    this.setSenderTemplateDefault();
                }
                // 弹窗
                this.modalShowFlag = true
            }
        },
        handleCancel() {
            this.modalShowFlag = false
            // 同时打印时，调用发货单打印
            this.isEachPrint && this.handleInvoicePrint();
        },
        getExpressTemplateName() {
          this.eOrderTempList.forEach(item => {
              if (item.value === this.model.express_template_id) {
                  this.expressTemplateName = item.express_company;
              }
          })
        },
        handleOk() {
            // 校验表单
            this.$refs['form'].validate().then(async (valid) => {
                if (valid) {
                    // 进行订单打印的校验，查看是否可以正常打印
                    await this.validOrderPrint();
                    this.getExpressTemplateName();
                    // 清空请求数据
                    this.postData = []
                    // loading
                    this.modalLoading = true
                    this.disabledCancel = true
                    this.disabledOk = true
                    // 循环调用打印接口
                    let _asyncWorker = []
                    this.selectedData.forEach((item) => {
                        _asyncWorker.push(this.orderPrint(item))
                    })
                    Promise.all(_asyncWorker).then((res) => {
                        console.log('所有的html模板 --------', res)
                        console.log('回调请求数据 --------', this.postData)
                        if (res && res.length) {
                            let _htmlArr = []
                            res.forEach((item) => {
                                item.forEach((sub) => {
                                    // 圆通快递电子面单高度不够，添加100%高度
                                    if (['YTO'].includes(this.expressTemplateName)) {
                                        sub = sub.replace(/<((html|body)).*?>/g, '<$1 style="height: 100%">')
                                    }
                                  _htmlArr.push(sub)
                                })
                            })
                            // console.log('_htmlArr --------', _htmlArr)
                            // 预览面单
                            preview(_htmlArr, this.LODOP)
                                .then((status) => {
                                    if (status && status === 'cancle') {
                                        // 关闭了预览窗口
                                        this.modalLoading = false
                                        this.disabledCancel = false
                                        this.disabledOk = false
                                        // 关闭弹窗
                                        this.modalShowFlag = false
                                        // 同时打印时，调用发货单打印
                                        this.isEachPrint && this.handleInvoicePrint();
                                    } else {
                                        console.log('打印完成啦！')
                                        this.modalLoading = false
                                        this.disabledCancel = false
                                        this.disabledOk = false
                                        // 关闭弹窗
                                        this.modalShowFlag = false
                                        // 同时打印时，调用发货单打印
                                        this.isEachPrint && this.handleInvoicePrint();
                                        // 打印成功回调 调用接口回复打印状态
                                        this.printCallback()
                                    }
                                })
                                .catch(() => {
                                    this.modalLoading = false
                                    this.disabledCancel = false
                                    this.disabledOk = false
                                    // 关闭弹窗
                                    this.modalShowFlag = false
                                })
                        }
                    })
                }
            })
        },
        // 订单打印 （获取打印html）
        orderPrint(data) {
            return new Promise((resolve) => {
                let _params = {
                    ...data,
                    ...this.model,
                }
                this.$api.eOrderApi.orderPrint(_params).then((res) => {
                    if (res.error == 0) {
                        // 拿到 html 模板
                        let _printTemplateArr = [];
                            res.print_data.forEach((item) => {
                            this.postData.push({
                                express_company: item.express_company,
                                logistic_code: item.logistic_code,
                                order_id: item.shop_order_id,
                                order_goods_id: item.shop_order_goods_id.map(
                                    (element) => element.id
                                ),
                            });
                            _printTemplateArr.push(item.PrintTemplate)
                            item.SubPrintTemplates?.length > 0 && (_printTemplateArr.push(...item.SubPrintTemplates))
                        });
                        resolve(_printTemplateArr)
                    } else {
                        this.modalLoading = false
                        this.disabledCancel = false
                        this.disabledOk = false
                    }
                })
            })
        },
        // 订单打印回调（通知打印状态）
        printCallback() {
            this.$api.eOrderApi
                .printCallback({
                    data: this.postData,
                    express_template_id: this.model.express_template_id,
                })
                .then((res) => {
                    if (res.error == 0) {
                        console.log('printCallback 回调成功--------')
                        // 不同时打印清空数据
                        if (!this.isEachPrint) {
                            // 清空选中数据
                            this.selectedData = []
                            // 清空回调请求数据
                            this.postData = []
                            // 刷新列表
                            this.refreshTable()
                        }
                    }
                })
        },
        // 获取电子面单模板
        getEOrderTempSimpleList() {
            return new Promise((resolve) => {
                this.$api.eOrderApi
                    .getEOrderTempSimpleList()
                    .then((res) => {
                        if (res.error == 0) {
                            this.eOrderTempList = res.list.map((item) => {
                                if (item.is_default === '1') {
                                    // 选中默认模板
                                    this.model.express_template_id = item.id;
                                    this.changeExpressTemplate(item.id);
                                }
                                return {
                                    value: item.id,
                                    label: item.name,
                                    express_company: item.express_company,
                                    is_sub: item.is_sub ? +item.is_sub : 0,
                                    is_default: item.is_default ? +item.is_default : 0
                                }
                            })
                        }
                        resolve()
                    })
            })
        },
        // 获取发件人模板
        getSenderTempSimpleList() {
            return new Promise((resolve) => {
                this.$api.eOrderApi
                    .getSenderTempSimpleList()
                    .then((res) => {
                        if (res.error == 0) {
                            this.senderTempList = res.list.map((item) => {
                                if (item.is_default === '1') {
                                    // 选中默认模板
                                    this.model.consigner_template_id = item.id
                                }
                                return {
                                    value: item.id,
                                    label: item.name,
                                }
                            })
                        }
                        resolve()
                    })
            })
        },
        handleInvoicePrint() {
            // 判断是否有选中的订单
            if (this.selectedData.length === 0) {
                this.$Message.error('请选择要打印的订单')
                return
            }
            this.LODOP = getLodop()
            if (this.LODOP) {
                this.$refs['invoice_modal'].setValue();
            }
        },
        // 发货单打印完成/未打印回调
        handleInvoicePreview() {
            this.isEachPrint = false;
            // 清空选中数据
            this.selectedData = []
            // 清空回调请求数据
            this.postData = []
            // 刷新列表
            this.refreshTable()
        },
        // 订单打印校验
        validOrderPrint() {
            return new Promise((resolve => {
                let order_id = [], order_goods_id = [];
                this.selectedData.forEach(item => {
                    order_id.push(item.order_id);
                    order_goods_id.push(...item.order_goods_id);
                })
                let params = {
                    order_id,
                    order_goods_id,
                    express_template_id: this.model.express_template_id
                }
                this.$api.eOrderApi.validOrderPrint(params).then(res => {
                    if (res.error === 0) {
                        if (!res.data.status) {
                            this.$Modal.confirm({
                                title: '提示',
                                content: res.data.message,
                                onOk: () => {

                                }
                            })
                        } else {
                            resolve();
                        }
                    }
                })
            }))
        },
        // 修改电子面单模板选中项
        changeExpressTemplate(id) {
            console.log('change-express-template', id)
            this.eOrderTempList.forEach(item => {
                if (item.value === id) {
                    this.expressTemplate = {
                        is_sub: 0,
                        ...item
                    };
                }
            })
            console.log('express-temp', this.expressTemplate)
        },
        // 当选择多个订单时，子母单模板禁用
        isTemplateDisabled(item) {
            return this.selectedData?.length > 1 && 1 === +item.is_sub;
        },
        // 设置电子面单模板的默认项
        setEOrderTemplateDefault() {
            this.model.express_template_id = '';
            this.model.number = '';
            this.expressTemplate = {
                is_sub: 0
            }
            this.eOrderTempList.forEach(item => {
                if (item.is_default === 1 && this.selectedData.length === 1) {
                    this.model.express_template_id = item.value;
                    this.changeExpressTemplate(item.value);
                }
            })
        },
        // 设置发件人模板默认项
        setSenderTemplateDefault() {
            this.model.consigner_template_id = '';
            this.senderTempList.forEach(item => {
                if (1 === +item.is_default) {
                    this.model.consigner_template_id = item.value;
                }
            })
        }
    },
}
</script>

<style scoped lang="scss">
.container {
    background-color: $background-color;
    margin: 20px auto;
    .table-list-wrap {
        background-color: #ffffff;
        padding: 0 20px;
        border-radius: 2px;
        position: relative;
        .btn-wrap {
            padding-top: 20px;
            padding-left: 20px;
        }
        .operate {
            padding-top: 16px;
            padding-bottom: 16px;
            padding-left: 17px;
            border-bottom: 1px solid $border-color;
            display: flex;
            align-items: center;
            /deep/ .ivu-checkbox-wrapper {
                margin-right: 10px;
            }
        }
    }
}
.modal-content {
    padding-top: 30px;
    padding-left: 20px;
}
</style>
