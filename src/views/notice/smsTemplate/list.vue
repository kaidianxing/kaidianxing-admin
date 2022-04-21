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
    <div class="notice-sms-list" v-loading="loading">
        <kdx-header-bar>
            <template #header>
                <Button type="primary" @click="handlerAdd">+添加模板</Button>
            </template>
            <Form ref="form" :model="search" :label-width="120" inline @submit.native.prevent>
                <FormItem label="模板名称：">
                    <Input type="text" v-model="search.name" placeholder="请输入关键字" class="width-340"
                           @on-enter="handleSearch"/>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button class="mL-20" type="text" @click="handleReset">重置</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="sms-list" v-loading="loading">
            <Table ref="table" :columns="columns" :data="data" @on-selection-change="selectChange"></Table>
            <div class="footer-action" v-if="data.length > 0">
                <Checkbox v-model="isSelectAll" @on-change="checkboxChange"></Checkbox>
                <!--<Button :disabled="selectDisabled" @click="bulkchangeState(1)">启用</Button>
                <Button :disabled="selectDisabled" @click="bulkchangeState(0)">禁用</Button>-->
                <Button :disabled="selectDisabled" @click="bulkDelete">删除</Button>
            </div>
            <div class="footer-page">
                <kdx-page-component ref="page" :total="page.total" @on-change="changePage"></kdx-page-component>
            </div>
        </div>

        <!--会员充值、积分、余额充值-->
        <kdx-modal-frame v-model="sendModal" title="测试发送" @on-cancel="handleCancel" @on-ok="handleOk">
            <div class="send-modal">
                <Form ref="sendModal" :label-width="120" :model="submitSendData" :rules="sendRule">
                    <FormItem label="手机号：" style="margin-top: 20px;" prop="mobile">
                        <Input class="width-340" v-model="submitSendData.mobile" placeholder="请输入被发送手机号"></Input>
                    </FormItem>
                    <FormItem label="数据值：" required>
                        <div class="data-value" v-for="(item, index) in sendData.data" :key="index"
                             style="margin-bottom: 20px;">
                            <Input class="width-340" v-model="item.data_shop" placeholder="此处请填写变量">
                                <span slot="prepend" style="padding: 4px 32px;">{{ item.data_temp }}</span>
                            </Input>
                        </div>
                    </FormItem>
                </Form>
            </div>
        </kdx-modal-frame>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            loading: false,
            sendModal: false,
            sendData: {},
            sms_template_quantity: '', // 短信模板条数
            submitSendData: {
                mobile: ''
            },
            page: {
                pageSize: 10,
                pageNumber: 1
            },
            isSelectAll: false,
            selectRows: [], // 选中项
            search: {
                name: ''
            },
            type: [
                {
                    id: 'all',
                    text: '全部'
                },
                {
                    id: 'aliyun',
                    text: '阿里云'
                },
                {
                    id: 'juhe',
                    text: '聚合'
                }
            ],
            status: [
                {
                    id: 'all',
                    text: '全部'
                },
                {
                    id: 0,
                    text: '禁用'
                },
                {
                    id: 1,
                    text: '启用'
                }
            ],
            data: [],
            columns: [
                {
                    type: 'selection',
                    width: 40,
                    align: 'center'
                },
                {
                    title: '模板ID',
                    key: 'sms_tpl_id',
                },
                {
                    title: '模板名称',
                    key: 'name',
                },
                {
                    title: '短信内容',
                    key: 'content',
                },
                {
                    title: '发送条件',
                    key: 'scene',
                },
                {
                    title: '状态',
                    key: 'state',
                    render: (h, params) => {
                        return (
                            params.row.state == 1 ? <kdx-tag-label type="success">应用中</kdx-tag-label> :
                                <kdx-tag-label type="disabled">未应用</kdx-tag-label>
                        )
                    }
                },
                {
                    title: '创建时间',
                    key: 'created_at',

                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'right',
                    render: (h, params) => {
                        return (
                            <div>
                                <Button type="text" class="rr-brand-color"
                                        onClick={() => this.changeState(params.row)}>{params.row.state == 1 ? '禁用' : '启用'}</Button>
                                <Button type="text" class="rr-brand-color marginL-10" onClick={() => {
                                    this.handleEdit(params.row.id, params.row.audit)
                                }}>编辑</Button>
                                <Button type="text" class="rr-brand-color marginL-10" onClick={() => {
                                    this.handleDelete(params.row.id)
                                }}>删除</Button>
                            </div>
                        )
                    }
                }
            ],
            sendRule: {
                mobile: [
                    {required: true, message: '请填写手机号', trigger: 'blur'},
                    {pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: '手机号错误', trigger: 'blur'}
                ]
            },
            recharge: {
                list: []
            }
        }
    },
    computed: {
        // 下方按钮是否可操作
        selectDisabled() {
            return this.selectRows.length === 0;
        },
        rechargeDisabled() {
            let pluginsPerm = this.$store.state?.config?.apps?.notice;
            return pluginsPerm?.is_forever != 1 && pluginsPerm?.about_expire == 1 && pluginsPerm?.is_free !== 1 && pluginsPerm?.shop_app_status == 0;
        }
    },
    created() {
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            this.loading = true;
            let obj = {
                ...this.search,
                type: this.search.type == 'all' ? '' : this.search.type,
                state: this.search.state == 'all' ? '' : this.search.state,
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
                pager: 1
            };
            this.$api.noticeApi.getSmsList(obj).then(res => {
                if (res.error == 0) {
                    this.page.total = res.total;
                    this.data = res.list;
                    this.sms_template_quantity = res.sms_template_quantity
                }
                this.loading = false;
            })
        },
        handlerAdd() {
            if (this.sms_template_quantity == 0) {
                this.$Message.error('您的短信模板数量已用完');
                return;
            }
            this.$router.push({
                path: '/notice/smsTemplate/add',
            })
        },
        // 选中项发生变化
        selectChange(selection) {
            this.selectRows = selection;
            this.isSelectAll = this.selectRows.length === this.data.length;
        },
        // 表格下方全选按钮
        checkboxChange(status) {
            this.$refs['table'].selectAll(status);
        },
        handleEdit(id, audit) {
            this.$router.push({
                path: '/notice/smsTemplate/edit',
                query: {
                    id: id,
                    disabled: audit == 0 ? false : true
                }
            });
        },
        changeState(item) {
            this.$api.noticeApi.changeSmsState({id: item.id, state: item.state == 0 ? 1 : 0}).then(res => {
                if (res.error == 0) {
                    this.getList();
                    this.$Message.success('修改成功')
                }
            })
        },
        bulkchangeState(state) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认批量修改',
                onOk: () => {
                    let ids = this.selectRows.map(item => item.id);
                    this.$api.noticeApi.changeSmsState({id: ids, state: state}).then(res => {
                        if (res.error == 0) {
                            this.getList();
                            this.$Message.success('修改成功')
                        }
                    })
                },
                onCancel: () => {
                }
            });
        },
        handleDelete(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认删除',
                onOk: () => {
                    this.$api.noticeApi.deleteSms({id: id}).then(res => {
                        if (res.error == 0) {
                            this.getList();
                            this.$Message.success('删除成功')
                        }
                    })
                },
                onCancel: () => {
                }
            });
        },
        // 批量删除
        bulkDelete() {
            this.$Modal.confirm({
                title: '提示',
                content: '确认批量删除',
                onOk: () => {
                    let ids = this.selectRows.map(item => item.id);
                    this.$api.noticeApi.deleteSms({id: ids}).then(res => {
                        if (res.error == 0) {
                            this.getList();
                            this.$Message.success('删除成功')
                        }
                    })
                },
                onCancel: () => {
                }
            });
        },
        // 重置页码
        reset() {
            this.$refs['page'].reset();
        },
        changePage(page) {
            this.page = page;
            this.getList();
        },
        handleSearch() {
            this.getList()
        },
        handleCancel() {
            this.sendModal = false
        },
        handleOk() {
            this.$refs['sendModal'].validate(valid => {
                if (valid) {
                    let result = this.sendData.data.every(item => item.data_shop)
                    if (!result) {
                        this.$Message.error('请填写数据值')
                    } else {
                        this.submitSend()
                    }
                }
            });
        },
        submitSend() {
            let obj = {
                id: this.sendData.id,
                mobile: this.submitSendData.mobile
            };
            let data = {};
            for (let i = 0; i < this.sendData.data.length; i++) {
                data[this.sendData.data[i].data_temp] = this.sendData.data[i].data_shop;
            }
            obj.data = data;
            this.$api.noticeApi.setSendData(obj).then(res => {
                if (res.error == 0) {
                    this.$Message.success('发送成功')
                }
                this.sendModal = false;
            });
        },
        handleRecharge() {
            this.getBuyList();
        },
        rechargeRefresh() {
            this.reset();
            this.getList();
        },
        handleReset() {
            this.search = {
                type: 'all',
                state: 'all',
                keyword: ''
            };
            this.getList()
        },
        getBuyList() {
            this.loading = true;
            this.$api.noticeApi.getSmsPlan().then(res => {
                this.loading = false;
                let data = [];
                if (!res.template_plan?.length) {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '还未配置短信模板购买套餐，请联系管理员进行配置',
                        onOk: () => {

                        }
                    })
                    return;
                }
                res.template_plan.forEach(item => {
                    data.push({
                        id: item.id,
                        app_id: item.app_id,
                        title: `${item.duration}条`,
                        price: item.price,
                        number: item.duration,
                        priceItem: parseFloat(item.price / item.duration).toFixed(3),
                        unit: '条'
                    });
                });
                this.recharge.list = data;
                this.$nextTick(() => {
                    this.$refs['plan_recharge'].setValue();
                })
            });
        },
    },
}
</script>

<style lang="scss">
.notice-sms-list {
    background-color: $background-color;
    margin: 20px auto;

    .tip {
        @include font-12-24;
    }

    .hint-alert-component {
        margin-bottom: 10px;
    }

    .sms-list {
        padding: 0 20px;
        background-color: #ffffff;
        position: relative;

        .type {
            span {
                display: inline-block;
                padding: 2px 8px;
                font-size: 12px;
                line-height: 16px;
            }

            span.rr-brand-color {
                background: #F0FAFF;
            }

            span.success-color {
                background: #EDFFF3;
            }
        }

        .footer-page {
            border-top: 1px solid $border-color;
        }
    }
}
</style>
