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
    <Collapse class='collapse' value='1' :class='{noBorder:noBorder}' simple @on-change='change'>
        <Panel name="1">
            <slot name='label'>label</slot>
            <div slot="content">
                <slot>content</slot>
            </div>
        </Panel>
    </Collapse>
</template>

<script>
    export default {
        props: {
            noBorder: {
                type: Boolean,
                default: false
            }
        },
        inject:['resizeParent'],
        data() {
            return {
                currentIdx: []
            }
        },
        methods: {
            change(idx) {
                this.currentIdx = idx;
                if(typeof this.resizeParent=='function'){
                    this.resizeParent()
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                let eles = document.querySelector('.collapse .ivu-collapse-header .ivu-icon-ios-arrow-forward');
                if (eles) {
                    var classVal = eles.getAttribute("class");
                    classVal = classVal.replace("ivu-icon-ios-arrow-forward", "ivu-icon-md-arrow-dropright");
                    eles.setAttribute("class", classVal);
                }
            })
        }
    }
</script>

<style lang="scss" scoped>
    .collapse {
        border-top: 0;
        margin-bottom: 10px;
        border-color: #e9edef;
        &.noBorder {
            border: none;
        }
        /deep/ .ivu-collapse-item {
            padding: 0;
            .ivu-collapse-header {
                padding: 0;
                margin-bottom: 20px;
                .ivu-icon {
                    margin: 0;
                    color: #939799;
                    font-size: 15px;
                }
            }
            .ivu-collapse-content,
            .ivu-collapse-content-box {
                padding: 0;
            }
        }
    }
</style>