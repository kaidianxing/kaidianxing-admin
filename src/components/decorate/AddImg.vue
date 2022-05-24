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
    <div class='select-good'>
        <i class="iconfont icon-move move-icon" v-if="draggable"></i>
        <div class="select-item">
            <AddImgImg :value='item[url]' @getImgInfo='getImgInfo' @change='changeImg'></AddImgImg>
            <div class="body">
                <SelectLink style='margin-bottom:10px;' :tab-name="tabName" :value='{
                    url: item[link],
                    name: item[`${link}_name`],
                    wxappid: item[wxappid],
                     video_id: item[video_id],
                    keyLink: item[keyLink],
                }' @change='changeLink'></SelectLink>
                <span class="tip">{{ tip }}</span>
            </div>
            <span class="close ivu-icon ivu-icon-md-close-circle" @click='delItem' v-if='!nodel'></span>
        </div>
    </div>
</template>

<script>
import AddImgImg from './AddImgImg'
import SelectLink from './SelectLink'

export default {
    components: {
        AddImgImg,
        SelectLink
    },
    props: {
        tip: {
            type: String,
            default: '建议图片宽度750px，高度跟随第一张图片的高度变化'
        },
        nodel: {
            type: Boolean,
            default: true
        },
        url: {
            type: String,
            default: 'url'
        },
        link: {
            type: String,
            default: 'link'
        },
        video_id: {
            type: String,
            default: 'video_id'
        },
        keyLink: {
            type: String,
            default: 'keyLink'
        },
        item: {
            type: Object,
            default: () => ({
                url: '',
                link: '',
                video_id: '',
                keyLink: ''
            })
        },
        draggable: {
            type: Boolean,
            default: false
        },
        wxappid: {
            type: String,
            default: 'wxappid'
        }
    },
    data() {
        return {
            tabName: 'store,goods,liver,coupon,customLink,goodsClassify,wxapplink,videoLive,videoRam'
        }
    },
    mounted() {
        let paths = ['/decorate/custom']
        if (paths.includes(this.$route.path)) {
            this.tabName = this.tabName.replace(',customLink', '')
        }
    },
    methods: {
        getImgInfo(e) {
            this.$emit('getImgInfo', e)
        },
        changeImg(val) {
            this.$emit('change-img', val, this.item)
        },
        changeLink(val) {
            this.$emit('change-link', val, this.item)
        },
        delItem() {
            this.$emit('del', this.item)
        }
    }
}
</script>

<style lang="scss" scoped>
.select-good {
    border-radius: 2px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;

    .move-icon {
        margin-right: 10px;
        color: #b8b9bd;
        font-size: 24px;
    }

    .select-item {
        background: #F4F6F8;
        width: 100%;
        display: flex;
        box-sizing: border-box;
        border-bottom: 1px solid #F4F6F8;
        position: relative;

        /deep/ .select-link {
            margin-bottom: 0 !important;
        }

        .close {
            position: absolute;
            right: 0;
            top: 0;
            font-size: 18px;
            top: -6px;
            right: -9px;
            color: rgba(0, 0, 0, 0.3);
            display: none;
        }

        &:hover {
            .close {
                display: inline;
                cursor: pointer;
            }
        }
    }

    .img-box {
        width: 60px;
        height: 60px;
        overflow: hidden;
        box-sizing: border-box;
        border-radius: 2px;
        border: 1px dashed #E9EDEF;
        display: flex;
        flex-direction: column;
        justify-content: center;
        cursor: pointer;

        span {
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            line-height: 16px;
            margin: 0 auto;
            text-align: center;
            color: #B8B9BD;
        }

        img {
            width: 100%;
            height: 100%;
        }

        /deep/ .ivu-icon-md-add {
            font-size: 22px;
            color: $brand-color;
            margin: 0 auto;
        }
    }

    .body {
        margin-left: 10px;
        flex: 1;

        .tip {
            display: block;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            line-height: 18px;
            color: #939799;
            margin-top: 8px;
        }
    }

    /deep/ .ivu-btn-default {
        color: $brand-color;
    }

    /deep/ .input {
        box-sizing: border-box;
        width: 250px;

        .ivu-input-search {
            color: #B8B9BD !important;
        }

        .ivu-input-search:hover {
            color: #fff !important;
        }
    }

    /deep/ .hasUrl {
    }

    /deep/ .ivu-input-group-append {
        background-color: #fff;

        .ivu-btn:hover {
            color: $brand-color;
            box-shadow: none;
            border: 1px solid $brand-color;
        }
    }

    /deep/ .ivu-input-group-prepend {
        background-color: #fff;
    }

    .addItem {
        width: 100%;
        margin-top: 10px;
    }
}
</style>
