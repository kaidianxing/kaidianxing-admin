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
    <kdx-modal-frame
        :value="value"
        :width="650"
        @on-cancel="handleCancel"
        :title="modalTitle"
        footerHide
    >
        <div class="modal-content">
            <div class="title">{{title}}</div>
            <div class="subtitle">{{subtitle}}</div>
            <img
                :src="imgurl"
                class="code-img"
                :class="{
                    'start': !download
                }"
            />
            <div
                class="download"
                v-if="download"
                @click="downloadImg"
            >保存直播间小程序码</div>
        </div>
    </kdx-modal-frame>
</template>


<script>
export default {
    props: {
        title: String,
        subtitle: String,
        imgurl: String,
        download: {
            type: Boolean,
            default: false
        },
        value: Boolean,
        modalTitle: {
            type: String,
            default: '标题'
        }
    },
    methods: {
        handleCancel(){
            this.$emit('on-cancel')
        },
        downloadImg() {
            var a = document.createElement('a')
            // 设置图片地址
            a.target = '_blank'
            a.href = this.imgurl;
            a.click();
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-content {
    margin: 60px 0;
    text-align: center;

    .title {
        font-size: 14px;
        line-height: 20px;
        color: #262b30;
        text-align: center;
    }

    .subtitle {
        margin-top: 8px;
        font-size: 14px;
        line-height: 20px;
        color: #939799;
        text-align: center;
    }

    .code-img {
        margin-top: 30px;
        height: 235px;
        width: 200px;


        &.start {
            height: 200px;
        }
    }

    .download {
        margin-top: 30px;
        font-size: 14px;
        line-height: 20px;
        color: $brand-color;
        cursor: pointer;
    }
}
</style>