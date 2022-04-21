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
    <div class="select-good-type">
        <div class="type-table">
            <Table border :columns="columns" :data="getCate" size="small"></Table>
            <div class="add" @click="selectLink" v-if="!getCate.length">+添加分类</div>
        </div>
        <!--链接选择器-->
        <class-selector
            v-model="show"
            :current="getCate[0]"
            @on-cancel="handleCancel"
            @on-change="handleChange"
        ></class-selector>
    </div>
</template>

<script>
import mixin from '../mixin.js'
import ClassSelector from '@/components/selector/GoodsClassifySelector'
export default {
    components: {
        ClassSelector
    },
    props: {
        currentInfo: {
            type: Object,
            default: ()=>{}
        }
    },
    mixins: [mixin],
    data() {
        return {
            show: false,
            componentData: {},
            columns: [
                {
                    key: 'thumb',
                    title: '分类名称',
                    align: 'left',
                    render: (h, params) => {
                        return (
                            <div class="category">
                                <img
                                    src={this.$utils.media(params.row.thumb)}
                                    style={{ width: '40px', height: '40px' }}
                                    alt=""
                                />
                                <div class="title">{params.row.title}</div>
                            </div>
                        )
                    }
                },
                {
                    key: 'option',
                    title: '操作',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        return (
                            <p class="option" style="text-align:center;">
                                <span
                                    onClick={() => {
                                        this.selectLink(params)
                                    }}
                                >
                                    替换
                                </span>
                                <span
                                        onClick={() => {
                                            this.delete(params)
                                        }}
                                    >
                                        删除
                                    </span>
                            </p>
                        )
                    }
                }
            ]
        }
    },
    computed: {
        getCate() {
            let data = [
                {
                    thumb: this.componentData.params.catethumb,
                    title: this.componentData.params.catename,
                    id: this.componentData.params.cateid
                }
            ]
            if (!this.componentData.params.cateid) {
                return []
            }
            return data
        }
    },
    watch: {
        'componentData.params.goodssort': {
            immediate: true,
            handler() {
                // this.handleChange()
            }
        }
    },
    created(){
        this.componentData = this.currentInfo || this.currentModal
    },
    methods: {
         delete(){
            this.componentData.params.cateid = ''
            this.componentData.params.catethumb=''
            this.componentData.params.catename=''
            this.componentData.data = []
        },
        selectLink() {
            this.show = !this.show
        },
        handleCancel() {
            this.show = false
        },
        handleChange(
            val = {
                id: this.componentData.params?.cateid,
                name: this.componentData.params?.catename,
                thumb: this.componentData.params?.catethumb
            }
        ) {
            this.errorInfo?.id=='goods'&&this.$emit('validateGoodsForm')
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
            this.componentData.params.cateid = val?.id
            this.componentData.params.catename = val?.name
            this.componentData.params.catethumb = val?.thumb
            let params={
                pageCount: 1,
                pagesize: 50,
                status: 1,
                category_id: val?.id ?? '',
                label_field: isNaN(this.componentData.params.goodsdata * 1)
                    ? this.componentData.params.goodsdata
                    : '',
                sort: sort[this.componentData.params.goodssort].key,
                by: sort[this.componentData.params.goodssort].by
            }
            this.$api.goodsApi
                .goodsList(params)
                .then(res => {
                    if (res.error === 0) {
                        this.componentData.data = res.list.map(val => {
                            return {
                                thumb: val.thumb,
                                price: val.price,
                                productprice: val.original_price,
                                sales: val.sales*1+val.real_sales*1,
                                title: val.title,
                                sub_name: val.sub_name,
                                gid: val.id,
                                bargain: 0,
                                credit: 0,
                                ctype: 0
                            }
                        })
                    }
                })
                .catch()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../common.scss';
.select-good-type {
    /deep/ .select-link {
        display: inline-block;
        width: 300px;
        margin: 0 !important;
    }
    .type-table {
        /deep/ thead {
            th {
                background: #f4f6f8 !important;
                border-right: none;
                padding: 0 10px;
            }
        }
        /deep/ .ivu-table-cell {
            padding: 10px 0!important;
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
            img {
                margin: auto 10px;
                flex-shrink: 0;
            }
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
                color: #262b30;
                flex: 1;
                box-sizing: border-box;
                padding: 0;
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
            border: 1px solid #e9edef;
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
