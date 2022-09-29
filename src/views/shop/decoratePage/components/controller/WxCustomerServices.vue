/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="select-good-type">
        <div class="type-table">
            <Table
                border
                :columns="columns"
                :data="currentRow"
                size="small"
            ></Table>
            <div class="add" @click="selectLink" v-if="!currentRow.length">
                +添加客服
            </div>
        </div>
         <!--微信客服 链接选择器-->
        <customerservice-selector
            v-model="show"
            :current="currentRow[0]"
            @on-cancel="handleCancel"
            @on-change="handleChange"
        ></customerservice-selector>
    </div>
</template>

<script>
import mixin from "./mixin.js";
import CustomerserviceSelector from "@/components/selector/CustomerServiceSelector";
export default {
    components: {
        CustomerserviceSelector
    },
    props: {
        currentUrl: {
            type: Object,
            default: () => {}
        },
    },
    mixins: [mixin],
    data() {
        return {
            show: false,
            currentRow: [],
            columns: [
                {
                    key: "name",
                    title: "客服名称",
                    align: "left",
                    tooltip: true,
                },
                {
                    key: "option",
                    title: "操作",
                    align: "center",
                    width: 100,
                    render: (h, params) => {
                        return (
                            <p class="option" style="text-align:center;">
                                <span
                                    onClick={() => {
                                        this.selectLink(params);
                                    }}
                                >
                                    替换
                                </span>
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
    created() {
        if(this.currentUrl.customerName) {
            this.currentRow = [];
            this.currentRow.push({
                name: this.currentUrl.customerName,
                link: this.currentUrl.link_url
            });
        }else if(this.currentUrl.customerlink){//详情页 底部导航传过来的参数
            this.currentRow.push({
                name: this.currentUrl.customerWeixinName,
                link: this.currentUrl.customerlink
            });
        }
    },
    methods: {
        delete() {
            this.currentRow = [];
            this.$emit("on-change", {});
        },
        selectLink() {
            this.show = !this.show;
        },
        handleCancel() {
            this.show = false;
        },
        handleChange(val) {
            this.currentRow = [val]
            this.$emit("on-change", val);
        },
    },
};
</script>

<style lang="scss" scoped>
@import "./common.scss";
.select-good-type {
    /deep/ .select-link {
        display: inline-block;
        width: 300px;
        margin: 0 !important;
    }
    .type-table {
        /deep/.ivu-table-wrapper-with-border {
            width: 100%;
        }
        /deep/ thead {
            th {
                background: #f4f6f8 !important;
                border-right: none;
                padding: 0 10px;
            }
        }
        /deep/ .ivu-table-cell {
            padding: 10px 10px !important;
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
            background: #fff;
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
