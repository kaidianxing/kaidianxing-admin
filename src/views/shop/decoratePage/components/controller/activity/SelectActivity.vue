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
        <div style="display:flex;margin-bottom:0;">
            <p class="label" style="padding-right:10px;" :style="{width: activeType=='seckill'?'110px':'90px;'}">选择活动：</p>
            <div
                class="select-link"
                style="margin-bottom:10px;"
                @mouseenter="mouseenter"
            >
                <div class="body">
                    <Input
                        class="input"
                        disabled
                        :value="currentModal.params.activityData.title"
                        v-if="currentModal.params.activityData.id"
                        enter-button="修改"
                        style="border-left:0;flex:1;"
                    >
                        <i
                            slot="prepend"
                            class="ivu-icon ivu-icon-ios-link"
                        ></i>
                        <span
                            slot="append"
                            style="padding:4px 16px;"
                            @click="selectActive"
                            >修改</span
                        >
                    </Input>
                    <i-button
                        @click="selectActive"
                        style="padding:4px 6px;width:100%;text-align:left;flex:1;"
                        icon="ios-link"
                        v-if="!currentModal.params.activityData.id"
                        >选择活动</i-button
                    >
                </div>
            </div>
        </div>
        <div v-if="currentModal.params.activityData.id">
            <Table
                draggable
                border
                :columns="columns"
                :data="currentModal.data"
                size="small"
                :key="refreshkey"
                @on-drag-drop="draggeTable"
            ></Table>
            <div
                class="add"
                @click="addGood"
                v-if="
                    currentModal.data &&
                        currentModal.data.length < currentModal.params.goodsnum
                "
            >
                +添加商品({{ currentModal.data.length }}/{{
                    currentModal.params.goodsnum
                }})
            </div>
        </div>
        <Selector @on-change="selectChange" v-model="show" :activeData="currentModal.params.activityData" :goods="currentModal.data" :selectorType="selectorType"  :active-type="activeType"></Selector>
    </div>
</template>

