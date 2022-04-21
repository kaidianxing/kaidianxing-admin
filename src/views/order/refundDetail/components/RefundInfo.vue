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
    <div class="refund-status">
        <p class="title">维权信息</p>
        <Form :label-width="100">
            <FormItem label="维权类型：">
                <kdx-tag-label type="danger" size="small">{{info.refund_type_text}}</kdx-tag-label>
            </FormItem>
            <FormItem label="退款金额：" class="refund-money-label">
                <span class="refund-money">￥{{info.price}}</span>
                <span v-if="info.is_contain_dispatch==1">(已退运费{{orderInfo.dispatch_price}})</span>
            </FormItem>
            <FormItem label="维权编号：">
                <span>{{info.refund_no |getNo}}</span>
            </FormItem>
            <FormItem label="维权说明：">
                <span class="paragraph">{{info.content || '无'}}</span>
            </FormItem>
            <!--等待商家处理维权-->
            <FormItem label="维权凭证：">
                <!--维权图片-->
                <span class="paragraph" v-if="info.images.length ===0">无</span>
                <ul class="evidence" v-else>
                    <li v-for="(img,index) in info.images" :key="index">
                        <img :src="img" alt @error="replaceImage" />
                        <div class="shade" @mousedown="previewImg(true,index)">
                            <div class="shade-content">
                                <p>
                                    <Icon type="ios-search" />
                                </p>
                                <p>查看</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </FormItem>
            <!--退款成功-->
            <!-- <FormItem label="快递信息：" v-if="data.status === '1'">
        <Button type="text" size="small" @click="packageExpress">查看历史发货信息</Button>
            </FormItem>-->
        </Form>
        <preview-img
            :imgList="info.images || []"
            :currentIndex="current"
            v-show="imgModal"
            @on-close="previewImg(false)"
        ></preview-img>
    </div>
</template>

<script>
    import PreviewImg from '@/components/PreviewImg';

export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        },
        orderInfo: {
            type: Object,
            default: () => {}
        },
    },
    components: {
        PreviewImg
    },
    filters: {
        getNo(val) {
            if (val && val !== '0') {
                return val
            } else {
                return '-'
            }
        }
    },
    data() {
        return {
            imgModal: false,
            current: 0
        }
    },
    methods: {
        previewImg(status, index) {
            this.imgModal = status
            if (index) {
                this.current = index
            }
        }
    }
}
</script>


<style lang="scss" scoped>
    .refund-status {
        /deep/ .ivu-form {
            .ivu-form-item {
                .ivu-form-item-content {
                    word-break:break-all;
                }
            }
        }
    }
// 维权图片
.evidence {
    display: flex;
    flex-wrap: wrap;
    > li {
        position: relative;
        margin: 0 6px 6px 0;
        width: 48px;
        height: 48px;
        &:hover {
            .shade {
                display: block;
            }
        }
        > img {
            width: 48px;
            height: 48px;
            box-sizing: border-box;
            border-radius: 2px;
            border: 1px solid $border-color;
        }
        // 遮罩
        .shade {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background-color: $shade-color;
            border-radius: 2px;
            color: #ffffff;
            @include font-12-16;
            display: none;
            cursor: pointer;
            > .shade-content {
                transform: translateY(10px);
                > p {
                    text-align: center;
                }
                .ivu-icon {
                    font-size: 14px;
                }
            }
        }
    }
}

.refund-money {
    @include font-18-25-bold;
    color: $warning-color;
    line-height: 20px;
}
    .paragraph {
        word-break: break-all;
    }
    .refund-money-label {
        display: flex;
        align-items: flex-end;
       /deep/ .ivu-form-item-content {
            margin-left: 0 !important;
        }
    }
</style>
