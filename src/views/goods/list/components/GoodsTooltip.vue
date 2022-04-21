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
    <div class="hint-tooltip">
        <!--二维码-->
        <Poptip
                placement="bottom-end"
                :transfer="true"
                class="qrCode-tooltip"
                :trigger="trigger"
                :loading="loading"
                @on-popper-show="onPopperShow"
        >
            <!--二维码图标-->
            <slot></slot>
            <template #content>
                <div class="tab">
                    <tabbar @tabContent="tabClick" :tabList="tabList"></tabbar>
                </div>
                <div class="qr-code-tooltip-content">
                    <div class="image">
                        <qr-code :size="150" :url="$media(url)" v-if="!qrcode_url&&tabContent.id=='h5'"></qr-code>
                        <img :src="qrData.qrcode" alt="" v-if="!qrcode_url&&tabContent.id=='wxapp'">
                    </div>
                    <p class="text">{{tabContent.tabLink}}</p>
                    <div class="link">
                        <div v-if="tabContent.id=='h5'">
                        {{$media(url)}}
                        </div>
                        <div v-else>{{qrData.url}}</div>
                    </div>
                    <kdx-copy-text :text="$media(url)" v-if="!qrcode_url&&tabContent.id=='h5'">
                        <Button type="text" :class="{textNext:!tabContent.isShow}">{{text}}</Button>
                    </kdx-copy-text>
                    <kdx-copy-text :text="qrData.url" v-else>
                        <Button type="text">{{text}}</Button>
                    </kdx-copy-text>
                    <Button type="text" class="downCode" v-if="tabContent.isShow" @click="downCode(id)">下载二维码</Button>
                </div>
            </template>
        </Poptip>
    </div>
</template>

<script>
    import QrCode from "../../../../components/QrCode";
    import Tabbar from "./Tabbar";
    // 问号弹窗提示
    export default {
        name: 'GoodsTooltip',
        components: { QrCode,Tabbar },
        props: {
            content: {
                type: String
            },
            maxWidth: {
                type: Number,
                default: 340
            },
            // 类型，用来区分二维码和其他文字描述
            type: {
                type: String,
                default: 'text',
                validator: val => ['text', 'form', 'image', 'qrCode'].includes(val)
            },
            image: {
                type: String,
                default: require('@/assets/image/shop/module-detail.png')
            },
            // 延时显示(毫秒)
            delay: {
                type: Number,
                default: 0
            },
            // 要复制提示文字
            text: {
                type: String,
                default: '复制链接'
            },
            // 二维码地址
            url: {
                type: String,
                default: 'https://www.baidu.com/'
            },
            // 二维码图片地址
            qrcode_url: {
                type: String,
                default: ''
            },
            // 商品id
            id: {
                type: String,
                default: ''
            },
            placement: {
                type: String,
                default: 'top'
            },
            width: String,
            trigger: {
                type: String,
                default: 'hover'
            },
        },
        data() {
            return {
                imgUrl: '',
                tabContent: {
                    id: 'h5',
                    tabTit: 'H5',
                    tabLink: '商品链接',
                    isShow: false
                },
                tabList: [
                    {
                        id: 'h5',
                        tabTit: 'H5',
                        tabLink: '商品链接',
                        isShow: false
                    },
                    {
                        id: 'wxapp',
                        tabTit: '微信小程序',
                        tabLink: '微信小程序商品路径',
                        isShow: true
                    },
                ],
                qrData: {}, //接到参数
                loading:false,
            }
        },
        mounted(){
            if(this.image && this.image.indexOf('static/dist/shop/')==-1) {
                this.imgUrl = this.$media(this.image)
            }
        },
        watch: {
            'tabContent.id': {
                handler(val) {
                    if(val==='wxapp') {
                        this.$api.goodsApi.getGoodQrcode({id:this.id})
                            .then(res => {
                            if (res.error === 0) {
                                this.qrData = res.data;
                            }
                        });
                    }
                }
            }
        },
        methods: {
            onPopperShow() {
                this.$emit('on-popper-show')
            },
            tabClick(val) {
                this.tabContent = val
            },
            downCode() {
                if (this.tabContent.id === 'wxapp') {
                    var image = new Image();
                    image.setAttribute("crossOrigin", "anonymous");
                    image.onload = function () {
                        var canvas = document.createElement("canvas");
                        canvas.width = image.width;
                        canvas.height = image.height;
                        var context = canvas.getContext("2d");
                        context.drawImage(image, 0, 0, image.width, image.height);
                        var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
                        var a = document.createElement("a"); // 生成一个a元素
                        var event = new MouseEvent("click"); // 创建一个单击事件
                        a.download =  "小程序商品二维码"; // 设置图片名称
                        a.href = url; // 将生成的URL设置为a.href属性
                        a.dispatchEvent(event); // 触发a的单击事件
                    };
                    image.src = this.qrData.qrcode;
                    return
                }
            },
        },
    }
</script>

<style scoped lang="scss">
    .hint-tooltip {
        display: inline-block;
        line-height: inherit;
        padding: 0;
    }
    .qr-code-tooltip-content {
        padding: 0 20px;
        text-align: center;
        > .image {
            border-radius: 2px;
            height: 140px;
            margin: 20px 0;
            img {
                width: 110px;
                margin-top: 20px;
            }
        }
        > .text {
            @include font-12-16;
            color: #262B30;
            font-weight: 600;
            padding-top: 10px;
        }
        > .link {
            @include font-12-16;
            width: 200px;
            color: #262B30;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            white-space: pre-wrap;
            margin-bottom: 8px;
        }
        .ivu-btn {
            @include font-12-16;
            &.textNext {
                margin-right: 0 !important;
            }
        }
    }
    .good-list-table-list .ivu-table td .action .ivu-btn-text.downCode {
        margin-right: 0;
    }

    /deep/ .ivu-poptip-popper {
        width: 240px;
        padding: 10px 0 0;
        height: 295px;
        /deep/ .ivu-poptip-body {
            padding: 0
        }
    }

</style>


