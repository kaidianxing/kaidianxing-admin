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
    <div class="video-input">
        <Input class="input" placeholder="请输入链接" v-model='imgurl' style="width: 360px" @on-blur="changeLink">
            <i slot="prepend" class="ivu-icon ivu-icon-ios-link"></i>
            <span slot="append" @click="addVideo">选择文件</span>
        </Input>

        <!--视频选择器-->
        <video-selector ref="video_selector" :current="value" @on-change="changeVideo"></video-selector>
    </div>
</template>

<script>
    export default {
        name: "VideoLink",
        components: {
            VideoSelector: () =>
                import ('@/components/selector/VideoSelector')
        },
        props: {
            value: {
                type: [String,Object],
                default: ''
            },
        },
        data() {
            return {
                imgurl: ''
            }
        },
        computed: {},
        watch: {
            value: {
                handler() {
                    if(typeof this.value === 'object'&&this.value?.type === 'link') {
                        this.imgurl = this.value?.path
                    } else {
                        this.imgurl = ''
                    }
                },
                immediate: true
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            changeVideo(val) {
                // console.log(val,'changeVideo???????');
                this.imgurl = '';
                this.$emit('change', val);
                this.$emit('input', val);
            },
            changeLink() {
                // console.log(val,'val???????');
                let data = {
                    path: this.imgurl,
                    type: 'link'
                };
                this.$emit('change', data);
                this.$emit('input', data);
            },
            addVideo() {
                this.$nextTick(() => {
                    setTimeout(() => {
                        if (this.$refs.video_selector) {
                            this.$refs.video_selector.setValue()
                        } else {
                            this.addImg()
                        }
                    }, 50)
                });
            }
        },
    }
</script>

<style lang="scss" scoped>
    .video-input {
        box-sizing: border-box;
        display: flex;
        /deep/ .ivu-input:not(:hover) {
            border-left-color: #fff;
        }
        /deep/ .ivu-input-group-append {
            color: $brand-color;
            cursor: pointer;
            background-color: #fff;
        }
        /deep/ .ivu-input-group-prepend {
            background-color: #fff;
        }
        .ivu-icon-ios-link {
            color: $brand-color;
            font-size: 14px;
        }
    }
</style>