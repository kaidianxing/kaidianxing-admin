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
    <div class='select-good-type'>
        <div class='type-table'>
            <Table border :columns="columns" :data="getCate" size="small"></Table>
            <div class='add' @click='selectLink' v-if='!getCate.length'>+添加分组</div>
        </div>
        <group-selector ref='groupSelector' :current='getCate[0]' @on-change='selectGroup'></group-selector>
    </div>
</template>

<script>
import GroupSelector from '@/components/selector/GoodsGroupSelector'

export default {
    components: {
        GroupSelector
    },
    props: ['currentInfo'],//object
    data() {
        return {
            componentData: {
                params: {
                    groupid: '',
                    groupname: '',
                    goodssort: 0
                },
                data: []
            },
            columns: [{
                key: 'thumb',
                title: '分组名称',
                align: 'left',
                render: (h, params) => {
                    return <div class='category'>
                        <div class='title'>
                            {params.row.title}
                        </div>
                    </div>
                }
            },
                {
                    key: 'option',
                    title: '操作',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        return (<p class="option" style='text-align:center;'>
                            <span onClick={() => {
                                this.selectLink(params)
                            }}>替换</span>
                            <span
                                onClick={() => {
                                    this.delete(params)
                                }}
                            >
                                        删除
                                    </span>
                        </p>)
                    }
                }],
        }
    },
    watch: {
        'componentData.data': {
            deep: true,
            handler() {
                console.log('deep')
                // this.handleChange()
                this.$emit('handleChange', this.componentData)
            }
        }
    },
    computed: {
        getCate() {
            if (!this.componentData.params.groupid) {
                return [];
            }
            let data = [{
                title: this.componentData.params.groupname,
                id: this.componentData.params.groupid,
            }]

            return data
        }
    },
    created() {
        if (!Array.isArray(this.currentInfo) && typeof this.currentInfo === 'object') {//不是数组的情况下赋值
            this.componentData = {
                params: {
                    groupid:  this.currentInfo.params.groupid || '',
                    groupname: this.currentInfo.params.groupname || '',
                    goodssort: this.currentInfo.params.goodssort || 0,
                },
                data: this.currentInfo.params.data || []
            }
        }
    },
    methods: {
        delete() {
            this.componentData = {
                params: {
                    groupid: '',
                    groupname: '',
                    goodssort: 0
                },
                data: []
            }
        },
        selectGroup(val = {
            id: this.componentData.params?.groupid,
            name: this.componentData.params?.groupname
        }) {
            this.errorInfo?.id == 'goods' && this.$emit('validateGoodsForm')
            if (!val.id) {
                this.componentData.data = []
                return
            }

            let sort = {
                0: {
                    key: '',
                    by: 'desc'
                },
                1: {
                    key: 'sales',
                    by: 'desc'
                },
                2: {
                    key: 'price',
                    by: 'desc'
                },
                3: {
                    key: 'price',
                    by: 'asc'
                }
            }
            this.componentData.params.groupname = val.name;
            this.componentData.params.groupid = val.id;
            let params = {
                pageCount: 1,
                pagesize: 50,
                status: 1,
                group_id: val?.id ?? '',
                sort: sort[this.componentData.params.goodssort].key,
                by: sort[this.componentData.params.goodssort].by,
            };
            this.$api.goodsApi.goodsList(params).then(res => {
                if (res.error == 0) {
                    this.componentData.data = res.list.map(val => {
                        return {
                            thumb: val.thumb,
                            price: val.price,
                            productprice: val.original_price,
                            sales: val.sales * 1 + val.real_sales * 1,
                            title: val.title,
                            sub_title: val.sub_title,
                            gid: val.id,
                            bargain: 0,
                            credit: 0,
                            ctype: 0
                        }
                    })
                }
            })
        },
        selectLink() {
            this.$refs.groupSelector.setValue();
        },
    }
}
</script>

<style lang="scss" scoped>
@import './common.scss';

.select-good-type {
    /deep/ .select-link {
        display: inline-block;
        width: 300px;
        margin: 0 !important;
    }

    .type-table {
        /deep/ thead {
            th {
                background: #F4F6F8 !important;
                border-right: none;
                padding: 0 10px;
            }

        }

        /deep/ .ivu-table-cell {
            padding: 10px 0 !important;
        }

        /deep/ .ivu-table-row {
            td {
                border-right: none;
            }
        }

        /deep/ .category {
            display: flex;
            justify-content: flex-start;
            flex-wrap: nowrap;

            .title {
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: 14px;
                line-height: 20px;
                /* identical to box height, or 133% */
                display: flex;
                align-items: center;
                /* text/first */
                color: #262B30;
                flex: 1;
                box-sizing: border-box;
                padding: 0 10px;
            }
        }

        /deep/ .option {
            display: flex;
            justify-content: center;

            span {
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: 12px;
                line-height: 16px;
                /* identical to box height, or 133% */
                display: flex;
                cursor: pointer;
                /* brand/def */
                color: $brand-color;
                margin: auto 5px;
            }
        }

        .add {
            border: 1px solid #E9EDEF;
            border-top: none;
            box-sizing: border-box;
            line-height: 52px;
            text-align: center;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            color: $brand-color;
            cursor: pointer;
        }
    }
}
</style>
