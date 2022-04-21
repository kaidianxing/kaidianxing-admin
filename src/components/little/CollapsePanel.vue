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
    <div class="collapse-panel">
        <Collapse simple @on-change="change">
            <Panel hide-arrow>
                <i class="ivu-icon icon-full-right iconfont"></i>{{value}}
                <p slot="content">
                    <slot></slot>
                </p>
            </Panel>
        </Collapse>
    </div>
</template>

<script>
    export default {
        name: "CollapsePanel",
        props: {
            // 折叠时显示的文字
            name: {
                type: String
            },
            // 展开时显示的文字
            expandName: {
                type: String
            }
        },
        data() {
            return {
                value: this.name,
            };
        },
        methods: {
            change(val) {
                if (val.length > 0) {
                    this.value = this.expandName || this.name;
                } else {
                    this.value = this.name;
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .collapse-panel {
        padding-top: 10px;

        .ivu-collapse {
            border: none;

            /deep/ .ivu-collapse-header {
                border: none;
                color: $brand-color;
                line-height: 20px;
                padding-left: 20px;
                height: inherit;
                margin-bottom: 30px;

                > .ivu-icon {
                    margin-right: 4px;
                    font-size: 16px;
                    color: $brand-color;
                    vertical-align: inherit;
                }
            }

            /deep/ .ivu-collapse-content {
                padding-left: 0;
                padding-bottom: 0;
            }
        }
    }
</style>
