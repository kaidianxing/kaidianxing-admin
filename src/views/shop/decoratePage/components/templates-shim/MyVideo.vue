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
    <video :ref='videoId' :src="src" :key='src'></video>
</template>

<script>
    export default {
        props: {
            src: {
                type: String,
                default: ''
            },
            videoId:{
                type: String,
                default: 'myVideo'
            },
            loop: {}
        },
        data() {
            return {
                playing: 0, //0没开始 1暂停 2结束
                video: null,
                long: 0, //视频长度
                left: 0, //剩余视频时间
                bar: null
            }
        },
        methods: {
            click() {
                if (this.playing != 1) {
                    this.play();
                } else {
                    this.pause();
                }
            },
            play() {
                this.playing = 1;
                if (!this.video) {
                    this.video = this.$refs[this.videoId];
                } else {
                    this.video.play();
                    this.bar = setInterval(() => {
                        this.long = this.video.duration;
                        this.left = this.video.currentTime;
                        if (this.left >= this.long) {
                            this.stop();
                        } 
                    }, 500)
                }
            },
            pause() {
                clearInterval(this.bar)
                this.playing = 2;
                this.video.pause();
                this.$emit("pause");
            },
            stop() {
                clearInterval(this.bar)
                this.playing = 3;
                this.$emit("stop");
            }
        },
        mounted() {
            this.video = this.$refs[this.videoId];
            this.$emit('ref', this.$refs[this.videoId])
        }
    }
</script>

<style lang="scss" scoped>

</style>