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
    <div class="header-card">
        <div class="title">佣金预览</div>
        <div class="content">
            <ul>
                <li>
                    <div class="icon">
                        <span class="iconfont icon-fenxiao-leijiyongjin-"></span>
                    </div>
                    <div class="right">
                        <div class="title">
                            提现待审核（元）
                        </div>
                        <div class="number number-font-family">
                            {{data.pre_check}}
                            <Button type="text" to="/commission/withdraw/list/waiting">去审核</Button>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="icon">
                        <span class="iconfont icon-fenxiao-tixian"></span>
                    </div>
                    <div class="right">
                        <div class="title">
                            提现待打款（元）
                        </div>
                        <div class="number number-font-family">
                            {{data.check_agree}}
                            <Button type="text" to="/commission/withdraw/list/paying">去打款</Button>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="icon">
                        <span class="iconfont icon-fenxiao-leijiyongjin"></span>
                    </div>
                    <div class="right">
                        <div class="title">
                            累计佣金 / 累计提现成功佣金
                        </div>
                        <div class="number number-font-family">
                           <span>
                               {{data.commission_total}}
                           </span>
                            /
                            <span class="success-number">
                                {{data.remit_success}}
                            </span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HeaderCard",
        props: {
            data: {
                type: Object,
                required: true
            }
        }
    };
</script>

<style scoped lang="scss">
    .header-card {
        padding: 20px 40px;
        background-color: #ffffff;
        margin-bottom: 10px;
        > .title {
            @include font-16-22-bold;
            color: $text-first;
            padding-bottom: 10px;
        }
        > .content {
            > ul {
                margin: 0 -10px;
                display: flex;
                flex-wrap: nowrap;
                flex: 1;
                > li {
                    margin: 0 10px;
                    border: 1px solid $border-color;
                    border-radius: 2px;
                    background-color: $global-bg3;
                    bos-sizing: border-box;
                    display: flex;
                    flex-wrap: nowrap;
                    flex: 1;
                    align-items: center;
                    padding: 30px 0 30px 30px;
                    .icon {
                        > span {
                            font-size: 36px;
                        }
                        .icon-fenxiao-leijiyongjin- {
                            color: $data-orange;
                        }
                        .icon-fenxiao-tixian {
                            color: $data-red;
                        }
                        .icon-fenxiao-leijiyongjin {
                            color: $data-blue;
                        }
                    }
                    .right {
                        color: $text-first;
                        padding-left: 20px;
                        .title {
                            @include font-14-20;
                        }
                        .number {
                            padding-top: 20px;
                            padding-right: 10px;
                            font-weight: 600;
                            @include font-30-36-500;
                            .success-number {
                                color: $success-color;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
