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
    <div class="good-list-table-list">
        <Table ref="table" :columns="columns" :data="data" @on-selection-change="selectChange"></Table>
        <div class="footer-action" v-if="data.length > 0">
            <Checkbox v-model="isSelectAll" @on-change="checkboxChange"></Checkbox>
            <Button :disabled="selectDisabled" @click="settingBlackStatus('setting','1')">设置黑名单</Button>
            <Button :disabled="selectDisabled" @click="settingBlackStatus('cancel', '0')">取消黑名单</Button>
            <!--<Button :disabled="selectDisabled" @click="handleMoreDelete">批量删除</Button>-->
            <Button :disabled="selectDisabled" @click="editGroup">修改标签组</Button>
            <Button :disabled="selectDisabled" @click="editGrade">修改等级</Button>
        </div>
        <div class="footer-page">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
        </div>
        <!--分组修改-->
        <kdx-modal-frame v-model="group.modal" title="批量修改标签组" :width="400" @on-cancel="handleGroupCancel"
                     @on-ok="handleGroupOk">
            <Form ref="form-group" :label-width="120" style="margin-top:20px">
                <FormItem label="标签组：" prop="group">
                    <Select v-model="group.group_id" placeholder="请选择" class="width-160">
                        <Option v-for="item in groupList" :key="item.id" :value="item.id">{{item.group_name}}
                        </Option>
                    </Select>
                </FormItem>
            </Form>
        </kdx-modal-frame>
        <!--会员等级修改-->
        <kdx-modal-frame v-model="level.modal" title="批量修改会员等级" :width="400" @on-cancel="handleGradeCancel"
                     @on-ok="handleGradeOk">
            <Form ref="form-level" :label-width="120" style="margin-top:20px">
                <FormItem label="会员等级：" prop="group">
                    <Select v-model="level.level_id" placeholder="请选择" class="width-160">
                        <Option v-for="item in levelList" :key="item.id" :value="item.id">{{item.level_name}}
                        </Option>
                    </Select>
                </FormItem>
            </Form>
        </kdx-modal-frame>
    </div>
</template>

