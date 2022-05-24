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
    <kdx-modal-frame :value="value" :width="800" footer-hide @on-cancel="handleCancel">
        <template #header>
            <div class="header">
                <div class="title">
                    自定义交易组件
                </div>
                <div class="text" @click="handleCancel">
                    不再提示
                </div>
            </div>
        </template>
        <div class="hint-modal">
            <div class="hint-item">
                <div class="line"></div>
                <div class="circle"></div>
                <div class="hint-content">
                    <div class="title">
                        步骤一：商家前往微信后台的交易组件，申请自定义交易组件
                    </div>
                    <div class="text">
                        • 选择自定义版交易组件，并申请开通功能，进入审核流程。
                    </div>
                    <div class="text">
                        • 接入小程序的视频号要求是企业认证的视频号，且视频号认证主体 和微信小程序认证主体一致，或者视频号的管理员和小程序的管理员一致。
                        更多开通条件请前往微信官方文档进行
                        <Button type="text"
                                to="https://developers.weixin.qq.com/miniprogram/dev/framework/ministore/minishopopencomponent2/m_guideline.html"
                                target="_blank">查看
                        </Button>
                    </div>
                    <Button type="primary"
                            to="https://developers.weixin.qq.com/miniprogram/dev/framework/ministore/minishopopencomponent2/m_guideline.html"
                            target="_blank">前往开通
                    </Button>
                </div>
            </div>
            <div class="hint-item">
                <div class="line"></div>
                <div class="circle"></div>
                <div class="hint-content">
                    <div class="title">
                        步骤二：完成开通后，进入后台自定义交易组件，进行商品上传
                    </div>
                    <div class="text">
                        选择商品进行上传提交至微信审核，上传时需关联微信方相关商品分类
                    </div>
                    <div class="add-goods">
                        <Button type="primary" @click="addGoods">上传商品</Button>
                    </div>
                </div>
            </div>
            <div class="hint-item">
                <div class="line"></div>
                <div class="circle"></div>
                <div class="hint-content">
                    <div class="title">
                        步骤三：生成一笔订单并付款成功（微信支付），进行订单发货，触发物流接口调用。
                    </div>
                </div>
            </div>
            <div class="hint-item">
                <div class="line"></div>
                <div class="circle"></div>
                <div class="hint-content">
                    <div class="title">
                        步骤四：创建售后，后续会将售后信息实时同步至微信，否则将触发微信运营规范，将暂停交易组件的使用。
                    </div>
                </div>
            </div>
            <div class="hint-item">
                <div class="line"></div>
                <div class="circle"></div>
                <div class="hint-content">
                    <div class="title">
                        步骤五：以上内容全部开通后且完成场景接入，相应小程序绑定着者可前往视频号主页-创作者中心-商品橱窗，进行商城小程序绑定进行小程序挂载
                    </div>
                    <div class="text">
                        进入视频号设置，用户通过点击视频号主页的商店，直接跳转至商城小程序。
                        <kdx-hint-tooltip
                            type="image"
                            width="450px"
                            :max-width="700"
                            :image="require('@/assets/image/wxTransactionComponent/example.png')">
                        </kdx-hint-tooltip>
                    </div>
                    <div class="text">
                        前往微信公众平台中，进入“交易组件”>“场景接入”菜单中，查看并选择需要接入的场景，
                        微信官方默认所有场景均接入。
                    </div>
                    <div class="text">
                        支持添加推广员，添加后可在推广员的视频号中推广。
                        <kdx-hint-tooltip
                            type="image"
                            width="1100px"
                            :max-width="1200"
                            :image="require('@/assets/image/wxTransactionComponent/wechat-example.png')">
                        </kdx-hint-tooltip>
                    </div>
                </div>
            </div>
            <div class="hint-item">
                <!--                <div class="line"></div>-->
                <div class="circle"></div>
                <div class="hint-content">
                    <div class="title">
                        步骤六：视频号直播，直接关联商城商品进行直播卖货
                    </div>
                    <div class="text">
                        使用视频号直播时，点击商品，添加已审核通过的商品，用户观看直播时，可直接点击商品
                        进入商城小程序进行下单购买。
                    </div>
                </div>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
export default {
    name: "HintModal",
    data() {
        return {
            value: false
        };
    },
    methods: {
        setValue() {
            this.value = !this.value;
        },
        handleCancel() {
            this.setValue();
            localStorage.setItem('transactionComponent', true);
        },
        addGoods() {
            this.setValue();
            this.$emit('on-add-goods');
        }
    }
};
</script>

<style scoped lang="scss">
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    //padding: 19px 20px;

    .title {
        @include font-16-22-bold;
        color: $text-first;
    }

    .text {
        @include font-14-20-bold;
        color: $text-third;
        padding-right: 30px;
        cursor: pointer;
    }
}

.hint-modal {
    padding: 40px;

    .hint-item {
        position: relative;
        padding-bottom: 30px;

        &:last-child {
            padding-bottom: 0;
        }

        .circle {
            position: absolute;
            top: 6px;
            left: 2px;
            width: 8px;
            height: 8px;
            background-color: #2D8CF0;
            border-radius: 100%;
        }

        .line {
            position: absolute;
            top: 8px;
            left: 5px;
            bottom: 0;
            width: 1px;
            height: 100%;
            background-color: #E9EDEF;
        }
    }
}

.hint-content {
    padding-left: 20px;

    .title {
        @include font-14-20-bold;
    }

    .text {
        @include font-12-16;
    }

    & > div {
        padding-bottom: 10px;
    }
}
</style>
