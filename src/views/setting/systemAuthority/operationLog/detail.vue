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
    <div class="operation-log-detail">
        <div class="operation-log-detail-content flex">
            <div class="before" style="margin-right: 20px;">
                <div class="top flex">
                    <div class="title">
                        <i class="iconfont icon-send danger-color"></i><span class="danger-color">修改前</span>
                    </div>
                    <div class="type">操作类型：<span>{{title}}</span></div>
                </div>
                <div v-html="form1"></div>
            </div>
            <div class="after">
                <div class="top flex">
                    <div class="title">
                        <i class="iconfont icon-airplay success-color"></i><span class="success-color">修改后</span>
                    </div>
                    <div class="type">操作类型：<span>{{title}}</span></div>
                </div>
                <div v-html="form2"></div>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import {toForm} from './toFormRichText'
    export default {
        name: "detail",
        data() {
            return {
                form1: '',
                form2: '',
                title: ''
            }
        },
        computed: {},
        created() {},
        mounted() {
            this.detail(this.$route.query.id);
        },
        methods: {
            detail(id) {
                this.$api.settingApi.getOperateLogDetail({id}).then(res => {
                    if (res.error == 0) {
                        this.title = res.title;
                        res.dirty_primary = Array.isArray(res.dirty_primary)?{}:res.dirty_primary;
                        this.change(res.dirty_primary, res.primary);
                    }
                })
            },
            change(before, after) {
                this.form1 = toForm(before, after);
                this.form2 = toForm(after, before);
            }
        },
    }
</script>

<style lang="scss" scoped>
    .operation-log-detail {
        margin: 20px auto;
        .operation-log-detail-content {
            margin: 18px auto;
            color: $text-first;
            >div {
                padding: 0 40px 100px 30px;
                width: 50%;
                background-color: #fff;
                border-radius: 2px;
                box-sizing: border-box;
                .top {
                    justify-content: space-between;
                    height: 114px;
                    line-height: 150px;
                    border-bottom: 1px solid $border-color;
                    .title {
                        span {
                            margin-left: 10px;
                            line-height: 34px;
                            font-weight: 550;
                            font-size: 24px;
                        }
                    }
                    i {
                        font-size: 26px;
                    }
                }
            }
        }
        /deep/ .form-1 >.form-title{
            margin: 40px 0 20px;
            font-weight: bold;
            font-size: 16px;
            line-height: 22px;
        }
        /deep/ .form-2 >.form-title{
            font-weight: bold;
        }
        /deep/ .form-label,
        .form-value {
            margin-bottom: 14px;
            line-height: 20px;
            font-size: 14px;
            word-break: break-word;
        }
        /deep/ .form-label {
            flex-shrink: 0;
        }
        /deep/ .form-body{
            padding-left:20px;
        }
        /deep/ .before .del{
            color: $danger-color;
            font-weight: bold;
        }
        /deep/ .after .del{
            color: $success-color;
            font-weight: bold;
        }
        /deep/ .before .delRow{
            color: $danger-color !important;
            font-weight: bold;
        }
        /deep/ .after .delRow{
            color: $success-color !important;
            font-weight: bold;
        }
        /deep/ table{
            width:100%;
            margin-top: 14px;
            border-collapse:collapse;
            border-radius: 2px;
            thead tr {
                background-color: $background-color;
                border: 1px solid $border-color;
            }
            tbody {
                border: 1px solid $border-color;
                tr {
                    border-bottom: 1px solid $border-color;
                    &:last-child {
                        border: 0;
                    }
                }
            }
            td,th{
                height: 52px;
                border-collapse:collapse;
                text-align: center;
                vertical-align: middle;
                /*border:1px solid #ccc;*/
            }
        }
    }
</style>
