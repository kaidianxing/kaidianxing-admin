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
    <div class="channel-buy">
        <div class="channel-title">
            <div>渠道</div>
            <div>操作</div>
        </div>
        <div class="channel-body">
            <div v-for="item in data" :key="item.id">
                <div class="channel-body-left">
                    <div class="image">
                        <!--自定义图标-->
                        <template v-if="item.info_type == 1">
                            <img :src="$media(item.shop_show_logo, 'manage')" @error="replaceImage"/>
                        </template>
                        <!--系统图标-->
                        <template v-else>
                            <img :src="$media(item.logo, 'manage')" @error="replaceImage"/>
                        </template>
                    </div>
                    <p class="title">
                        <span>{{ item.info_type == 1 ? item.shop_show_name : item.name }}</span>
                    </p>
                    <p class="text">
                        {{ item.info_type == 1 ? item.shop_show_description : item.description }}
                    </p>
                </div>
                <div class="channel-body-right">
                    <!--                    <Button-->
                    <!--                        class="primary-long"-->
                    <!--                        :disabled="noManagePerm"-->

                    <!--                    >管理{{ item.info_type == 1 ? item.shop_show_name : item.name }}-->
                    <!--                    </Button>-->
                    <!--微信小程序-->
                    <template v-if="item.identity === 'wxapp'">
                        <Button class="primary-long" :class='{noManagePerm:noWxManagePerm}'
                                :disabled='noWxManagePerm' v-if="getItemInfo(item).status"
                                @click="handleManage('wx')">
                            管理微信小程序
                        </Button>
                        <Button class="primary-long" :class='{noManagePerm:noWxManagePerm}'
                                :disabled='noWxManagePerm' v-else
                                @click="handleConfig('wx')">
                            配置微信小程序
                        </Button>

                    </template>
                    <!--微信公众号-->
                    <template v-else-if="item.identity === 'wechat'">
                        <Button class="primary-long" v-if="getItemInfo(item).connect"
                                :class='{noManagePerm:noWechatManagePerm}'
                                :disabled='noWechatManagePerm'
                                @click="handleManage('wechat', item)">
                            管理微信公众号
                        </Button>
                        <Button class="primary-long" v-else :class='{noManagePerm:noWechatManagePerm}'
                                :disabled='noWechatManagePerm' @click="handleConfig('wechat', item)">
                            配置微信公众号
                        </Button>
                    </template>

                    <!--头条小程序-->
                    <template v-if="item.identity === 'toutiao'">
                        <Button class="primary-long" :class='{noManagePerm:noTtManagePerm}'
                                :disabled='noTtManagePerm' v-if="getItemInfo(item).status"
                                @click="handleManage('tt')">
                            管理头条小程序
                        </Button>
                        <Button class="primary-long" :class='{noManagePerm:noTtManagePerm}'
                                :disabled='noTtManagePerm' v-else
                                @click="handleConfig('tt')">
                            配置头条小程序
                        </Button>
                    </template>
                    <!--抖音小程序-->
                    <template v-if="item.identity === 'douyin'">
                        <Button class="primary-long" :class='{noManagePerm:noTtManagePerm}'
                                :disabled='noTtManagePerm' v-if="getItemInfo(item).status"
                                @click="handleManage('douyin')">
                            管理抖音小程序
                        </Button>
                        <Button class="primary-long" :class='{noManagePerm:noTtManagePerm}'
                                :disabled='noTtManagePerm' v-else
                                @click="handleConfig('douyin')">
                            配置抖音小程序
                        </Button>
                    </template>
                    <!--  程序码 qrcode_url="https://shuke-20.v6.getpkg.cn//tmp/wxapp/3/unlimited/8417f99a234ab6d1d56e876c0058479c.jpg?v=1640936750550" -->
                    <kdx-hint-tooltip
                        v-if="getItemInfo(item).status && item.identity != 'wap'"
                        type="qrCode"
                        :qrcode_url="`${getItemInfo(item).src}?v=${new Date().getTime()}`"
                        text=""
                    >
                        <Button class="primary-long">推广入口</Button>
                    </kdx-hint-tooltip>
                    <!--  二维码 -->

                    <kdx-hint-tooltip
                        v-else-if="getItemInfo(item).status && item.identity === 'wap'"
                        type="qrCode"
                        :url="getItemInfo(item).src"
                        text="复制页面链接"
                    >
                        <Button class="primary-long">推广入口</Button>
                    </kdx-hint-tooltip>


                    <template v-if="getItemInfo(item).connect">
                        <template v-if="getItemInfo(item).status=='1'">
                            <Button type="text"
                                    :disabled='noWechatManagePerm' @click="changeStatus('0','20')">
                                关闭访问
                            </Button>
                        </template>
                        <template v-else>
                            <Button type="text"
                                    :disabled='noWechatManagePerm' @click="changeStatus('1','20')">
                                开启访问
                            </Button>
                        </template>
                    </template>
                    <!--浏览器-->
                    <template v-else-if="item.identity === 'wap'">
                        <template v-if="getItemInfo(item).status">
                            <Button type="text" :class='{noManagePerm:noManagePerm}'
                                    :disabled='noManagePerm' @click="changeStatus('0','10')">
                                关闭访问
                            </Button>
                            <!--                            <kdx-copy-text :text="getItemInfo(item).src">-->
                            <!--                                <Button class="default-primary copy-link">-->
                            <!--                                    复制链接-->
                            <!--                                </Button>-->
                            <!--                            </kdx-copy-text>-->
                        </template>
                        <template v-else>
                            <Button type="text" :class='{noManagePerm:noManagePerm}'
                                    :disabled='noManagePerm' @click="changeStatus('1', '10')">
                                开启访问
                            </Button>
                        </template>
                    </template>
                    <template v-else>
                        <Button style="visibility: hidden" type="text">关闭访问</Button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: "ChannelHave",
    computed: {
        noManagePerm() { //管理权限
            return !this.$getPermMap('channel.wap.manage');
        },
        noWechatManagePerm() { //微信公众号管理权限
            return !this.$getPermMap('channel.wechat.manage');
        },
        noWxManagePerm() { // wx管理权限
            return !this.$getPermMap('channel.wxapp.manage')
        },
        noTtManagePerm() { // tt管理权限
            return !this.$getPermMap('channel.byteDance.manage')
        },
    },
    props: {
        data: {
            type: Array,
            default: () => []
        },
    },
    methods: {
        handleConfig(type, item) {
            this.$emit('on-config', type, item);
        },
        handleManage(type, item) {
            this.$emit('on-manage', type, item);
        },
        changeStatus(status, client_type) { // 切换渠道应用状态
            this.$emit('on-change', {
                status, client_type
            });
        },
        getItemInfo(item) {
            switch (item.identity) {
                case 'wxapp':   // 小程序
                    return {
                        src: item?.channel_info?.qrcode,
                        status: item?.channel_info?.status == '1',
                        icon: 'icon-weixinxiaochengxu'
                    }
                case 'wechat': // 微信
                    return {
                        src: item?.channel_info?.data?.qrcodeimgsrc,
                        status: item?.channel_info?.is_open,
                        icon: 'icon-weixin',
                        connect: item?.channel_info?.connect
                    }
                case 'toutiao': // 头条
                    return {
                        src: item?.channel_info?.toutiao_qrcode,
                        status: item?.channel_info?.status == 1,
                        icon: 'icon-qudao-toutiao2'
                    }
                case 'douyin': // 抖音
                    return {
                        src: item?.channel_info?.douyin_qrcode,
                        status: item?.channel_info?.status == 1,
                        icon: 'icon-douyin'
                    }
                case 'wap': // H5
                    return {
                        src: item?.channel_info?.url,
                        status: item?.channel_info?.is_open == 1,
                        icon: 'icon-H'
                    }
                default:
                    return {icon: '', status: 0, src: ''}
            }
        },
    }
};
</script>

<style scoped lang="scss">
.channel-buy {
    margin-left: -10px;
    margin-right: -10px;

    .channel-title {
        padding: 0 260px 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #262B30;
        font-weight: 600;
        font-size: 14px;
        line-height: 60px;
        border-bottom: 1px solid #E9EDEF;

    }

    .channel-body {
        > div {
            border-bottom: 1px solid #E9EDEF;
            height: 80px;
            padding: 0 40px 0 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &:hover {
                background: #FAFDFF;
            }
        }

        .channel-body-left {
            display: flex;
            align-items: center;

            .image {
                width: 34px;
                height: 34px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .title {
                color: #262B30;
                font-size: 16px;
                padding: 0 20px;
                line-height: 16px;
            }

            .text {
                color: #636669;
                font-size: 14px;
                line-height: 14px;
            }
        }

        .channel-body-right {
            button {
                margin-left: 20px;
            }
        }
    }
}

</style>
