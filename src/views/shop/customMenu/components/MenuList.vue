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
    <div class="shop-custom-menu-list">
        <Table :columns="columns" :data="data" v-loading="loading"></Table>
        <div class="footer-page">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MenuList",
        props: {
            data: {
                type: Array,
                default: () => []
            },
            total: {
                type: Number
            },
            loading: {
                type: Boolean,
                default: false
            },
            types: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                columns: [
                    {
                        title: '序号',
                        key: 'id',
                        width: 80,
                        render: (h, params) => {
                            let data;
                            if (parseInt(params.row.id) > 999) {
                                data = '999+';
                            } else {
                                data = params.row.id;
                            }
                            return (
                                <div>{data}</div>
                            );
                        }
                    },
                    {
                        title: '菜单名称',
                        key: 'name',
                        render: (h, params) => {
                            return (
                                <div className="menu-title">
                                    <span className="title">{params.row[params.column.key]}</span>
                                </div>
                            );
                        }
                    },
                    {
                        title: '应用类型',
                        key: 'type',
                        render: (h, params) => {
                            let item =this.types.filter(v=>v.type == params.row.type);
                            if(item&&item.length){
                                let iconTemp;
                                if(item[0].type =='10') {
                                    iconTemp = <span class="iconfont icon-shouye1" ></span>
                                }
                                else if(item[0].type =='20') {
                                    iconTemp =  <span class="iconfont icon-xiangqing"></span>
                                }
                                return (<div class="page-type">
                                        {iconTemp}
                                        <span class="page-name">{item[0].text}</span>
                                    </div>)
                            } else {
                                return (
                                    <div>-</div>
                                );
                            }
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            if (params.row.status === '1') {
                                return (
                                    <kdx-tag-label type="success">应用中</kdx-tag-label>
                                )
                            } else {
                                return (
                                    <kdx-tag-label type="disabled">未应用</kdx-tag-label>
                                )
                            }
                        }
                    },
                    {
                        title: '修改时间',
                        key: 'updated_at',
                        render: (h, params) => {
                            if (params.row.updated_at === '0000-00-00 00:00:00') {
                                return (
                                    <div>{params.row.created_at}</div>
                                )
                            } else {
                                return (
                                    <div>{params.row.updated_at}</div>
                                )
                            }
                        }
                    },
                    {
                        title: '预览',
                        key: 'thumb',
                        width: 368,
                        render: (h, params) => {
                            let src = this.$utils.media(params.row[params.column.key])
                            return (
                                <div class="preview">
                                    <img src={src} alt=""/>
                                </div>
                            );
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            let delTemp,pubTemp;
                            if(params.row.status == '0'){
                                delTemp =
                                    <Button type="text" disabled={this.noManagePerm} onClick={() => { this.handleDelete(params.row);}}>删除</Button>
                                pubTemp =  <Button type="text" disabled={this.noManagePerm} onClick={() => { this.handlePublish(params.row);}}>应用</Button>

                            }


                            // 自定义菜单支持删除
                            return (
                                <div class="action">
                                    <Button type="text" disabled={this.noManagePerm} to={`/decorate/diymenu?id=${params.row.id}&type=edit`}>编辑</Button>
                                    {delTemp}
                                    {pubTemp}
                                </div>
                            );
                        }
                    }
                ]
            };
        },
        computed: {
            noManagePerm() { //管理权限
                return !this.$getPermMap('diypage.menu.manage')
            },
        },
        methods: {
            changePage(page) {
                this.$emit('on-page-change', page);
            },
            reset() {
                this.$refs['page']?.reset();
            },
            handleDelete(row) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否删除该菜单?',
                    onOk: () => {
                        this.$api.shopApi.deleteNewMenu({id: row.id})
                            .then(res => {
                                if (res.error === 0) {
                                    this.$Message.success('菜单删除成功');
                                    this.$emit('on-refresh');
                                }
                            });
                    }
                });
            },
            handlePublish(row){
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否应用该菜单?',
                    onOk: () => {
                        this.$api.shopApi.menuApply({id: row.id})
                            .then(res => {
                                if (res.error === 0) {
                                    this.$Message.success('菜单应用成功');
                                    this.$emit('on-refresh');
                                }
                            });
                    }
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .shop-custom-menu-list {
        background-color: #ffffff;
        padding: 0 20px;
        /deep/ .ivu-table {
            td {
                @include font-14-20;
                word-break: normal;
                color: $text-first;
                .ivu-table-cell {
                    word-break: normal;
                }
                .menu-title {
                    > .default {
                        color: $brand-color;
                        background-color: $brand-light;
                        @include font-12-16;
                        padding: 2px 8px;
                        margin-left: 4px;
                    }
                }
                // 页面类型
                .page-type {
                    .iconfont {
                        border-radius: 100%;
                        color: #ffffff;
                        padding: 4px;
                    }
                    .iconfont.icon-shouye1 {
                        background-color: $brand-color;
                    }
                    .iconfont.icon-xiangqing {
                        background-color: $warning-color;
                    }
                    .iconfont.icon-huiyuanzhongxin1 {
                        background-color: $danger-color;
                    }
                    .page-name {
                        padding: 0 5px;
                        vertical-align: top;
                    }
                }
                // 状态
                .menu-status {
                    > .using {
                        padding: 2px 5px;
                        color: $success-color;
                        background-color: $success-light;
                    }
                }
                // 预览
                .preview {
                    border-radius: 2px;
                    border: 1px solid $border-color;
                    height: 45px;
                    > img {
                        max-width: 100%;
                        max-height: 100%;
                    }
                }
                // 操作
                .action {
                    .ivu-btn {
                        margin-right: 10px;
                    }
                }
            }
        }
        .footer-page {
            padding: 20px 0;
            display: flex;
            justify-content: center;
        }
    }
</style>
