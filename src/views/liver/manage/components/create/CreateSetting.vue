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
    <div class="create-setting">
        <kdx-form-title>分享卡片样式配置</kdx-form-title>
        <div class="setting-info">
            <Form
                :label-width="120"
                :model="model"
                :rules="rules"
                ref="shareForm"
            >
                <form-item label="分享卡片封面：">
                    <p class="setting-title">观众在微信对话框内分享的直播间将以分享卡片的形式呈现</p>
                </form-item>
                <form-item
                    label="封面图片："
                    prop="share_img"
                    ref="share_img"
                >
                    <kdx-image-video
                        type="image"
                        @on-change="changeThumb($event, 'share')"
                        :current="model.share_img"
                    ></kdx-image-video>
                    <kdx-hint-text>建议尺寸：800像素 * 640像素，图片大小不得超过1M</kdx-hint-text>
                </form-item>
            </Form>
            <div class="card-preview">
                <div class="card-info">
                    <div class="card-header">
                        <img class="circle" :src="getLogo" />
                        <span>{{settings.name}}</span>
                    </div>
                    <p class="card-title">好友邀请你参与直播：</p>
                    <div class="card-thumb">
                        <img
                            :src="$utils.media(model.share_img)"
                            v-if="model.share_img"
                        />
                    </div>
                </div>
                <div class="channel-info">
                    <i class="iconfont icon-qudao-weixinxiaochengxu channel-icon"></i>
                    <span>小程序</span>
                </div>
            </div>
        </div>
        <kdx-form-title>直播间样式配置</kdx-form-title>
        <div class="setting-info">
            <Form
                :label-width="120"
                :model="model"
                :rules="rules"
                ref="coverForm"
            >
                <form-item label="直播间背景墙：">
                    <p class="setting-title">直播间背景墙是每个直播间的默认背景</p>
                </form-item>
                <form-item
                    label="封面图片："
                    prop="cover_img"
                    ref="cover_img"
                >
                    <kdx-image-video
                        type="image"
                        @on-change="changeThumb($event, 'cover')"
                        :current="model.cover_img"
                    ></kdx-image-video>
                    <kdx-hint-text>建议尺寸：1080像素 * 1920像素，图片大小不得超过2M</kdx-hint-text>
                </form-item>
                <form-item label="直播间功能：">
                    <CheckboxGroup
                        v-model="actions"
                        @on-change="actionChange"
                    >
                        <Checkbox label="close_comment">评论</Checkbox>
                        <Checkbox label="close_like">点赞</Checkbox>
                        <Checkbox label="close_goods">商品货架</Checkbox>
                    </CheckboxGroup>
                </form-item>
            </Form>
            <div class="liver-preview">
                <img
                    class="liver-bg"
                    :src="require('@/assets/image/liver/liver_bg.png')"
                />
                <img
                    class="liver-cover"
                    v-if="model.cover_img"
                    :src="$utils.media(model.cover_img)"
                />
                <div class="liver-fixed">
                    <img
                        v-if="model.close_like =='0'"
                        class="liver-fixed-img"
                        :src="require('@/assets/image/liver/praise.png')"
                    />
                    <img
                        v-if="model.close_comment =='0'"
                        class="liver-fixed-img"
                        :src="require('@/assets/image/liver/comment.png')"
                    />
                    <img
                        v-if="model.close_goods =='0'"
                        class="liver-fixed-img"
                        :src="require('@/assets/image/liver/shelves.png')"
                    />
                </div>
                <div class="liver-info">
                    <img
                        :src="getLogo"
                        class="liver-info-img"
                    />
                    <div class="liver-info-content">
                        <p class="liver-info-name line-hide">{{settings.name}}</p>
                        <p class="liver-info-num">观看人数</p>
                    </div>
                </div>

            </div>
        </div>
        <div class="btn-group">
            <Button @click="backHandler">上一步</Button>
            <Button
                type="primary"
                @click="nextHandler"
                :loading="loading"
            >创建直播间</Button>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {

        return {
            logo: '',
            rules: {
                cover_img: [{ required: true, message: '请上传封面图片' }],
                share_img: [{ required: true, message: '请上传封面图片' }],
            },
            actions: ['close_comment', 'close_like', 'close_goods'],
            model: {
                cover_img: '',
                cover_img_media_id: '',
                share_img: '',
                share_img_media_id: '',
                close_like: '0',
                close_goods: '0',
                close_comment: '0',
            }
        }
    },
    computed: {
        ...mapState('config',{
            settings: state=> state.baseSetting
        }),
        getLogo() {
            return this.settings.logo? this.$utils.media(this.settings.logo) : this.$utils.staticImg('decorate/avatar_mobile.png')
        }
    },
    methods: {
        changeThumb(e, type) {

            if (!e) {
                this.model[type + '_img'] = ''
                this.model[type + '_img_media_id'] = ''
                return
            }

            this.$api.liverApi.uploadImg({
                url: this.$utils.media(e)
            }).then(res => {
                if (res.error == 0) {
                    this.model[type + '_img'] = e
                    this.model[type + '_img_media_id'] = res.media_id
                    this.$refs[type + '_img'].validateState = ''
                }

            })
        },
        actionChange(e) {
            let obj = {
                close_like: '1',
                close_goods: '1',
                close_comment: '1',
            }
            e.forEach(v => {
                obj[v] = '0'
            })

            this.model = { ...this.model, ...obj }
        },
        nextHandler() {
            let i = 0;
            let formName = ['shareForm', 'coverForm']
            formName.forEach(item => {
                this.$refs[item].validate(valid => {
                    if (valid) {
                        if (++i == 2) {
                            this.$emit('on-next', this.model)
                        }
                    }
                });
            })
        },
        backHandler() {
            this.$emit('on-back')
        }
    }
}
</script>