<script>
import mixin from "../mixin.js";
import Selector from "@/components/selector/activity/SelectActivity";
export default {
    props: {
        type: String,
        activeType: String,
    },
    mixins: [mixin],
    components: {
        Selector,
    },
    data() {
        return {
            refreshkey: "0",
            loadSelector: false,
            show: false,
            selectorType: 'activity',
            columns: [
                {
                    key: "thumb",
                    width: 94,
                    title: "商品",
                    align: "left",
                    render: (h, params) => {
                        return (
                            <div class="goods-thumb">
                                <i class="iconfont icon-move move-icon"></i>
                                <img
                                    src={this.$utils.media(params.row.thumb)}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        display: "block",
                                        margin: "0 10px",
                                    }}
                                    alt=""
                                />
                            </div>
                        );
                    },
                },
                {
                    key: "title",
                    width: 220,
                    align: "center",
                    title: " ",
                    render: (h, params) => {
                        let active = "";
                        if (params.row.bargain) {
                            active = "砍";
                        } else if (params.row.credit) {
                            active = "积";
                        }
                        let getType;
                        switch (params.row.type) {
                            case '0':
                                getType = {
                                    goodsName : 'mark real',
                                    goodsText : '实'
                                }
                                break;

                            case '1':
                                getType = {
                                    goodsName : 'mark virtual',
                                    goodsText : '虚'
                                }
                                break;

                            case '2':
                                getType = {
                                    goodsName: 'mark secret',
                                    goodsText: '密'
                                }
                                break;
                        }
                        return (
                            <div class="title">
                                <span
                                    class="mark"
                                    style={{
                                        display:
                                            params.row.has_option === "1"
                                                ? "inline-block"
                                                : "none",
                                    }}
                                >
                                    多
                                </span>
                                <span
                                    class={getType.goodsName}>
                                        { getType.goodsText}
                                </span>
                                {active ? (
                                    <span class="icon">{active}</span>
                                ) : (
                                    ""
                                )}
                                {params.row.title}
                            </div>
                        );
                    },
                },
                {
                    key: "price",
                    title: "价格",
                    align: "center",
                    render: (h, params) => {
                        return (
                            <p class="price" style="text-align:center;">
                                ￥{params.row.price}
                            </p>
                        );
                    },
                },
                {
                    key: "option",
                    title: "操作",
                    align: "center",
                    render: (h, params) => {
                        return (
                            <p class="option" style="text-align:center;">
                                <span
                                    onClick={() => {
                                        this.delete(params);
                                    }}
                                >
                                    删除
                                </span>
                            </p>
                        );
                    },
                },
            ],
        };
    },
    methods: {
        mouseenter() {
            this.loadSelector = true;
        },
        draggeTable(nIndex, oIndex) {
            let item = { ...this.currentModal.data[nIndex] };
            Object.assign(
                this.currentModal.data[nIndex],
                this.currentModal.data[oIndex]
            );
            Object.assign(this.currentModal.data[oIndex], item);
        },
        handleChange(val) {
            this.currentModal.data.length = 0;
            let len =
                val.length <= this.currentModal.params.goodsnum
                    ? val.length
                    : this.currentModal.params.goodsnum;
            for (let i = 0; i < len; i++) {
                let item = val[i];
                let data = {
                    thumb: item.thumb,
                    price: item.price,
                    productprice: item.original_price,
                    sales: item.sales * 1,
                    sub_name: item.sub_name,
                    title: item.title,
                    gid: item.id,
                    id: item.id,
                    bargain: 0,
                    credit: 0,
                    ctype: 0,
                    has_option: item.has_option,
                    type: item.type,
                    seckillData: item.seckillData||  item?.activitys?.seckill || null,
                    groupsData: item?.activitys?.groups || null,
                    groupsRebateData: item?.activitys?.groupsRebate || null,
                    groupsFissionData: item?.activitys?.groupsFission || null
                }
                if (this.activeType === 'groups') {
                    data.productprice = item.min_price;
                }
                this.currentModal.data.push(data);
            }
            this.refreshkey = Math.random();
            this.errorInfo?.id == "goods" && this.$emit("validateGoodsForm");
            this.refreshCurrentModal()
        },
        delete(params) {
            this.currentModal.data.splice(params.index, 1);
            this.refreshCurrentModal()
        },
        selectChange({activeData,goods}){
            this.handleChange(goods)
            this.currentModal.params.activityData = activeData;
            this.currentModal.params.activitygoodscount = activeData.goods_count;
            this.show= false
        },
        addGood() {
            this.selectorType = 'goods'
            this.show = true
        },
        selectActive() {
            this.selectorType = 'activity'
            this.show = true
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../common.scss";
.select-good1 {
    /deep/ .ivu-input-icon-validate {
        display: none!important;
    }
    /deep/ .ivu-table-cell {
        padding: 10px 0 !important;
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

    /deep/ .goods-thumb {
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
        /*display: flex;*/
        // align-items: center;
        /* text/first */
        color: #262b30;
        text-align: left;
        @include font-multiple-omit(3) .mark {
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
                background-color: #f0faff;
                color: $brand-color;
            }
            &.virtual {
                background-color: #e6fff9;
                color: #00c5c5;
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

.select-link {
    background: #ffffff;
    border-radius: 2px;
    display: block;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;

    .body {
        box-sizing: border-box;
        display: flex;
        /deep/ .ivu-input:not(:hover) {
            border-left-color: #fff;
        }
        /deep/ .ivu-input.ivu-input-disabled {
            color: #515a6e;
            background: #fff;
        }
        /deep/ .ivu-input-group-append {
            padding-left: 16px;
            padding-right: 16px;
            color: $brand-color;
            cursor: pointer;
            padding: 0;
        }
        .ivu-btn {
            .ivu-icon {
                color: #515a6e !important;
            }

            &:hover {
                border: 1px solid $brand-color;
            }
        }
    }
    /deep/ .ivu-btn-default {
        color: $brand-color;
    }
    /deep/ .input {
        box-sizing: border-box;
        width: 100%;
        .ivu-input-search {
            color: #b8b9bd !important;
        }
        .ivu-input-search:hover {
            color: #fff !important;
        }
    }
    /deep/ .ivu-input-group-append {
        background-color: #fff;
        .ivu-btn:hover {
            color: $brand-color;
            box-shadow: none;
            border: 1px solid $brand-color;
        }
    }
    /deep/ .ivu-input-group-prepend {
        background-color: #fff;
    }
    .addItem {
        width: 100%;
        margin-top: 10px;
    }
}

.label {
    box-sizing: border-box;
    width: 90px;
    text-align: right;
    flex-shrink: 0;
}
</style>
