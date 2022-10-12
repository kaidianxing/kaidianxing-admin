/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <kdx-modal-frame title="文章推广" v-model="showModal" :loading="loading" @on-cancel="handleCancel">
        <div class="modal-frame-content">
            <div class="tag-label flex">
                <template v-for="item in tab.list">
                    <div :key="item.id" @click="chooseChannel(item)" v-if="tab.data && tab.data[item.id]">
                        <kdx-tag-label :class="{active: item.id === tab.select}">{{item.name}}</kdx-tag-label>
                    </div>
                </template>
            </div>
            <template v-if="tab.select && tab.data && tab.data[tab.select]">
                <div class="qrcode-img">
                    <img :src="tab.data[tab.select].image" alt="">
                </div>
                <div class="channel-title">{{tab.selectData.name}}</div>
                <div>
                    <Button type="text" class="marginR-10" @click="downLoadQrcode">下载二维码</Button>
                    <kdx-copy-text :text="tab.data[tab.select].url">
                        <Button type="text">复制路径</Button>
                    </kdx-copy-text>
                </div>
                <kdx-hint-text>二维码有效期默认30天</kdx-hint-text>
            </template>
        </div>
        <template #footer>
            <Button class="primary-long" @click="handleCancel">关闭</Button>
        </template>
    </kdx-modal-frame>
</template>

<script>
    import Qrious from 'qrious';
    import {Export} from '@/utils/export.js'
    export default {
        props: {
            id: {
                type: [Number, String],
                required: true,
            }
        },
        data() {
            return {
                showModal: false,
                oldId: '',
                tab: {
                    list: [
                        {
                            id: 'wxapp',
                            name: '微信小程序',
                        },
                        {
                            id: 'wechat',
                            name: '微信公众号',
                        },
                        {
                            id: 'h5',
                            name: '手机浏览器H5',
                        },
                        {
                            id: 'toutiao',
                            name: '头条小程序',
                        },
                        {
                            id: 'douyin',
                            name: '抖音小程序',
                        }
                    ],
                    select: 'wxapp',
                    selectData: null,
                    data: null
                },
                loading: false,
            }
        },
        methods: {
            getVerifyQrcode() {
                this.loading = true;
                this.$api.articleApi.promoteArticle({id: this.id}).then(res => {
                    if (res.error === 0) {
                        this.tab.data = {}, this.tab.select = '';
                        this.tab.list.forEach(item => {
                            if (['h5'].includes(item.id)) {
                                this.tab.data[item.id] = {
                                   image: this.markQrcode(res.data[item.id].url),
                                    url: res.data[item.id].url
                                };
                            } else if (['wechat'].includes(item.id)) {
                                this.tab.data[item.id] = {
                                   image: this.markQrcode(res.data[item.id].qrcode),
                                    url: res.data[item.id].qrcode
                                };
                            } else {
                                this.tab.data[item.id] = {
                                    image: res.data[item.id].qrcode,
                                    url: `/pagesArticle/detail/index?id=${this.id}`

                                };
                            }
                            // 將数据为空的置为null
                            !this.tab.data[item.id].image && (this.tab.data[item.id] = null);
                            if(!this.tab.select && this.tab.data[item.id]) {
                                this.tab.select = item.id;
                                this.tab.selectData = item;
                            }
                        })
                        console.log('tab-data', this.tab.data);
                    }
                }).finally(() => {
                    this.loading = false;
                })
            },
            setValue() {
                this.showModal = !this.showModal;
                this.showModal&&(this.oldId !== this.id)&&this.getVerifyQrcode()
                this.oldId = this.id;
            },
            chooseChannel(data) {
                this.tab.select = data.id;
                this.tab.selectData = data;
            },
            handleCancel() {
                this.showModal = false;
            },
            // 生成二维码
            markQrcode(url) {
                if (!url) return '';
                return new Qrious({
                    element: this.$refs.qrcode,
                    value: url,
                    size: 180,
                }).toDataURL();
            },
            downLoadQrcode() {
                if (this.tab.select === 'h5' || this.tab.select === 'wechat') {
                    this.downloadFile('', this.tab.data[this.tab.select].image)
                    return
                }
                Export(articleApi.downloadImageArticle.api, {url: this.tab.data[this.tab.select].image})

            },
            //下载
            downloadFile(fileName, content) {
                console.log('file-name', fileName, content);

                let a = document.createElement('a');
                a.download = '';
                a.href = content;
                a.click();

                // let aLink = document.createElement('a');
                // let blob = this.base64ToBlob(content); //new Blob([content]);
                
                // let evt = document.createEvent("HTMLEvents");
                // console.log("点击下载",evt)
                // evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
                // aLink.download = fileName;
                // aLink.href = URL.createObjectURL(blob);
                // aLink.dispatchEvent(evt);
                // aLink.click()
            },
            //base64转blob
            base64ToBlob(code) {
                let parts = code.split(';base64,');
                let contentType = parts[0].split(':')[1];
                let raw = window.atob(parts[1]);
                let rawLength = raw.length;

                let uInt8Array = new Uint8Array(rawLength);

                for (let i = 0; i < rawLength; ++i) {
                    uInt8Array[i] = raw.charCodeAt(i);
                }
                return new Blob([uInt8Array], {type: contentType});
            }
        },
    }
</script>

<style lang="scss" scoped>
    .modal-frame-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 0 47px;
        box-sizing: border-box;
        .qrcode-img {
            margin-top: 40px;
            width: 180px;
            height: 180px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        /deep/ .tag-label {
            cursor: pointer;
            &.active {
                .label-content {
                    color: $channel-baidu;
                    border: 1px solid $channel-baidu;
                    background-color: #F0FAFF;
                }
            }
            .label-content {
                padding: 6px 16px;
            }
        }
        .channel-title {
            margin: 20px 0 10px;
            line-height: 22px;
            font-weight: 600;
            font-size: 16px;
        }
        .info-text {
            margin-top: 10px;
            line-height: 20px;
            font-size: 12px;
            text-align: center;
            color: $text-third;
        }
    }
</style>