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
    <div class='poster_pushsetting'>
        <div class="info-box">
            <img :src="getImg" alt="" v-if='componentData.params.type==1'>
            <div class="info">
                <p class="title">{{componentData.params.title||'这里是推送标题'}}</p>
                <p class="subtitle">{{componentData.params.content||'这里是一段推送简介。'}}</p>
            </div>
        </div>
        <img class="footer" :src="$utils.staticImg('decorate/poster/footer.png')" alt="">
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'poster_pushsetting',
        computed: {
            getImg() {
                if(this.componentData.params.thumb){
                    return this.$utils.media(this.componentData.params.thumb)
                }
                return this.$utils.staticImg('decorate/goods_block1.png')
            }
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .poster_pushsetting {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        padding-bottom:51px;
        .info-box {
            width: 349px;
            margin: 13px;
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            img {
                width: 100%;
                height: 150px;
                flex-shrink: 0;
            }
            .info {
                width: 100%;
                flex: 1;
                background: #fff;
                padding: 16px 17px;
                min-height:75px;
            }
            .title {
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: 17px;
                line-height: 20px;
                /* identical to box height, or 118% */
                color: #212121;
                margin-bottom:7px;
                word-break: break-all;
            }
            .subtitle {
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: 12px;
                line-height: 20px;
                word-break: break-all;
                /* identical to box height, or 167% */
                /* text/third */
                color: #939799;
            }
        }
        .footer{
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 0;
        }
    }
</style>
