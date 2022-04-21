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
    <div class="wechat-list" v-loading="loading">
        <div class="wechat-list-alert">
            <kdx-hint-alert :show-icon="false">
                <p>注意：</p>
                <p>请将公众平台模板消息所在行业选择为：<span class="bold warning-color">IT科技 / 互联网|电子商务 / 其他/其他</span>，所选行业不一致将会导致模板消息不可用。</p>
                <p>您的公众平台模板消息目前所属行业为：<span class="bold warning-color">{{ industry.join(' / ') }}</span> </p>
                <p>当前列表内的模板消息为您已申请的模板消息，您可以点击查看详情或者删除处理。</p>
            </kdx-hint-alert>
        </div>
        <kdx-header-bar>
            <Form ref="form" :model="search" :label-width="30" inline @submit.native.prevent>
                <FormItem>
                    <Input type="text" v-model="search.keyword" placeholder="请输入模板编码" class="width-340"
                           @on-enter="add"/>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="add">添加微信模板</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="weixin-template">
            <Table ref="table" :columns="columns" :data="data" @on-selection-change="selectChange"></Table>
            <div class="footer-action" v-if="data.length > 0">
                <Checkbox v-model="isSelectAll" @on-change="checkboxChange"></Checkbox>
                <Button :disabled="selectDisabled" @click="bulkDelete">删除</Button>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        components: {},
        props: {},
        data() {
            return {
                loading: false,
                isSelectAll: false,
                selectRows: [], // 选中项
                search: {
                    keyword: ''
                },
                data: [],
                industry: [], // 行业
                columns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    // {
                    //     title: '序号',
                    //     key: 'template_id'
                    // },
                    {
                        title: '模板名称',
                        key: 'title'
                    },
                    {
                        title: '所属行业',
                        key: 'primary_industry',
                        render: (h, params) => {
                            return (
                                <div>{
                                    params.row.primary_industry + (params.row.deputy_industry ? '/' + params.row.deputy_industry : '')
                                }</div>
                            );
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            return (
                                <div>
                                    <span class="rr-brand-color pointer" onClick={() => {
                                        this.handleEdit(params.row.template_id);
                                    }}>查看</span>
                                    <span class="rr-brand-color marginL-10 pointer" onClick={() => {
                                        this.handleDelete(params.row.template_id);
                                    }}>删除</span>
                                </div>
                            );
                        }
                    }
                ]
            };
        },
        computed: {
            // 下方按钮是否可操作
            selectDisabled() {
                return this.selectRows.length === 0;
            }
        },
        created() {
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList() {
                this.loading = true;
                this.$api.noticeApi.getWexinTemplate({}).then(res => {
                    this.loading = false;
                    if (res.error == 0) {
                        this.data = res.template_list;
                        this.industry = res.industry;
                    }
                });
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
            handleEdit(id) {
                this.$router.push({
                    path: '/notice/wxappTemplate/index',
                    query: {
                        id: id
                    }
                });
            },
            handleDelete(id) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除该模板',
                    onOk: () => {
                        this.$api.noticeApi.deleteWexinTemplate({id: id}).then(res => {
                            if (res.error == 0) {
                                this.getList();
                                this.$Message.success('删除成功');
                            }
                        });
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
                        let ids = this.selectRows.map(item => item.template_id);
                        this.$api.noticeApi.bulkDeleteWexinTemplate({ids: ids}).then(res => {
                            if (res.error == 0) {
                                this.getList();
                                this.$Message.success('删除成功');
                            }
                        });
                    },
                    onCancel: () => {
                    }
                });
            },
            // 重置页码
            reset() {
                this.$refs['page'].reset();
            },
            add() {
                if (!this.search.keyword) {
                    this.$Message.error('请输入模板编码');
                    return;
                }
                this.$api.noticeApi.addWexinTemplate({id: this.search.keyword}).then(res => {
                    if (res.error == 0) {
                        this.getList();
                        this.$Message.success('添加成功');
                    }
                });
            }
        },
    };
</script>

<style lang="scss">
    .wechat-list {
        margin: 20px auto;
        .wechat-list-alert {
            background-color: $background-color;
            padding-bottom: 10px;
            /deep/ .ivu-alert {
                line-height: 24px;
            }
        }
        .header-bar {
            .content {
                flex: 1;
            }
        }
        .weixin-template {
            padding: 0 20px;
            background: #fff;
        }
        .tip {
            color: #B8B9BD;
            @include font-12-16;
        }
    }

</style>
