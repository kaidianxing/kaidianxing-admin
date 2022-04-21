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
    <div class="app-table-list">
        <Table
            ref="table"
            :columns="columns"
            :data="data"
            v-loading="loading"
            @on-sort-change="changeSort"
        >
            <template slot-scope="{ row }" slot="action">
                <div class="action">
                    <Button
                        type="text"
                        :disabled="!row.can_install"
                        @click="handleInstall(row)"
                    >
                        {{ row.can_install ? '立即安装' : row.install_limit_text}}
                    </Button>
                </div>
            </template>
        </Table>
        <div class="footer-page" v-show="total > 10">
            <kdx-page-component
                ref="page"
                :total="total"
                @on-change="changePage"
            ></kdx-page-component>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TableList',
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        total: {
            type: [String, Number],
            default: 0,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        category: {
            type: [String, Number],
            default: 'all',
        },
    },
    data() {
        return {
            isSelectAll: false,
            columns: [
                {
                    title: '应用名称',
                    key: 'name',
                    minWidth: 150,
                    render: (h, params) => {
                        return (
                            <div class="app-name">
                                <div class="image">
                                    <img
                                        src={this.$utils.media(params.row.logo)}
                                        onError={(e) =>
                                            this.$utils.replaceImage(e, 'shop')
                                        }
                                    />
                                </div>
                                <div class="name-box">
                                    <div class="name">{params.row.name}</div>
                                    <div class="intro">
                                        {params.row.description}
                                    </div>
                                </div>
                            </div>
                        )
                    },
                },
                {
                    title: '更新时间',
                    slot: 'action',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 240,
                },
            ],
            appSettings: {
                notice: {
                    path: '/app/app/notice',
                    settingsTab: 'package'
                }
            }
        }
    },
    methods: {
        changePage(page) {
            this.$emit('on-page-change', page)
        },
        reset() {
            this.$refs['page']?.reset()
        },
        // 排序
        changeSort({ key, order }) {
            if (order === 'normal') {
                this.$emit('on-sort', {})
            } else {
                this.$emit('on-sort', { sort: key, by: order })
            }
        },
        // 安装
        handleInstall(data) {
            this.$emit('on-install', {
                identity: data.identity,
                app_id: data.id,
                logo: data.logo,
                name: data.name,
            })
        },
        editConfig(row) {
            let path = `/app/app/config?id=${row.id}&type=${row.identity}`;
            if (row.identity === 'assistant') {
                path = `/app/app/shop-assistant?id=${row.id}`
            }
            this.$router.push({
                path
            })
        },
        // 设置
        handleSetting(row) {
            let {path, settingsTab} = this.appSettings[row.identity];
            this.$router.push({
                path,
                query: {
                    tab: settingsTab,
                    id: row.id
                }
            })
        }
    },
}
</script>

<style scoped lang="scss">
.app-table-list {
    /deep/ .ivu-table {
        .ivu-table-header {
            tr {
                th {
                    background-color: $background-color;
                    border: none;
                }
            }
        }
        td {
            .app-name {
                display: flex;
                align-items: center;
                > .image {
                    width: 48px;
                    height: 48px;
                    overflow: hidden;
                    flex-shrink: 0;
                    border-radius: 100%;
                    box-sizing: border-box;
                    overflow: hidden;
                    margin-right: 10px;
                    > img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .name-box {
                    > .name {
                        @include font-16-22-bold;
                        color: $text-first;
                        padding-bottom: 4px;
                        padding-left: 0;
                    }
                    > .intro {
                        @include font-12-16;
                        color: $text-second;
                    }
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
        // border-top: 1px solid $border-color;
        padding: 20px 0;
        display: flex;
        justify-content: center;
    }
}
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
                        > .image {
                            width: 24px;
                            height: 24px;
                            border: 1px solid $border-color;
                            border-radius: 100%;
                            overflow: hidden;
                            flex-shrink: 0;
                            > img {
                                width: 100%;
                                height: 100%;
                                border-radius: 100%;
                            }
                        }
                        > span {
                            padding-left: 10px;
                        }
                    }
                }
            }
        }
    }
}
</style>
