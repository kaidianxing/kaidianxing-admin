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
    <div class="select-good1">
        <Table draggable border :columns="columns" :data="componentData.data" size="small" :key="refreshkey" @on-drag-drop="draggeTable"></Table>
        <div class="add" @click="addGood" v-if="componentData.data && componentData.data.length < 50">+添加商品({{componentData.data.length}}/50)</div>
        <!--商品选择器-->
        <goods-selector
            v-model="show"
            multiple
            :limit="50"
            :current-list="componentData.data"
            @on-cancel="handleCancel"
            @on-change="handleChange"
        ></goods-selector>
        <!--商品单选选择器-->
        <goods-selector
            v-model="singleShow"
            :current="getSingData"
            @on-cancel="singleCancel"
            @on-change="singleChange"
        ></goods-selector>
    </div>
</template>

<script>
import mixin from '../mixin.js'
import GoodsSelector from '@/components/selector/GoodsSelector'
export default {
    components: { GoodsSelector },
    mixins: [mixin],
    props: {
        currentInfo: {
            type: Object,
            default: ()=>{}
        }
    },
    data() {
        return {
            componentData: {},
            refreshkey: '0',
            show: false,
            singleShow: false,
            columns: [
                {
                    key: 'thumb',
                    width: 94,
                    title: '商品',
                    align: 'left',
                    render: (h, params) => {
                        return (
                            <div class="goods-thumb">
                              <i class="iconfont icon-move move-icon"></i>
                              <img
                                src={this.$utils.media(params.row.thumb)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    display: 'block',
                                    margin:  '0 10px'
                                }}
                                alt=""
                                /></div>

                        )
                    }
                },
                {
                    key: 'title',
                    width: 220,
                    align: 'center',
                    title: ' ',
                    render: (h, params) => {
                        let active = ''
                        if (params.row.bargain) {
                            active = '砍'
                        } else if (params.row.credit) {
                            active = '积'
                        }
                        let getType;
                        let type = params.row.goodstype || params.row.type
                        switch (type) {
                            case '0':
                                getType =  {
                                    goodsName : 'mark real',
                                    goodsText : '实'
                                }
                                break

                            case '1':
                                getType = {
                                    goodsName : 'mark virtual',
                                    goodsText : '虚'
                                }
                                break

                            case '2':
                                getType  = {
                                    goodsName: 'mark secret',
                                    goodsText: '密'
                                }
                                break
                        }
                        return (
                            <div class="title">
                                <span class="mark" style={{display: params.row.has_option === '1' ? 'inline-block' : 'none'}}>多</span>
                                <span class= {getType.goodsName} >
                                    { getType.goodsText}
                                </span>
                                {active ? (
                                    <span class="icon">{active}</span>
                                ) : (
                                    ''
                                )}
                                {params.row.title}
                            </div>
                        )
                    }
                },
                {
                    key: 'price',
                    title: '价格',
                    align: 'center',
                    render: (h, params) => {
                        return (
                            <p class="price" style="text-align:center;">
                                ￥{params.row.price}
                            </p>
                        )
                    }
                },
                {
                    key: 'option',
                    title: '操作',
                    align: 'center',
                    render: (h, params) => {
                        return (
                            <p class="option" style="text-align:center;">
                                <span
                                    onClick={() => {
                                        this.replace(params)
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
            ],
            replaceIndex: -1 // 替换索引值
        }
    },
    computed: {
        getSingData() {
            return this.componentData.data[this.replaceIndex] || {}
        }
    },
    methods: {
        draggeTable(nIndex, oIndex){
            let item = { ...this.componentData.data[nIndex] }
            Object.assign(this.componentData.data[nIndex], this.componentData.data[oIndex])
            Object.assign(this.componentData.data[oIndex], item)
        },
        handleCancel() {
            this.show = false
        },
        singleCancel() {
            this.singleShow = false
        },
        handleChange(val) {
            this.componentData.data.length=0;
            let len = val.length<=50? val.length:50;
            for (let i = 0; i < len; i++) {
                let item = val[i]
                // 销量补充真实销量
                let sales = +item.sales
                if(item.real_sales) {
                    sales+= +item.real_sales
                }

                this.componentData.data.push({
                    thumb: item.thumb,
                    price: item.price,
                    productprice: item.original_price,
                    sales,
                    sub_name: item.sub_name,
                    title: item.title,
                    gid: item.id,
                    id: item.id,
                    bargain: 0,
                    credit: 0,
                    ctype: 0,
                    has_option: item.has_option,
                    type: item.type || item.goodstype,
                })
            }
            this.refreshkey = Math.random()
            this.errorInfo?.id=='goods'&&this.$emit('validateGoodsForm')
        },
        singleChange(val) {
            if(!val.id) {
                this.componentData.data.splice(this.replaceIndex,1)
            } else {
                Object.assign(this.componentData.data[this.replaceIndex], {
                    id:val.id,
                    thumb: val.thumb,
                    price: val.price,
                    productprice: val.original_price,
                    sales: val.sales * 1 + val.real_sales * 1,
                    title: val.title,
                    sub_name: val.sub_name,
                    gid: val.id,
                    bargain: 0,
                    credit: 0,
                    ctype: 0,
                    has_option: val.has_option,
                    type: val.type || val.goodstype,
                })
            }


            this.refreshkey = Math.random()
        },
        replace(params) {
            this.replaceIndex = params.index
            this.singleShow = true
        },
        delete(params) {
            this.componentData.data.splice(params.index, 1)
        },
        addGood() {
            this.show = true
        }
    },
    created(){
        this.componentData = this.currentInfo || this.currentModal
    },
    mounted() {
        if (this.componentData?.defaultData?.length) {
            this.componentData.data = []
            this.handleChange(this.componentData?.defaultData);
        }
    },
    beforeDestroy() {
        let data = this.componentData.data
        this.componentData.defaultData = data?.length?data: this.componentData.defaultData;
    }
}
</script>

<style lang="scss" scoped>
@import '../common.scss';
.select-good1 {
    /deep/ .ivu-table-cell {
        padding: 10px 0!important;
    }
    /deep/ .ivu-table-row {
        td {
            border-right: none;
        }
    }
    /deep/ thead {
        th {
            background: #f4f6f8 !important;
            border-right: none;

            &:first-child {
                .ivu-table-cell {
                    padding-left: 10px !important;
                }
            }
        }
    }

   /deep/  .goods-thumb {
        display: flex;
        align-items: center;
        .move-icon {
            margin-left: 10px;
            font-size: 24px;
            color: #b8b9bd;
        }
    }


    /deep/ .title {
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 16px;
        /* identical to box height, or 133% */
        display: flex;
        // align-items: center;
        /* text/first */
        color: #262b30;
        text-align: left;
        .mark {
            @include font-12-16;
            color: #ed4014;
            background-color: #ffefe6;
            border-radius: 2px;
            margin-right: 4px;
            width: 18px;
            height: 18px;
            display: inline-block;
            text-align: center;
            line-height: 18px;
            &:nth-last-child(2) {
                margin-right: 6px;
            }
            &.real {
                background-color: #F0FAFF;
                color: $brand-color;
            }
            &.virtual {
                background-color: #E6FFF9;
                color: #00C5C5;
            }
            &.secret {
                background-color: #FFCDD0;
                color: #FF000F;
            }
        }
        .icon {
            display: inline-block;
            width: 18px;
            height: 18px;
            line-height: 18px;
            background: #ffefe6;
            border-radius: 2px;
            color: #ed4014;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            text-align: center;
            margin: 0 5px;
            flex-shrink: 0;
        }
    }
    /deep/ .price {
        font-family: PingFang SC;
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        line-height: 16px;
        /* identical to box height, or 133% */
        text-align: center;
        /* text/first */
        color: #262b30;
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
            align-items: center;
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
</style>
