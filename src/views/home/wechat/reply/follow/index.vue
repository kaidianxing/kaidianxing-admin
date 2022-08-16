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
    <kdx-content-bar>
        <kdx-hint-alert class="margin-t" >粉丝在关注您的公众号时，会自动发送您设置的文字/图片/语音/视频给粉丝或触发关键词</kdx-hint-alert>
        <div class="main">
            <Tabs v-model="model.containtype">
                <TabPane label="文字" name="text">
                    <div class="main-content">
                        <Input type="textarea" v-model="content" />
                    </div>
                </TabPane>
                <TabPane label="图片" name="images">
                    <div class="main-content">
                        <div class="img-box" v-if="!imageObj.path" @click="chooseImg">
                            <i class="iconfont icon-tianjiatupian add-icon"></i>
                            <span class="add-text">添加图片</span>
                        </div>
                        <div class="img-box" v-else @click="chooseImg">
                            <img :src="$media(imageObj.path)" class="img" />
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <template #btn>
            <Button
                class="primary-long"
                :disabled="noManagePerm"
                @click="handleSave"
                >保存</Button
            >
        </template>
        <image-selector
            :current="imageObj"
            ref="img"
            return-type="object"
            @on-change="changeHandler"
        ></image-selector>
    </kdx-content-bar>
</template>

<script>
import ImageSelector from '@/components/selector/ImageSelector.vue'
export default {
    components: {
        ImageSelector
    },
    data() {
        return {
            model: {
                containtype: 'text',
                content: ''
            },
            imgPath: '',
            content: '',
            imageObj: {
                path: ''
            },
        }
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("channel.wechat.manage");
        },
    },
    created() {
        this.getReplySet()
    },
    methods: {
        getReplySet() {
            this.$api.homeApi.getWechatFollowReply().then(res => {
                if (res.error === 0) {
                    let { path, type, content } = res.data || {}
                    this.model.containtype = type
                    if (type == 'text') {
                        this.content = content
                    } else {
                        this.imgPath = path
                        let paths = path.split('_id=') || [];
                        this.imageObj = {
                            path: paths?.[0] || '',
                            id: paths?.[1] || ''
                        }
                    }
                }
            })
        },
        handleSave() {
            let params = {
                containtype: this.model.containtype
            }
            if (this.model.containtype == 'images') {
                this.model.content = this.imgPath
                // 将图片的id存到了图片后面
                params.content = this.imageObj.path + '_id=' + this.imageObj.id;
                params.attachment_id = this.imageObj.id;
            } else {
                params.content = this.content
            }
            if (params.content) {
                this.$api.homeApi.setWechatFollowReply(params).then(res => {
                    if (res.error == 0) {
                        this.$Message.success('设置成功')
                        this.getReplySet()
                    }
                })
            } else {
                this.$Message.error('请先填写内容')
            }
        },
        chooseImg() {
            this.$refs.img.setValue()
        },
        changeHandler(e) {
            this.imageObj = e;
        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    margin-top: 20px;
    min-height: calc(100% - 161px);

    background: #fff;

    /deep/ .ivu-tabs {
        .ivu-tabs-bar {
            margin-bottom: 0;
            padding: 0 40px;

            .ivu-tabs-tab {
                padding: 12px 30px;
                font-size: 18px;
                font-weight: bold;
                line-height: 25px;
            }
        }
    }

    .main-content {
        padding: 40px;
        width: 880px;
        height: 500px;
        display: flex;
        flex-direction: column;

        .img-box {
            border: 1px solid #e9edef;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 20px;

            .add-icon {
                margin-bottom: 12px;
                font-size: 28px;
                color: #2d8cf0;
            }

            .add-text {
                font-size: 12px;
                line-height: 16px;
                color: #b8b9bd;
            }

            .img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }

        /deep/ .ivu-input-wrapper {
            height: 100%;

            .ivu-input {
                height: 100%;
            }
        }
    }
}
.margin-t {
    margin-top: 20px;
}
</style>
