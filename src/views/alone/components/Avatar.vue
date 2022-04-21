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
    <label class="avatar" for="file">
        <!-- <div class="container un-choose" v-if="!value">
            <i class="iconfont icon-tianjiatupian add-icon" />
        </div> -->
        <div class="container choose" >
            <img :src="getImgPath" class="avatar-img" />
            <div class="replace-btn">替换</div>
        </div>
        <input
            id="file"
            type="file"
            style="display: none"
            ref="upload_input"
            @change="changeFile"
            name="file"
        />
    </label>
</template>

<script>
import { accessoryApi } from "@/api/accessory";
import { uploadFile } from '@/api/config/fileRequest';
export default {
    props: {
        value: {
            type: [String]
        },
        default: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        getImgPath() {
            if (this.value) {
                return this.$media(this.value)
            } else if(this.default){
                return require("@/assets/image/replace/avatar.png");
            } else {
                return ''
            }
        },
        maxSize() {
            return this.toFixed(this.$store.state?.config?.uploadSetting?.image?.max_size) || 2048;
        },
        limitType() {
            let type = (this.$store.state?.config?.uploadSetting?.image?.extensions || []).map(item => {
                if (item === 'jpg') {
                    return `image/jpeg`;
                } else {
                    return `image/${item}`;
                }
            }).join(',');
            return type || 'image/png';
        },
        hintMaxText() {
            let size = this.toFixed(this.maxSize / 1024);
            return `大小不要超过${size}M`;
        },
        hintTooltipText() {
            let type = (this.$store.state?.config?.uploadSetting?.image?.extensions || []).join(',') || 'png';
            return `${this.hintMaxText},支持图片类型${type}`;
        }
    },
    created() {
        this.$store.dispatch('config/getAccountUploadSetting');
    },
    methods: {
        /* 保留两位小数
            * num 传入数值
            * return 返回两位小数值
            */
        toFixed(num) {
            let times = Math.pow(10, 2)
            let des = num * times + 0.5
            des = parseInt(des, 10) / times;
            return des + '';
        },
        // 图片选择
        changeFile(e) {
            if (e) {
                let file = e.target.files[0];
                if (file.size > this.maxSize * 1024) {
                    this.$Message.error(`图片应选择小于${this.toFixed(this.maxSize / 1024)}M的`);
                    return
                }
                let type = (this.$store.state?.config?.uploadSetting?.image?.extensions || []).join('|');
                let reg2 = eval("/^(\\s|\\S)+(" + type + ")+$/");
                if (!reg2.test(file.name.toLowerCase())) {
                    this.$Message.error('请选择正确的格式的图片');
                    return
                }

                this.upload(file)

            }
            this.$refs['upload_input'].value = '';
        },
        upload(file) {
            let params = new FormData(); // 创建form对象
            params.append('file', file); // 通过append向form对象添加数据
            params.append('type', '10');
            params.append('scene', 50)
            uploadFile(accessoryApi.uploadImageNoShop.api, params).then(res => {
                if (res.error === 0) {
                    this.$emit('input', res.path)
                } else {
                    this.$Message.error(res.message)
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.avatar,
.container,
.un-choose,
.choose,
.avatar-img {
    width: 70px;
    height: 70px;
}
.avatar-img {
    display: block;
}

.container {
    position: relative;
    cursor: pointer;
    border-radius: 50%;
    border: 1px solid #e9edef;

    &.choose {
        position: relative;
        overflow: hidden;

        .replace-btn {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 20px;
            z-index: 1;
            font-size: 12px;
            line-height: 16px;
            text-align: center;
            color: #ffffff;
            background: rgba(0, 0, 0, 0.7);
        }
    }
    &.un-choose {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border: 1px dashed #e9edef;

        .add-icon {
            font-size: 28px;
            color: #1154ff;
        }
    }
}
</style>