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
    <div class='select-link' style='margin-bottom:10px;' @mouseenter='mouseenter'>
        <div class="body">
            <Input class='input' disabled :value="linkInfo.name" v-if='linkInfo.url' enter-button="修改"
                   style='border-left:0;flex:1;'>
                <i slot="prepend" :class='[icon]'></i>
                <span slot="append" v-if="enabled" style='padding:4px 16px;' @click='selectLink'>修改</span>
            </Input>
            <i-button @click='selectLink' style='padding:4px 6px;width:100%;text-align:left;flex:1;' :icon="btnIcon"
                      v-if='!linkInfo.url'>{{ btnText }}
            </i-button>
        </div>
        <!--链接选择器-->
      
        <union-selector v-model="show" v-if='loadSelector&&enabled' :tab-name="chooseTabs" :current="linkInfo"
                        @on-cancel="handleCancel" @on-change="changeLink"></union-selector>

    </div>
</template>

<script>
import UnionSelector from '../selector/LinkUnionSelector'

export default {
    inject: {
        'chooseTab': {
            default: 'LinkStorePageLink,LinkCouponLink,LinkCustomLink,LinkGoodsClassifyLink,LinkGoodsGroupLink,LinkGoodsLink,LinkLiverLink,LinkMarketingPage,LinkWxAppLink,LinkApplicationPlug'
        }
    },
    components: {
        UnionSelector
    },
    props: {
        enabled: {
            type: Boolean,
            default: true
        },
        showSelector: {
            type: Boolean,
            default: true
        },
        value: {
            type: Object,
            default: () => {

            }
        },
        btnText: {
            type: String,
            default: '选择链接'
        },
        icon: {
            type: String,
            default: 'ivu-icon ivu-icon-ios-link'
        },
        tabName: {
            type: String,
            default: 'LinkStorePageLink,LinkCouponLink,LinkCustomLink,LinkGoodsClassifyLink,LinkGoodsGroupLink,LinkGoodsLink,LinkLiverLink,LinkMarketingPage,LinkWxAppLink,LinkApplicationPlug'
        },
        btnIcon: {
            type: String,
            default: 'ios-link'
        }
    },
    watch: {
        value: {
            immediate: true,
            handler() {
                this.linkInfo = this.value;
            }
        }
    },
    data() {
        return {
            show: false,
            linkInfo: {
                url: '',
                name: ''
            },
            loadSelector: false,
            chooseTabs: ''
        }
    },
    created() {
        this.chooseTabs = this.chooseTab ? this.chooseTab : this.tabName;
    },
    methods: {
        mouseenter() {
            this.loadSelector = true
        },
        handleCancel() {
            this.show = false;
        },
        changeLink(val) {
            this.linkInfo = val;
            this.show = false;
            this.$emit('change', val);
        },
        selectLink() {
            if (this.showSelector) {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.show = true;
                    })
                })
            } else {
                this.$emit('click')
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.select-link {
    background: #FFFFFF;
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

            .iconfont {
                color: #2D8CF0 !important;
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
            color: #B8B9BD !important;
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
</style>
