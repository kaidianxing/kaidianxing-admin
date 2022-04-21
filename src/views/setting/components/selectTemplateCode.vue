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
        <div class="text-info">
            <div>点击变量后会自动插入选择的文本框的焦点位置，在发送给粉丝时系统会自动替换对应变量值</div>
            <div class="rr-brand-color">注意：以上模板消息变量只适用于系统类通知，会员群发工具不适用</div>
        </div>
        <div class="select">
            <Select v-model="code" placeholder="选择模板变量类型" @on-change="change">
                <Option v-for="item in list" :key="item.type" :value="item.name" >{{item.name}}</Option>
            </Select>
            <!--<Select v-model="search.state" placeholder="全部" class="width-160">
                <Option v-for="item in codeList" :key="item.id" :value="item.id">{{item.text}}</Option>
            </Select>-->
        </div>
        <div class="select-list" v-if="selectList.length > 0">
            <div v-for="(item, index) in selectList" :key="index">
                <div class="title" v-if="item.name">{{item.name}}</div>
                <div class="label-content flex">
                    <div class="label-item pointer" v-for="(childrenItem, childrenIndex) in  item.children" :key="childrenIndex" @click="chooseCode(childrenItem.name)">
                        <div class="label">{{childrenItem.name}}</div>
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
                let result = this.list.filter(item => item.name == e);
                this.selectList = result[0].children
            },
            chooseCode(name) {
                let data = `[${name}]`;
                this.$emit('chooseCode', data)
            }
        },
    }
</script>

<style lang="scss" scoped>
    .template-code {
        width: 100%;
        .text-info {
            padding: 10px;
            color: $text-third;
            font-size: 12px;
            line-height: 24px;
            border: 1px solid $border-color;
        }
        .select-list {
            font-size: 12px;
            line-height: 24px;
            border: 1px solid $border-color;
            .title {
                padding: 10px 15px;
                line-height: 17px;
                background-color: $background-color;
                color: $text-first;
                border-top: 1px solid $border-color;
                border-bottom: 1px solid $border-color;
            }
            .label-content {
                flex-wrap: wrap;
                padding: 15px;
                .label-item {
                    padding: 7px;
                    margin-right: 5px;
                    margin-bottom: 10px;
                    background-color: #F4F6F8;
                    line-height: 12px;
                    border: 1px solid $border-color;
                }
            }
        }
    }
</style>