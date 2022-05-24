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
    <div class="table-list">
        <Table ref="tab" :columns="columns" :data="data" v-loading="loading">
            <template #status="{row}">
                <kdx-tag-label :type="option.status[row.goods_status].type">{{ option.status[row.goods_status].title }}</kdx-tag-label>
            </template>
            <template #audit_status="{row}">
                <kdx-status-text :type="option.auditStatus[row.status].type">{{
                        option.auditStatus[row.status].title
                    }}
                </kdx-status-text>
            </template>
            <template #action="{row}">
                <!--审核成功不可编辑和删除-->
                <div class="action">
                    <Button v-if="row.status != '1'" type="text" :disabled="noManagePerm" @click="handleEdit(row)">编辑</Button>
                    <Button v-if="row.status == '9'" type="text" :disabled="noManagePerm" @click="handleDelete(row)">删除</Button>
                </div>
            </template>
        </Table>
        <div class="footer-page" v-show="total > 10">
            <kdx-page-component :current='current' :pageSize='pageSize' ref="page" :total="total"
                            @on-change="changePage"></kdx-page-component>
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
        // 每页多少条
        pageSize: {
            type: Number,
            default: 10
        },
        // 当前页码
        current: {
            type: Number,
            default: 1
        },
        total: {
            type: Number,
            default: 0
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            columns: [
                {
                    title: '审核单号',
                    key: 'audit_id'
                },
                {
                    title: '分类名称',
                    key: 'category_name',
                },
                {
                    title: '审核状态',
                    slot: 'audit_status',
                    maxWidth: 200
                },
                {
                    title: '操作',
                    slot: 'action',
                    maxWidth: 200
                }
            ],
            option: {
                status: {
                    1: {
                        title: '出售中',
                        type: 'success'
                    },
                    // 0: {
                    //     title: '已下架',
                    //     type: 'danger'
                    // },
                    2: {
                        title: '已售罄',
                        type: 'danger'
                    },
                    3: {
                        title: '仓库中',
                        type: 'warning'
                    },
                    4: {
                        title: '回收站',
                        type: 'disabled'
                    }
                },
                auditStatus: {
                    '0': {
                        title: '审核中',
                        type: 'warning'
                    },
                    '1': {
                        title: '审核成功',
                        type: 'success'
                    },
                    '9': {
                        title: '审核失败',
                        type: 'danger'
                    }
                }
            },
        };
    },
    computed: {
        noManagePerm(){//无管理权限
            return !this.$getPermMap('wxTransactionComponent.category.manage')
        },
    },
    methods: {
        changePage(page) {
            this.$emit('on-page-change', page);
        },
        // 重置页码
        reset(page) {
            this.$refs['page']?.reset(page);
        },
        handleEdit(row) {
           this.$emit('on-edit', row.id)
        },
        recallAudit(row) {
            this.$api.wxTransactionComponentApi.recallAudit({id: row.id}).then(res => {
                if (res.error === 0) {
                    this.$Message.success('撤销审核成功');
                    this.$emit('on-refresh');
                }
            });
        },
        handleDelete(row) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认删除？',
                onOk: () => {
                    this.$api.wxTransactionComponentApi.deleteCategoryAudit({id: row.id}).then(res => {
                        if (res.error === 0) {
                            this.$Message.success('商品删除成功');
                            this.$emit('on-refresh');
                        }
                    });
                }
            })
        },
    }
};
</script>

<style scoped lang="scss">
.table-list {
    padding: 0 20px 20px 20px;
    background-color: #ffffff;
    border-radius: 2px;

    .goods {
        display: flex;
        align-items: center;

        .image {
            width: 60px;
            height: 60px;
            border: 1px solid #E9EDEF;
            box-sizing: border-box;
            border-radius: 2px;
            overflow: hidden;
            flex-shrink: 0;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .content {
            padding-left: 10px;
            @include font-14-20;
            color: $text-first;
            @include font-multiple-omit(2);

            .mark {
                padding: 1px 3px;
                @include font-12-16;
                border-radius: 2px;
                margin-right: 5px;
            }

            .real {
                background-color: $brand-light;
                color: $brand-color;
            }

            .more {
                background-color: $warning-light;
                color: $warning-color;
            }

            .virtual {
                color: #00C5C5;
                background-color: #E6FFF9;
            }

            .card {
                color: $danger-color;
                background-color: $danger-light;
            }
        }

        .price {
            font-weight: bold;
        }
    }
}
.action {
    .ivu-btn {
        margin-right: 10px;
    }
}

.footer-page {
    //border-top: 1px solid $border-color;
    padding: 20px 0 0 0;
}
</style>