<script>
    export default {
        name: "TableList",
        props: {
            list: {
                type: Array,
                default: () => []
            },
            total: {
                type: [String, Number],
                default: 0
            },
            groupList: {
                type: Array,
                default: () => []
            },
            levelList:  {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                data: [], // 数据
                selectRows: [], // 选中项
                isSelectAll: false,
                group: {
                    modal: false,
                    group_id: ''
                }, // 标签组
                level: {
                    modal: false,
                    level_id: ''
                }, // 等级
                sourceHtml: '',
                columns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: '会员',
                        key: 'shop',
                        minWidth: 150,
                        render: (h, params) => {
                            return (
                                <kdx-hint-tooltip type="form" placement="right">
                                    <div class="vip-information" slot="header">
                                        <div class="user-image">
                                            <img src={this.$media(params.row.avatar)} onError={(e) => {this.replaceImage(e, 'avatar')}} />
                                        </div>
                                        <div class="vip-content">
                                            <p class="vip-name">{params.row.nickname || '-'}</p>
                                            <div class="vip-platform">
                                                {
                                                    params.row.source == 10 ? <span class="iconfont icon-H"></span> :
                                                    params.row.source == 20 ? <span class="iconfont icon-weixin"></span> :
                                                    params.row.source == 21 ? <span class="iconfont icon-weixinxiaochengxu"></span> :
                                                    params.row.source == 30 ? <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2"></kdx-svg-icon> :
                                                    params.row.source == 32 ? <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban"></kdx-svg-icon> :
                                                    params.row.source == 31 ? <kdx-svg-icon class="iconfont" type="icon-douyin"></kdx-svg-icon> :
                                                    params.row.source == 70 ? <span class="iconfont icon-PCduan"></span> : ''
                                                }
                                                {
                                                    params.row.is_black == 1 ?
                                                        <span class="table-blacklist">
                                                            <span class="blacklist-icon iconfont icon-huiyuan-heimingdan"></span>
                                                            <span>黑名单</span>
                                                        </span>
                                                        : ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <Form label-width={60}>
                                        <FormItem label="ID：">
                                            <span>{params.row.id}</span>
                                        </FormItem>
                                        <FormItem label="推荐人：">
                                            {
                                               params.row.inviter_name ?
                                                    <div class="invited-box">
                                                        <div class="image"><img class="invited-img"
                                                                                    src={this.$media(params.row.inviter_avatar)}
                                                                                    onError={(e) => {
                                                                                        this.replaceImage(e, 'avatar')
                                                                                    }}/></div>
                                                        <span>{params.row.inviter == 0 ? '' : [params.row.inviter]}{params.row.inviter_name}</span>
                                                    </div>
                                               : '无'
                                            }
                                        </FormItem>
                                        <FormItem label="手机号：">
                                            <span>{ params.row.mobile || '未绑定'}</span>
                                        </FormItem>
                                        <FormItem label="是否关注：">
                                            <span>{params.row.is_follow_name}</span>
                                        </FormItem>
                                        <FormItem label="状态：">
                                            <span>{params.row.is_black?'禁用':'正常'}</span>
                                        </FormItem>
                                    </Form>
                                </kdx-hint-tooltip>
                            )
                        }
                    },
                    {
                        title: '会员等级',
                        key: 'level_name',
                        minWidth: 80,
                        render: (h, params) => {
                            if (!params.row?.is_default_level) {
                                return (
                                    <div class="vip-grade">
                                        <kdx-svg-icon type="icon-huiyuan-bg" class="icon"></kdx-svg-icon>
                                        <span class="text">{params.row.level_name}</span>
                                    </div>
                                )
                            } else {
                                return (
                                    <div class="vip-grade">
                                        <span class="text">{params.row.level_name || '普通会员'}</span>
                                    </div>
                                )
                            }
                        },
                    },
                    {
                        title: '标签组',
                        key: 'group_name',
                        minWidth: 100,
                        render: (h, params) => {
                            if (params.row.group_name) {
                                let group =  params.row.group_name.split(',').map(item => {
                                    return (
                                        <kdx-tag-label type="info" size="small">{item}</kdx-tag-label>
                                    )
                                })
                                return (
                                    <div class="group-name">
                                        {group}
                                    </div>
                                )
                            } else {
                                return (
                                    <div>-</div>
                                )
                            }
                        }
                    },
                    {
                        title: '注册时间',
                        key: 'created_at',
                        width: 120,
                        render: (h, params) => {
                            return h('p', {
                                style: {
                                    'word-break': 'normal'
                                }
                            }, params.row.created_at);
                        }
                    },
                    {
                        title: '积分/余额',
                        key: 'credit',
                        minWidth: 120,
                        render: (h, params) => {
                            return h('div', [
                                h('p', [
                                    h('span', '积分：'),
                                    h('span', {
                                        class: {
                                            'vip-table-number': true
                                        }
                                    }, params.row.credit)
                                ]),
                                h('p', [
                                    h('span', '余额：'),
                                    h('span', {
                                        class: {
                                            'vip-table-number': true
                                        }
                                    }, params.row.balance)
                                ])
                            ]);
                        }
                    },
                    {
                        title: '成交',
                        key: 'order_count',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('p', [
                                    h('span', '订单：'),
                                    h('span', {
                                        class: {
                                            'vip-table-number': true
                                        }
                                    }, params.row.order_count)
                                ]),
                                h('p', [
                                    h('span', '金额：'),
                                    h('span', {
                                        class: {
                                            'vip-table-number': true
                                        }
                                    }, params.row.money_count?params.row.money_count:'0')
                                ])
                            ]);
                        }
                    },
                    {
                        title: '优惠券',
                        key: 'coupon_count',
                        minWidth: 80,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 120,
                        render: (h, params) => {
                            return (
                                <div class="action">
                                    <Button type="text" onClick={() => {this.handleEdit(params.row.id)}}>编辑</Button>
                                    <Button type="text" target="_blank" onClick={() => {this.toOrder(params.row.id)}}>订单</Button>
                                </div>
                            )
                        }
                    }
                ],
            };
        },
        watch: {
            list: {
                handler(newValue) {
                    this.data = newValue
                },
                immediate: true
            }
        },
        computed: {
            selectDisabled() {
                return this.selectRows.length === 0;
            },
            noManagePerm() { //管理权限
                return !this.$getPermMap('member.list.manage')
            },

        },
        methods: {

            reset(page){
                this.$refs.page.reset(page)
            },
            toOrder(id) {
                this.$utils.openNewWindowPage('/order/list/all', {
                    keywords: id,
                    search_field: 'member_id'
                });
            },
            // 修改黑名单状态
            settingBlackStatus(type, status) {
                let content = '', message = '';
                if (type === 'setting') {
                    content = '确认设置黑名单?'
                    message = '设置黑名单操作成功'
                } else if (type === 'cancel') {
                    content = '确认取消黑名单?'
                    message = '取消黑名单操作成功'
                }
                this.$Modal.confirm({
                    title: '提示',
                    content,
                    onOk: () => {
                        let ids = this.selectRows.map(item => item.id);
                        this.$api.memberApi.setMemberBlackStatus({id: ids, is_black: status}).then(res => {
                            if (res.error == 0) {
                                this.selectRows = []
                                this.isSelectAll = false
                                this.$Message.success(message);
                                this.$emit('getList')
                            }
                        })
                    },
                    onCancel: () => {
                    }
                });
            },
            // 多条删除
            handleMoreDelete() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除？',
                    onOk: () => {
                        let ids = this.selectRows.map(item => item.id);
                        this.$api.memberApi.deleteBatchMember({ids: ids}).then(res => {
                            if (res.error == 0) {
                                this.$Message.success('操作成功');
                                this.$emit('getList')
                            }
                        })
                    },
                    onCancel: () => {
                    }
                });
            },
            // 修改标签分组
            editGroup() {
                this.group.modal = true;
            },
            handleGroupCancel() {
                this.group.modal = false;
                this.group.group_id = '';
            },
            handleGroupOk() {
                let ids = this.selectRows.map(item => item.id);
                this.$api.memberApi.changeMemberGroup({id: ids, group_ids: this.group.group_id}).then(res => {
                    if (res.error == 0) {
                        this.$Message.success('操作成功');
                        this.$emit('getList')
                    }
                    this.group.modal = false;
                })
            },
            // 等级修改
            editGrade() {
                this.level.modal = true;
            },
            handleGradeCancel() {
                this.level.modal = false;
                this.level.level_id = '';
            },
            handleGradeOk() {
                let ids = this.selectRows.map(item => item.id);
                this.$api.memberApi.changeMemberLevel({id: ids, level_id: this.level.level_id}).then(res => {
                    if (res.error == 0) {
                        this.$Message.success('操作成功');
                        this.$emit('getList')
                    }
                    this.level.modal = false;
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
                this.data.forEach((item, index) => {
                    this.$set(this.data[index], '_checked', status);
                });
                if (status) {
                    this.selectRows = this.data;
                } else {
                    this.selectRows = [];
                }
            },
            changePage(page) {
                this.$emit('on-page-change', page);
                this.initFooterData();
            },
            // 初始化下方的checkbox
            initFooterData() {
                this.isSelectAll = false;
                this.selectRows = [];
            },
            // 编辑
            handleEdit(id) {
                this.$router.push({
                    path: '/member/detail',
                    query: {
                        id: id
                    }
                });
            },
            handleExport() {
                this.$refs.table.exportCsv({
                    filename: '会员',
                    columns: this.columns,
                    data: this.data
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
     .good-list-table-list {
        /deep/ .ivu-table {
            td {
                // 会员
                .vip-information {
                    display: flex;
                    flex-wrap: nowrap;
                    > .user-image {
                        width: 46px;
                        height: 46px;
                        border-radius: 100%;
                        border: 1px solid $border-color;
                        box-sizing:border-box;
                        > img {
                            width: 44px;
                            height: 44px;
                            border-radius: 50%;
                        }
                    }
                    > .vip-content {
                        padding-left: 10px;
                        height: 46px;
                        width:fit-content;
                        > .vip-name {
                            width: 100%;
                            padding-bottom: 4px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        > .vip-platform {
                            display: flex;
                            align-items: center;
                            > span {
                                display: block;
                            }
                            > .iconfont {
                                font-size: 20px;
                                border-radius: 100%;
                            }
                            .icon-weixin {
                                color: $success-color;
                            }
                            .icon-weixinxiaochengxu {
                                color: #677de0;
                            }
                            .icon-toutiaoxiaochengxu {
                                color: #239bff;
                            }

                            .icon-zhifubaoxiaochengxu {
                                color: #2094e7;
                            }

                            .icon-baiduxiaochengxu {
                                color: #306cff;
                            }

                            .icon-PCduan{
                                font-size: 16px;
                                color:#11aa9c ;

                            }
                            .icon-H {
                                color: #ff6004;
                            }
                            > .table-blacklist {
                                background-color: $background-color;
                                padding: 2px 6px;
                                @include font-12-16;
                                color: $text-first;
                                margin-left: 10px;
                                > .blacklist-icon {
                                    padding-right: 5px;
                                    color: $danger-color;
                                    vertical-align: bottom;
                                }
                            }
                        }
                    }
                }
                // 积分余额
                .vip-table-number {
                    color: $warning-color;
                }
                .group-name {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                    height: 20px;
                    .tag-label {
                        margin-right: 10px;
                    }
                }
                // 会员等级
                .vip-grade {
                    display: flex;
                    flex-wrap: nowrap;
                    .icon {
                        flex-shrink: 0;
                        .svg-icon {
                            font-size: 20px;
                            padding-right: 4px;
                            vertical-align: bottom;
                        }
                    }
                    .text {
                        width: 0;
                        flex: 1;
                    }
                }
                .action {
                    margin-right: -8px;
                    .ivu-btn-text {
                        margin-right: 8px;
                    }
                }
            }
        }
        /deep/ .ivu-table {
            // 会员等级
            .vip-grade {
                .text {
                    padding-left: 4px;
                    vertical-align: text-bottom;
                }
            }
        }
        .footer-action {
            padding: 16px 0;
            .ivu-checkbox-default {
                margin-right: 0;
                width: 40px;
                text-align: center;
                > span {
                    /*&:last-child {*/
                    /*    display: none;*/
                    /*}*/
                }
            }
            .ivu-btn-default {
                width: inherit;
                margin-left: 10px;
            }
        }
        .footer-page {
            border-top: 1px solid $border-color;
            padding: 20px 0;
            display: flex;
            justify-content: center;
        }
    }
    .hint-tooltip,
    .hint-tooltip-tooltip {
        width: 100%;
        overflow: hidden;
        .vip-content{
            overflow: hidden;
        }
    }
</style>
<style lang="scss">
    .hint-tooltip-text-content {
        .tooltip-form {
            .ivu-form {
                .ivu-form-item {
                    .ivu-form-item-content {
                        .invited-box {
                            display: flex;
                            flex-wrap: nowrap;
                            align-items: center;
                            transform: translateY(-5px);
                            >.image {
                                width: 24px;
                                height: 24px;
                                border: 1px solid $border-color;
                                border-radius: 100%;
                                overflow: hidden;
                                flex-shrink: 0;
                                >img {
                                    width: 100%;
                                    height: 100%;
                                    border-radius: 100%;
                                }
                            }
                            >span {
                                padding-left: 10px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
