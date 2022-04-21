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
    <div>
        <Upload :before-upload="upload" action :accept="accept">
            <Button class="upload-btn">{{status?'重新上传':'上传文件'}}</Button>
            <span @click.stop><slot name="example"></slot></span>
        </Upload>
        <div class="upload-tip" v-if="desc">{{desc}}</div>
        <div v-if="status" class="flex align-center status">
            <i class="iconfont icon-yes status-icon"></i>
            <span class="status-text">已上传</span>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        desc: String,
        accept: String,
        status: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        upload(e) {
            this.$emit('change', e)
            return false
        }
    }
}
</script>


<style lang="scss" scoped>
.upload-btn {
    @include font-14-20;
    color: $brand-color;
}

.upload-tip {
    @include font-12-16;
    margin-top: 10px;
    color: #939799;
}

/deep/ .ivu-upload-list {
    display: none;
}

.status {
    .status-text {
        font-size: 14px;
        color: #262b30;
    }

    .status-icon {
        margin-right: 4px;
        font-size: 24px;
        color: $brand-color;
    }
}
</style>