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
    <div class="template-code">
        <div class="title">变量选择</div>
        <div class="template-code-content">
            <div class="text-info">
                <kdx-hint-alert :show-icon="false">
                    <div class="text-info-tip">点击变量后会自动插入选择的文本框的焦点位置，在发送给粉丝时系统会自动替换对应变量值</div>
                    <div class="text-info-tip rr-brand-color">注意：以上模板消息变量只适用于系统类通知，会员群发工具不适用</div>
                </kdx-hint-alert>
            </div>
            <div class="select flex">
                <div class="label">变量类别：</div>
                <Select v-model="code" placeholder="选择模板变量类型" @on-change="change">
                    <Option v-for="item in list" :key="item.type" :value="item.label" >{{item.label}}</Option>
                </Select>
            </div>
            <div class="select-list" v-if="selectList.length > 0">
                <div class="select-list-child" v-for="(item, index) in selectList" :key="index">
                    <div class="select-list-title" v-if="item.value">{{item.label}}</div>
                    <div class="label-content flex">
                        <div class="label-item pointer" v-for="(childrenItem, childrenIndex) in  item.children" :key="childrenIndex" @click="chooseCode(childrenItem.value)">
                            <div class="label">{{childrenItem.label}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import codeList from "./codeJS";

    export default {
        name: "selectTemplateCode",
        components: {},
        props: {},
        data() {
            return {
                code: '',
                list: [],
                selectList: [], // 选中数据
            }
        },
        computed: {},
        created() {
            this.list = codeList
        },
        mounted() {
        },
        methods: {
            change(e) {
                let result = this.list.filter(item => item.label == e);
                this.selectList = result[0].children
            },
            chooseCode(data) {
                // let data = `[${name}]`;
                this.$emit('chooseCode', data)
            }
        },
    }
</script>

<style lang="scss" scoped>
    .template-code {
        width: 100%;
        height: 630px;
        color: $text-first;
        overflow: hidden;
        background-color: #fff;
        .title {
            padding-left: 20px;
            height: 60px;
            line-height: 60px;
            font-weight: bold;
            font-size: 16px;
            border-bottom: 1px solid $border-color;
        }
        .template-code-content {
            padding: 20px;
            .text-info {
                .text-info-tip {
                    font-size: 12px;
                    line-height: 24px;
                }
            }
            .select {
                margin-top: 30px;
                .label {
                    flex-shrink: 0;
                    width: 70px;
                    margin-right: 10px;
                    line-height: 30px;
                }
            }
            .select-list {
                height: 400px;
                margin-top: 10px;
                font-size: 12px;
                line-height: 24px;
                overflow-y: scroll;
                .select-list-child {
                    padding: 20px 20px 8px 20px;
                    margin-bottom: 10px;
                    background-color: $background-color;
                }
                .select-list-title {
                    margin-bottom: 10px;
                    line-height: 20px;
                    font-weight: bold;
                    font-size: 14px;
                }
                .label-content {
                    flex-wrap: wrap;
                    .label-item {
                        margin: 0 10px 10px 0;
                        padding: 2px 8px;
                        font-size: 14px;
                        line-height: 20px;
                        background-color: #fff;
                        border: 1px solid $border-color;
                    }
                }
            }
        }
    }
</style>