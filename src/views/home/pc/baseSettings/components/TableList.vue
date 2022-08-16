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
    <div class="good-group-table-list">
        <Table ref="table" :columns="columns" :data="getTableData">
            <template slot-scope="{ row }" slot="showImg">
                <img class="advImg" :src="$media(row.img)" alt="">
            </template>
        </Table>
        <div class="footer-page">
            <!--<kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>-->
        </div>
    </div>
</template>

<script>
export default {
    name: "TableList",
    props: {
        data: {
            type: Array,
            default: () => []
        },
        total: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            columns: [
                {
                    title: '排序',
                    key: 'sort_order',
                    width: 100
                },
                {
                    title: '展示图片',
                    key: 'img',
                    slot: 'showImg'
                },
                {
                    title: '跳转链接',
                    key: 'url'
                },
                {
                    title: '创建时间',
                    key: 'created_at'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    render: (h, params) => {
                        return (
                            <div class="action">
                                <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                    this.$emit('tableEdit', params.row)
                                }}>编辑</Button>
                                <Button type="text" disabled={this.noManagePerm || params.row.is_default == '1'}
                                        onClick={() => {
                                            this.handleDelete(params.row);
                                        }}>删除</Button>
                            </div>
                        );
                    }
                }
            ],
        };
    },
    computed: {
        getTableData() {
            return this.data.map(item => {
                item._disabled = this.noManagePerm;
                return item;
            })
        },
        noManagePerm() { //管理权限
            return !this.$getPermMap('pc.home-ads.manage')
        },
        isDisabled() {
            return this.selectRows.length === 0;
        },
        selectHasDefault() {
            return this.selectRows.some(row => row.is_default == '1')
        }
    },
    methods: {
        // 删除
        handleDelete(row) {
            this.$Modal.confirm({
                title: '提示',
                content: '是否确认删除？',
                onOk: () => {
                    this.$api.homeApi.advertiseDelete({id: row.id})
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('删除成功');
                                this.$emit('on-refresh');
                            }
                        })
                        .catch();
                }
            });
        },
        // // 重置页码
        // reset(page) {
        //     this.$refs['page'].reset(page);
        // },
        // changePage(page) {
        //     this.$emit('on-page-change', page);
        // },
        // 下方的按钮初始化
        initFooterData() {
            this.isSelectAll = false;
            this.selectRows = [];
        }
    }
};
</script>

<style scoped lang="scss">

.good-group-table-list {
    /deep/.advImg{
        width: 100px;
        height: auto;
    }
    /deep/ .ivu-table {
        td {
            .action {
                margin-right: -8px;

                .ivu-btn-text {
                    margin-right: 8px;
                }
            }

        }

    }

    .footer-action {
        padding: 16px 0;
        border-bottom: 1px solid $border-color;

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
}
</style>