<style lang="scss" scoped>
.create-setting {
    margin-top: 20px;
    padding: 40px 40px 60px;
    background-color: #fff;
    border-radius: 2px;

    .setting-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 60px;
    }

    .setting-title {
        padding: 8px 0 7px 0;
        font-size: 14px;
        line-height: 20px;
        color: #262b30;
        white-space: nowrap;
    }

    .card-preview {
        width: 317px;
        height: 316px;
        background: #ffffff;
        border-radius: 4px;
        box-shadow: 0px 0px px2rpx(19) rgba(0, 0, 0, 0.1);

        .card-info {
            padding: 10px 15px 15px;

            .card-header {
                display: flex;
                font-size: 12px;
                line-height: 16px;
                color: #939799;

                .circle {
                    margin-right: 8px;
                    height: 14px;
                    width: 14px;
                    border-radius: 50%;
                }
            }

            .card-title {
                margin: 10px 0;
                font-size: 14px;
                line-height: 20px;
                color: #262b30;
            }

            .card-thumb {
                width: 287px;
                height: 206px;
                background: rgba(0, 33, 97, 0.7);

                img {
                    height: 100%;
                    width: 100%;
                }
            }
        }

        .channel-info {
            padding-left: 15px;
            display: flex;
            align-items: center;
            border-top: 1px solid #e9edef;
            height: 28px;
            font-size: 12px;
            line-height: 16px;
            color: #939799;

            .channel-icon {
                margin-right: 6px;
                color: #677de0;
            }
        }
    }

    .liver-preview {
        width: 317px;
        height: 686px;
        position: relative;
        background: rgba(0, 33, 97, 0.7);

        .liver-bg {
            position: relative;
            z-index: 99;
            width: 317px;
            height: 686px;
        }

        .liver-cover {
            position: absolute;
            height: 100%;
            width: 100%;
            left: 0;
            top: 0;
        }

        .liver-fixed {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            position: absolute;
            right: 15px;
            bottom: 30px;
            height: 162px;
            width: 34px;
            z-index: 99;

            &-img {
                margin-bottom: 30px;
                flex-grow: 30px;
                height: 34px;
                width: 34px;
            }
        }

        .liver-info {
            position: absolute;
            top: 35px;
            left: 29px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            border-radius: 21px;
            width: 161px;
            padding-left: 4px;
            height: 42px;
            background: rgba(#262b30, 0.2);
            z-index: 99;

            &-img {
                margin-right: 6px;
                width: 34px;
                height: 34px;
                border-radius: 50%;
            }

            &-name {
                width: 90px;
                font-size: 16px;
                line-height: 22px;
                color: #fff;
            }

            &-num {
                font-size: 12px;
                line-height: 17px;
                color: #fff;
            }
        }
    }

    .btn-group {
        margin: 90px auto 0;
        width: 530px;
        display: flex;
        justify-content: space-between;
        /deep/ .ivu-btn {
            width: 250px;
        }
    }
}
</style>