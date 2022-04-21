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
    <div class="header-info">
        <kdx-form-title>分销关系</kdx-form-title>
        <Row class="base-information">
            <Col span="10">
                <div class="user">
                    <div class="user-image">
                        <img :src="$media(memberInfo.avatar)" alt="" @error="replaceImage($event, 'avatar')">
                    </div>
                    <div class="user-information">
                        <Form :label-width="100">
                            <FormItem label="昵称：">
                                {{memberInfo.nickname || '无'}}
                            </FormItem>
                            <FormItem label="上级分销商：">
                                <div class="up-level">
                                    <img :src="$media(agentInfo.avatar)" alt="" @error="replaceImage($event, 'avatar')">
                                    <span class="nick-name line-hide">{{agentInfo.nickname || '-'}}</span>
                                </div>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </Col>
            <Col span="8" style="margin-bottom: -20px">
                <Form :label-width="120">
                    <FormItem label="全部下级：" class="r-form-item-checkbox">
                        <span class="level-member">{{child.all}}</span>人（分销商：{{child.all_agent}}人）
                    </FormItem>
                    <FormItem label="一级：" class="r-form-item-checkbox">
                        <span class="level-member">{{child.level1_all}}</span>人（分销商：{{child.level1_agent}}人）
                    </FormItem>
                    <FormItem label="二级：" class="r-form-item-checkbox">
                        <span class="level-member">{{child.level2_all}}</span>人（分销商：{{child.level2_agent}}人）
                    </FormItem>
                    <FormItem label="三级：" class="r-form-item-checkbox">
                        <span class="level-member">{{child.level3_all}}</span>人（分销商：{{child.level3_agent}}人）
                    </FormItem>
                </Form>
            </Col>
            <Col span="6">

            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: "HeaderInfo",
        props: {
            child: {
                type: Object,
                default: () => {
                }
            },
            memberInfo: {
                type: Object,
                default: () => {
                }
            },
            agentInfo: {
                type: Object,
                default: () => {
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .header-info {
        background-color: #ffffff;
        margin-bottom: 10px;
        border-radius: 2px;
        padding: 40px;
        .base-information {
            .ivu-form {
                .ivu-form-item {
                    margin-bottom: 20px;
                    :last-child {
                        margin-bottom: 0;
                    }
                }
            }
            .user {
                display: flex;
                flex-wrap: nowrap;

                > .user-image {
                    margin-left: 40px;
                    margin-right: 20px;
                    width: 90px;
                    height: 90px;
                    border: 4px solid #ffffff;
                    border-radius: 100%;
                    box-shadow: 0 4px 10px rgba(0, 82, 169, 0.2);
                    display: inherit;
                    box-sizing: border-box;
                    flex-shrink: 0;
                    overflow: hidden;

                    > img {
                        width: 84px;
                        height: 84px;
                        border-radius: 100%;
                    }
                }

                > .user-information {
                    width: 100%;
                    .up-level {
                       img {
                           width: 30px;
                           height: 30px;
                           border-radius: 100%;
                       }
                        .nick-name {
                            @include font-14-20;
                            color: $text-first;
                            padding-left: 10px;
                            line-height: 30px;
                            vertical-align: top;
                        }
                    }
                }
            }
        }
        .level-member {
            color: $brand-color;
        }
        .source {
            .icon {
                margin-right: 5px;
            }
        }
    }
</style>
